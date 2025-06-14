from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Optional
from datetime import date

import models 
from models import TipoMovimentacao # Ajuste se TipoMovimentacao estiver apenas em schemas

def create_orcamento(db: Session,
                     nome: str,
                     valor_orcado: float, 
                     data_inicio: date,
                     data_fim: date,
                     usuario_id: int,
                     categoria_id: Optional[int] = None) -> models.Orcamento:
    db_orcamento = models.Orcamento(
        nome=nome,
        valor_orcado=valor_orcado,
        data_inicio=data_inicio,
        data_fim=data_fim,
        usuario_id=usuario_id,
        categoria_id=categoria_id,
        valor_gasto=0.0
    )
    db.add(db_orcamento)
    db.commit()
    db.refresh(db_orcamento)
    return db_orcamento

def get_orcamento_by_id(db: Session, orcamento_id: int, usuario_id: int) -> Optional[models.Orcamento]:
    return db.query(models.Orcamento).filter(
        models.Orcamento.idOrcamento == orcamento_id, 
        models.Orcamento.usuario_id == usuario_id
    ).options(
        joinedload(models.Orcamento.categoria)
    ).first()

def get_orcamentos(db: Session, usuario_id: int, skip: int = 0, limit: int = 100) -> List[models.Orcamento]:
    return db.query(models.Orcamento).filter(
        models.Orcamento.usuario_id == usuario_id
    ).options(
        joinedload(models.Orcamento.categoria)
    ).offset(skip).limit(limit).all()

def update_orcamento(db: Session,
                     orcamento: models.Orcamento,
                     nome: Optional[str] = None,
                     valor_orcado: Optional[float] = None,
                     data_inicio: Optional[date] = None,
                     data_fim: Optional[date] = None,
                     categoria_id: Optional[int] = None) -> models.Orcamento:
    if nome is not None:
        orcamento.nome = nome
    if valor_orcado is not None:
        orcamento.valor_orcado = valor_orcado
    if data_inicio is not None:
        orcamento.data_inicio = data_inicio
    if data_fim is not None:
        orcamento.data_fim = data_fim
    if categoria_id is not None:
        orcamento.categoria_id = categoria_id

    db.commit()
    db.refresh(orcamento)
    return orcamento

def delete_orcamento(db: Session, orcamento: models.Orcamento) -> None:
    db.delete(orcamento)
    db.commit()

def calculate_valor_gasto_orcamento(db: Session, orcamento_id: int) -> float:
    orcamento = db.query(models.Orcamento).filter(models.Orcamento.idOrcamento == orcamento_id).first()
    if not orcamento:
        return 0.0

    query = db.query(func.sum(models.Movimentacao.valor)).filter(
        models.Movimentacao.usuario_id == orcamento.usuario_id,
        models.Movimentacao.data_movimentacao >= orcamento.data_inicio,
        models.Movimentacao.data_movimentacao <= orcamento.data_fim,
        models.Movimentacao.tipo == TipoMovimentacao.despesa
    )
    
    if orcamento.categoria_id:
        query = query.filter(models.Movimentacao.categoria_id == orcamento.categoria_id)

    total_gasto = query.scalar()
    return float(total_gasto) if total_gasto is not None else 0.0

def update_valor_gasto_orcamento(db: Session, orcamento: models.Orcamento) -> models.Orcamento:
    orcamento.valor_gasto = calculate_valor_gasto_orcamento(db, orcamento.idOrcamento)
    db.commit()
    db.refresh(orcamento)
    return orcamento

def get_orcamentos_by_period_and_category(
    db: Session,
    usuario_id: int,
    start_date: date,
    end_date: date,
    categoria_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100
) -> List[models.Orcamento]:
    query = db.query(models.Orcamento).filter(
        models.Orcamento.usuario_id == usuario_id,
        models.Orcamento.data_inicio <= end_date,
        models.Orcamento.data_fim >= start_date
    )
    if categoria_id:
        query = query.filter(models.Orcamento.categoria_id == categoria_id)
    return query.options(joinedload(models.Orcamento.categoria)).offset(skip).limit(limit).all()