from sqlalchemy.orm import Session
from crud.meta_crud import (
    create_meta, get_meta_by_id, get_metas_by_user, 
    update_meta, delete_meta, get_meta_progress
)
from schemas import MetaCreateSchema, MetaUpdateSchema, MetaResponseSchema
from typing import List, Optional
from decimal import Decimal

class MetaService:
    def __init__(self, db: Session):
        self.db = db

    def create_meta(self, meta_data: MetaCreateSchema, usuario_id: int) -> MetaResponseSchema:
        """Cria uma nova meta financeira"""
        db_meta = create_meta(self.db, meta_data, usuario_id)
        
        # Calcula progresso inicial (será 0)
        valor_atual, progresso_percentual = get_meta_progress(self.db, db_meta.idMeta)
        
        return MetaResponseSchema(
            idMeta=db_meta.idMeta,
            nome=db_meta.nome,
            descricao=db_meta.descricao,
            valor_objetivo=db_meta.valor_objetivo,
            valor_inicial=db_meta.valor_inicial,
            data_limite=db_meta.data_limite,
            usuario_id=db_meta.usuario_id,
            valor_atual=valor_atual,
            progresso_percentual=progresso_percentual
        )

    def get_meta_by_id(self, meta_id: int, usuario_id: int) -> Optional[MetaResponseSchema]:
        """Busca uma meta específica com cálculo de progresso"""
        db_meta = get_meta_by_id(self.db, meta_id, usuario_id)
        if not db_meta:
            return None
        
        valor_atual, progresso_percentual = get_meta_progress(self.db, db_meta.idMeta)
        
        return MetaResponseSchema(
            idMeta=db_meta.idMeta,
            nome=db_meta.nome,
            descricao=db_meta.descricao,
            valor_objetivo=db_meta.valor_objetivo,
            valor_inicial=db_meta.valor_inicial,
            data_limite=db_meta.data_limite,
            usuario_id=db_meta.usuario_id,
            valor_atual=valor_atual,
            progresso_percentual=progresso_percentual
        )

    def get_metas_by_user(self, usuario_id: int, skip: int = 0, limit: int = 100) -> List[MetaResponseSchema]:
        """Busca todas as metas de um usuário com cálculo de progresso"""
        db_metas = get_metas_by_user(self.db, usuario_id, skip, limit)
        
        result = []
        for db_meta in db_metas:
            valor_atual, progresso_percentual = get_meta_progress(self.db, db_meta.idMeta)
            
            meta_response = MetaResponseSchema(
                idMeta=db_meta.idMeta,
                nome=db_meta.nome,
                descricao=db_meta.descricao,
                valor_objetivo=db_meta.valor_objetivo,
                valor_inicial=db_meta.valor_inicial,
                data_limite=db_meta.data_limite,
                usuario_id=db_meta.usuario_id,
                valor_atual=valor_atual,
                progresso_percentual=progresso_percentual
            )
            result.append(meta_response)
        
        return result

    def update_meta(self, meta_id: int, usuario_id: int, meta_data: MetaUpdateSchema) -> Optional[MetaResponseSchema]:
        """Atualiza uma meta financeira"""
        db_meta = update_meta(self.db, meta_id, usuario_id, meta_data)
        if not db_meta:
            return None
        
        valor_atual, progresso_percentual = get_meta_progress(self.db, db_meta.idMeta)
        
        return MetaResponseSchema(
            idMeta=db_meta.idMeta,
            nome=db_meta.nome,
            descricao=db_meta.descricao,
            valor_objetivo=db_meta.valor_objetivo,
            valor_inicial=db_meta.valor_inicial,
            data_limite=db_meta.data_limite,
            usuario_id=db_meta.usuario_id,
            valor_atual=valor_atual,
            progresso_percentual=progresso_percentual
        )

    def delete_meta(self, meta_id: int, usuario_id: int) -> bool:
        """Exclui uma meta financeira"""
        return delete_meta(self.db, meta_id, usuario_id)

    def validate_meta_ownership(self, meta_id: int, usuario_id: int) -> bool:
        """Valida se uma meta pertence ao usuário"""
        db_meta = get_meta_by_id(self.db, meta_id, usuario_id)
        return db_meta is not None
