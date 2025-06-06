from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import schemas, models
from database import get_db
from services.auth_service import auth_service_instance, AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=schemas.VerificationCodeRequestedSchema, status_code=status.HTTP_201_CREATED)
def register_user_request_code_endpoint(
    user_reg_data: schemas.UserRegistrationSchema,
    db: Session = Depends(get_db),
    service: AuthService = Depends(lambda: auth_service_instance)
):
    try:
        _, temp_code = service.request_registration_and_send_code(db=db, user_reg_data=user_reg_data)
        return schemas.VerificationCodeRequestedSchema(
            message="Código de verificação enviado com sucesso. Verifique seu e-mail (simulado).",
            email=user_reg_data.email,
            verification_code_for_testing=temp_code
        )
    except HTTPException as e:
        raise e
    except Exception as e_gen:
        print(f"Erro inesperado no registro: {e_gen}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro interno ao processar registro.")


@router.post("/verify-email", response_model=schemas.UserResponseSchema)
def verify_email_endpoint(
    verification_data: schemas.EmailVerificationSchema,
    db: Session = Depends(get_db),
    service: AuthService = Depends(lambda: auth_service_instance)
):
    user = service.verify_email_and_activate_user(db=db, verification_data=verification_data)
    
    preferencias_obj = user.preferencias
    
    return schemas.UserResponseSchema(
        idUsuario=user.idUsuario,
        nomeUsuario=user.nomeUsuario,
        email=user.credenciais.email,
        is_verified=user.is_verified,
        objetivoPreferencias=preferencias_obj.objetivoPreferencias if preferencias_obj else None,
        rendaMensalPreferencias=preferencias_obj.rendaMensalPreferencias if preferencias_obj else None
    )

@router.post("/login", response_model=schemas.LoginSuccessResponseSchema)
def login_user_endpoint(
    login_data: schemas.UserLoginSchema,
    db: Session = Depends(get_db),
    service: AuthService = Depends(lambda: auth_service_instance)
):
    user = service.login_user(db=db, login_data=login_data)
    preferencias_obj = user.preferencias

    user_resp = schemas.UserResponseSchema(
        idUsuario=user.idUsuario,
        nomeUsuario=user.nomeUsuario,
        email=user.credenciais.email,
        is_verified=user.is_verified,
        objetivoPreferencias=preferencias_obj.objetivoPreferencias if preferencias_obj else None,
        rendaMensalPreferencias=preferencias_obj.rendaMensalPreferencias if preferencias_obj else None
    )
    return schemas.LoginSuccessResponseSchema(message="Login successful", user=user_resp)