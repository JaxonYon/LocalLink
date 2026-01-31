from database import Base
from sqlalchemy import Column, Integer, String, Text


class SharedItineraryDB(Base):
    __tablename__ = 'shared_itineraries'

    id = Column(Integer, primary_key=True)
    share_id = Column(String, unique=True, index=True)
    content = Column(Text)
    created_at = Column(String)
