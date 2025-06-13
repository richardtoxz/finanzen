from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import date, timedelta
from decimal import Decimal
import schemas, models
from crud import user_crud

def create_test_user_directly(db: Session, user_data: schemas.UserRegistrationSchema, is_verified: bool = True) -> models.Usuario:
    """Função auxiliar para criar usuário de teste"""
    db_user_obj = models.Usuario(
        nomeUsuario=user_data.nomeUsuario,
        is_verified=is_verified
    )
    db.add(db_user_obj)
    db.flush()

    db_credenciais_obj = models.Credenciais(
        email=user_data.email,
        senha=user_data.senha,
        usuario_id=db_user_obj.idUsuario
    )
    db.add(db_credenciais_obj)

    if hasattr(user_data, 'objetivoPreferencias') and user_data.objetivoPreferencias is not None or \
       hasattr(user_data, 'rendaMensalPreferencias') and user_data.rendaMensalPreferencias is not None:
        db_preferencias_obj = models.PreferenciasUsuario(
            id_UsuarioPreferencias=db_user_obj.idUsuario,
            objetivoPreferencias=user_data.objetivoPreferencias,
            rendaMensalPreferencias=user_data.rendaMensalPreferencias
        )
        db.add(db_preferencias_obj)

    db.commit()
    db.refresh(db_user_obj)
    
    print(f"DEBUG: Usuario criado - ID: {db_user_obj.idUsuario}, is_verified: {db_user_obj.is_verified}")
    
    return db_user_obj

def test_create_movimentacao_success(client: TestClient, db_session: Session):
    """Teste para criação de movimentação com sucesso"""
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="Test User",
        email="test@example.com",
        senha="TestPass123!",
        objetivoPreferencias="Economizar",
        rendaMensalPreferencias="R$1000-R$2000"
    )
    user = create_test_user_directly(db_session, user_data)
    
    categoria_payload = {
        "nome": "Alimentação",
        "tipo": "despesa"
    }
    headers = {"Authorization": f"Bearer {user.idUsuario}"}
    categoria_response = client.post("/categorias/", json=categoria_payload, headers=headers)
    assert categoria_response.status_code == 201, f"Erro ao criar categoria: {categoria_response.text}"
    categoria_data = categoria_response.json()
    movimentacao_payload = {
        "tipo": "despesa",
        "valor": "150.75",
        "descricao": "Compras no supermercado",
        "data_movimentacao": "2024-01-15",
        "categoria_id": categoria_data["idCategoria"]
    }
    
    response = client.post("/transacoes/", json=movimentacao_payload, headers=headers)
    assert response.status_code == 201, response.text
    
    data = response.json()
    assert data["tipo"] == movimentacao_payload["tipo"]
    assert float(data["valor"]) == float(movimentacao_payload["valor"])
    assert data["descricao"] == movimentacao_payload["descricao"]
    assert data["data_movimentacao"] == movimentacao_payload["data_movimentacao"]
    assert data["categoria_id"] == categoria_data["idCategoria"]
    assert data["usuario_id"] == user.idUsuario
    assert data["categoria"]["nome"] == categoria_data["nome"]

def test_create_movimentacao_categoria_nao_pertence_usuario(client: TestClient, db_session: Session):
    """Teste para criação de movimentação com categoria de outro usuário"""
    user1_data = schemas.UserRegistrationSchema(
        nomeUsuario="User 1",
        email="user1@example.com",
        senha="TestPass123!",
        objetivoPreferencias="Economizar",
        rendaMensalPreferencias="R$1000-R$2000"
    )
    user1 = create_test_user_directly(db_session, user1_data)
    
    user2_data = schemas.UserRegistrationSchema(
        nomeUsuario="User 2",
        email="user2@example.com",
        senha="TestPass123!",
        objetivoPreferencias="Investir",
        rendaMensalPreferencias="R$2000-R$3000"
    )
    user2 = create_test_user_directly(db_session, user2_data)
    
    categoria_payload = {
        "nome": "Categoria User1",
        "tipo": "despesa"
    }
    headers_user1 = {"Authorization": f"Bearer {user1.idUsuario}"}
    categoria_response = client.post("/categorias/", json=categoria_payload, headers=headers_user1)
    assert categoria_response.status_code == 201
    categoria_data = categoria_response.json()
    movimentacao_payload = {
        "tipo": "despesa",
        "valor": "100.00",
        "descricao": "Tentativa inválida",
        "data_movimentacao": "2024-01-15",
        "categoria_id": categoria_data["idCategoria"]
    }
    
    headers_user2 = {"Authorization": f"Bearer {user2.idUsuario}"}
    
    response = client.post("/transacoes/", json=movimentacao_payload, headers=headers_user2)
    assert response.status_code == 404, response.text

def test_get_movimentacoes_success(client: TestClient, db_session: Session):
    """Teste para listar movimentações do usuário"""
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="Test User",
        email="test2@example.com",
        senha="TestPass123!",
        objetivoPreferencias="Economizar",
        rendaMensalPreferencias="R$1000-R$2000"
    )
    user = create_test_user_directly(db_session, user_data)
    
    headers = {"Authorization": f"Bearer {user.idUsuario}"}
    
    categoria_despesa_payload = {"nome": "Alimentação", "tipo": "despesa"}
    categoria_despesa_response = client.post("/categorias/", json=categoria_despesa_payload, headers=headers)
    assert categoria_despesa_response.status_code == 201
    categoria_despesa_data = categoria_despesa_response.json()
    
    categoria_receita_payload = {"nome": "Salário", "tipo": "receita"}
    categoria_receita_response = client.post("/categorias/", json=categoria_receita_payload, headers=headers)
    assert categoria_receita_response.status_code == 201
    categoria_receita_data = categoria_receita_response.json()
    
    mov1_payload = {
        "tipo": "despesa",
        "valor": "100.00",
        "descricao": "Compras",
        "data_movimentacao": "2024-01-15",
        "categoria_id": categoria_despesa_data["idCategoria"]
    }
    mov1_response = client.post("/transacoes/", json=mov1_payload, headers=headers)
    assert mov1_response.status_code == 201
    
    mov2_payload = {
        "tipo": "receita",
        "valor": "2000.00",
        "descricao": "Salário",
        "data_movimentacao": "2024-01-01",
        "categoria_id": categoria_receita_data["idCategoria"]
    }
    mov2_response = client.post("/transacoes/", json=mov2_payload, headers=headers)
    assert mov2_response.status_code == 201
    
    response = client.get("/transacoes/", headers=headers)
    assert response.status_code == 200, response.text
    
    data = response.json()
    assert len(data) == 2
    
    assert data[0]["data_movimentacao"] == "2024-01-15"  # mov1
    assert data[1]["data_movimentacao"] == "2024-01-01"  # mov2

def test_get_movimentacoes_with_filters(client: TestClient, db_session: Session):
    """Teste para filtrar movimentações por tipo e data"""
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="Test User",
        email="test3@example.com",
        senha="TestPass123!",
        objetivoPreferencias="Economizar",
        rendaMensalPreferencias="R$1000-R$2000"
    )
    user = create_test_user_directly(db_session, user_data)
    
    headers = {"Authorization": f"Bearer {user.idUsuario}"}
    
    categoria_payload = {"nome": "Geral", "tipo": "despesa"}
    categoria_response = client.post("/categorias/", json=categoria_payload, headers=headers)
    assert categoria_response.status_code == 201
    categoria_data = categoria_response.json()
    
    mov1_payload = {
        "tipo": "despesa",
        "valor": "100.00",
        "descricao": "Jan",
        "data_movimentacao": "2024-01-15",
        "categoria_id": categoria_data["idCategoria"]
    }
    mov1_response = client.post("/transacoes/", json=mov1_payload, headers=headers)
    assert mov1_response.status_code == 201
    
    mov2_payload = {
        "tipo": "despesa",
        "valor": "200.00",
        "descricao": "Fev", 
        "data_movimentacao": "2024-02-15",
        "categoria_id": categoria_data["idCategoria"]
    }
    mov2_response = client.post("/transacoes/", json=mov2_payload, headers=headers)
    assert mov2_response.status_code == 201
    
    response = client.get("/transacoes/?tipo=despesa", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    
    response = client.get("/transacoes/?data_inicio=2024-02-01", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["descricao"] == "Fev"

def test_get_movimentacao_by_id_success(client: TestClient, db_session: Session):
    """Teste para buscar movimentação específica"""
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="Test User",
        email="test4@example.com",
        senha="TestPass123!",
        objetivoPreferencias="Economizar",
        rendaMensalPreferencias="R$1000-R$2000"
    )
    user = create_test_user_directly(db_session, user_data)
    
    headers = {"Authorization": f"Bearer {user.idUsuario}"}
    
    categoria_payload = {"nome": "Alimentação", "tipo": "despesa"}
    categoria_response = client.post("/categorias/", json=categoria_payload, headers=headers)
    assert categoria_response.status_code == 201
    categoria_data = categoria_response.json()
    
    movimentacao_payload = {
        "tipo": "despesa",
        "valor": "150.75",
        "descricao": "Supermercado",
        "data_movimentacao": "2024-01-15",
        "categoria_id": categoria_data["idCategoria"]
    }
    movimentacao_response = client.post("/transacoes/", json=movimentacao_payload, headers=headers)
    assert movimentacao_response.status_code == 201
    movimentacao_data = movimentacao_response.json()
    
    response = client.get(f"/transacoes/{movimentacao_data['idMovimentacao']}", headers=headers)
    assert response.status_code == 200, response.text
    
    data = response.json()
    assert data["idMovimentacao"] == movimentacao_data["idMovimentacao"]
    assert data["tipo"] == "despesa"
    assert float(data["valor"]) == 150.75

def test_update_movimentacao_success(client: TestClient, db_session: Session):
    """Teste para atualizar movimentação com sucesso"""
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="Test User",
        email="test5@example.com",
        senha="TestPass123!",
        objetivoPreferencias="Economizar",
        rendaMensalPreferencias="R$1000-R$2000"
    )
    user = create_test_user_directly(db_session, user_data)
    
    headers = {"Authorization": f"Bearer {user.idUsuario}"}
    
    categoria_payload = {"nome": "Alimentação", "tipo": "despesa"}
    categoria_response = client.post("/categorias/", json=categoria_payload, headers=headers)
    assert categoria_response.status_code == 201
    categoria_data = categoria_response.json()
    
    movimentacao_payload = {
        "tipo": "despesa",
        "valor": "100.00",
        "descricao": "Original",
        "data_movimentacao": "2024-01-15",
        "categoria_id": categoria_data["idCategoria"]
    }
    movimentacao_response = client.post("/transacoes/", json=movimentacao_payload, headers=headers)
    assert movimentacao_response.status_code == 201
    movimentacao_data = movimentacao_response.json()
    
    update_payload = {
        "valor": "200.50",
        "descricao": "Atualizada"
    }
    
    response = client.put(f"/transacoes/{movimentacao_data['idMovimentacao']}", json=update_payload, headers=headers)
    assert response.status_code == 200, response.text
    
    data = response.json()
    assert float(data["valor"]) == 200.50
    assert data["descricao"] == "Atualizada"

def test_delete_movimentacao_success(client: TestClient, db_session: Session):
    """Teste para deletar movimentação com sucesso"""
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="Test User",
        email="test6@example.com",
        senha="TestPass123!",
        objetivoPreferencias="Economizar",
        rendaMensalPreferencias="R$1000-R$2000"
    )
    user = create_test_user_directly(db_session, user_data)
    
    headers = {"Authorization": f"Bearer {user.idUsuario}"}
    
    categoria_payload = {"nome": "Alimentação", "tipo": "despesa"}
    categoria_response = client.post("/categorias/", json=categoria_payload, headers=headers)
    assert categoria_response.status_code == 201
    categoria_data = categoria_response.json()
    
    movimentacao_payload = {
        "tipo": "despesa",
        "valor": "100.00",
        "descricao": "Para deletar",
        "data_movimentacao": "2024-01-15",
        "categoria_id": categoria_data["idCategoria"]
    }
    movimentacao_response = client.post("/transacoes/", json=movimentacao_payload, headers=headers)
    assert movimentacao_response.status_code == 201
    movimentacao_data = movimentacao_response.json()
    
    response = client.delete(f"/transacoes/{movimentacao_data['idMovimentacao']}", headers=headers)
    assert response.status_code == 204, response.text
    
    get_response = client.get(f"/transacoes/{movimentacao_data['idMovimentacao']}", headers=headers)
    assert get_response.status_code == 404

def test_user_cannot_access_other_user_movimentacao(client: TestClient, db_session: Session):
    """Teste para garantir que usuário não acessa movimentações de outro usuário"""
    user1_data = schemas.UserRegistrationSchema(
        nomeUsuario="User 1",
        email="user1_mov@example.com",
        senha="TestPass123!",
        objetivoPreferencias="Economizar",
        rendaMensalPreferencias="R$1000-R$2000"
    )
    user1 = create_test_user_directly(db_session, user1_data)
    
    user2_data = schemas.UserRegistrationSchema(
        nomeUsuario="User 2",
        email="user2_mov@example.com",
        senha="TestPass123!",
        objetivoPreferencias="Investir",
        rendaMensalPreferencias="R$2000-R$3000"
    )
    user2 = create_test_user_directly(db_session, user2_data)
    
    headers_user1 = {"Authorization": f"Bearer {user1.idUsuario}"}
    headers_user2 = {"Authorization": f"Bearer {user2.idUsuario}"}
    
    categoria_payload = {"nome": "Categoria User1", "tipo": "despesa"}
    categoria_response = client.post("/categorias/", json=categoria_payload, headers=headers_user1)
    assert categoria_response.status_code == 201
    categoria_data = categoria_response.json()
    
    movimentacao_payload = {
        "tipo": "despesa",
        "valor": "100.00",
        "descricao": "Movimentação User1",
        "data_movimentacao": "2024-01-15",
        "categoria_id": categoria_data["idCategoria"]
    }
    movimentacao_response = client.post("/transacoes/", json=movimentacao_payload, headers=headers_user1)
    assert movimentacao_response.status_code == 201
    movimentacao_data = movimentacao_response.json()
    
    response = client.get(f"/transacoes/{movimentacao_data['idMovimentacao']}", headers=headers_user2)
    assert response.status_code == 404, response.text
    
    response = client.delete(f"/transacoes/{movimentacao_data['idMovimentacao']}", headers=headers_user2)
    assert response.status_code == 404, response.text
    
    response = client.get(f"/transacoes/{movimentacao_data['idMovimentacao']}", headers=headers_user1)
    assert response.status_code == 200

def test_create_movimentacao_unauthorized(client: TestClient):
    """Teste para criação de movimentação sem autenticação"""
    movimentacao_payload = {
        "tipo": "despesa",
        "valor": "100.00",
        "descricao": "Sem autorização",
        "data_movimentacao": "2024-01-15",
        "categoria_id": 1
    }
    
    response = client.post("/transacoes/", json=movimentacao_payload)
    assert response.status_code == 422
