import os

from schemas.itinerary import Trip
from google import genai

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))


def generate_trip(prompt: str):
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_json_schema': Trip.model_json_schema()
        },
    )

    return response.parsed
