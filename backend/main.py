from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from database import engine, Base
from controllers import auth_controller, categoria_controller, movimentacao_controller, meta_controller, orcamentos_controller, reports_controller, perfil_controller
from core.config import settings
import logging

logging.basicConfig(
    level=logging.INFO) 
logger = logging.getLogger(__name__)    

Base.metadata.create_all(bind=engine)

security = HTTPBearer()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="""
    API para fins acadêmicos (Projeto Finanzen).
    A api usa estrutura MVC, lógica de negócios baseada na documentação e testes.
    
    ## Autenticação
    Use o formato: `Bearer {user_id}` onde user_id é o ID do usuário.
    
    Exemplo: `Bearer 11`
    """
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(auth_controller.router)
app.include_router(categoria_controller.router)
app.include_router(movimentacao_controller.router)
app.include_router(meta_controller.router)
app.include_router(orcamentos_controller.router)
app.include_router(reports_controller.router)
app.include_router(perfil_controller.router)

@app.get("/", tags=["Root"])
async def read_root():
    return {
        "message": f"Bem vindo ao {settings.PROJECT_NAME}!"
        }