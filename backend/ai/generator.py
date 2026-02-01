import logging
import os

from google import genai
from schemas.itinerary import Trip

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))


def generate_trip(prompt: str):
    logger.info("🤖 Starting AI itinerary generation...")
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json',
                'response_json_schema': Trip.model_json_schema()
            },
        )
        logger.info("✅ AI generation complete!")
        # Convert response to Trip object if it's a dict
        if isinstance(response.parsed, dict):
            logger.debug("🔄 Converting dict response to Trip object...")
            result = Trip(**response.parsed)
        else:
            result = response.parsed
        logger.debug(f"📊 Trip object ready: {len(result.days)} days")
        return result
    except Exception as e:
        logger.error(f"❌ AI generation failed: {str(e)}", exc_info=True)
        raise
