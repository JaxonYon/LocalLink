import logging
import os

from database import Base, engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import (itinerary,  # Import models so SQLAlchemy knows about them
                    user)
from routers import auth
from routers import itinerary as itinerary_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

logger.info("🚀 Starting LocalLink backend...")

# Create all tables
logger.info("📦 Creating database tables...")
Base.metadata.create_all(bind=engine)
logger.info("✅ Database tables ready")

app = FastAPI()
logger.info("✨ FastAPI app initialized")

logger.info("🔐 Setting up CORS middleware...")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite dev server and fallback
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logger.info("✅ CORS configured")

logger.info("📍 Registering routers...")
app.include_router(auth.router, tags=["auth"])
app.include_router(itinerary_router.router, tags=["itinerary"])
logger.info("✅ All routers registered")
logger.info("🎉 Backend ready!")
