import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Para desarrollo local rápido usamos SQLite (puedes cambiarlo a PostgreSQL fácilmente en .env)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./questlish.db")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependencia para obtener la sesión de la Base de Datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
