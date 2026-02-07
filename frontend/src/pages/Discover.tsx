import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Container } from '@/components/layout';
import { ListingGrid } from '@/components/listing';
import { SectionHero } from '@/components/section-hero';
import { Button, Card, Input, Select } from '@/components/ui';
import { listingCategories } from '@/data';
import { filterListings, getListings } from '@/services';
import type { Listing, ListingFilters } from '@/types';

const categoryOptions = [{ value: 'all', label: 'All categories' }, ...listingCategories.map((category) => ({ value: category.id, label: category.label }))];

const ratingOptions = [
	{ value: 'all', label: 'Any rating' },
	{ value: '4.9', label: '4.9+' },
	{ value: '4.7', label: '4.7+' },
	{ value: '4.5', label: '4.5+' },
];

export const Discover = (): JSX.Element => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [listings, setListings] = useState<Listing[]>([]);
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
	const [filters, setFilters] = useState<ListingFilters>({
		categoryId: 'all',
		minPrice: null,
		maxPrice: null,
		minRating: null,
	});

	useEffect(() => {
		const loadListings = async (): Promise<void> => {
			const data = await getListings();
			setListings(data);
		};
		void loadListings();
	}, []);

	// Update search query when URL params change
	useEffect(() => {
		const urlSearch = searchParams.get('search');
		if (urlSearch) {
			setSearchQuery(urlSearch);
		}
	}, [searchParams]);

	const filteredListings = useMemo(() => {
		let results = filterListings(listings, filters);

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			results = results.filter((listing) => listing.title.toLowerCase().includes(query) || listing.location.toLowerCase().includes(query) || listing.description.toLowerCase().includes(query));
		}

		return results;
	}, [listings, filters, searchQuery]);

	return (
		<>
			<SectionHero title='Browse experiences' subTitle='Find curated local experiences and trusted guides tailored to how you travel.' />
			<Container className='py-10'>
				<div className='grid gap-8 lg:grid-cols-[280px_1fr]'>
					<Card className='h-fit space-y-6 p-5'>
						<div>
							<h2 className='text-base font-semibold text-text'>Filter listings</h2>
							<p className='text-sm text-text-subtle'>Refine by budget, rating, and category.</p>
						</div>
						<div className='space-y-4'>
							<Input
								label='Search'
								type='text'
								placeholder='Search destinations...'
								value={searchQuery}
								onChange={(event) => {
									setSearchQuery(event.target.value);
									if (event.target.value) {
										setSearchParams({ search: event.target.value });
									} else {
										setSearchParams({});
									}
								}}
							/>
							<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-1'>
								<Input
									label='Min price'
									type='number'
									placeholder='Any'
									value={filters.minPrice ?? ''}
									onChange={(event) =>
										setFilters((prev) => ({
											...prev,
											minPrice: event.target.value ? Number(event.target.value) : null,
										}))
									}
								/>
								<Input
									label='Max price'
									type='number'
									placeholder='Any'
									value={filters.maxPrice ?? ''}
									onChange={(event) =>
										setFilters((prev) => ({
											...prev,
											maxPrice: event.target.value ? Number(event.target.value) : null,
										}))
									}
								/>
							</div>
							<Select
								label='Category'
								value={filters.categoryId}
								onChange={(event) =>
									setFilters((prev) => ({
										...prev,
										categoryId: event.target.value,
									}))
								}
								options={categoryOptions}
							/>
							<Select
								label='Rating'
								value={filters.minRating?.toString() ?? 'all'}
								onChange={(event) =>
									setFilters((prev) => ({
										...prev,
										minRating: event.target.value === 'all' ? null : Number(event.target.value),
									}))
								}
								options={ratingOptions}
							/>
							<Button
								variant='ghost'
								fullWidth
								onClick={() => {
									setFilters({
										categoryId: 'all',
										minPrice: null,
										maxPrice: null,
										minRating: null,
									});
									setSearchQuery('');
									setSearchParams({});
								}}>
								Reset filters
							</Button>
						</div>
					</Card>
					<div className='space-y-6'>
						<div>
							<h1 className='text-2xl font-semibold text-text'>Discover experiences</h1>
							{searchQuery ? (
								<p className='text-sm text-text-subtle'>
									Showing results for "{searchQuery}" · {filteredListings.length} experiences
								</p>
							) : (
								<p className='text-sm text-text-subtle'>{filteredListings.length} experiences available</p>
							)}
						</div>
						<ListingGrid listings={filteredListings} />
					</div>
				</div>
			</Container>
		</>
	);
};
