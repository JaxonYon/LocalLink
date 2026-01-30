import os
import requests
from typing import List, Dict, Optional
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class LiteAPIService:
    """Service for interacting with LiteAPI hotel booking platform"""
    
    BASE_URL = "https://api.liteapi.travel/v3.0"
    BOOK_URL = "https://book.liteapi.travel/v3.0"
    MARKUP_PERCENTAGE = 0.17  # 17% markup
    
    def __init__(self):
        self.api_key = os.getenv("LITEAPI_API_KEY")
        if not self.api_key:
            raise ValueError("LITEAPI_API_KEY not found in environment variables")
        
        self.headers = {
            "X-API-Key": self.api_key,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    
    def _apply_markup(self, price: float) -> float:
        """Apply 17% markup to the base price"""
        return round(price * (1 + self.MARKUP_PERCENTAGE), 2)
    
    def search_hotels(
        self, 
        city_name: str, 
        check_in: str, 
        check_out: str, 
        guests: int = 2,
        limit: int = 5
    ) -> List[Dict]:
        """
        Search for hotels in a city using LiteAPI v3.0
        
        Args:
            city_name: Destination city name
            check_in: Check-in date (YYYY-MM-DD)
            check_out: Check-out date (YYYY-MM-DD)
            guests: Number of guests (default: 2)
            limit: Number of results to return (default: 5)
            
        Returns:
            List of hotel dictionaries with marked-up prices
        """
        try:
            # Step 1: Get place ID from city name
            place_id = self._get_place_id(city_name)
            if not place_id:
                print(f"Could not find place ID for {city_name}")
                return []
            
            # Step 2: Search hotel rates using place ID
            endpoint = f"{self.BASE_URL}/hotels/rates"
            
            payload = {
                "placeId": place_id,
                "occupancies": [{"adults": guests}],
                "currency": "USD",
                "guestNationality": "US",
                "checkin": check_in,
                "checkout": check_out,
                "roomMapping": True,
                "maxRatesPerHotel": 1,
                "includeHotelData": True
            }
            
            response = requests.post(endpoint, headers=self.headers, json=payload)
            response.raise_for_status()
            
            rates_data = response.json()
            
            # Process the response
            hotels_list = []
            
            # Get hotel data from response
            hotels_data = rates_data.get("hotels", [])
            rate_data = rates_data.get("data", [])
            
            # Create a mapping of hotelId to hotel info
            hotel_info_map = {hotel.get("id"): hotel for hotel in hotels_data}
            
            # Process each rate and combine with hotel info
            for rate in rate_data[:limit]:
                try:
                    hotel_id = rate.get("hotelId")
                    hotel_info = hotel_info_map.get(hotel_id, {})
                    
                    # Get the price from the rate
                    room_types = rate.get("roomTypes", [])
                    if not room_types:
                        continue
                    
                    # Get the first rate
                    rates = room_types[0].get("rates", [])
                    if not rates:
                        continue
                    
                    rate_info = rates[0]
                    retail_rate = rate_info.get("retailRate", {})
                    total_info = retail_rate.get("total", [{}])[0]
                    price = total_info.get("amount", 0)
                    
                    # Apply markup
                    marked_up_price = self._apply_markup(price)
                    
                    # Get hotel details
                    hotels_list.append({
                        "id": hotel_id,
                        "name": hotel_info.get("name", "Unknown Hotel"),
                        "stars": hotel_info.get("rating"),
                        "address": hotel_info.get("address", ""),
                        "latitude": hotel_info.get("location", {}).get("latitude"),
                        "longitude": hotel_info.get("location", {}).get("longitude"),
                        "images": [hotel_info.get("main_photo")] if hotel_info.get("main_photo") else [],
                        "description": hotel_info.get("hotelDescription", ""),
                        "amenities": hotel_info.get("hotelFacilities", [])[:4],
                        "price_per_night": marked_up_price,
                        "currency": total_info.get("currency", "USD"),
                        "check_in": check_in,
                        "check_out": check_out,
                        "offer_id": room_types[0].get("offerId", "")  # Store offerId for booking
                    })
                except Exception as e:
                    print(f"Error processing hotel {hotel_id}: {str(e)}")
                    continue
            
            # Sort by price and return
            hotels_list.sort(key=lambda x: x["price_per_night"])
            return hotels_list[:limit]
            
        except requests.RequestException as e:
            print(f"Error searching hotels: {str(e)}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response content: {e.response.text}")
            return []
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return []
    
    def _get_place_id(self, city_name: str) -> Optional[str]:
        """Get place ID from city name using LiteAPI places endpoint"""
        try:
            endpoint = f"{self.BASE_URL}/data/places"
            params = {"textQuery": city_name}
            
            response = requests.get(endpoint, headers=self.headers, params=params)
            response.raise_for_status()
            
            places = response.json()
            if places.get("data") and len(places["data"]) > 0:
                return places["data"][0].get("placeId")
            
            return None
        except requests.RequestException as e:
            print(f"Error getting place ID: {str(e)}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response content: {e.response.text}")
            return None
    
    def get_hotel_details(self, hotel_id: str) -> Optional[Dict]:
        """
        Get detailed information about a specific hotel
        
        Args:
            hotel_id: The LiteAPI hotel ID
            
        Returns:
            Hotel details dictionary or None if not found
        """
        try:
            endpoint = f"{self.BASE_URL}/data/hotel"
            params = {"hotelId": hotel_id, "timeout": 4}
            
            response = requests.get(endpoint, headers=self.headers, params=params)
            response.raise_for_status()
            
            hotel_data = response.json()
            
            if hotel_data.get("data"):
                hotel = hotel_data["data"]
                return {
                    "id": hotel.get("id"),
                    "name": hotel.get("name"),
                    "stars": hotel.get("starRating"),
                    "address": hotel.get("address", ""),
                    "latitude": hotel.get("location", {}).get("latitude"),
                    "longitude": hotel.get("location", {}).get("longitude"),
                    "images": [img.get("url") for img in hotel.get("hotelImages", [])],
                    "description": hotel.get("hotelDescription", ""),
                    "amenities": hotel.get("hotelFacilities", []),
                    "phone": hotel.get("phone", ""),
                    "email": hotel.get("email", "")
                }
            
            return None
        except requests.RequestException as e:
            print(f"Error getting hotel details: {str(e)}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response content: {e.response.text}")
            return None
    
    def prebook(self, offer_id: str) -> Optional[Dict]:
        """
        Prebook a hotel rate to get payment details
        
        Args:
            offer_id: The offer ID from the rates search
            
        Returns:
            Prebook response with prebookId, transactionId, secretKey
        """
        try:
            endpoint = f"{self.BOOK_URL}/rates/prebook"
            
            payload = {
                "usePaymentSdk": True,
                "offerId": offer_id
            }
            
            response = requests.post(endpoint, headers=self.headers, json=payload)
            response.raise_for_status()
            
            prebook_data = response.json()
            
            if prebook_data.get("data"):
                return prebook_data["data"]
            
            return None
        except requests.RequestException as e:
            print(f"Error prebooking: {str(e)}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response content: {e.response.text}")
            return None
    
    def book(
        self, 
        prebook_id: str, 
        transaction_id: str,
        holder_first_name: str,
        holder_last_name: str,
        holder_email: str,
        guest_first_name: str,
        guest_last_name: str,
        guest_email: str
    ) -> Optional[Dict]:
        """
        Book a hotel room after payment
        
        Args:
            prebook_id: The prebookId from prebook response
            transaction_id: The transactionId from prebook response
            holder_*: Booking holder information
            guest_*: Guest information
            
        Returns:
            Booking confirmation with bookingId, hotelConfirmationCode
        """
        try:
            endpoint = f"{self.BOOK_URL}/rates/book"
            
            payload = {
                "prebookId": prebook_id,
                "holder": {
                    "firstName": holder_first_name,
                    "lastName": holder_last_name,
                    "email": holder_email
                },
                "payment": {
                    "method": "TRANSACTION_ID",
                    "transactionId": transaction_id
                },
                "guests": [{
                    "occupancyNumber": 1,
                    "firstName": guest_first_name,
                    "lastName": guest_last_name,
                    "email": guest_email
                }]
            }
            
            response = requests.post(endpoint, headers=self.headers, json=payload)
            response.raise_for_status()
            
            booking_data = response.json()
            
            if booking_data.get("data"):
                return booking_data["data"]
            
            return None
        except requests.RequestException as e:
            print(f"Error booking: {str(e)}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response content: {e.response.text}")
            return None


# Create a singleton instance
liteapi_service = LiteAPIService()
