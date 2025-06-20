from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
from typing import Optional, List
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

class OrcamentoUpdateSchema(BaseModel):
    nome: Optional[str] = Field(None, min_length=1, max_length=150)
    valor_orcado: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    data_inicio: Optional[date] = None
    data_fim: Optional[date] = None
    categoria_id: Optional[int] = Field(None, gt=0)

class OrcamentoResponseSchema(BaseModel):
    idOrcamento: int
    nome: str
    valor_orcado: Decimal
    valor_gasto: Decimal
    data_inicio: date
    data_fim: date
    usuario_id: int
    categoria_id: Optional[int] = None
    categoria: Optional[CategoriaSimpleResponseSchema] = None

    model_config = ConfigDict(from_attributes=True)

class DashboardSummarySchema(BaseModel):
    saldo_atual: float
    total_receitas: float  
    total_despesas: float

class PieChartDataSchema(BaseModel):
    name: str
    value: float
    color: str

class BarChartDataSchema(BaseModel):
    month: str
    receitas: float
    despesas: float

class SummaryDataSchema(BaseModel):
    receitas_totais: float
    despesas_totais: float
    saldo_final: float

class ReportsDataSchema(BaseModel):
    pieChartData: List[PieChartDataSchema]
    barChartData: List[BarChartDataSchema]
    summaryData: SummaryDataSchema

class UserProfileResponseSchema(BaseModel):
    """Schema para resposta com dados do perfil do usuário"""
    idUsuario: int
    nomeUsuario: str
    email: str
    objetivoPreferencias: Optional[str] = None
    rendaMensalPreferencias: Optional[str] = None
    is_verified: bool

class UserProfileUpdateSchema(BaseModel):
    """Schema para atualização parcial do perfil do usuário (sem email)"""
    nomeUsuario: Optional[str] = Field(None, min_length=2, max_length=150)
    objetivoPreferencias: Optional[str] = Field(None, max_length=100)
    rendaMensalPreferencias: Optional[str] = Field(None, max_length=50)

class UserPasswordUpdateSchema(BaseModel):
    """Schema específico para mudança de senha"""
    senha_atual: str = Field(..., min_length=1)
    nova_senha: str = Field(..., min_length=8, max_length=82)

    @field_validator('nova_senha')
    @classmethod
    def validate_nova_senha(cls, value):
        if len(value) < 8:
            raise ValueError("Nova senha deve ter pelo menos 8 caracteres")
        if len(value) > 82:
            raise ValueError("Nova senha não pode ter mais de 82 caracteres")
        if not re.search(r"[A-Z]", value):
            raise ValueError("Nova senha deve conter pelo menos uma letra maiúscula")    
        if not re.search(r"[a-z]", value):
            raise ValueError("Nova senha deve conter pelo menos uma letra minúscula")    
        if not re.search(r"\d", value):
            raise ValueError("Nova senha deve conter pelo menos um número")  
        if not re.search(r"[!\"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~]", value):
            raise ValueError('Nova senha deve conter pelo menos um caractere especial válido.')  
        return value

class EmailChangeRequestSchema(BaseModel):
    """Schema para solicitar alteração de email"""
    novo_email: EmailStr

class EmailChangeRequestResponseSchema(BaseModel):
    """Schema de resposta para solicitação de alteração de email"""
    message: str
    verification_code_for_testing: Optional[str] = None

class EmailChangeConfirmSchema(BaseModel):
    """Schema para confirmar alteração de email"""
    novo_email: EmailStr
    codigo_verificacao: str = Field(..., min_length=6, max_length=6)