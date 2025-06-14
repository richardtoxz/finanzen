from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
from typing import Optional
from datetime import datetime, date
from enum import Enum
from decimal import Decimal
import re

class TipoCategoriaEnum(str, Enum):
    receita = "receita"
    despesa = "despesa"

class TipoMovimentacaoEnum(str, Enum):
    receita = "receita"
    despesa = "despesa"

class UserRegistrationSchema(BaseModel):
    nomeUsuario: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    senha: str 
    objetivoPreferencias: Optional[str] = Field(None, max_length=100)
    rendaMensalPreferencias: Optional[str] = Field(None, max_length=50)

    @field_validator('senha')
    @classmethod
    def validate_senha(cls, value):
        if not value:
            raise ValueError("Senha é obrigatória")
        if len(value) < 8:
            raise ValueError("Senha deve ter pelo menos 8 caracteres")
        if len(value) > 82:
            raise ValueError("Senha não pode ter mais de 82 caracteres")
        if not re.search(r"[A-Z]", value):
            raise ValueError("Senha deve conter pelo menos uma letra maiúscula")    
        if not re.search(r"[a-z]", value):
            raise ValueError("Senha deve conter pelo menos uma letra minúscula")    
        if not re.search(r"\d", value):
            raise ValueError("Senha deve conter pelo menos um número")  
        if not re.search(r"[!\"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~]", value):
            raise ValueError('Senha deve conter pelo menos um caractere especial válido.')  
        return value
class VerificationCodeRequestedSchema(BaseModel):
    message: str
    email: EmailStr
    # TESTE TIRAR DPS
    verification_code_for_testing: Optional[str] = None

class EmailVerificationSchema(BaseModel):
    email: EmailStr
    codigo_Verificacao: str = Field(..., min_length=6, max_length=6)

class UserResponseSchema(BaseModel):
    idUsuario: int
    nomeUsuario: str
    email: EmailStr
    is_verified: bool
    objetivoPreferencias: Optional[str] = None
    rendaMensalPreferencias: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class UserLoginSchema(BaseModel):
    email: EmailStr
    senha: str

class LoginSuccessResponseSchema(BaseModel):
    message: str
    user: UserResponseSchema

class CategoriaCreateSchema(BaseModel):
    nome: str = Field(..., min_length=1, max_length=100)
    tipo: TipoCategoriaEnum

class CategoriaUpdateSchema(BaseModel):
    nome: Optional[str] = Field(None, min_length=1, max_length=100)
    tipo: Optional[TipoCategoriaEnum] = None

class CategoriaResponseSchema(BaseModel):
    idCategoria: int
    nome: str
    tipo: TipoCategoriaEnum
    usuario_id: int

    model_config = ConfigDict(from_attributes=True)

class MovimentacaoCreateSchema(BaseModel):
    tipo: TipoMovimentacaoEnum
    valor: Decimal = Field(..., gt=0, decimal_places=2)
    descricao: Optional[str] = Field(None, max_length=500)
    data_movimentacao: date
    categoria_id: int = Field(..., gt=0)
    meta_id: Optional[int] = Field(None, gt=0)

class MovimentacaoUpdateSchema(BaseModel):
    tipo: Optional[TipoMovimentacaoEnum] = None
    valor: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    descricao: Optional[str] = Field(None, max_length=500)
    data_movimentacao: Optional[date] = None
    categoria_id: Optional[int] = Field(None, gt=0)
    meta_id: Optional[int] = Field(None, gt=0)

class CategoriaSimpleResponseSchema(BaseModel):
    idCategoria: int
    nome: str
    tipo: TipoCategoriaEnum

    model_config = ConfigDict(from_attributes=True)

class MovimentacaoResponseSchema(BaseModel):
    idMovimentacao: int
    tipo: TipoMovimentacaoEnum
    valor: Decimal
    descricao: Optional[str]
    data_movimentacao: date
    usuario_id: int
    categoria_id: int
    categoria: CategoriaSimpleResponseSchema
    meta_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

# Schemas para Metas Financeiras
class MetaCreateSchema(BaseModel):
    nome: str = Field(..., min_length=1, max_length=150)
    valor_objetivo: Decimal = Field(..., gt=0, decimal_places=2)
    descricao: Optional[str] = Field(None, max_length=500)
    data_limite: Optional[date] = None

class MetaUpdateSchema(BaseModel):
    nome: Optional[str] = Field(None, min_length=1, max_length=150)
    valor_objetivo: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    descricao: Optional[str] = Field(None, max_length=500)
    data_limite: Optional[date] = None

class MetaResponseSchema(BaseModel):
    idMeta: int
    nome: str
    descricao: Optional[str]
    valor_objetivo: Decimal
    valor_inicial: Decimal
    data_limite: Optional[date]
    usuario_id: int
    valor_atual: Decimal
    progresso_percentual: float

    model_config = ConfigDict(from_attributes=True)

class OrcamentoCreateSchema(BaseModel):
    nome: str = Field(..., min_length=1, max_length=150)
    valor_orcado: Decimal = Field(..., gt=0, decimal_places=2)
    data_inicio: date
    data_fim: date
    categoria_id: Optional[int] = Field(None, gt=0)

    @field_validator('data_fim')
    @classmethod
    def validate_dates(cls, v, info):
        if 'data_inicio' in info.data and v < info.data['data_inicio']:
            raise ValueError("A data final não pode ser anterior à data de início.")
        return v

class OrcamentoUpdateSchema(BaseModel):
    nome: Optional[str] = Field(None, min_length=1, max_length=150)
    valor_orcado: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    data_inicio: Optional[date] = None
    data_fim: Optional[date] = None
    categoria_id: Optional[int] = Field(None, gt=0)

    @field_validator('data_fim')
    @classmethod
    def validate_dates_for_update(cls, v, info):
        if 'data_inicio' in info.data and info.data['data_inicio'] is not None and v is not None:
            if v < info.data['data_inicio']:
                raise ValueError("A nova data final não pode ser anterior à nova data de início.")
        return v

class OrcamentoResponseSchema(BaseModel):
    idOrcamento: int
    nome: str
    valor_orcado: Decimal
    valor_gasto: Decimal # Campo que será calculado no backend
    data_inicio: date
    data_fim: date
    usuario_id: int
    categoria_id: Optional[int] = None
    categoria: Optional[CategoriaSimpleResponseSchema] = None

    model_config = ConfigDict(from_attributes=True)