export interface ListingCategory {
	id: string;
	label: string;
}

export interface Listing {
	id: string;
	title: string;
	location: string;
	pricePerPerson: number;
	rating: number;
	reviewCount: number;
	durationHours: number;
	categoryId: string;
	tags: string[];
	image: string;
	description: string;
	highlights: string[];
	hostName: string;
	languages: string[];
	availability: string;
}

export interface ListingFilters {
	categoryId: string;
	minPrice: number | null;
	maxPrice: number | null;
	minRating: number | null;
}
