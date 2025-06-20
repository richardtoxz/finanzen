from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from datetime import date

import schemas, models
from crud import movimentacao_crud
from crud.meta_crud import get_meta_by_id

class MovimentacaoService:
    def create_movimentacao(
        self, 
        db: Session, 
        movimentacao_data: schemas.MovimentacaoCreateSchema, 
        usuario_id: int
    ) -> models.Movimentacao:
        if not movimentacao_crud.verificar_categoria_pertence_usuario(
            db, movimentacao_data.categoria_id, usuario_id
        ):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Categoria não encontrada ou não pertence ao usuário."
            )
        
        # Validar se a meta pertence ao usuário (se fornecida)
        if movimentacao_data.meta_id is not None:
            if not get_meta_by_id(db, movimentacao_data.meta_id, usuario_id):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Meta não encontrada ou não pertence ao usuário."
                )
        
        return movimentacao_crud.create_movimentacao(db, movimentacao_data, usuario_id)
    
    def get_movimentacoes_usuario(
        self, 
        db: Session, 
        usuario_id: int,
        tipo_filter: Optional[str] = None,
        data_inicio: Optional[date] = None,
        data_fim: Optional[date] = None
    ) -> List[models.Movimentacao]:
        return movimentacao_crud.get_movimentacoes_by_usuario(
            db, usuario_id, tipo_filter, data_inicio, data_fim
        )
    
    def get_movimentacao_by_id(
        self, 
        db: Session, 
        movimentacao_id: int, 
        usuario_id: int
    ) -> models.Movimentacao:
        movimentacao = movimentacao_crud.get_movimentacao_by_id_and_usuario(
            db, movimentacao_id, usuario_id
        )
        if not movimentacao:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transação não encontrada ou não pertence ao usuário."
            )
        return movimentacao
    
    def update_movimentacao(
        self, 
        db: Session, 
        movimentacao_id: int, 
        usuario_id: int, 
        movimentacao_data: schemas.MovimentacaoUpdateSchema
    ) -> models.Movimentacao:
        if movimentacao_data.categoria_id is not None:
            if not movimentacao_crud.verificar_categoria_pertence_usuario(
                db, movimentacao_data.categoria_id, usuario_id
            ):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Categoria não encontrada ou não pertence ao usuário."
                )
        
        # Validar se a meta pertence ao usuário (se fornecida)
        if movimentacao_data.meta_id is not None:
            if not get_meta_by_id(db, movimentacao_data.meta_id, usuario_id):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Meta não encontrada ou não pertence ao usuário."
                )
        
        movimentacao = movimentacao_crud.update_movimentacao(
            db, movimentacao_id, usuario_id, movimentacao_data
        )
        if not movimentacao:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transação não encontrada ou não pertence ao usuário."
            )
        return movimentacao
    
    def delete_movimentacao(self, db: Session, movimentacao_id: int, usuario_id: int) -> None:
        success = movimentacao_crud.delete_movimentacao(db, movimentacao_id, usuario_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transação não encontrada ou não pertence ao usuário."
            )

movimentacao_service_instance = MovimentacaoService()
