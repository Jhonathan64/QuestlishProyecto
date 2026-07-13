from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. Importar los routers activos de la aplicación
from app.routers import users, minigames

# 2. Instanciar FastAPI
app = FastAPI(title="Questlish API")

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
app.include_router(minigames.router, prefix="/api/v1/minigames", tags=["MiniGames"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Questlish API"}