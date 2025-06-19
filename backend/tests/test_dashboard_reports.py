import pytest
from datetime import date
from decimal import Decimal

def test_dashboard_summary_no_transactions(db_session, client):
    """Testa o endpoint de resumo do dashboard sem transações."""
    # Criar usuário
    from backend.models import Usuario
    user = Usuario(nomeUsuario="Test User")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    response = client.get(
        "/transacoes/dashboard/summary",
        headers={"Authorization": f"Bearer {user.idUsuario}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["saldo_atual"] == 0.0
    assert data["total_receitas"] == 0.0
    assert data["total_despesas"] == 0.0

def test_dashboard_summary_with_transactions(db_session, client):
    """Testa o endpoint de resumo do dashboard com transações."""
    from backend.models import Usuario, CategoriaMov, Movimentacao, TipoCategoria, TipoMovimentacao
    from datetime import datetime
    
    # Criar usuário
    user = Usuario(nomeUsuario="Test User")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    # Criar categorias
    categoria_receita = CategoriaMov(
        nome="Salário",
        tipo=TipoCategoria.receita,
        usuario_id=user.idUsuario
    )
    categoria_despesa = CategoriaMov(
        nome="Alimentação",
        tipo=TipoCategoria.despesa,
        usuario_id=user.idUsuario
    )
    db_session.add(categoria_receita)
    db_session.add(categoria_despesa)
    db_session.commit()
    db_session.refresh(categoria_receita)
    db_session.refresh(categoria_despesa)
    
    # Criar movimentações do mês atual
    current_date = datetime.now().date()
    
    receita = Movimentacao(
        tipo=TipoMovimentacao.receita,
        valor=Decimal("5000.00"),
        descricao="Salário",
        data_movimentacao=current_date,
        usuario_id=user.idUsuario,
        categoria_id=categoria_receita.idCategoria
    )
    
    despesa = Movimentacao(
        tipo=TipoMovimentacao.despesa,
        valor=Decimal("1500.00"),
        descricao="Supermercado",
        data_movimentacao=current_date,
        usuario_id=user.idUsuario,
        categoria_id=categoria_despesa.idCategoria
    )
    
    db_session.add(receita)
    db_session.add(despesa)
    db_session.commit()
    
    response = client.get(
        "/transacoes/dashboard/summary",
        headers={"Authorization": f"Bearer {user.idUsuario}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["saldo_atual"] == 3500.0
    assert data["total_receitas"] == 5000.0
    assert data["total_despesas"] == 1500.0

def test_reports_data_mes_atual(db_session, client):
    """Testa o endpoint de dados de relatórios para o mês atual."""
    from backend.models import Usuario, CategoriaMov, Movimentacao, TipoCategoria, TipoMovimentacao
    from datetime import datetime
    
    # Criar usuário
    user = Usuario(nomeUsuario="Test User")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    # Criar categorias
    categoria_alimentacao = CategoriaMov(
        nome="Alimentação",
        tipo=TipoCategoria.despesa,
        usuario_id=user.idUsuario
    )
    categoria_transporte = CategoriaMov(
        nome="Transporte",
        tipo=TipoCategoria.despesa,
        usuario_id=user.idUsuario
    )
    categoria_salario = CategoriaMov(
        nome="Salário",
        tipo=TipoCategoria.receita,
        usuario_id=user.idUsuario
    )
    
    db_session.add_all([categoria_alimentacao, categoria_transporte, categoria_salario])
    db_session.commit()
    db_session.refresh(categoria_alimentacao)
    db_session.refresh(categoria_transporte)
    db_session.refresh(categoria_salario)
    
    # Criar movimentações do mês atual
    current_date = datetime.now().date()
    
    movimentacoes = [
        Movimentacao(
            tipo=TipoMovimentacao.receita,
            valor=Decimal("5000.00"),
            descricao="Salário",
            data_movimentacao=current_date,
            usuario_id=user.idUsuario,
            categoria_id=categoria_salario.idCategoria
        ),
        Movimentacao(
            tipo=TipoMovimentacao.despesa,
            valor=Decimal("800.00"),
            descricao="Supermercado",
            data_movimentacao=current_date,
            usuario_id=user.idUsuario,
            categoria_id=categoria_alimentacao.idCategoria
        ),
        Movimentacao(
            tipo=TipoMovimentacao.despesa,
            valor=Decimal("300.00"),
            descricao="Combustível",
            data_movimentacao=current_date,
            usuario_id=user.idUsuario,
            categoria_id=categoria_transporte.idCategoria
        )
    ]
    
    db_session.add_all(movimentacoes)
    db_session.commit()
    
    response = client.get(
        "/relatorios/dados?periodo=mes_atual",
        headers={"Authorization": f"Bearer {user.idUsuario}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Verificar estrutura da resposta
    assert "pieChartData" in data
    assert "barChartData" in data
    assert "summaryData" in data
    
    # Verificar dados do gráfico de pizza (despesas por categoria)
    pie_data = data["pieChartData"]
    assert len(pie_data) == 2  # 2 categorias de despesa
    
    category_names = [item["name"] for item in pie_data]
    assert "Alimentação" in category_names
    assert "Transporte" in category_names
    
    # Verificar dados de resumo
    summary = data["summaryData"]
    assert summary["receitas_totais"] == 5000.0
    assert summary["despesas_totais"] == 1100.0
    assert summary["saldo_final"] == 3900.0

def test_reports_data_invalid_periodo(db_session, client):
    """Testa o endpoint de dados de relatórios com período inválido."""
    from backend.models import Usuario
    
    # Criar usuário
    user = Usuario(nomeUsuario="Test User")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    response = client.get(
        "/relatorios/dados?periodo=periodo_invalido",
        headers={"Authorization": f"Bearer {user.idUsuario}"}
    )
    
    assert response.status_code == 400
    assert "Período deve ser" in response.json()["detail"]

def test_dashboard_summary_unauthorized(client):
    """Testa o endpoint de resumo do dashboard sem autorização."""
    response = client.get("/transacoes/dashboard/summary")
    assert response.status_code == 403

def test_reports_data_unauthorized(client):
    """Testa o endpoint de dados de relatórios sem autorização."""
    response = client.get("/relatorios/dados")
    assert response.status_code == 403
