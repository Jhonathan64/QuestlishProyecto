import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

# ==================== USUARIOS ====================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    current_level = Column(String, default="B1")
    total_xp = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)

# ==================== LECCIONES ====================
class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    level = Column(String, default="B1")
    order_index = Column(Integer, nullable=False)

class UserLessonProgress(Base):
    __tablename__ = "user_lesson_progress"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(Integer, ForeignKey("users.id")) # 👈 Corregido a Integer
    lesson_id = Column(String, ForeignKey("lessons.id"))
    status = Column(String, default="locked")  # 'completed', 'current', 'locked'

# ==================== MINIJUEGOS ====================
class MiniGame(Base):
    __tablename__ = "minigames"

    id = Column(String, primary_key=True)  # ej: 'grammar-ninja'
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)  # 'Grammar', 'Vocabulary', 'Pronunciation'
    level = Column(String, nullable=False)
    plays_count = Column(String, default="1.2k plays")
    tag = Column(String, nullable=False)
    instruction = Column(String, nullable=False)
    prompt = Column(String, nullable=False)
    correct_token_index = Column(Integer, nullable=False)

    tokens = relationship("MiniGameToken", back_populates="minigame", cascade="all, delete-orphan")

class MiniGameToken(Base):
    __tablename__ = "minigame_tokens"

    id = Column(String, primary_key=True, default=generate_uuid)
    minigame_id = Column(String, ForeignKey("minigames.id"))
    word = Column(String, nullable=False)
    explanation = Column(Text, nullable=False)
    token_order = Column(Integer, nullable=False)

    minigame = relationship("MiniGame", back_populates="tokens")

class UserMiniGameProgress(Base): # 👈 Tabla agregada para persistir partidas
    __tablename__ = "user_minigame_progress"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(Integer, ForeignKey("users.id"))
    minigame_id = Column(String, ForeignKey("minigames.id"))
    score_earned = Column(Integer, default=0)
    completed = Column(Boolean, default=True)