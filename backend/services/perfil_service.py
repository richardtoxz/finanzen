from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import schemas, models
from crud import perfil_crud

class PerfilService:
    def get_user_profile(self, db: Session, usuario_id: int) -> schemas.UserProfileResponseSchema:
        """
        Obtém o perfil completo do usuário
        """
        user = perfil_crud.get_user_profile(db, usuario_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )
        
        profile_data = {
            "idUsuario": user.idUsuario,
            "nomeUsuario": user.nomeUsuario,
            "email": user.credenciais.email if user.credenciais else "",
            "is_verified": user.is_verified,
            "objetivoPreferencias": None,
            "rendaMensalPreferencias": None
        }
        
        if user.preferencias:
            profile_data["objetivoPreferencias"] = user.preferencias.objetivoPreferencias
            profile_data["rendaMensalPreferencias"] = user.preferencias.rendaMensalPreferencias
        
        return schemas.UserProfileResponseSchema(**profile_data)
    
    def update_user_profile(
        self, 
        db: Session, 
        usuario_id: int, 
        profile_data: schemas.UserProfileUpdateSchema
    ) -> schemas.UserProfileResponseSchema:
        """
        Atualiza o perfil do usuário (sem email - removido por segurança)
        """
        updated_user = perfil_crud.update_user_profile(db, usuario_id, profile_data)
        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )
        
        return self.get_user_profile(db, usuario_id)
    
    def update_user_password(
        self, 
        db: Session, 
        usuario_id: int, 
        password_data: schemas.UserPasswordUpdateSchema
    ) -> dict:
        """
        Atualiza a senha do usuário após validar a senha atual
        """
        success = perfil_crud.update_user_password(db, usuario_id, password_data)
        
        if not success:
            user = perfil_crud.get_user_profile(db, usuario_id)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Usuário não encontrado"
                )
            
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Senha atual incorreta"
            )
        
        return {"message": "Senha alterada com sucesso"}
    
    def request_email_change(
        self, 
        db: Session, 
        usuario_id: int, 
        email_request: schemas.EmailChangeRequestSchema
    ) -> schemas.EmailChangeRequestResponseSchema:
        """
        Solicita alteração de email - primeira etapa
        """
        if perfil_crud.check_email_exists(db, email_request.novo_email, usuario_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Este e-mail já está em uso."
            )
        
        verification_code = perfil_crud.generate_verification_code()
        
        perfil_crud.save_email_change_verification(
            db, usuario_id, email_request.novo_email, verification_code
        )
        
        return schemas.EmailChangeRequestResponseSchema(
            message="Código de verificação para o novo e-mail gerado com sucesso.",
            verification_code_for_testing=verification_code
        )
    
    def confirm_email_change(
        self, 
        db: Session, 
        usuario_id: int, 
        email_confirm: schemas.EmailChangeConfirmSchema
    ) -> dict:
        """
        Confirma alteração de email - segunda etapa
        """
        is_valid = perfil_crud.validate_email_change_code(
            db, usuario_id, email_confirm.novo_email, email_confirm.codigo_verificacao
        )
        
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Código inválido ou expirado."
            )
        
        success = perfil_crud.update_user_email(db, usuario_id, email_confirm.novo_email)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno ao atualizar o e-mail."
            )
        
        perfil_crud.mark_email_verification_as_used(
            db, usuario_id, email_confirm.novo_email, email_confirm.codigo_verificacao
        )
        
        return {"message": "E-mail alterado com sucesso!"}

perfil_service_instance = PerfilService()
