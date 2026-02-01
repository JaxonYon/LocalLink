import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

logger = logging.getLogger(__name__)

# Load environment variables from backend/.env
env_path = Path(__file__).parent / '.env'
logger.info(f"📂 Loading .env from {env_path}")
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    logger.error("❌ DATABASE_URL environment variable not set!")
    raise ValueError("DATABASE_URL environment variable is required. Please configure PostgreSQL on Railway.")

if not DATABASE_URL.startswith('postgresql'):
    logger.error("❌ DATABASE_URL must be PostgreSQL. SQLite is no longer supported.")
    raise ValueError("This application requires PostgreSQL. Please set DATABASE_URL to a valid PostgreSQL connection string from Railway.")

logger.info("🗄️  Using PostgreSQL database on Railway")
logger.info("⚙️  Configuring PostgreSQL with connection pooling...")
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True  # Verify connections before using
)
logger.info("✅ PostgreSQL engine created")

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()


def get_db():
    logger.debug("🔌 Creating new database session")
    db = SessionLocal()
    try:
        yield db
    finally:
        logger.debug("🔌 Closing database session")
        db.close()
