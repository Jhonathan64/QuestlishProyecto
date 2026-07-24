from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.auth import get_current_user
from app.database import get_db
from app.models import Lesson, User, UserLessonProgress
from app.schemas import LessonResponse, CompleteLessonResponse

router = APIRouter()

def ensure_lessons(db: Session):
    lessons = db.query(Lesson).order_by(Lesson.order_index).all()
    if not lessons:
        db.add_all([
            Lesson(title="Grammar Essentials", description="Master nouns, verbs, and adjectives in context", level="B1", order_index=1),
            Lesson(title="Letters & Sounds", description="Learn phonetic alphabet and English sounds", level="B1", order_index=2),
            Lesson(title="Daily Conversations", description="Continue your learning journey", level="B1", order_index=3),
            Lesson(title="Workplace English", description="English for professional situations", level="B1", order_index=4),
            Lesson(title="Academic Writing", description="Write clearly in academic contexts", level="B1", order_index=5),
        ])
        db.commit()
        lessons = db.query(Lesson).order_by(Lesson.order_index).all()
    return lessons

@router.get("/map", response_model=List[LessonResponse])
def get_lessons_map(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    lessons = ensure_lessons(db)
    states = {row.lesson_id: row.status for row in db.query(UserLessonProgress).filter(UserLessonProgress.user_id == current_user.id)}
    completed_orders = [lesson.order_index for lesson in lessons if states.get(lesson.id) == "completed"]
    next_order = max(completed_orders, default=0) + 1
    return [LessonResponse(id=lesson.id, title=lesson.title, description=lesson.description,
        level=lesson.level, order_index=lesson.order_index,
        status=states.get(lesson.id, "current" if lesson.order_index == next_order else "locked"))
        for lesson in lessons]

@router.post("/{lesson_id}/complete", response_model=CompleteLessonResponse)
def complete_lesson(lesson_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    lessons = ensure_lessons(db)
    lesson = next((item for item in lessons if item.id == lesson_id), None)
    if not lesson:
        raise HTTPException(status_code=404, detail="This lesson does not exist.")
    progress = db.query(UserLessonProgress).filter(UserLessonProgress.user_id == current_user.id,
        UserLessonProgress.lesson_id == lesson_id).first()
    if not progress:
        progress = UserLessonProgress(user_id=current_user.id, lesson_id=lesson_id)
        db.add(progress)
    first_completion = progress.status != "completed"
    progress.status = "completed"
    if first_completion:
        current_user.total_xp += 15
        current_user.streak_days = max(1, current_user.streak_days)
    db.flush()
    completed = db.query(UserLessonProgress).filter(UserLessonProgress.user_id == current_user.id,
        UserLessonProgress.status == "completed").count()
    current_user.global_progress = min(100, round(completed * 100 / max(1, len(lessons))))
    db.commit()
    return CompleteLessonResponse(message="Lesson completed!", xpEarned=15 if first_completion else 0,
        totalXp=current_user.total_xp, streakDays=current_user.streak_days)
