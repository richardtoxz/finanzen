from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from schemas import MetaCreateSchema, MetaUpdateSchema, MetaResponseSchema
from services.meta_service import MetaService
from typing import List, Optional

router = APIRouter(prefix="/metas", tags=["Metas Financeiras"])
security = HTTPBearer()

def get_user_id_from_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> int:
    """Extrai o user_id do token Bearer"""
    try:
        user_id = int(credentials.credentials)
        return user_id
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autorização deve ser um ID de usuário válido"
        )

@router.post("/", response_model=MetaResponseSchema, status_code=status.HTTP_201_CREATED)
def create_meta(
    meta_data: MetaCreateSchema,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id_from_token)
):
    """Cria uma nova meta financeira"""
    meta_service = MetaService(db)
    return meta_service.create_meta(meta_data, user_id)

@router.get("/", response_model=List[MetaResponseSchema])
def get_metas(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id_from_token)
):
    """Lista todas as metas do usuário com progresso calculado"""
    meta_service = MetaService(db)
    return meta_service.get_metas_by_user(user_id, skip, limit)

@router.get("/{meta_id}", response_model=MetaResponseSchema)
def get_meta(
    meta_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id_from_token)
):
    """Busca uma meta específica com progresso calculado"""
    meta_service = MetaService(db)
    meta = meta_service.get_meta_by_id(meta_id, user_id)
    
    if not meta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meta não encontrada"
        )
    
    return meta

@router.put("/{meta_id}", response_model=MetaResponseSchema)
def update_meta(
    meta_id: int,
    meta_data: MetaUpdateSchema,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id_from_token)
):
    """Atualiza uma meta financeira"""
    meta_service = MetaService(db)
    updated_meta = meta_service.update_meta(meta_id, user_id, meta_data)
    
    if not updated_meta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meta não encontrada"
        )
    
    return updated_meta

@router.delete("/{meta_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meta(
    meta_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id_from_token)
):
    """Exclui uma meta financeira"""
    meta_service = MetaService(db)
    deleted = meta_service.delete_meta(meta_id, user_id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meta não encontrada"
        )
    
    return
