from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
from typing import Optional
from datetime import datetime
import re

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