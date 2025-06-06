import os
from dotenv import load_dotenv
from pathlib import Path

# Obtém o caminho absoluto para o arquivo .env
env_path = Path(__file__).parent.resolve() / '.env'
print(f"Tentando carregar .env de: {env_path}")
print(f"O arquivo existe? {env_path.exists()}")

# Carrega as variáveis de ambiente
load_dotenv(dotenv_path=env_path)

# Verifica se a variável foi carregada
print(f"DATABASE_URL carregada: {os.getenv('DATABASE_URL')}")

class Settings:
    PROJECT_NAME: str = "Finanzen API - Backend"
    PROJECT_DESCRIPTION: str = "Finanzen API Backend Service"
    PROJECT_VERSION: str = "1.0.0"
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    
    def __init__(self):
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL não foi encontrada nas variáveis de ambiente!")

settings = Settings()