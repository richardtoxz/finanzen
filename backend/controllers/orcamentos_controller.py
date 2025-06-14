from fastapi import APIRouter, Depends, HTTPException, status, Query # ADICIONE ', Query' aqui
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials 
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from decimal import Decimal 

# Importar dependências do seu projeto - UTILIZANDO A MESMA LÓGICA DE IMPORTAÇÃO DO MOVIMENTACAO_CONTROLLER.PY
import schemas, models       # Importações absolutas, esperando que 'backend' seja o diretório raiz
from database import get_db  # Importação absoluta
import crud.orcamento as crud_orcamento # Importação absoluta do módulo crud.orcamento (anteriormente era backend.crud.orcamento)
# Importação para o serviço de orçamento, se você criar um. Por enquanto, não vamos usar um serviço para orçamento.
# from services.orcamento_service import orcamento_service_instance, OrcamentoService


# =========================================================================
# FUNÇÃO DE AUTENTICAÇÃO REAL - ADAPTADA DO SEU categoria_controller.py
# =========================================================================
security = HTTPBearer() 

def get_current_user_id_for_orcamento(credentials: HTTPAuthorizationCredentials = Depends(security)) -> int:
    """
    Extrai o user_id do token Bearer, adaptado para uso nos controllers de orçamento.
    """
    try:
        user_id = int(credentials.credentials)
        return user_id
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autorização deve ser um ID de usuário válido."
        )
# =========================================================================


router = APIRouter(
    prefix="/orcamentos", 
    tags=["Orçamentos"]
)


@router.post("/", response_model=schemas.OrcamentoResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_orcamento(
    orcamento_data: schemas.OrcamentoCreateSchema,
    db: Session = Depends(get_db),
    # USANDO A FUNÇÃO DE AUTENTICAÇÃO REAL AQUI:
    usuario_id: int = Depends(get_current_user_id_for_orcamento) 
):
    """
    Cria um novo orçamento para o usuário logado.
    """
    if orcamento_data.categoria_id:
        categoria = db.query(models.CategoriaMov).filter(
            models.CategoriaMov.idCategoria == orcamento_data.categoria_id,
            models.CategoriaMov.usuario_id == usuario_id # Usando o ID do usuário autenticado
        ).first()
        if not categoria:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Categoria não encontrada ou não pertence a este usuário."
            )

    db_orcamento = crud_orcamento.create_orcamento(
        db=db,
        nome=orcamento_data.nome,
        valor_orcado=float(orcamento_data.valor_orcado),
        data_inicio=orcamento_data.data_inicio,
        data_fim=orcamento_data.data_fim,
        usuario_id=usuario_id, # Usando o ID do usuário autenticado
        categoria_id=orcamento_data.categoria_id
    )

    db_orcamento = crud_orcamento.update_valor_gasto_orcamento(db, db_orcamento)

    response_data = schemas.OrcamentoResponseSchema.model_validate(db_orcamento)
    if db_orcamento.categoria:
        response_data.categoria = schemas.CategoriaSimpleResponseSchema.model_validate(db_orcamento.categoria)

    return response_data

@router.get("/{orcamento_id}", response_model=schemas.OrcamentoResponseSchema)
async def get_orcamento(
    orcamento_id: int,
    db: Session = Depends(get_db),
    # USANDO A FUNÇÃO DE AUTENTICAÇÃO REAL AQUI:
    usuario_id: int = Depends(get_current_user_id_for_orcamento) 
):
    """
    Obtém um orçamento específico pelo ID para o usuário logado.
    """
    db_orcamento = crud_orcamento.get_orcamento_by_id(db, orcamento_id, usuario_id) # Usando o ID do usuário autenticado
    if not db_orcamento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Orçamento não encontrado.")
    
    db_orcamento = crud_orcamento.update_valor_gasto_orcamento(db, db_orcamento)

    response_data = schemas.OrcamentoResponseSchema.model_validate(db_orcamento)
    if db_orcamento.categoria:
        response_data.categoria = schemas.CategoriaSimpleResponseSchema.model_validate(db_orcamento.categoria)

    return response_data

@router.get("/", response_model=List[schemas.OrcamentoResponseSchema])
async def list_orcamentos(
    db: Session = Depends(get_db),
    # USANDO A FUNÇÃO DE AUTENTICAÇÃO REAL AQUI:
    usuario_id: int = Depends(get_current_user_id_for_orcamento), 
    skip: int = 0,
    limit: int = 100,
    data_inicio: Optional[date] = Query(None, description="Data de início no formato AAAA-MM-DD"), # Adicionado Query para docs
    data_fim: Optional[date] = Query(None, description="Data de fim no formato AAAA-MM-DD"),   # Adicionado Query para docs
    categoria_id: Optional[int] = Query(None, description="ID da categoria para filtrar") # Adicionado Query para docs
):
    """
    Lista todos os orçamentos do usuário logado, com opções de filtro por período e categoria.
    """
    if data_inicio and data_fim:
        orcamentos = crud_orcamento.get_orcamentos_by_period_and_category(
            db, usuario_id, data_inicio, data_fim, categoria_id, skip=skip, limit=limit # Usando o ID do usuário autenticado
        )
    else:
        orcamentos = crud_orcamento.get_orcamentos(db, usuario_id, skip=skip, limit=limit) # Usando o ID do usuário autenticado
    
    response_list = []
    for orcamento in orcamentos:
        updated_orcamento = crud_orcamento.update_valor_gasto_orcamento(db, orcamento)
        response_data = schemas.OrcamentoResponseSchema.model_validate(updated_orcamento)
        if updated_orcamento.categoria:
            response_data.categoria = schemas.CategoriaSimpleResponseSchema.model_validate(updated_orcamento.categoria)
        response_list.append(response_data)
        
    return response_list


@router.put("/{orcamento_id}", response_model=schemas.OrcamentoResponseSchema)
async def update_orcamento(
    orcamento_id: int,
    orcamento_data: schemas.OrcamentoUpdateSchema,
    db: Session = Depends(get_db),
    # USANDO A FUNÇÃO DE AUTENTICAÇÃO REAL AQUI:
    usuario_id: int = Depends(get_current_user_id_for_orcamento) 
):
    """
    Atualiza um orçamento existente para o usuário logado.
    """
    db_orcamento = crud_orcamento.get_orcamento_by_id(db, orcamento_id, usuario_id) # Usando o ID do usuário autenticado
    if not db_orcamento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Orçamento não encontrado.")

    if orcamento_data.categoria_id is not None:
        categoria = db.query(models.CategoriaMov).filter(
            models.CategoriaMov.idCategoria == orcamento_data.categoria_id,
            models.CategoriaMov.usuario_id == usuario_id # Usando o ID do usuário autenticado
        ).first()
        if not categoria:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Nova categoria não encontrada ou não pertence a este usuário."
            )

    updated_orcamento_db = crud_orcamento.update_orcamento(
        db=db,
        orcamento=db_orcamento,
        nome=orcamento_data.nome,
        valor_orcado=float(orcamento_data.valor_orcado) if orcamento_data.valor_orcado is not None else None,
        data_inicio=orcamento_data.data_inicio,
        data_fim=orcamento_data.data_fim,
        categoria_id=orcamento_data.categoria_id
    )

    updated_orcamento_db = crud_orcamento.update_valor_gasto_orcamento(db, updated_orcamento_db)

    response_data = schemas.OrcamentoResponseSchema.model_validate(updated_orcamento_db)
    if updated_orcamento_db.categoria:
        response_data.categoria = schemas.CategoriaSimpleResponseSchema.model_validate(updated_orcamento_db.categoria)

    return response_data

@router.delete("/{orcamento_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_orcamento(
    orcamento_id: int,
    db: Session = Depends(get_db),
    # USANDO A FUNÇÃO DE AUTENTICAÇÃO REAL AQUI:
    usuario_id: int = Depends(get_current_user_id_for_orcamento) 
):
    """
    Deleta um orçamento existente para o usuário logado.
    """
    db_orcamento = crud_orcamento.get_orcamento_by_id(db, orcamento_id, usuario_id) # Usando o ID do usuário autenticado
    if not db_orcamento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Orçamento não encontrado.")
    
    crud_orcamento.delete_orcamento(db, db_orcamento)
    return {}