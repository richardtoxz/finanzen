from sqlalchemy.orm import Session
from sqlalchemy import func
from models import MetaFinanceira, Movimentacao
from schemas import MetaCreateSchema, MetaUpdateSchema
from decimal import Decimal
from typing import List, Optional

def create_meta(db: Session, meta_data: MetaCreateSchema, usuario_id: int) -> MetaFinanceira:
    """Cria uma nova meta financeira"""
    db_meta = MetaFinanceira(
        nome=meta_data.nome,
        descricao=meta_data.descricao,
        valor_objetivo=meta_data.valor_objetivo,
        valor_inicial=Decimal('0.00'),
        data_limite=meta_data.data_limite,
        usuario_id=usuario_id
    )
    db.add(db_meta)
    db.commit()
    db.refresh(db_meta)
    return db_meta

def get_meta_by_id(db: Session, meta_id: int, usuario_id: int) -> Optional[MetaFinanceira]:
    """Busca uma meta específica do usuário"""
    return db.query(MetaFinanceira).filter(
        MetaFinanceira.idMeta == meta_id,
        MetaFinanceira.usuario_id == usuario_id
    ).first()

def get_metas_by_user(db: Session, usuario_id: int, skip: int = 0, limit: int = 100) -> List[MetaFinanceira]:
    """Busca todas as metas de um usuário"""
    return db.query(MetaFinanceira).filter(
        MetaFinanceira.usuario_id == usuario_id
    ).offset(skip).limit(limit).all()

def update_meta(db: Session, meta_id: int, usuario_id: int, meta_data: MetaUpdateSchema) -> Optional[MetaFinanceira]:
    """Atualiza uma meta financeira"""
    db_meta = get_meta_by_id(db, meta_id, usuario_id)
    if not db_meta:
        return None
    
    update_data = meta_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_meta, field, value)
    
    db.commit()
    db.refresh(db_meta)
    return db_meta

def delete_meta(db: Session, meta_id: int, usuario_id: int) -> bool:
    """Exclui uma meta financeira"""
    db_meta = get_meta_by_id(db, meta_id, usuario_id)
    if not db_meta:
        return False
    
    db.delete(db_meta)
    db.commit()
    return True

def get_meta_progress(db: Session, meta_id: int) -> tuple[Decimal, float]:
    """Calcula o valor atual e progresso percentual de uma meta"""
    valor_atual = db.query(func.coalesce(func.sum(Movimentacao.valor), 0)).filter(
        Movimentacao.meta_id == meta_id
    ).scalar()
    
    if valor_atual is None:
        valor_atual = Decimal('0.00')
    else:
        valor_atual = Decimal(str(valor_atual))
    
    meta = db.query(MetaFinanceira).filter(MetaFinanceira.idMeta == meta_id).first()
    if not meta or meta.valor_objetivo == 0:
        return valor_atual, 0.0
    
    progresso_percentual = float((valor_atual / meta.valor_objetivo) * 100)
    return valor_atual, progresso_percentual
