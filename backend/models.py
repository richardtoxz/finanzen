from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, TIMESTAMP, func, Text, Enum, DECIMAL, Date
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timedelta
import enum

class TipoCategoria(enum.Enum):
    receita = "receita"
    despesa = "despesa"

class TipoMovimentacao(enum.Enum):
    receita = "receita"
    despesa = "despesa"

class Usuario(Base):
    __tablename__ = "usuario"
    __table_args__ = {'extend_existing': True}
    idUsuario = Column(Integer, primary_key=True, autoincrement=True, index=True)
    nomeUsuario = Column(String(150), nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)

    credenciais = relationship("Credenciais", back_populates="usuario", uselist=False, cascade="all, delete-orphan")
    preferencias = relationship("PreferenciasUsuario", back_populates="usuario", uselist=False, cascade="all, delete-orphan")
    categorias = relationship("CategoriaMov", back_populates="usuario", cascade="all, delete-orphan")
    movimentacoes = relationship("Movimentacao", back_populates="usuario", cascade="all, delete-orphan")
    metas = relationship("MetaFinanceira", back_populates="usuario", cascade="all, delete-orphan")
    orcamentos = relationship("Orcamento", back_populates="usuario", cascade="all, delete-orphan")

class Credenciais(Base):
    __tablename__ = "credenciais"
    __table_args__ = {'extend_existing': True}
    idCredencial = Column(Integer, primary_key=True, autoincrement=True, index=True)
    email = Column(String(100), nullable=False, unique=True, index=True)
    senha = Column(String(255), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuario.idUsuario"), nullable=False, unique=True)
    usuario = relationship("Usuario", back_populates="credenciais")

class PreferenciasUsuario(Base):
    __tablename__ = "preferencias_usuarios"
    __table_args__ = {'extend_existing': True}
    idPreferencias = Column(Integer, primary_key=True, autoincrement=True)
    id_UsuarioPreferencias = Column(Integer, ForeignKey("usuario.idUsuario"), nullable=False, unique=True)
    objetivoPreferencias = Column(String(100), nullable=True)
    rendaMensalPreferencias = Column(String(50), nullable=True)
    usuario = relationship("Usuario", back_populates="preferencias")

class VerificacoesEmail(Base):
    __tablename__ = "verificacoes_email"
    __table_args__ = {'extend_existing': True}
    id_Verificacoes = Column(Integer, primary_key=True, autoincrement=True)
    emailVerificacao = Column(String(255), nullable=False, index=True)
    codigo_Verificacao = Column(String(6), nullable=False)
    criado_emVerificacao = Column(TIMESTAMP, server_default=func.now())
    expiracao_emVerificacao = Column(TIMESTAMP, nullable=False)
    usado = Column(Boolean, default=False, nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuario.idUsuario"), nullable=False)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.expiracao_emVerificacao:
            self.expiracao_emVerificacao = datetime.utcnow() + timedelta(minutes=15)

class CategoriaMov(Base):
    __tablename__ = "categoria_mov"
    __table_args__ = {'extend_existing': True}
    idCategoria = Column(Integer, primary_key=True, autoincrement=True, index=True)
    nome = Column(String(100), nullable=False)
    tipo = Column(Enum(TipoCategoria), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuario.idUsuario"), nullable=False)
    
    usuario = relationship("Usuario", back_populates="categorias")
    movimentacoes = relationship("Movimentacao", back_populates="categoria", cascade="all, delete-orphan")
    orcamentos = relationship("Orcamento", back_populates="categoria", cascade="all, delete-orphan")

class Movimentacao(Base):
    __tablename__ = "movimentacao"
    __table_args__ = {'extend_existing': True}
    idMovimentacao = Column(Integer, primary_key=True, autoincrement=True, index=True)
    tipo = Column(Enum(TipoMovimentacao), nullable=False)
    valor = Column(DECIMAL(10, 2), nullable=False)
    descricao = Column(Text, nullable=True)
    data_movimentacao = Column(Date, nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuario.idUsuario"), nullable=False)
    categoria_id = Column(Integer, ForeignKey("categoria_mov.idCategoria"), nullable=False)
    meta_id = Column(Integer, ForeignKey("meta_financeira.idMeta"), nullable=True)
    
    usuario = relationship("Usuario", back_populates="movimentacoes")
    categoria = relationship("CategoriaMov", back_populates="movimentacoes")
    meta = relationship("MetaFinanceira", back_populates="movimentacoes")

class MetaFinanceira(Base):
    __tablename__ = "meta_financeira"
    __table_args__ = {'extend_existing': True}
    idMeta = Column(Integer, primary_key=True, autoincrement=True, index=True)
    nome = Column(String(150), nullable=False)
    descricao = Column(Text, nullable=True)
    valor_objetivo = Column(DECIMAL(10, 2), nullable=False)
    valor_inicial = Column(DECIMAL(10, 2), nullable=False, default=0)
    data_limite = Column(Date, nullable=True)
    usuario_id = Column(Integer, ForeignKey("usuario.idUsuario"), nullable=False)
    
    usuario = relationship("Usuario", back_populates="metas")
    movimentacoes = relationship("Movimentacao", back_populates="meta", cascade="all, delete-orphan")

class Orcamento(Base):
    __tablename__ = "orcamento"
    __table_args__ = {'extend_existing': True}
    idOrcamento = Column(Integer, primary_key=True, autoincrement=True, index=True)
    nome = Column(String(150), nullable=False)
    valor_orcado = Column(DECIMAL(10, 2), nullable=False)
    valor_gasto = Column(DECIMAL(10, 2), nullable=False, default=0)
    data_inicio = Column(Date, nullable=False)
    data_fim = Column(Date, nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuario.idUsuario"), nullable=False)
    categoria_id = Column(Integer, ForeignKey("categoria_mov.idCategoria"), nullable=True)

    usuario = relationship("Usuario", back_populates="orcamentos")
    categoria = relationship("CategoriaMov", back_populates="orcamentos")