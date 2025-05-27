import sys
import os

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

if project_root not in sys.path:
    sys.path.insert(0, project_root)

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import pytest

from backend.main import app
from backend.database import Base, get_db

SQLALCHEMY_DATABASE_URL_TEST = "sqlite:///:memory:"
engine_test = create_engine(
    SQLALCHEMY_DATABASE_URL_TEST,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="session", autouse=True)
def create_test_tables_session_scoped():
    Base.metadata.create_all(bind=engine_test)
    yield
    # Base.metadata.drop_all(bind=engine_test) # Opcional, BD em memória é descartado

@pytest.fixture(scope="function")
def db_session(create_test_tables_session_scoped):
    connection = engine_test.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()
    for table in reversed(Base.metadata.sorted_tables):
        with engine_test.connect() as conn:
            conn.execute(table.delete())
            conn.commit()

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c