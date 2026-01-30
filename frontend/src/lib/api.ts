const API_URL = 'http://localhost:8000';

export const api = {
	signup: (email: string, password: string) =>
		fetch(`${API_URL}/signup`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		}).then((r) => r.json()),

	login: (email: string, password: string) =>
		fetch(`${API_URL}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		}).then((r) => r.json()),

	generateItinerary: (payload: any) =>
		fetch('http://localhost:8000/generate-itinerary', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		}).then((r) => r.json()),

	saveItinerary: (email: string, itinerary: any) =>
		fetch(`${API_URL}/save-itinerary`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, itinerary }),
		}).then((r) => r.json()),

	getItineraries: (email: string) => fetch(`${API_URL}/get-itineraries?email=${email}`).then((r) => r.json()),
};
