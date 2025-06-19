import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend import schemas, models
from backend.main import app

client = TestClient(app)

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
        db_preferences_obj = models.PreferenciasUsuario(
            objetivoPreferencias=user_data.objetivoPreferencias,
            rendaMensalPreferencias=user_data.rendaMensalPreferencias,
            usuario_id=db_user_obj.idUsuario
        )
        db.add(db_preferences_obj)

    db.commit()
    db.refresh(db_user_obj)
    return db_user_obj

def test_get_user_profile_success(client: TestClient, db_session: Session):
    """Teste para buscar perfil do usuário com sucesso"""
    # Criar usuário de teste
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="João Silva",
        email="joao@test.com",
        senha="TesteSenh@123",
        objetivoPreferencias="Economizar",
        rendaMensalPreferencias="R$2000-R$3000"
    )
    
    user = create_test_user_directly(db_session, user_data)
    
    # Fazer requisição para buscar perfil
    response = client.get(
        "/perfil/",
        headers={"Authorization": f"Bearer {user.idUsuario}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["idUsuario"] == user.idUsuario
    assert data["nomeUsuario"] == "João Silva"
    assert data["email"] == "joao@test.com"
    assert data["objetivoPreferencias"] == "Economizar"
    assert data["rendaMensalPreferencias"] == "R$2000-R$3000"
    assert data["is_verified"] == True
    assert "senha" not in data  # Senha não deve estar na resposta

def test_get_user_profile_not_found(client: TestClient):
    """Teste para buscar perfil de usuário inexistente"""
    response = client.get(
        "/perfil/",
        headers={"Authorization": "Bearer 99999"}
    )
    
    assert response.status_code == 404
    assert "Usuário não encontrado" in response.json()["detail"]

def test_update_user_profile_success(client: TestClient, db_session: Session):
    """Teste para atualizar perfil do usuário com sucesso"""
    # Criar usuário de teste
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="Maria Santos",
        email="maria@test.com",
        senha="TesteSenha@456",
        objetivoPreferencias="Investir",
        rendaMensalPreferencias="R$3000-R$4000"
    )
    
    user = create_test_user_directly(db_session, user_data)
    
    # Dados para atualização
    update_data = {
        "nomeUsuario": "Maria Silva Santos",
        "objetivoPreferencias": "Comprar casa",
        "rendaMensalPreferencias": "R$4000-R$5000"
    }
    
    response = client.put(
        "/perfil/",
        json=update_data,
        headers={"Authorization": f"Bearer {user.idUsuario}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["nomeUsuario"] == "Maria Silva Santos"
    assert data["objetivoPreferencias"] == "Comprar casa"
    assert data["rendaMensalPreferencias"] == "R$4000-R$5000"
    assert data["email"] == "maria@test.com"  # Email não alterado

def test_update_user_profile_partial_update(client: TestClient, db_session: Session):
    """Teste para atualização parcial do perfil"""
    # Criar usuário de teste
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="Pedro Costa",
        email="pedro@test.com",
        senha="TesteSenha@789"
    )
    
    user = create_test_user_directly(db_session, user_data)
    
    # Atualizar apenas o nome
    update_data = {
        "nomeUsuario": "Pedro Silva Costa"
    }
    
    response = client.put(
        "/perfil/",
        json=update_data,
        headers={"Authorization": f"Bearer {user.idUsuario}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["nomeUsuario"] == "Pedro Silva Costa"
    assert data["email"] == "pedro@test.com"
    assert data["objetivoPreferencias"] is None
    assert data["rendaMensalPreferencias"] is None

def test_update_user_profile_email_already_exists(client: TestClient, db_session: Session):
    """Teste para atualização de email que já existe"""
    # Criar primeiro usuário
    user1_data = schemas.UserRegistrationSchema(
        nomeUsuario="Usuário 1",
        email="user1@test.com",
        senha="TesteSenha@123"
    )
    user1 = create_test_user_directly(db_session, user1_data)
    
    # Criar segundo usuário
    user2_data = schemas.UserRegistrationSchema(
        nomeUsuario="Usuário 2",
        email="user2@test.com",
        senha="TesteSenha@456"
    )
    user2 = create_test_user_directly(db_session, user2_data)
    
    # Tentar atualizar o email do usuário 2 para o email do usuário 1
    update_data = {
        "email": "user1@test.com"
    }
    
    response = client.put(
        "/perfil/",
        json=update_data,
        headers={"Authorization": f"Bearer {user2.idUsuario}"}
    )
    
    assert response.status_code == 400
    assert "já está sendo utilizado" in response.json()["detail"]

def test_update_user_password_success(client: TestClient, db_session: Session):
    """Teste para alterar senha com sucesso"""
    # Criar usuário de teste
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="Ana Souza",
        email="ana@test.com",
        senha="SenhaAntiga@123"
    )
    
    user = create_test_user_directly(db_session, user_data)
    
    # Dados para alteração de senha
    password_data = {
        "senha_atual": "SenhaAntiga@123",
        "nova_senha": "NovaSenha@456"
    }
    
    response = client.put(
        "/perfil/senha",
        json=password_data,
        headers={"Authorization": f"Bearer {user.idUsuario}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Senha alterada com sucesso"

def test_update_user_password_wrong_current_password(client: TestClient, db_session: Session):
    """Teste para alteração de senha com senha atual incorreta"""
    # Criar usuário de teste
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="Carlos Lima",
        email="carlos@test.com",
        senha="SenhaCorreta@123"
    )
    
    user = create_test_user_directly(db_session, user_data)
    
    # Dados com senha atual incorreta
    password_data = {
        "senha_atual": "SenhaIncorreta@999",
        "nova_senha": "NovaSenha@456"
    }
    
    response = client.put(
        "/perfil/senha",
        json=password_data,
        headers={"Authorization": f"Bearer {user.idUsuario}"}
    )
    
    assert response.status_code == 400
    assert "Senha atual incorreta" in response.json()["detail"]

def test_update_user_password_invalid_new_password(client: TestClient, db_session: Session):
    """Teste para alteração de senha com nova senha inválida"""
    # Criar usuário de teste
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="Lucia Pereira",
        email="lucia@test.com",
        senha="SenhaAtual@123"
    )
    
    user = create_test_user_directly(db_session, user_data)
    
    # Nova senha muito simples (não atende aos critérios)
    password_data = {
        "senha_atual": "SenhaAtual@123",
        "nova_senha": "123"
    }
    
    response = client.put(
        "/perfil/senha",
        json=password_data,
        headers={"Authorization": f"Bearer {user.idUsuario}"}
    )
    
    assert response.status_code == 422  # Validation error

def test_unauthorized_access(client: TestClient):
    """Teste para acesso não autorizado aos endpoints de perfil"""
    # Tentar acessar sem token
    response = client.get("/perfil/")
    assert response.status_code == 403
    
    # Tentar acessar com token inválido
    response = client.get(
        "/perfil/",
        headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401

def test_update_user_profile_with_email_success(client: TestClient, db_session: Session):
    """Teste para atualizar email com sucesso"""
    # Criar usuário de teste
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="Roberto Silva",
        email="roberto@test.com",
        senha="TesteSenha@123"
    )
    
    user = create_test_user_directly(db_session, user_data)
    
    # Dados para atualização incluindo novo email
    update_data = {
        "nomeUsuario": "Roberto Silva Santos",
        "email": "roberto.novo@test.com"
    }
    
    response = client.put(
        "/perfil/",
        json=update_data,
        headers={"Authorization": f"Bearer {user.idUsuario}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["nomeUsuario"] == "Roberto Silva Santos"
    assert data["email"] == "roberto.novo@test.com"
