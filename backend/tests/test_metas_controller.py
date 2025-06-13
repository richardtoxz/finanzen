import pytest
from fastapi.testclient import TestClient
from datetime import date
from decimal import Decimal

from backend.main import app

client = TestClient(app)

class TestMetasController:
    
    def setup_user_and_category(self, db_session):
        """Helper para criar usuário e categoria de teste"""
        from backend.models import Usuario, Credenciais, CategoriaMov, TipoCategoria
        
        # Criar usuário
        user = Usuario(nomeUsuario="Test User", is_verified=True)
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        
        # Criar credenciais
        credentials = Credenciais(
            email="test@example.com",
            senha="hashed_password",
            usuario_id=user.idUsuario
        )
        db_session.add(credentials)
        
        # Criar categoria
        category = CategoriaMov(
            nome="Salário",
            tipo=TipoCategoria.receita,
            usuario_id=user.idUsuario
        )
        db_session.add(category)
        db_session.commit()
        db_session.refresh(category)
        
        return user, category

    def test_create_meta(self, db_session):
        """Teste de criação de meta financeira"""
        user, _ = self.setup_user_and_category(db_session)
        
        meta_data = {
            "nome": "Viagem para Europa",
            "valor_objetivo": 5000.00,
            "descricao": "Viagem de férias",
            "data_limite": "2025-12-31"
        }
        
        response = client.post(
            "/metas/",
            json=meta_data,
            headers={"Authorization": f"Bearer {user.idUsuario}"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["nome"] == "Viagem para Europa"
        assert float(data["valor_objetivo"]) == 5000.00
        assert data["descricao"] == "Viagem de férias"
        assert data["usuario_id"] == user.idUsuario
        assert float(data["valor_atual"]) == 0.00
        assert data["progresso_percentual"] == 0.0

    def test_create_meta_without_optional_fields(self, db_session):
        """Teste de criação de meta apenas com campos obrigatórios"""
        user, _ = self.setup_user_and_category(db_session)
        
        meta_data = {
            "nome": "Emergência",
            "valor_objetivo": 1000.00
        }
        
        response = client.post(
            "/metas/",
            json=meta_data,
            headers={"Authorization": f"Bearer {user.idUsuario}"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["nome"] == "Emergência"
        assert float(data["valor_objetivo"]) == 1000.00
        assert data["descricao"] is None
        assert data["data_limite"] is None

    def test_get_metas_empty_list(self, db_session):
        """Teste de busca de metas quando não há metas"""
        user, _ = self.setup_user_and_category(db_session)
        
        response = client.get(
            "/metas/",
            headers={"Authorization": f"Bearer {user.idUsuario}"}
        )
        
        assert response.status_code == 200
        assert response.json() == []

    def test_meta_progress_calculation(self, db_session):
        """Teste chave: cálculo do progresso da meta com transações"""
        from backend.models import MetaFinanceira, Movimentacao, TipoMovimentacao
        
        user, category = self.setup_user_and_category(db_session)
        
        # Criar meta de R$ 1000
        meta = MetaFinanceira(
            nome="Viagem",
            valor_objetivo=Decimal('1000.00'),
            usuario_id=user.idUsuario
        )
        db_session.add(meta)
        db_session.commit()
        db_session.refresh(meta)
        
        # Criar duas transações de receita associadas à meta (R$ 200 + R$ 300 = R$ 500)
        movimentacao1 = Movimentacao(
            tipo=TipoMovimentacao.receita,
            valor=Decimal('200.00'),
            descricao="Primeira contribuição",
            data_movimentacao=date.today(),
            categoria_id=category.idCategoria,
            meta_id=meta.idMeta,
            usuario_id=user.idUsuario
        )
        movimentacao2 = Movimentacao(
            tipo=TipoMovimentacao.receita,
            valor=Decimal('300.00'),
            descricao="Segunda contribuição",
            data_movimentacao=date.today(),
            categoria_id=category.idCategoria,
            meta_id=meta.idMeta,
            usuario_id=user.idUsuario
        )
        db_session.add_all([movimentacao1, movimentacao2])
        db_session.commit()
        
        # Verificar o progresso da meta
        response = client.get(
            f"/metas/{meta.idMeta}",
            headers={"Authorization": f"Bearer {user.idUsuario}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert float(data["valor_atual"]) == 500.00
        assert data["progresso_percentual"] == 50.0

    def test_create_transaction_with_meta_association(self, db_session):
        """Teste de criação de transação associada a uma meta"""
        from backend.models import MetaFinanceira
        
        user, category = self.setup_user_and_category(db_session)
        
        # Criar meta
        meta = MetaFinanceira(
            nome="Meta de Teste",
            valor_objetivo=Decimal('1000.00'),
            usuario_id=user.idUsuario
        )
        db_session.add(meta)
        db_session.commit()
        db_session.refresh(meta)
        
        # Criar transação associada à meta
        transaction_data = {
            "tipo": "receita",
            "valor": 250.00,
            "descricao": "Contribuição para meta",
            "data_movimentacao": "2025-06-13",
            "categoria_id": category.idCategoria,
            "meta_id": meta.idMeta
        }
        
        response = client.post(
            "/transacoes/",
            json=transaction_data,
            headers={"Authorization": f"Bearer {user.idUsuario}"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["meta_id"] == meta.idMeta

    def test_create_transaction_with_invalid_meta(self, db_session):
        """Teste de criação de transação com meta inválida"""
        user, category = self.setup_user_and_category(db_session)
        
        transaction_data = {
            "tipo": "receita",
            "valor": 250.00,
            "descricao": "Contribuição para meta",
            "data_movimentacao": "2025-06-13",
            "categoria_id": category.idCategoria,
            "meta_id": 999  # Meta inexistente
        }
        
        response = client.post(
            "/transacoes/",
            json=transaction_data,
            headers={"Authorization": f"Bearer {user.idUsuario}"}
        )
        
        assert response.status_code == 404
        assert "Meta não encontrada" in response.json()["detail"]

    def test_unauthorized_access(self, db_session):
        """Teste de acesso não autorizado às metas"""
        response = client.get("/metas/")
        assert response.status_code == 422  # Header de autorização não fornecido
        
        response = client.get("/metas/", headers={"Authorization": "Invalid Token"})
        assert response.status_code == 401
