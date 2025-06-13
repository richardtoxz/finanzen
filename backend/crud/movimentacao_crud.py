from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import date
import models, schemas

def create_movimentacao(
    db: Session, 
    movimentacao_data: schemas.MovimentacaoCreateSchema, 
    usuario_id: int
) -> models.Movimentacao:
    db_movimentacao = models.Movimentacao(
        tipo=movimentacao_data.tipo,
        valor=movimentacao_data.valor,
        descricao=movimentacao_data.descricao,
        data_movimentacao=movimentacao_data.data_movimentacao,
        categoria_id=movimentacao_data.categoria_id,
        meta_id=movimentacao_data.meta_id,
        usuario_id=usuario_id
    )
    db.add(db_movimentacao)
    db.commit()
    db.refresh(db_movimentacao)
    return db_movimentacao

def get_movimentacoes_by_usuario(
    db: Session, 
    usuario_id: int,
    tipo_filter: Optional[str] = None,
    data_inicio: Optional[date] = None,
    data_fim: Optional[date] = None
) -> List[models.Movimentacao]:
    query = db.query(models.Movimentacao).options(
        joinedload(models.Movimentacao.categoria)
    ).filter(models.Movimentacao.usuario_id == usuario_id)
    
    if tipo_filter:
        query = query.filter(models.Movimentacao.tipo == tipo_filter)
    
    if data_inicio:
        query = query.filter(models.Movimentacao.data_movimentacao >= data_inicio)
    
    if data_fim:
        query = query.filter(models.Movimentacao.data_movimentacao <= data_fim)
    
    return query.order_by(models.Movimentacao.data_movimentacao.desc()).all()

def get_movimentacao_by_id_and_usuario(
    db: Session, 
    movimentacao_id: int, 
    usuario_id: int
) -> Optional[models.Movimentacao]:
    return db.query(models.Movimentacao).options(
        joinedload(models.Movimentacao.categoria)
    ).filter(
        models.Movimentacao.idMovimentacao == movimentacao_id,
        models.Movimentacao.usuario_id == usuario_id
    ).first()

def update_movimentacao(
    db: Session, 
    movimentacao_id: int, 
    usuario_id: int, 
    movimentacao_data: schemas.MovimentacaoUpdateSchema
) -> Optional[models.Movimentacao]:
    db_movimentacao = get_movimentacao_by_id_and_usuario(db, movimentacao_id, usuario_id)
    if not db_movimentacao:
        return None
    
    update_data = movimentacao_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_movimentacao, field, value)
    
    db.commit()
    db.refresh(db_movimentacao)
    return db_movimentacao

def delete_movimentacao(db: Session, movimentacao_id: int, usuario_id: int) -> bool:
    db_movimentacao = get_movimentacao_by_id_and_usuario(db, movimentacao_id, usuario_id)
    if not db_movimentacao:
        return False
    
    db.delete(db_movimentacao)
    db.commit()
    return True

def verificar_categoria_pertence_usuario(db: Session, categoria_id: int, usuario_id: int) -> bool:
    """Verifica se a categoria pertence ao usuário especificado"""
    categoria = db.query(models.CategoriaMov).filter(
        models.CategoriaMov.idCategoria == categoria_id,
        models.CategoriaMov.usuario_id == usuario_id
    ).first()
    return categoria is not None
