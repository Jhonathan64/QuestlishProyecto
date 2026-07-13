from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserResponse

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def read_user_me(db: Session = Depends(get_db)):
    current_user = db.query(User).filter(User.id == 1).first()
    if current_user is None:
        current_user = db.query(User).order_by(User.id.asc()).first()

    if current_user is None:
        raise HTTPException(status_code=404, detail="No se encontró un usuario de perfil.")

    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        currentLevel=current_user.current_level,
        totalXp=current_user.total_xp,
        streakDays=current_user.streak_days,
    )