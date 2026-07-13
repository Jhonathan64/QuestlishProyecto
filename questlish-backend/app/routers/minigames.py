from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.orm import selectinload
from typing import List
from app.database import get_db
from app.models import MiniGame, UserMiniGameProgress, User
from app.schemas import MiniGameResponse, VerifyAnswerRequest, VerifyAnswerResponse

router = APIRouter()

# Datos iniciales mockeados
MOCK_MINIGAMES = [
    {
        "id": "mg-1",
        "title": "Grammar Challenge",
        "description": "Test your knowledge on Present Perfect",
        "category": "GRAMMAR",
        "level": "B1",
        "plays_count": "1.2k plays",
        "tag": "HOT",
        "instruction": "Select the correct option to complete the sentence.",
        "prompt": "She _____ in London since 2018.",
        "correct_token_index": 0,
        "tokens": [
            {"id": "t-1", "word": "has lived", "explanation": "Correct. Use 'has lived' for ongoing past-to-present actions.", "token_order": 0},
            {"id": "t-2", "word": "have lived", "explanation": "Incorrect. 'She' requires 'has', not 'have'.", "token_order": 1},
            {"id": "t-3", "word": "lived", "explanation": "Incorrect. Simple past doesn't fit 'since 2018'.", "token_order": 2},
            {"id": "t-4", "word": "is living", "explanation": "Incorrect. Use Present Perfect for duration with 'since'.", "token_order": 3}
        ]
    }
]

@router.get("/", response_model=List[MiniGameResponse])
def get_minigames(db: Session = Depends(get_db)):
    games = db.query(MiniGame).options(selectinload(MiniGame.tokens)).all()
    return games

@router.post("/verify", response_model=VerifyAnswerResponse)
def verify_and_save_progress(data: VerifyAnswerRequest, db: Session = Depends(get_db)):
    game_id = getattr(data, "minigameId", "grammar-ninja") or "grammar-ninja"
    game = db.query(MiniGame).filter(MiniGame.id == game_id).first()

    if not game:
        raise HTTPException(status_code=404, detail="Minijuego no encontrado")

    is_correct = (data.selectedIndex == game.correct_token_index)
    xp_gained = 50 if is_correct else 0

    # Buscar la explicación según la opción seleccionada
    tokens = sorted(game.tokens, key=lambda x: x.token_order)
    selected_token = tokens[data.selectedIndex] if data.selectedIndex < len(tokens) else None
    explanation = selected_token.explanation if selected_token else "Respuesta procesada."

    user_id = getattr(data, "userId", 1) or 1
    user = db.query(User).filter(User.id == user_id).first()
    total_xp = 0

    if user:
        if is_correct:
            user.total_xp += xp_gained
            progress = UserMiniGameProgress(
                user_id=user.id,
                minigame_id=game.id,
                score_earned=xp_gained,
                completed=True
            )
            db.add(progress)
            db.commit()
            db.refresh(user)
        total_xp = user.total_xp

    return VerifyAnswerResponse(
        isCorrect=is_correct,
        explanation=explanation,
        xpEarned=xp_gained,
        totalXp=total_xp
    )