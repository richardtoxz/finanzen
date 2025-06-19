from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional

import schemas
from database import get_db
from services.reports_service import reports_service_instance, ReportsService

router = APIRouter(prefix="/relatorios", tags=["Relatórios"])
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

@router.get("/dados", response_model=schemas.ReportsDataSchema)
def get_reports_data(
    periodo: Optional[str] = Query("mes_atual", description="Período: mes_atual, mes_anterior, ano_atual"),
    db: Session = Depends(get_db),
    usuario_id: int = Depends(get_current_user_id),
    service: ReportsService = Depends(lambda: reports_service_instance)
):
    """
    Endpoint para obter dados agregados para relatórios incluindo gráficos de pizza e barras.
    """
    if periodo not in ["mes_atual", "mes_anterior", "ano_atual"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Período deve ser 'mes_atual', 'mes_anterior' ou 'ano_atual'"
        )
    
    reports_data = service.get_reports_data(db, usuario_id, periodo)
    return reports_data
