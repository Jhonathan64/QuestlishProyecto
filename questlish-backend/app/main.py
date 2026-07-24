from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. Importar los routers activos de la aplicación
from app.routers import auth, users, lessons, minigames
from app.database import Base, engine
from sqlalchemy import inspect, text

# 2. Instanciar FastAPI
app = FastAPI(title="Questlish API")
Base.metadata.create_all(bind=engine)
if "global_progress" not in {column["name"] for column in inspect(engine).get_columns("users")}:
    with engine.begin() as connection:
        connection.execute(text("ALTER TABLE users ADD COLUMN global_progress INTEGER DEFAULT 0"))

# 3. Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Registrar los routers activos
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(lessons.router, prefix="/api/v1/lessons", tags=["Lessons"])
app.include_router(minigames.router, prefix="/api/v1/minigames", tags=["MiniGames"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Questlish API"}
