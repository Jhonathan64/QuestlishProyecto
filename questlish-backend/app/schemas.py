from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional

# ==================== USER SCHEMAS ====================
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    current_level: str = Field(..., serialization_alias="currentLevel")
    total_xp: int = Field(..., serialization_alias="totalXp")
    streak_days: int = Field(..., serialization_alias="streakDays")
    global_progress: int = Field(0, serialization_alias="progress")
    lessons_state: dict[str, str] = Field(default_factory=dict, serialization_alias="lessonsState")

    class Config:
        from_attributes = True
        populate_by_name = True

class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class LoginRequest(BaseModel):
    identifier: str = Field(min_length=2, max_length=120)
    password: str = Field(min_length=1, max_length=128)

class AuthResponse(BaseModel):
    accessToken: str
    tokenType: str = "bearer"
    user: UserResponse

# ==================== LESSON SCHEMAS ====================
class LessonResponse(BaseModel):
    id: str  # 👈 Cambiado a str (UUID)
    title: str
    description: Optional[str] = None
    level: str
    order_index: int = Field(..., serialization_alias="orderIndex")
    status: Optional[str] = "locked"

    class Config:
        from_attributes = True
        populate_by_name = True

class CompleteLessonResponse(BaseModel):
    message: str
    xpEarned: int
    totalXp: int
    streakDays: int

# ==================== MINIGAME SCHEMAS ====================
class MiniGameTokenResponse(BaseModel): # 👈 Agregado para los tokens del minijuego
    id: str
    word: str
    explanation: str
    token_order: int = Field(..., serialization_alias="tokenOrder")

    class Config:
        from_attributes = True
        populate_by_name = True

class MiniGameResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    level: str
    plays_count: str = Field(..., serialization_alias="plays") # 👈 Mapeado con tu modelo
    tag: str
    instruction: str
    prompt: str
    correct_token_index: int = Field(..., serialization_alias="correctTokenIndex")
    tokens: List[MiniGameTokenResponse] = [] # 👈 Incluye la lista de tokens relacionados

    class Config:
        from_attributes = True
        populate_by_name = True

class VerifyAnswerRequest(BaseModel):
    selectedIndex: int
    minigameId: Optional[str] = "mg-1"
    userId: Optional[int] = 1

class VerifyAnswerResponse(BaseModel):
    isCorrect: bool
    explanation: str
    xpEarned: int
    totalXp: int

# ==================== MODEL REBUILD (Pydantic V2) ====================
UserResponse.model_rebuild()
LessonResponse.model_rebuild()
MiniGameTokenResponse.model_rebuild()
MiniGameResponse.model_rebuild()
