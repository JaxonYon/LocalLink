from app.database import get_db
from app.models.user import UserDB
from app.schemas.user import UserAuth
from app.security import hash_password, verify_password
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter(prefix='/auth')


@router.post('/signup')
def signup(user: UserAuth, db: Session = Depends(get_db)):
    if db.query(UserDB).filter(UserDB.email == user.email).first():
        raise HTTPException(400, 'Email already exists')

    new_user = UserDB(email=user.email, hashed_password=hash_password(user.password))

    db.add(new_user)
    db.commit()

    return {
        'message': 'User created',
        'email': user.email
    }


@router.post('/login')
def login(user: UserAuth, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(400, 'Invalid credentials')

    return {
        'email': db_user.email,
        'name': db_user.name
    }
