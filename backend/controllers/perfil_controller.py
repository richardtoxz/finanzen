from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Dict

import schemas
from database import get_db
from services.perfil_service import perfil_service_instance, PerfilService

router = APIRouter(prefix="/perfil", tags=["Perfil do Usuário"])
security = HTTPBearer()

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> int:
    """
    Função auxiliar para extrair o user_id do token Bearer.
    O frontend deve enviar o ID do usuário no formato: Bearer {user_id}
    """
    try:
        user_id = int(credentials.credentials)
        return user_id
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autorização deve ser um ID de usuário válido"
        )

@router.get("/", response_model=schemas.UserProfileResponseSchema)
def get_user_profile_endpoint(
    db: Session = Depends(get_db),
    usuario_id: int = Depends(get_current_user_id),
    service: PerfilService = Depends(lambda: perfil_service_instance)
):
    """
    Endpoint para obter o perfil completo do usuário autenticado.
    Retorna informações pessoais e preferências, mas não a senha.
    """
    return service.get_user_profile(db, usuario_id)

@router.put("/", response_model=schemas.UserProfileResponseSchema)
def update_user_profile_endpoint(
    profile_data: schemas.UserProfileUpdateSchema,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(get_current_user_id),
    service: PerfilService = Depends(lambda: perfil_service_instance)
):
    """
    Endpoint para atualizar informações do perfil do usuário.
    Permite atualização parcial - apenas os campos enviados serão alterados.
    """
    return service.update_user_profile(db, usuario_id, profile_data)

@router.put("/senha", response_model=Dict[str, str])
def update_user_password_endpoint(
    password_data: schemas.UserPasswordUpdateSchema,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(get_current_user_id),
    service: PerfilService = Depends(lambda: perfil_service_instance)
):
    """
    Endpoint dedicado para alteração de senha.
    Requer a senha atual para validação antes de definir a nova senha.
    """
    return service.update_user_password(db, usuario_id, password_data)
