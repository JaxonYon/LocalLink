import os
import bcrypt
import json
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from sqlalchemy import Column, Integer, String, Text, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
from google import genai
from dotenv import load_dotenv

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
    prompt = f"<prompt> You are an Expert travel planner plan a trip for the user with their data </prompt>. <userdata> User: {user.name}, {user.age}yo {user.gender}. Trip: {req.place}, from {req.start_date} to {req.end_date}. Budget: {req.activity_budget}, Travelling with: {travellingwith}, Group Size of {req.group_size} Transportation options: {transportationoptions}Vibe: {req.travel_vibe}, Interests: {interests}. </userdata> Format: JSON."
    
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

app.mount("/", StaticFiles(directory="static", html=True), name="static")