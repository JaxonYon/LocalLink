import hashlib
import json
import logging

from ai.generator import generate_trip
from cache import cache_clear_pattern, cache_get, cache_set, rate_limit
from database import SessionLocal
from fastapi import APIRouter, HTTPException
from models.itinerary import ItineraryDB
from models.user import UserDB
from schemas.itinerary import SaveTripRequest, TripRequest

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/generate-itinerary")
async def generate_itinerary(req: TripRequest):
    """
    Generate AI-powered trip itinerary based on user preferences.
    Uses Google Gemini 2.5 Flash for structured JSON generation.
    Auto-creates user in database if they don't exist (Clerk integration).
    Results are cached to avoid redundant AI calls.
    """
    logger.info(f"📥 /generate-itinerary request received from {req.email}")

    # Rate limiting: 20 requests per hour per user
    if not rate_limit(f"ratelimit:itinerary:{req.email}", limit=20, window=3600):
        logger.warning(f"⚠️  Rate limit exceeded for {req.email}")
        raise HTTPException(status_code=429, detail="Too many requests. Max 20 per hour.")

    # Create cache key based on request parameters
    cache_key = f"itinerary:{hashlib.md5(f'{req.place}:{req.start_date}:{req.end_date}:{req.travel_vibe}'.encode()).hexdigest()}"

    # Check cache first
    logger.debug(f"🔍 Checking cache for: {cache_key}")
    cached_result = cache_get(cache_key)
    if cached_result:
        logger.info(f"⚡ Cache HIT - returning cached itinerary for {req.place}")
        return cached_result

    db = SessionLocal()

    try:
        logger.debug(f"🔍 Checking if user {req.email} exists in database...")
        # Check if user exists, if not create them (Clerk users won't be in DB yet)
        user = db.query(UserDB).filter(UserDB.email == req.email).first()
        if not user:
            logger.info(f"👤 Auto-creating user: {req.email}")
            # Auto-create user from Clerk authentication
            user = UserDB(
                email=req.email,
                hashed_password=""  # Clerk handles authentication, no password needed
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info(f"✅ User created: {req.email}")
        else:
            logger.debug(f"✅ User found: {req.email}")

        # Build comprehensive prompt for AI
        interests = ", ".join(req.interested_activities)
        travelling_with = ", ".join(req.traveling_with)
        transportation_options = ", ".join(req.transportation_options)
        logger.debug(f"📋 Building prompt for {req.place} with interests: {interests}")

        prompt = f"""<prompt>
You are an expert travel planner. Create a detailed, day-by-day itinerary for the user.

For each activity, provide:
- name: The activity name
- location: Full address or location name
- location_coordinates: Latitude and longitude in 'latitude,longitude' format (e.g., '40.7128,-74.0060')
- description: Brief description of the activity and why it's recommended
- time_to_complete_hours: Estimated hours needed for this activity
</prompt>

<userdata>
Destination: {req.place}
Travel Dates: {req.start_date} to {req.end_date}
Budget Level: {req.activity_budget}
Travel Vibe: {req.travel_vibe}
Interested Activities: {interests}
Traveling With: {travelling_with}
Group Size: {req.group_size}
Transportation Options: {transportation_options}
</userdata>

Create a realistic itinerary with 3-5 activities per day based on the travel vibe."""

        # Call AI generator
        logger.info(f"🤖 Calling Gemini AI to generate itinerary for {req.place}...")
        result = generate_trip(prompt)
        logger.info(
            f"✅ Itinerary generated: {len(result.days)} days, "
            f"{sum(len(day.activities) for day in result.days)} total activities"
        )

        # Cache the result for 24 hours
        cache_set(cache_key, result.model_dump(), ttl=86400)
        logger.info(f"💾 Cached itinerary for {req.place}")

        return result

    except Exception as e:
        logger.error(f"❌ Itinerary generation error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to generate itinerary: {str(e)}")
    finally:
        logger.debug("🔌 Closing database session")
        db.close()


@router.post("/save-itinerary")
def save_itinerary(req: SaveTripRequest):
    """
    Save generated itinerary to user's account.
    Auto-creates user if they don't exist (Clerk integration).
    Rate limited to 50 saves per hour.
    """
    logger.info(f"📥 /save-itinerary request received from {req.email}")

    # Rate limiting: 50 saves per hour per user
    if not rate_limit(f"ratelimit:save:{req.email}", limit=50, window=3600):
        logger.warning(f"⚠️  Rate limit exceeded for save: {req.email}")
        raise HTTPException(status_code=429, detail="Too many saves. Max 50 per hour.")

    db = SessionLocal()

    try:
        logger.debug(f"🔍 Checking if user {req.email} exists...")
        # Check if user exists, if not create them
        user = db.query(UserDB).filter(UserDB.email == req.email).first()
        if not user:
            logger.info(f"👤 Auto-creating user: {req.email}")
            # Auto-create user from Clerk authentication
            user = UserDB(
                email=req.email,
                hashed_password=""  # Clerk handles authentication
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info(f"✅ User created: {req.email}")
        else:
            logger.debug(f"✅ User found: {req.email}")

        logger.debug(f"💾 Saving itinerary for {req.itinerary.place_name}...")
        new_trip = ItineraryDB(
            user_id=user.id,
            place_name=req.itinerary.place_name,
            content=req.itinerary.model_dump_json()
        )
        db.add(new_trip)
        db.commit()
        logger.info(f"✅ Itinerary saved successfully (ID: {new_trip.id})")

        return {"message": "Itinerary saved successfully", "id": new_trip.id}

    except Exception as e:
        logger.error(f"❌ Save itinerary error: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save itinerary: {str(e)}")
    finally:
        logger.debug("🔌 Closing database session")
        db.close()


@router.get("/get-itineraries")
def get_itineraries(email: str):
    """
    Retrieve all saved itineraries for a user.
    """
    logger.info(f"📥 /get-itineraries request for {email}")
    db = SessionLocal()

    try:
        logger.debug(f"🔍 Fetching user {email}...")
        user = db.query(UserDB).filter(UserDB.email == email).first()
        if not user:
            logger.info(f"⚠️  User not found: {email}")
            return []

        logger.debug(f"📋 Fetching itineraries for user {user.id}...")
        trips = db.query(ItineraryDB).filter(ItineraryDB.user_id == user.id).all()
        logger.info(f"✅ Found {len(trips)} itineraries for {email}")

        return [
            {
                "id": trip.id,
                "place": trip.place_name,
                "data": json.loads(trip.content)
            }
            for trip in trips
        ]

    except Exception as e:
        logger.error(f"❌ Get itineraries error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to retrieve itineraries: {str(e)}")
    finally:
        logger.debug("🔌 Closing database session")
        db.close()
        db.close()
