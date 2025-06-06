from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime

class UserRegistrationSchema(BaseModel):
    nomeUsuario: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    senha: str = Field(..., min_length=8)
    objetivoPreferencias: Optional[str] = Field(None, max_length=100)
    rendaMensalPreferencias: Optional[str] = Field(None, max_length=50)

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