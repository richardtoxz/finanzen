from sqlalchemy.orm import Session, joinedload
from typing import Optional
from datetime import datetime, timedelta
import random
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
    
    
    if 'objetivoPreferencias' in update_data or 'rendaMensalPreferencias' in update_data:
        if user.preferencias:
            if 'objetivoPreferencias' in update_data:
                user.preferencias.objetivoPreferencias = update_data['objetivoPreferencias']
            if 'rendaMensalPreferencias' in update_data:
                user.preferencias.rendaMensalPreferencias = update_data['rendaMensalPreferencias']
        else:
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

def generate_verification_code() -> str:
    """
    Gera um código de verificação de 6 dígitos
    """
    return str(random.randint(100000, 999999))

def save_email_change_verification(
    db: Session, 
    usuario_id: int, 
    novo_email: str, 
    verification_code: str
) -> bool:
    """
    Salva o código de verificação para alteração de email
    """
    try:
        db.query(models.VerificacoesEmail).filter(
            models.VerificacoesEmail.usuario_id == usuario_id,
            models.VerificacoesEmail.usado == False
        ).update({"usado": True})
        
        verification = models.VerificacoesEmail(
            emailVerificacao=novo_email,
            codigo_Verificacao=verification_code,
            expiracao_emVerificacao=datetime.utcnow() + timedelta(minutes=15),
            usado=False,
            usuario_id=usuario_id
        )
        
        db.add(verification)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        raise e

def validate_email_change_code(
    db: Session, 
    usuario_id: int, 
    novo_email: str, 
    verification_code: str
) -> bool:
    """
    Valida o código de verificação para alteração de email
    """
    verification = db.query(models.VerificacoesEmail).filter(
        models.VerificacoesEmail.usuario_id == usuario_id,
        models.VerificacoesEmail.emailVerificacao == novo_email,
        models.VerificacoesEmail.codigo_Verificacao == verification_code,
        models.VerificacoesEmail.usado == False,
        models.VerificacoesEmail.expiracao_emVerificacao > datetime.utcnow()
    ).first()
    
    return verification is not None

def update_user_email(db: Session, usuario_id: int, novo_email: str) -> bool:
    """
    Atualiza o email do usuário na tabela credenciais
    """
    try:
        user = db.query(models.Usuario).filter(
            models.Usuario.idUsuario == usuario_id
        ).first()
        
        if not user or not user.credenciais:
            return False
        
        user.credenciais.email = novo_email
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        raise e

def mark_email_verification_as_used(
    db: Session, 
    usuario_id: int, 
    novo_email: str, 
    verification_code: str
) -> bool:
    """
    Marca o código de verificação como usado
    """
    try:
        db.query(models.VerificacoesEmail).filter(
            models.VerificacoesEmail.usuario_id == usuario_id,
            models.VerificacoesEmail.emailVerificacao == novo_email,
            models.VerificacoesEmail.codigo_Verificacao == verification_code
        ).update({"usado": True})
        
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        raise e
