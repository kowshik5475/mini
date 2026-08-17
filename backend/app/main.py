import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import analysis_routes, upload_routes

load_dotenv()

app = FastAPI(
    title="AI Report Generator API",
    description="Phase 2: real file upload and storage only. No AI, no parsing yet.",
    version="0.2.0",
)

# Explicit origin allow-list rather than "*", per Phase 2 requirements.
# FRONTEND_ORIGIN may hold a comma-separated list for flexibility.
_origins_env = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")
allowed_origins = [origin.strip() for origin in _origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(upload_routes.router)
app.include_router(analysis_routes.router)


@app.get("/")
def read_root():
    return {"status": "ok", "service": "AI Report Generator API", "phase": 2}


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
