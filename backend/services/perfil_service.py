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
        
        # Preparar dados do perfil
        profile_data = {
            "idUsuario": user.idUsuario,
            "nomeUsuario": user.nomeUsuario,
            "email": user.credenciais.email if user.credenciais else "",
            "is_verified": user.is_verified,
            "objetivoPreferencias": None,
            "rendaMensalPreferencias": None
        }
        
        # Adicionar preferências se existirem
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
        Atualiza o perfil do usuário com validações
        """
        # Validar se email não está sendo usado por outro usuário
        if profile_data.email:
            if perfil_crud.check_email_exists(db, profile_data.email, usuario_id):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Este email já está sendo utilizado por outro usuário"
                )
        
        # Atualizar perfil
        updated_user = perfil_crud.update_user_profile(db, usuario_id, profile_data)
        
        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )          # Retornar perfil atualizado
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
            # Verificar se o usuário existe
            user = perfil_crud.get_user_profile(db, usuario_id)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Usuário não encontrado"
                )
            
            # Se chegou aqui, a senha atual está incorreta
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Senha atual incorreta"
            )
        
        return {"message": "Senha alterada com sucesso"}

# Instância global do serviço
perfil_service_instance = PerfilService()
