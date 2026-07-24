from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.auth import create_access_token, get_current_user, hash_password, verify_password
from app.database import get_db
from app.models import User, UserLessonProgress
from app.schemas import AuthResponse, LoginRequest, RegisterRequest, UserResponse

router = APIRouter()

def serialize_user(user: User, db: Session) -> UserResponse:
    lessons = db.query(UserLessonProgress).filter(UserLessonProgress.user_id == user.id).all()
    return UserResponse(id=user.id, name=user.name, email=user.email, current_level=user.current_level,
        total_xp=user.total_xp, streak_days=user.streak_days, global_progress=user.global_progress,
        lessons_state={item.lesson_id: item.status for item in lessons})

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    email = data.email.lower().strip()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="An account with this email already exists.")
    user = User(name=data.name.strip(), email=email, hashed_password=hash_password(data.password),
        current_level="B1 - INTERMEDIATE", total_xp=0, streak_days=0, global_progress=0)
    db.add(user)
    db.commit()
    db.refresh(user)
    return AuthResponse(accessToken=create_access_token(user.id), user=serialize_user(user, db))

@router.post("/login", response_model=AuthResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    identifier = data.identifier.lower().strip()
    user = db.query(User).filter(or_(User.email == identifier, User.name.ilike(identifier))).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="The email or password is incorrect.")
    return AuthResponse(accessToken=create_access_token(user.id), user=serialize_user(user, db))

@router.get("/session", response_model=UserResponse)
def session(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return serialize_user(current_user, db)
