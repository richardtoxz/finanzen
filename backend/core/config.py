import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent.resolve() / '.env'
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "Finanzen API - Backend"
    PROJECT_DESCRIPTION: str = "Finanzen API Backend Service"
    PROJECT_VERSION: str = "1.0.0"
    DATABASE_URL: str = os.getenv("DATABASE_URL")

settings = Settings()