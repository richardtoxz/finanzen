from fastapi import FastAPI
from backend.database import engine, Base
from backend.controllers import auth_controller
from backend.core.config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="""
    API para fins acadêmicos (Projeto Finanzen).
    A api usa estrutura MVC, lógica de negócios baseada na documentação e testes.
    """
)

app.include_router(auth_controller.router)

@app.get("/", tags=["Root"])
async def read_root():
    return {
        "message": f"Bem vindo ao {settings.PROJECT_NAME}!"
        }