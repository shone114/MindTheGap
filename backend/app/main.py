from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes.session_routes import router as session_router

app = FastAPI(title="MindTheGap API", version=settings.API_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(session_router)

@app.get("/")
def read_root():
    return {"message": "MindTheGap API is running"}

# Force Reload
