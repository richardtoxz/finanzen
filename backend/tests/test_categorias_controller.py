from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
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
    return db_user_obj

def test_create_categoria_success(client: TestClient, db_session: Session):
    """Teste para criação de categoria com sucesso"""
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
    
    response = client.post("/categorias/", json=categoria_payload, headers=headers)
    assert response.status_code == 201, response.text
    
    data = response.json()
    assert data["nome"] == categoria_payload["nome"]
    assert data["tipo"] == categoria_payload["tipo"]
    assert data["usuario_id"] == user.idUsuario

def test_create_categoria_unauthorized(client: TestClient):
    """Teste para criação de categoria sem autenticação"""
    categoria_payload = {
        "nome": "Alimentação",
        "tipo": "despesa"
    }
    
    response = client.post("/categorias/", json=categoria_payload)
    assert response.status_code == 422

def test_get_categorias_success(client: TestClient, db_session: Session):
    """Teste para listar categorias do usuário"""
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="Test User",
        email="test2@example.com",
        senha="TestPass123!",
        objetivoPreferencias="Economizar",
        rendaMensalPreferencias="R$1000-R$2000"
    )
    user = create_test_user_directly(db_session, user_data)
    
    categoria1 = models.CategoriaMov(nome="Alimentação", tipo=models.TipoCategoria.despesa, usuario_id=user.idUsuario)
    categoria2 = models.CategoriaMov(nome="Salário", tipo=models.TipoCategoria.receita, usuario_id=user.idUsuario)
    db_session.add(categoria1)
    db_session.add(categoria2)
    db_session.commit()
    
    headers = {"Authorization": f"Bearer {user.idUsuario}"}
    
    response = client.get("/categorias/", headers=headers)
    assert response.status_code == 200, response.text
    
    data = response.json()
    assert len(data) == 2
    assert any(cat["nome"] == "Alimentação" for cat in data)
    assert any(cat["nome"] == "Salário" for cat in data)

def test_update_categoria_success(client: TestClient, db_session: Session):
    """Teste para atualizar categoria com sucesso"""
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="Test User",
        email="test3@example.com",
        senha="TestPass123!",
        objetivoPreferencias="Economizar",
        rendaMensalPreferencias="R$1000-R$2000"
    )
    user = create_test_user_directly(db_session, user_data)
    
    categoria = models.CategoriaMov(nome="Alimentação", tipo=models.TipoCategoria.despesa, usuario_id=user.idUsuario)
    db_session.add(categoria)
    db_session.commit()
    db_session.refresh(categoria)
    
    update_payload = {
        "nome": "Alimentação Atualizada",
        "tipo": "receita"
    }
    
    headers = {"Authorization": f"Bearer {user.idUsuario}"}
    
    response = client.put(f"/categorias/{categoria.idCategoria}", json=update_payload, headers=headers)
    assert response.status_code == 200, response.text
    
    data = response.json()
    assert data["nome"] == update_payload["nome"]
    assert data["tipo"] == update_payload["tipo"]
    assert data["usuario_id"] == user.idUsuario

def test_update_categoria_not_found(client: TestClient, db_session: Session):
    """Teste para atualizar categoria inexistente"""
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="Test User",
        email="test4@example.com",
        senha="TestPass123!",
        objetivoPreferencias="Economizar",
        rendaMensalPreferencias="R$1000-R$2000"
    )
    user = create_test_user_directly(db_session, user_data)
    
    update_payload = {
        "nome": "Categoria Inexistente",
        "tipo": "receita"
    }
    
    headers = {"Authorization": f"Bearer {user.idUsuario}"}
    
    response = client.put("/categorias/999", json=update_payload, headers=headers)
    assert response.status_code == 404, response.text

def test_delete_categoria_success(client: TestClient, db_session: Session):
    """Teste para deletar categoria com sucesso"""
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="Test User",
        email="test5@example.com",
        senha="TestPass123!",
        objetivoPreferencias="Economizar",
        rendaMensalPreferencias="R$1000-R$2000"
    )
    user = create_test_user_directly(db_session, user_data)
    
    categoria = models.CategoriaMov(nome="Alimentação", tipo=models.TipoCategoria.despesa, usuario_id=user.idUsuario)
    db_session.add(categoria)
    db_session.commit()
    db_session.refresh(categoria)
    
    headers = {"Authorization": f"Bearer {user.idUsuario}"}
    
    response = client.delete(f"/categorias/{categoria.idCategoria}", headers=headers)
    assert response.status_code == 204, response.text
    
    deleted_categoria = db_session.query(models.CategoriaMov).filter(
        models.CategoriaMov.idCategoria == categoria.idCategoria
    ).first()
    assert deleted_categoria is None

def test_delete_categoria_not_found(client: TestClient, db_session: Session):
    """Teste para deletar categoria inexistente"""
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="Test User",
        email="test6@example.com",
        senha="TestPass123!",
        objetivoPreferencias="Economizar",
        rendaMensalPreferencias="R$1000-R$2000"
    )
    user = create_test_user_directly(db_session, user_data)
    
    headers = {"Authorization": f"Bearer {user.idUsuario}"}
    
    response = client.delete("/categorias/999", headers=headers)
    assert response.status_code == 404, response.text

def test_create_categoria_invalid_tipo(client: TestClient, db_session: Session):
    """Teste para criação de categoria com tipo inválido"""
    user_data = schemas.UserRegistrationSchema(
        nomeUsuario="Test User",
        email="test7@example.com",
        senha="TestPass123!",
        objetivoPreferencias="Economizar",
        rendaMensalPreferencias="R$1000-R$2000"
    )
    user = create_test_user_directly(db_session, user_data)
    
    categoria_payload = {
        "nome": "Alimentação",
        "tipo": "tipo_invalido"
    }
    
    headers = {"Authorization": f"Bearer {user.idUsuario}"}
    
    response = client.post("/categorias/", json=categoria_payload, headers=headers)
    assert response.status_code == 422, response.text

def test_user_can_only_access_own_categories(client: TestClient, db_session: Session):
    """Teste para garantir que usuário só acessa suas próprias categorias"""
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
        objetivoPreferencias="Economizar",
        rendaMensalPreferencias="R$1000-R$2000"
    )
    user2 = create_test_user_directly(db_session, user2_data)
    
    categoria_user1 = models.CategoriaMov(nome="Categoria User1", tipo=models.TipoCategoria.despesa, usuario_id=user1.idUsuario)
    db_session.add(categoria_user1)
    db_session.commit()
    db_session.refresh(categoria_user1)
    
    headers_user2 = {"Authorization": f"Bearer {user2.idUsuario}"}
    
    response = client.delete(f"/categorias/{categoria_user1.idCategoria}", headers=headers_user2)
    assert response.status_code == 404, response.text  # Não encontrada porque não pertence ao user2
    
    categoria_still_exists = db_session.query(models.CategoriaMov).filter(
        models.CategoriaMov.idCategoria == categoria_user1.idCategoria
    ).first()
    assert categoria_still_exists is not None
