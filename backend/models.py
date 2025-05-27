from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, TIMESTAMP, func, Text
from sqlalchemy.orm import relationship
from backend.database import Base
from datetime import datetime, timedelta

class Usuario(Base):
    __tablename__ = "usuario"
    idUsuario = Column(Integer, primary_key=True, autoincrement=True, index=True)
    nomeUsuario = Column(String(150), nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)

    credenciais = relationship("Credenciais", back_populates="usuario", uselist=False, cascade="all, delete-orphan")
    preferencias = relationship("PreferenciasUsuario", back_populates="usuario", uselist=False, cascade="all, delete-orphan")

class Credenciais(Base):
    __tablename__ = "credenciais"
    idCredencial = Column(Integer, primary_key=True, autoincrement=True, index=True)
    email = Column(String(100), nullable=False, unique=True, index=True)
    senha = Column(String(255), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuario.idUsuario"), nullable=False, unique=True)
    usuario = relationship("Usuario", back_populates="credenciais")

class PreferenciasUsuario(Base):
    __tablename__ = "preferencias_usuarios"
    idPreferencias = Column(Integer, primary_key=True, autoincrement=True)
    id_UsuarioPreferencias = Column(Integer, ForeignKey("usuario.idUsuario"), nullable=False, unique=True)
    objetivoPreferencias = Column(String(100), nullable=True)
    rendaMensalPreferencias = Column(String(50), nullable=True)
    usuario = relationship("Usuario", back_populates="preferencias")

class VerificacoesEmail(Base):
    __tablename__ = "verificacoes_email"
    id_Verificacoes = Column(Integer, primary_key=True, autoincrement=True)
    emailVerificacao = Column(String(255), nullable=False, index=True)
    codigo_Verificacao = Column(String(6), nullable=False)
    criado_emVerificacao = Column(TIMESTAMP, server_default=func.now())
    expiracao_emVerificacao = Column(TIMESTAMP, nullable=False)
    usado = Column(Boolean, default=False, nullable=False)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.expiracao_emVerificacao:
            self.expiracao_emVerificacao = datetime.utcnow() + timedelta(minutes=15)