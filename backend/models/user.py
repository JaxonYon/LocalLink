from database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship


class UserDB(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)

    itineraries = relationship('ItineraryDB', back_populates='owner')
