export type ItineraryPace = 'relaxed' | 'balanced' | 'fast';

export type BudgetTier = 'low' | 'medium' | 'high';

export interface ItineraryInput {
	destination: string;
	startDate: string;
	endDate: string;
	interests: string[];
	pace: ItineraryPace;
	budget: BudgetTier;
	mustSees: string;
}

export interface ItineraryActivity {
	time: string;
	title: string;
	description: string;
	location: string;
	category: string;
}

export interface ItineraryDay {
	day: number;
	date: string;
	activities: ItineraryActivity[];
}

export interface Itinerary {
	id: string;
	destination: string;
	createdAt: string;
	summary: string;
	days: ItineraryDay[];
}
