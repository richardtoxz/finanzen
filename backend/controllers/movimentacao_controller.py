from fastapi import APIRouter, Depends, HTTPException, status, Header, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

import schemas, models
from database import get_db
from services.movimentacao_service import movimentacao_service_instance, MovimentacaoService

router = APIRouter(prefix="/transacoes", tags=["Transações"])

def get_current_user_id(authorization: str = Header(...), db: Session = Depends(get_db)) -> int:
    """
    Função auxiliar para extrair o user_id do cabeçalho Authorization.
    O frontend deve enviar o ID do usuário no formato: Bearer {user_id}
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autorização inválido."
        )
    
    try:
        user_id_str = authorization.replace("Bearer ", "").strip()
        user_id = int(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ID de usuário inválido."
        )
    
    user = db.query(models.Usuario).filter(
        models.Usuario.idUsuario == user_id,
        models.Usuario.is_verified == True
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado ou não verificado."
        )
    
    return user.idUsuario

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
