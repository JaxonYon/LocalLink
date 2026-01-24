import { dummyListings } from '@/data';
import type { Listing, ListingFilters } from '@/types';

export const getListings = async (): Promise<Listing[]> => {
	return Promise.resolve(dummyListings);
};

export const getListingById = async (id: string): Promise<Listing | null> => {
	const match = dummyListings.find((listing) => listing.id === id) ?? null;
	return Promise.resolve(match);
};

export const filterListings = (listings: Listing[], filters: ListingFilters): Listing[] => {
	return listings.filter((listing) => {
		const matchesCategory =
			filters.categoryId === 'all' || listing.categoryId === filters.categoryId;
		const matchesMinPrice =
			filters.minPrice === null || listing.pricePerPerson >= filters.minPrice;
		const matchesPrice =
			filters.maxPrice === null || listing.pricePerPerson <= filters.maxPrice;
		const matchesRating =
			filters.minRating === null || listing.rating >= filters.minRating;
		return matchesCategory && matchesMinPrice && matchesPrice && matchesRating;
	});
};
