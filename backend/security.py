import logging

import bcrypt

logger = logging.getLogger(__name__)


def hash_password(password: str) -> str:
    logger.debug("🔐 Hashing password...")
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    logger.debug("✅ Password hashed successfully")
    return hashed


def verify_password(plain: str, hashed: str) -> bool:
    logger.debug("🔐 Verifying password...")
    is_valid = bcrypt.checkpw(plain.encode(), hashed.encode())
    if is_valid:
        logger.debug("✅ Password verified successfully")
    else:
        logger.warning("⚠️  Password verification failed")
    return is_valid
