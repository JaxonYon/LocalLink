from typing import List

from pydantic import BaseModel


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
