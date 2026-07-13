from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Lesson, User
from app.schemas import LessonResponse, CompleteLessonResponse

router = APIRouter()

@router.get("/map", response_model=List[LessonResponse])
def get_lessons_map(db: Session = Depends(get_db)):
    lessons = db.query(Lesson).order_by(Lesson.order_index).all()
    
    if not lessons:
        default_lessons = [
            Lesson(title="Present Perfect vs Past Simple", level="B1", order_index=1),
            Lesson(title="Conditionals in Context", level="B1", order_index=2),
            Lesson(title="Modal Verbs for Advice", level="B1", order_index=3),
            Lesson(title="Passive Voice Basics", level="B1", order_index=4),
            Lesson(title="Reported Speech", level="B1", order_index=5),
        ]
        db.add_all(default_lessons)
        db.commit()
        lessons = db.query(Lesson).order_index.all() if hasattr(Lesson, 'order_index') else db.query(Lesson).all()

    result = []
    for idx, lesson in enumerate(lessons):
        status = "completed" if idx == 0 else ("current" if idx == 1 else "locked")
        result.append(LessonResponse(
            id=lesson.id,
            title=lesson.title,
            description=lesson.description or "Practice key concepts to unlock the next node.",
            level=lesson.level,
            orderIndex=lesson.order_index,
            status=status
        ))
    
    return result

@router.post("/{lesson_id}/complete", response_model=CompleteLessonResponse)
def complete_lesson(lesson_id: str, db: Session = Depends(get_db)):
    user = db.query(User).first()
    if user:
        user.total_xp += 15
        db.commit()
        db.refresh(user)

    return CompleteLessonResponse(
        message="Lesson completed successfully!",
        xpEarned=15,
        totalXp=user.total_xp if user else 355,
        streakDays=user.streak_days if user else 7
    )