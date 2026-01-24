import os
import bcrypt
import json
import uuid
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from sqlalchemy import Column, Integer, String, Text, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
from google import genai
from dotenv import load_dotenv
from services.liteapi_service import liteapi_service

load_dotenv()

# --- DATABASE SETUP ---
DATABASE_URL = "sqlite:///./locallink.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
#userdata 
class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    itineraries = relationship("ItineraryDB", back_populates="owner")
#saved itineraries
class ItineraryDB(Base):
    __tablename__ = "itineraries"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    place_name = Column(String)
    content = Column(Text) 
    owner = relationship("UserDB", back_populates="itineraries")

#shared itineraries
class SharedItineraryDB(Base):
    __tablename__ = "shared_itineraries"
    id = Column(Integer, primary_key=True, index=True)
    share_id = Column(String, unique=True, index=True)
    content = Column(Text)
    created_at = Column(String)

#hotel bookings (for future use)
class HotelBookingDB(Base):
    __tablename__ = "hotel_bookings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    itinerary_id = Column(Integer, ForeignKey("itineraries.id"))
    hotel_id = Column(String)
    hotel_name = Column(String)
    check_in = Column(String)
    check_out = Column(String)
    total_price = Column(String)
    booking_status = Column(String)
    created_at = Column(String)

Base.metadata.create_all(bind=engine)

# --- SECURITY ---
def get_password_hash(password: str):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# --- SCHEMAS ---
class UserAuth(BaseModel):
    email: str
    password: str

class ProfileUpdate(BaseModel):
    email: str
    name: str
    age: int
    gender: str

class Activity(BaseModel):
    name: str
    location: str
    location_coordinates: str
    description: str
    time_to_complete_hours: int
    

class Day(BaseModel):
    day_name: str
    activities: List[Activity]

class Trip(BaseModel):
    place_name: str
    days: List[Day]

class TripRequest(BaseModel):
    email: str
    place: str
    start_date: str 
    end_date: str   
    activity_budget: str
    travel_vibe: str
    interested_activities: List[str]
    traveling_with: List[str]
    group_size: str
    transportation_options: List[str]

class SaveTripRequest(BaseModel):
    email: str
    itinerary: Trip

class ShareTripRequest(BaseModel):
    itinerary: Trip

class HotelSearchRequest(BaseModel):
    destination: str
    check_in: str
    check_out: str
    guests: int = 2

class Hotel(BaseModel):
    id: str
    name: str
    stars: Optional[float] = None
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    images: List[str] = []
    description: str = ""
    amenities: List[str] = []
    price_per_night: float
    currency: str = "USD"
    check_in: str
    check_out: str
    offer_id: str = ""

class HotelSearchResponse(BaseModel):
    hotels: List[Hotel]
    count: int

class PrebookRequest(BaseModel):
    offer_id: str

class BookRequest(BaseModel):
    prebook_id: str
    transaction_id: str
    holder_first_name: str
    holder_last_name: str
    holder_email: str
    guest_first_name: str
    guest_last_name: str
    guest_email: str

class SaveBookingRequest(BaseModel):
    email: str
    booking_id: str
    hotel_name: str
    check_in: str
    check_out: str
    total_price: float
    hotel_confirmation_code: str

# --- APP SETUP ---
app = FastAPI()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY")) #Gemini SET UP

# --- ENDPOINTS ---
#Create account
@app.post("/signup")
def signup(user: UserAuth):
    db = SessionLocal()
    if db.query(UserDB).filter(UserDB.email == user.email).first():
        db.close()
        raise HTTPException(status_code=400, detail="Email already exists")
    # Store initial user
    new_user = UserDB(email=user.email, hashed_password=get_password_hash(user.password))
    db.add(new_user)
    db.commit()
    db.close()
    return {"message": "User created", "email": user.email}
#logging in
@app.post("/login")
def login(user: UserAuth):
    db = SessionLocal()
    db_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        db.close()
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"email": db_user.email, "name": db_user.name}
#get user data
@app.get("/get-profile")
def get_profile(email: str):
    db = SessionLocal()
    user = db.query(UserDB).filter(UserDB.email == email).first()
    return {"name": user.name, "age": user.age, "gender": user.gender} if user else {}
#update user data
@app.post("/save-profile")
def save_profile(profile: ProfileUpdate):
    db = SessionLocal()
    user = db.query(UserDB).filter(UserDB.email == profile.email).first()
    if user:
        user.name, user.age, user.gender = profile.name, profile.age, profile.gender
        db.commit()
    db.close()
    return {"message": "Saved"}
#Create itinerary
@app.post("/generate-itinerary")
async def generate_itinerary(req: TripRequest):
    db = SessionLocal()
    user = db.query(UserDB).filter(UserDB.email == req.email).first()
    if not user or not user.name:
        raise HTTPException(status_code=400, detail="Complete profile first") 

    interests = ", ".join(req.interested_activities)
    travellingwith = ", ".join(req.traveling_with)
    transportationoptions = ", ".join(req.transportation_options)
    prompt = f"<prompt> You are an Expert travel planner plan a trip for the user with their data. For each activity, provide the exact location address AND location_coordinates in 'latitude,longitude' format (e.g., '40.7128,-74.0060'). </prompt>. <userdata> User: {user.name}, {user.age}yo {user.gender}. Trip: {req.place}, from {req.start_date} to {req.end_date}. Budget: {req.activity_budget}, Travelling with: {travellingwith}, Group Size of {req.group_size} Transportation options: {transportationoptions}Vibe: {req.travel_vibe}, Interests: {interests}. </userdata> Format: JSON."
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=prompt,
            config={"response_mime_type": "application/json", "response_json_schema": Trip.model_json_schema()},
        )
        return response.parsed
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/save-itinerary")
def save_itinerary(req: SaveTripRequest):
    db = SessionLocal()
    user = db.query(UserDB).filter(UserDB.email == req.email).first()
    if user:
        new_trip = ItineraryDB(user_id=user.id, place_name=req.itinerary.place_name, content=req.itinerary.model_dump_json())
        db.add(new_trip)
        db.commit()
    db.close()
    return {"message": "Saved"}

@app.get("/get-itineraries")
def get_itineraries(email: str):
    db = SessionLocal()
    user = db.query(UserDB).filter(UserDB.email == email).first()
    trips = db.query(ItineraryDB).filter(ItineraryDB.user_id == user.id).all() if user else []
    return [{"id": t.id, "place": t.place_name, "data": json.loads(t.content)} for t in trips]

@app.post("/share-itinerary")
def share_itinerary(req: ShareTripRequest):
    db = SessionLocal()
    share_id = str(uuid.uuid4())
    created_at = datetime.now().isoformat()
    new_share = SharedItineraryDB(share_id=share_id, content=req.itinerary.model_dump_json(), created_at=created_at)
    db.add(new_share)
    db.commit()
    db.close()
    return {"share_id": share_id}

@app.get("/shared/{share_id}")
def get_shared_itinerary(share_id: str):
    db = SessionLocal()
    shared = db.query(SharedItineraryDB).filter(SharedItineraryDB.share_id == share_id).first()
    if not shared:
        db.close()
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Check if expired (30 days)
    created = datetime.fromisoformat(shared.created_at)
    if datetime.now() - created > timedelta(days=30):
        db.close()
        raise HTTPException(status_code=410, detail="This trip link has expired (30 days)")
    
    db.close()
    return json.loads(shared.content)

@app.post("/api/search-hotels")
def search_hotels(req: HotelSearchRequest):
    """Search for hotels based on destination and dates"""
    try:
        hotels = liteapi_service.search_hotels(
            city_name=req.destination,
            check_in=req.check_in,
            check_out=req.check_out,
            guests=req.guests,
            limit=5
        )
        return HotelSearchResponse(hotels=hotels, count=len(hotels))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/hotels/{hotel_id}")
def get_hotel_details(hotel_id: str):
    """Get detailed information about a specific hotel"""
    try:
        hotel = liteapi_service.get_hotel_details(hotel_id)
        if not hotel:
            raise HTTPException(status_code=404, detail="Hotel not found")
        return hotel
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/hotels/prebook")
def prebook_hotel(req: PrebookRequest):
    """Prebook a hotel rate"""
    try:
        prebook_data = liteapi_service.prebook(req.offer_id)
        if not prebook_data:
            raise HTTPException(status_code=400, detail="Prebook failed")
        return prebook_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/hotels/book")
def book_hotel(req: BookRequest):
    """Book a hotel room after payment"""
    try:
        booking_data = liteapi_service.book(
            prebook_id=req.prebook_id,
            transaction_id=req.transaction_id,
            holder_first_name=req.holder_first_name,
            holder_last_name=req.holder_last_name,
            holder_email=req.holder_email,
            guest_first_name=req.guest_first_name,
            guest_last_name=req.guest_last_name,
            guest_email=req.guest_email
        )
        if not booking_data:
            raise HTTPException(status_code=400, detail="Booking failed")
        return booking_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/bookings/save")
def save_booking(req: SaveBookingRequest):
    """Save booking to user's history"""
    db = SessionLocal()
    try:
        user = db.query(UserDB).filter(UserDB.email == req.email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        new_booking = HotelBookingDB(
            user_id=user.id,
            hotel_id=req.booking_id,
            hotel_name=req.hotel_name,
            check_in=req.check_in,
            check_out=req.check_out,
            total_price=str(req.total_price),
            booking_status="CONFIRMED",
            created_at=datetime.now().isoformat()
        )
        db.add(new_booking)
        db.commit()
        return {"message": "Booking saved"}
    finally:
        db.close()

@app.get("/api/bookings")
def get_bookings(email: str):
    """Get user's booking history"""
    db = SessionLocal()
    try:
        user = db.query(UserDB).filter(UserDB.email == email).first()
        if not user:
            return []
        
        bookings = db.query(HotelBookingDB).filter(HotelBookingDB.user_id == user.id).all()
        return [{
            "id": b.id,
            "booking_id": b.hotel_id,
            "hotel_name": b.hotel_name,
            "check_in": b.check_in,
            "check_out": b.check_out,
            "total_price": b.total_price,
            "status": b.booking_status,
            "created_at": b.created_at
        } for b in bookings]
    finally:
        db.close()

app.mount("/", StaticFiles(directory="static", html=True), name="static")