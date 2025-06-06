from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional

import schemas, models
from crud import user_crud, verification_crud
from core.security import generate_verification_code

class AuthService:
    def request_registration_and_send_code(
        self, db: Session, user_reg_data: schemas.UserRegistrationSchema
    ) -> tuple[models.Usuario, str]:
        existing_verified_user = user_crud.get_usuario_by_email(db, email=user_reg_data.email)
        if existing_verified_user and existing_verified_user.is_verified:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="E-mail já cadastrado e verificado.")

        user = user_crud.create_update_user_with_preferences(db, user_reg_data, is_verified=False)

        code = generate_verification_code()
        verification_crud.create_verification_code(db, email=user_reg_data.email, code=code)
        
        print(f"Código de verificação apenas para teste: {user_reg_data.email}: {code}")
        
        return user, code

    def verify_email_and_activate_user(self, db: Session, verification_data: schemas.EmailVerificationSchema) -> models.Usuario:
        code_entry = verification_crud.get_valid_verification_code(
            db, email=verification_data.email, code=verification_data.codigo_Verificacao
        )
        if not code_entry:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Código de verificação inválido ou expirado.")

        user = user_crud.set_user_verified(db, email=verification_data.email)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado para verificação.")
        
        verification_crud.mark_verification_code_as_used(db, code_entry)
        return user

    def login_user(self, db: Session, login_data: schemas.UserLoginSchema) -> Optional[models.Usuario]:
        credenciais = user_crud.get_credenciais_by_email(db, email=login_data.email)
        
        if not credenciais or not credenciais.usuario:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Esse e-mail não está cadastrado, por favor utilizar e-mail valido."
            )

        if not credenciais.usuario.is_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Conta não verificada. Por favor, verifique seu e-mail."
            )
        
        if credenciais.senha != login_data.senha:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Senha incorreta, insira uma senha válida."
            )
        return credenciais.usuario


auth_service_instance = AuthService()