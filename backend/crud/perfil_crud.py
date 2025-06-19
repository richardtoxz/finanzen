from sqlalchemy.orm import Session, joinedload
from typing import Optional
import models, schemas

def get_user_profile(db: Session, usuario_id: int) -> Optional[models.Usuario]:
    """
    Busca o perfil completo do usuário incluindo credenciais e preferências
    """
    return db.query(models.Usuario).options(
        joinedload(models.Usuario.credenciais),
        joinedload(models.Usuario.preferencias)
    ).filter(
        models.Usuario.idUsuario == usuario_id
    ).first()

def update_user_profile(
    db: Session, 
    usuario_id: int, 
    profile_data: schemas.UserProfileUpdateSchema
) -> Optional[models.Usuario]:
    """
    Atualiza informações do perfil do usuário
    """
    user = db.query(models.Usuario).filter(
        models.Usuario.idUsuario == usuario_id
    ).first()
    
    if not user:
        return None
    
    update_data = profile_data.model_dump(exclude_unset=True)
    
    if 'nomeUsuario' in update_data:
        user.nomeUsuario = update_data['nomeUsuario']
    
    if 'email' in update_data:
        if user.credenciais:
            user.credenciais.email = update_data['email']
    
    if 'objetivoPreferencias' in update_data or 'rendaMensalPreferencias' in update_data:
        if user.preferencias:
            if 'objetivoPreferencias' in update_data:
                user.preferencias.objetivoPreferencias = update_data['objetivoPreferencias']
            if 'rendaMensalPreferencias' in update_data:
                user.preferencias.rendaMensalPreferencias = update_data['rendaMensalPreferencias']
            new_preferences = models.PreferenciasUsuario(
                objetivoPreferencias=update_data.get('objetivoPreferencias'),
                rendaMensalPreferencias=update_data.get('rendaMensalPreferencias'),
                id_UsuarioPreferencias=usuario_id
            )
            db.add(new_preferences)
    
    try:
        db.commit()
        db.refresh(user)
        return user
    except Exception as e:
        db.rollback()
        raise e

def check_email_exists(db: Session, email: str, current_user_id: int) -> bool:
    """
    Verifica se um email já está sendo usado por outro usuário
    """
    existing_credential = db.query(models.Credenciais).filter(
        models.Credenciais.email == email,
        models.Credenciais.usuario_id != current_user_id
    ).first()
    
    return existing_credential is not None

def update_user_password(
    db: Session, 
    usuario_id: int, 
    password_data: schemas.UserPasswordUpdateSchema
) -> bool:
    """
    Atualiza a senha do usuário após validar a senha atual
    """
    user = db.query(models.Usuario).filter(
        models.Usuario.idUsuario == usuario_id
    ).first()
    
    if not user or not user.credenciais:
        return False
    
    if user.credenciais.senha != password_data.senha_atual:
        return False
    
    user.credenciais.senha = password_data.nova_senha
    
    try:
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        raise e

def get_user_credentials(db: Session, usuario_id: int) -> Optional[models.Credenciais]:
    """
    Busca as credenciais de um usuário específico
    """
    return db.query(models.Credenciais).filter(
        models.Credenciais.usuario_id == usuario_id
    ).first()
