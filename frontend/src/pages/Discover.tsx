import { useEffect, useMemo, useState } from 'react';

import { listingCategories } from '@/data';
import type { Listing, ListingFilters } from '@/types';
import { Button, Card, Input, Select } from '@/components/ui';
import { ListingGrid } from '@/components/listing';
import { filterListings, getListings } from '@/services';

const categoryOptions = [
	{ value: 'all', label: 'All categories' },
	...listingCategories.map((category) => ({ value: category.id, label: category.label }))
];

const ratingOptions = [
	{ value: 'all', label: 'Any rating' },
	{ value: '4.9', label: '4.9+' },
	{ value: '4.7', label: '4.7+' },
	{ value: '4.5', label: '4.5+' }
];

export const Discover = (): JSX.Element => {
	const [listings, setListings] = useState<Listing[]>([]);
	const [filters, setFilters] = useState<ListingFilters>({
		categoryId: 'all',
		minPrice: null,
		maxPrice: null,
		minRating: null
	});

	useEffect(() => {
		const loadListings = async (): Promise<void> => {
			const data = await getListings();
			setListings(data);
		};
		void loadListings();
	}, []);

	const filteredListings = useMemo(() => filterListings(listings, filters), [listings, filters]);

	return (
		<div className="grid gap-8 lg:grid-cols-[280px_1fr]">
			<Card className="h-fit space-y-6 p-5">
				<div>
					<h2 className="text-base font-semibold text-text">Filter listings</h2>
					<p className="text-sm text-text-subtle">Refine by budget, rating, and category.</p>
				</div>
				<div className="space-y-4">
					<Input
						label="Min price"
						type="number"
						placeholder="Any"
						value={filters.minPrice ?? ''}
						onChange={(event) =>
							setFilters((prev) => ({
								...prev,
								minPrice: event.target.value ? Number(event.target.value) : null
							}))
						}
					/>
					<Input
						label="Max price"
						type="number"
						placeholder="Any"
						value={filters.maxPrice ?? ''}
						onChange={(event) =>
							setFilters((prev) => ({
								...prev,
								maxPrice: event.target.value ? Number(event.target.value) : null
							}))
						}
					/>
					<Select
						label="Category"
						value={filters.categoryId}
						onChange={(event) =>
							setFilters((prev) => ({
								...prev,
								categoryId: event.target.value
							}))
						}
						options={categoryOptions}
					/>
					<Select
						label="Rating"
						value={filters.minRating?.toString() ?? 'all'}
						onChange={(event) =>
							setFilters((prev) => ({
								...prev,
								minRating: event.target.value === 'all' ? null : Number(event.target.value)
							}))
						}
						options={ratingOptions}
					/>
					<Button
						variant="ghost"
						className="w-full"
						onClick={() =>
							setFilters({
								categoryId: 'all',
								minPrice: null,
								maxPrice: null,
								minRating: null
							})
						}
					>
						Reset filters
					</Button>
				</div>
			</Card>
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-semibold text-text">Discover experiences</h1>
					<p className="text-sm text-text-subtle">
						{filteredListings.length} experiences available
					</p>
				</div>
				<ListingGrid listings={filteredListings} />
			</div>
		</div>
	);
};
