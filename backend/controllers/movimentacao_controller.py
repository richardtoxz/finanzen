from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime
from sqlalchemy import func, extract

import schemas, models
from database import get_db
from services.movimentacao_service import movimentacao_service_instance, MovimentacaoService

router = APIRouter(prefix="/transacoes", tags=["Transações"])
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

@router.post("/", response_model=schemas.MovimentacaoResponseSchema, status_code=status.HTTP_201_CREATED)
def create_movimentacao_endpoint(
    movimentacao_data: schemas.MovimentacaoCreateSchema,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(get_current_user_id),
    service: MovimentacaoService = Depends(lambda: movimentacao_service_instance)
):
    movimentacao = service.create_movimentacao(db, movimentacao_data, usuario_id)
    return movimentacao

@router.get("/", response_model=List[schemas.MovimentacaoResponseSchema])
def get_movimentacoes_endpoint(
    tipo: Optional[str] = Query(None, description="Filtrar por tipo: 'receita' ou 'despesa'"),
    data_inicio: Optional[date] = Query(None, description="Data de início no formato AAAA-MM-DD"),
    data_fim: Optional[date] = Query(None, description="Data de fim no formato AAAA-MM-DD"),
    db: Session = Depends(get_db),
    usuario_id: int = Depends(get_current_user_id),
    service: MovimentacaoService = Depends(lambda: movimentacao_service_instance)
):
    if tipo and tipo not in ["receita", "despesa"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tipo deve ser 'receita' ou 'despesa'."
        )
    
    movimentacoes = service.get_movimentacoes_usuario(
        db, usuario_id, tipo, data_inicio, data_fim
    )
    return movimentacoes

@router.get("/{id_transacao}", response_model=schemas.MovimentacaoResponseSchema)
def get_movimentacao_endpoint(
    id_transacao: int,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(get_current_user_id),
    service: MovimentacaoService = Depends(lambda: movimentacao_service_instance)
):
    movimentacao = service.get_movimentacao_by_id(db, id_transacao, usuario_id)
    return movimentacao

@router.put("/{id_transacao}", response_model=schemas.MovimentacaoResponseSchema)
def update_movimentacao_endpoint(
    id_transacao: int,
    movimentacao_data: schemas.MovimentacaoUpdateSchema,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(get_current_user_id),
    service: MovimentacaoService = Depends(lambda: movimentacao_service_instance)
):
    movimentacao = service.update_movimentacao(db, id_transacao, usuario_id, movimentacao_data)
    return movimentacao

@router.delete("/{id_transacao}", status_code=status.HTTP_204_NO_CONTENT)
def delete_movimentacao_endpoint(
    id_transacao: int,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(get_current_user_id),
    service: MovimentacaoService = Depends(lambda: movimentacao_service_instance)
):
    service.delete_movimentacao(db, id_transacao, usuario_id)
    return

@router.get("/dashboard/summary", response_model=schemas.DashboardSummarySchema)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    usuario_id: int = Depends(get_current_user_id)
):
    """
    Endpoint para obter resumo do dashboard com totais de receitas, despesas e saldo do mês atual.
    """
    current_date = datetime.now()
    current_month = current_date.month
    current_year = current_date.year
    
    receitas_query = db.query(func.sum(models.Movimentacao.valor)).filter(
        models.Movimentacao.usuario_id == usuario_id,
        models.Movimentacao.tipo == models.TipoMovimentacao.receita,
        extract('month', models.Movimentacao.data_movimentacao) == current_month,
        extract('year', models.Movimentacao.data_movimentacao) == current_year
    ).scalar()
    
    despesas_query = db.query(func.sum(models.Movimentacao.valor)).filter(
        models.Movimentacao.usuario_id == usuario_id,
        models.Movimentacao.tipo == models.TipoMovimentacao.despesa,
        extract('month', models.Movimentacao.data_movimentacao) == current_month,
        extract('year', models.Movimentacao.data_movimentacao) == current_year
    ).scalar()
    
    total_receitas = float(receitas_query) if receitas_query else 0.0
    total_despesas = float(despesas_query) if despesas_query else 0.0
    saldo_atual = total_receitas - total_despesas
    
    return {
        "saldo_atual": saldo_atual,
        "total_receitas": total_receitas,
        "total_despesas": total_despesas
    }
