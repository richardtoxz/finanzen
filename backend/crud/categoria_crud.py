from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas

def create_categoria(db: Session, categoria_data: schemas.CategoriaCreateSchema, usuario_id: int) -> models.CategoriaMov:
    db_categoria = models.CategoriaMov(
        nome=categoria_data.nome,
        tipo=categoria_data.tipo,
        usuario_id=usuario_id
    )
    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

def get_categorias_by_usuario(db: Session, usuario_id: int) -> List[models.CategoriaMov]:
    return db.query(models.CategoriaMov).filter(models.CategoriaMov.usuario_id == usuario_id).all()

def get_categoria_by_id_and_usuario(db: Session, categoria_id: int, usuario_id: int) -> Optional[models.CategoriaMov]:
    return db.query(models.CategoriaMov).filter(
        models.CategoriaMov.idCategoria == categoria_id,
        models.CategoriaMov.usuario_id == usuario_id
    ).first()

def update_categoria(db: Session, categoria_id: int, usuario_id: int, categoria_data: schemas.CategoriaUpdateSchema) -> Optional[models.CategoriaMov]:
    db_categoria = get_categoria_by_id_and_usuario(db, categoria_id, usuario_id)
    if not db_categoria:
        return None
    
    update_data = categoria_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_categoria, field, value)
    
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

def delete_categoria(db: Session, categoria_id: int, usuario_id: int) -> bool:
    db_categoria = get_categoria_by_id_and_usuario(db, categoria_id, usuario_id)
    if not db_categoria:
        return False
    
    db.delete(db_categoria)
    db.commit()
    return True
