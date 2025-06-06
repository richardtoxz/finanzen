from sqlalchemy.orm import Session
from typing import Optional
import models, schemas  

def get_usuario_by_email(db: Session, email: str) -> Optional[models.Usuario]:
    credencial = db.query(models.Credenciais).filter(models.Credenciais.email == email).first()
    if credencial:
        return credencial.usuario
    return None

def get_credenciais_by_email(db: Session, email: str) -> Optional[models.Credenciais]:
    return db.query(models.Credenciais).filter(models.Credenciais.email == email).first()


def create_update_user_with_preferences(
    db: Session,
    user_data: schemas.UserRegistrationSchema,
    is_verified: bool = False
) -> models.Usuario:
    existing_usuario = get_usuario_by_email(db, email=user_data.email)

    if existing_usuario:
        existing_usuario.nomeUsuario = user_data.nomeUsuario
        existing_usuario.is_verified = is_verified

        credenciais = existing_usuario.credenciais
        if credenciais:
            credenciais.senha = user_data.senha
        else:
            credenciais = models.Credenciais(
                email=user_data.email,
                senha=user_data.senha,
                usuario_id=existing_usuario.idUsuario
            )
            db.add(credenciais)

        preferencias = existing_usuario.preferencias
        if preferencias:
            preferencias.objetivoPreferencias = user_data.objetivoPreferencias
            preferencias.rendaMensalPreferencias = user_data.rendaMensalPreferencias
        else:
            preferencias = models.PreferenciasUsuario(
                id_UsuarioPreferencias=existing_usuario.idUsuario,
                objetivoPreferencias=user_data.objetivoPreferencias,
                rendaMensalPreferencias=user_data.rendaMensalPreferencias
            )
            db.add(preferencias)
        db_user_to_return = existing_usuario
    else:
        db_user = models.Usuario(
            nomeUsuario=user_data.nomeUsuario,
            is_verified=is_verified
        )
        db.add(db_user)
        db.flush()

        db_credenciais = models.Credenciais(
            email=user_data.email,
            senha=user_data.senha,
            usuario_id=db_user.idUsuario
        )
        db.add(db_credenciais)

        if user_data.objetivoPreferencias is not None or user_data.rendaMensalPreferencias is not None:
            db_preferencias = models.PreferenciasUsuario(
                id_UsuarioPreferencias=db_user.idUsuario,
                objetivoPreferencias=user_data.objetivoPreferencias,
                rendaMensalPreferencias=user_data.rendaMensalPreferencias
            )
            db.add(db_preferencias)
        db_user_to_return = db_user

    db.commit()
    if hasattr(db_user_to_return, 'idUsuario'):
        db.refresh(db_user_to_return)
        if db_user_to_return.credenciais:
             db.refresh(db_user_to_return.credenciais)
        if db_user_to_return.preferencias:
             db.refresh(db_user_to_return.preferencias)
    return db_user_to_return


def set_user_verified(db: Session, email: str) -> Optional[models.Usuario]:
    user = get_usuario_by_email(db, email=email)
    if user:
        user.is_verified = True
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    return None