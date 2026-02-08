import logging
import os

import sentry_sdk
from database import Base, engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import itinerary  # Import models so SQLAlchemy knows about them
from models import user
from routers import auth
from routers import itinerary as itinerary_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

logger.info("🚀 Starting LocalLink backend...")

sentry_sdk.init(
    dsn="https://aa8cb0ad5e4709158d21e5711e17a61d@o4510847352307712.ingest.us.sentry.io/4510847354601472",
    send_default_pii=True,
    enable_logs=True,
    traces_sample_rate=1.0,
    profile_session_sample_rate=1.0,
    profile_lifecycle="trace",
)

# Create all tables
logger.info("📦 Creating database tables...")
Base.metadata.create_all(bind=engine)
logger.info("✅ Database tables ready")

app = FastAPI()
logger.info("✨ FastAPI app initialized")

logger.info("🔐 Setting up CORS middleware...")
default_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://local-link-mvp.vercel.app",
]
env_origins = [origin.strip() for origin in os.getenv("FRONTEND_ORIGINS", "").split(",") if origin.strip()]
allow_origins = list(dict.fromkeys(default_origins + env_origins))
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logger.info("✅ CORS configured")

logger.info("📍 Registering routers...")
app.include_router(auth.router, tags=["auth"])
app.include_router(itinerary_router.router, tags=["itinerary"])
logger.info("✅ All routers registered")


@app.get("/sentry-debug")
async def trigger_sentry_error():
    division_by_zero = 1 / 0
    return {"result": division_by_zero}

logger.info("🎉 Backend ready!")
