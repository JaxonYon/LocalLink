import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import UserDB
from app.schemas.user import UserAuth
from app.security import hash_password, verify_password

logger = logging.getLogger(__name__)
router = APIRouter(prefix='/auth')


@router.post('/signup')
def signup(user: UserAuth, db: Session = Depends(get_db)):
    logger.info(f"📝 Signup attempt for {user.email}")
    existing = db.query(UserDB).filter(UserDB.email == user.email).first()
    if existing:
        logger.warning(f"⚠️  Signup failed: Email {user.email} already exists")
        raise HTTPException(400, 'Email already exists')

    new_user = UserDB(email=user.email, hashed_password=hash_password(user.password))
    db.add(new_user)
    db.commit()
    logger.info(f"✅ User created: {user.email}")

    return {
        'message': 'User created',
        'email': user.email
    }


@router.post('/login')
def login(user: UserAuth, db: Session = Depends(get_db)):
    logger.info(f"🔐 Login attempt for {user.email}")
    db_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        logger.warning(f"⚠️  Login failed for {user.email}: Invalid credentials")
        raise HTTPException(400, 'Invalid credentials')

    logger.info(f"✅ Login successful: {user.email}")
    return {
        'email': db_user.email,
        'name': db_user.name
    }
