import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent.resolve() / '.env'
if env_path.exists():
    print(f"Carregando variáveis de .env: {env_path}")
    load_dotenv(dotenv_path=env_path)
else:
    print("Arquivo .env não encontrado, usando variáveis de ambiente existentes")

class Settings:
    PROJECT_NAME: str = "Finanzen API - Backend"
    PROJECT_DESCRIPTION: str = "Finanzen API Backend Service"
    PROJECT_VERSION: str = "1.0.0"
    
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "chave_secreta_desenvolvimento_nao_usar_em_producao")
    
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS")
    
    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    def __init__(self):
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL não foi encontrada nas variáveis de ambiente!")

settings = Settings()