from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List

import schemas, models
from database import get_db
from services.categoria_service import categoria_service_instance, CategoriaService

router = APIRouter(prefix="/categorias", tags=["Categorias"])
security = HTTPBearer()

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> int:
    """
    Função auxiliar para extrair o user_id do token Bearer.
    O frontend deve enviar o ID do usuário no formato: Bearer {user_id}
    Em produção, isso seria um JWT token.
    """
    try:
        user_id = int(credentials.credentials)
        return user_id
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autorização deve ser um ID de usuário válido"
        )

@router.post("/", response_model=schemas.CategoriaResponseSchema, status_code=status.HTTP_201_CREATED)
def create_categoria_endpoint(
    categoria_data: schemas.CategoriaCreateSchema,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(get_current_user_id),
    service: CategoriaService = Depends(lambda: categoria_service_instance)
):
    categoria = service.create_categoria(db, categoria_data, usuario_id)
    return categoria

@router.get("/", response_model=List[schemas.CategoriaResponseSchema])
def get_categorias_endpoint(
    db: Session = Depends(get_db),
    usuario_id: int = Depends(get_current_user_id),
    service: CategoriaService = Depends(lambda: categoria_service_instance)
):
    categorias = service.get_categorias_usuario(db, usuario_id)
    return categorias

@router.put("/{id_categoria}", response_model=schemas.CategoriaResponseSchema)
def update_categoria_endpoint(
    id_categoria: int,
    categoria_data: schemas.CategoriaUpdateSchema,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(get_current_user_id),
    service: CategoriaService = Depends(lambda: categoria_service_instance)
):
    categoria = service.update_categoria(db, id_categoria, usuario_id, categoria_data)
    return categoria

@router.delete("/{id_categoria}", status_code=status.HTTP_204_NO_CONTENT)
def delete_categoria_endpoint(
    id_categoria: int,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(get_current_user_id),
    service: CategoriaService = Depends(lambda: categoria_service_instance)
):
    service.delete_categoria(db, id_categoria, usuario_id)
    return
