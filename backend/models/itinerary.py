from database import Base
from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship


class ItineraryDB(Base):
    __tablename__ = 'itineraries'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    place_name = Column(String)
    content = Column(Text)

    owner = relationship('UserDB', back_populates='itineraries')
