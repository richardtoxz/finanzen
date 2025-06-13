from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List

import schemas, models
from crud import categoria_crud

class CategoriaService:
    def create_categoria(self, db: Session, categoria_data: schemas.CategoriaCreateSchema, usuario_id: int) -> models.CategoriaMov:
        return categoria_crud.create_categoria(db, categoria_data, usuario_id)
    
    def get_categorias_usuario(self, db: Session, usuario_id: int) -> List[models.CategoriaMov]:
        return categoria_crud.get_categorias_by_usuario(db, usuario_id)
    
    def update_categoria(self, db: Session, categoria_id: int, usuario_id: int, categoria_data: schemas.CategoriaUpdateSchema) -> models.CategoriaMov:
        categoria = categoria_crud.update_categoria(db, categoria_id, usuario_id, categoria_data)
        if not categoria:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Categoria não encontrada ou não pertence ao usuário."
            )
        return categoria
    
    def delete_categoria(self, db: Session, categoria_id: int, usuario_id: int) -> None:
        success = categoria_crud.delete_categoria(db, categoria_id, usuario_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Categoria não encontrada ou não pertence ao usuário."
            )

categoria_service_instance = CategoriaService()
