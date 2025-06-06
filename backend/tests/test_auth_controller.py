from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend import schemas, models
from backend.crud import user_crud 

def create_test_user_directly(db: Session, user_data: schemas.UserRegistrationSchema, is_verified: bool = True) -> models.Usuario:
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
    if db_user_obj.credenciais:
        pass
    if hasattr(db_user_obj, 'preferencias') and db_user_obj.preferencias:
        pass
    return db_user_obj


def test_register_user_success(client: TestClient, db_session: Session):
    user_payload = {
        "nomeUsuario": "usuario teste 1",
        "email": "emailvalidocatolica@example.com",
        "senha": "senha8ca", 
        "objetivoPreferencias": "Economizar",
        "rendaMensalPreferencias": "R$1000-R$2000"
    }
    response = client.post("/auth/register", json=user_payload)
    assert response.status_code == 201, response.text
    data = response.json()
    assert data["email"] == user_payload["email"]

    db_user_with_creds = user_crud.get_credenciais_by_email(db_session, email=user_payload["email"])
    assert db_user_with_creds is not None
    assert db_user_with_creds.email == user_payload["email"]
    assert db_user_with_creds.usuario.nomeUsuario == user_payload["nomeUsuario"]
    assert db_user_with_creds.senha == user_payload["senha"]
    assert db_user_with_creds.usuario.is_verified is False
    assert db_user_with_creds.usuario.preferencias is not None
    assert db_user_with_creds.usuario.preferencias.objetivoPreferencias == user_payload["objetivoPreferencias"]

def test_register_user_duplicate_email(client: TestClient, db_session: Session):
    user_payload = {
        "nomeUsuario": "Primeiro usuario",
        "email": "mesmoemail@example.com",
        "senha": "password123",
        "objetivoPreferencias": "Pagar dívidas"
    }
    response1 = client.post("/auth/register", json=user_payload)
    assert response1.status_code == 201, response1.text
    data1 = response1.json()
    code1 = data1["verification_code_for_testing"]

    verify_payload1 = {"email": user_payload["email"], "codigo_Verificacao": code1}
    response_verify1 = client.post("/auth/verify-email", json=verify_payload1)
    assert response_verify1.status_code == 200, response_verify1.text

    user_payload_2 = {
        "nomeUsuario": "Segundo usuario mesmo email",
        "email": "mesmoemail@example.com",
        "senha": "outrasenha123",
        "objetivoPreferencias": "Investir"
    }
    response2 = client.post("/auth/register", json=user_payload_2)
    assert response2.status_code == 400, response2.text
    assert response2.json()["detail"] == "E-mail já cadastrado e verificado."

def test_login_user_success(client: TestClient, db_session: Session):
    user_email = "login.success@example.com"
    user_pass = "testpassword123"
    reg_payload = schemas.UserRegistrationSchema(
        nomeUsuario="Usuario com sucesso no login",
        email=user_email,
        senha=user_pass,
        objetivoPreferencias="Viajar"
    )
    response_reg = client.post("/auth/register", json=reg_payload.model_dump())
    assert response_reg.status_code == 201
    verification_code = response_reg.json()["verification_code_for_testing"]

    verify_payload = {"email": user_email, "codigo_Verificacao": verification_code}
    response_verify = client.post("/auth/verify-email", json=verify_payload)
    assert response_verify.status_code == 200
    verified_user_data = response_verify.json()
    created_user_id = verified_user_data["idUsuario"]

    login_payload = {
        "email": user_email,
        "senha": user_pass
    }
    response_login = client.post("/auth/login", json=login_payload)
    assert response_login.status_code == 200, response_login.text
    data = response_login.json()
    assert data["message"] == "Login successful"
    assert data["user"]["email"] == user_email
    assert data["user"]["idUsuario"] == created_user_id
    assert data["user"]["is_verified"] is True
    assert data["user"]["objetivoPreferencias"] == "Viajar"


def test_login_user_wrong_password(client: TestClient, db_session: Session):
    user_email = "testesenhaincorreta@example.com"
    correct_pass = "senhacorreta123"
    reg_payload = schemas.UserRegistrationSchema(
        nomeUsuario="Usuario com senha incorreta",
        email=user_email,
        senha=correct_pass
    )
    response_reg = client.post("/auth/register", json=reg_payload.model_dump())
    assert response_reg.status_code == 201
    verification_code = response_reg.json()["verification_code_for_testing"]

    verify_payload = {"email": user_email, "codigo_Verificacao": verification_code}
    response_verify = client.post("/auth/verify-email", json=verify_payload)
    assert response_verify.status_code == 200

    login_payload = {
        "email": user_email,
        "senha": "senhaincorreta123"
    }
    response_login = client.post("/auth/login", json=login_payload)
    assert response_login.status_code == 401, response_login.text
    assert response_login.json()["detail"] == "Senha incorreta, insira uma senha válida." 

def test_login_user_not_found(client: TestClient, db_session: Session):
    login_payload = {
        "email": "emailqualquer@example.com",
        "senha": "qualquersenha321"
    }
    response = client.post("/auth/login", json=login_payload)
    assert response.status_code == 401, response.text
    assert response.json()["detail"] == "Esse e-mail não está cadastrado, por favor utilizar e-mail valido."