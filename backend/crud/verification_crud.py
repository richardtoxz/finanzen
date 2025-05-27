from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta, timezone
from backend.models import VerificacoesEmail

def create_verification_code(db: Session, email: str, code: str, expires_in_minutes: int = 15) -> VerificacoesEmail:
    db.query(VerificacoesEmail).filter(
        VerificacoesEmail.emailVerificacao == email,
        VerificacoesEmail.usado == False
    ).update({"usado": True, "expiracao_emVerificacao": datetime.now(timezone.utc)})


    expiration_time = datetime.now(timezone.utc) + timedelta(minutes=expires_in_minutes)
    db_code = VerificacoesEmail(
        emailVerificacao=email,
        codigo_Verificacao=code,
        expiracao_emVerificacao=expiration_time
    )
    db.add(db_code)
    db.commit()
    db.refresh(db_code)
    return db_code

def get_valid_verification_code(db: Session, email: str, code: str) -> Optional[VerificacoesEmail]:
    now_utc = datetime.now(timezone.utc)
    return db.query(VerificacoesEmail).filter(
        VerificacoesEmail.emailVerificacao == email,
        VerificacoesEmail.codigo_Verificacao == code,
        VerificacoesEmail.usado == False,
        VerificacoesEmail.expiracao_emVerificacao > now_utc
    ).first()

def mark_verification_code_as_used(db: Session, verification_code_entry: VerificacoesEmail):
    verification_code_entry.usado = True
    db.add(verification_code_entry)
    db.commit()
    db.refresh(verification_code_entry)