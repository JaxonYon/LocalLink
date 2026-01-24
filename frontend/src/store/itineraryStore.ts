import type { Itinerary } from '@/types';
import { getLocalStorage, setLocalStorage } from '@/store/localStorage';

const ITINERARY_KEY = 'local_link_itineraries';

export const getSavedItineraries = (): Itinerary[] => {
	return getLocalStorage<Itinerary[]>(ITINERARY_KEY, []);
};

export const saveItinerary = (itinerary: Itinerary): Itinerary[] => {
	const existing = getSavedItineraries();
	const next = existing.some((item) => item.id === itinerary.id)
		? existing.map((item) => (item.id === itinerary.id ? itinerary : item))
		: [itinerary, ...existing];
	setLocalStorage(ITINERARY_KEY, next);
	return next;
};
