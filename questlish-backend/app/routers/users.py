from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.auth import get_current_user
from app.database import get_db
from app.models import User, UserLessonProgress
from app.schemas import UserResponse

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def read_user_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    states = db.query(UserLessonProgress).filter(UserLessonProgress.user_id == current_user.id).all()
    return UserResponse(id=current_user.id, name=current_user.name, email=current_user.email,
        current_level=current_user.current_level, total_xp=current_user.total_xp,
        streak_days=current_user.streak_days, global_progress=current_user.global_progress,
        lessons_state={item.lesson_id: item.status for item in states})
