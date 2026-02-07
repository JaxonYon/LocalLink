import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { Container } from '@/components/layout';
import { ListingGrid } from '@/components/listing';
import { SectionHero } from '@/components/section-hero';
import { Button } from '@/components/ui';
import { dummyListings } from '@/data';
import type { SavedItem } from '@/store';
import { getSavedItems, removeSavedListing } from '@/store';
import type { Listing } from '@/types';

export const Saved = (): JSX.Element => {
	const [savedItems, setSavedItems] = useState<SavedItem[]>(getSavedItems());

	const savedListings = useMemo<Listing[]>(() => {
		const ids = new Set(savedItems.map((item) => item.listingId));
		return dummyListings.filter((listing) => ids.has(listing.id));
	}, [savedItems]);

	return (
		<>
			<SectionHero title='Saved experiences' subTitle='Your short list of places to revisit.' />
			<Container className='space-y-8 py-10'>
				<ListingGrid
					listings={savedListings}
					emptyState={
						<div className='rounded-lg border border-dashed border-border p-8 text-center text-sm text-text-subtle'>
							<p>You have no saved listings yet.</p>
							<Button asChild variant='outline' size='sm' className='mt-4'>
								<Link to='/discover'>Browse experiences</Link>
							</Button>
						</div>
					}
					actionRenderer={(listing) => (
						<div className='flex gap-2'>
							<Button asChild variant='outline' size='sm'>
								<Link to={`/listing/${listing.id}`}>View</Link>
							</Button>
							<Button variant='ghost' size='sm' onClick={() => setSavedItems(removeSavedListing(listing.id))}>
								Remove
							</Button>
						</div>
					)}
				/>
			</Container>
		</>
	);
};
