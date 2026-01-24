import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { ListingGrid } from '@/components/listing';
import { Button } from '@/components/ui';
import { dummyListings } from '@/data';
import type { Listing } from '@/types';
import type { SavedItem } from '@/store';
import { getSavedItems, removeSavedListing } from '@/store';

export const Saved = (): JSX.Element => {
	const [savedItems, setSavedItems] = useState<SavedItem[]>(getSavedItems());

	const savedListings = useMemo<Listing[]>(() => {
		const ids = new Set(savedItems.map((item) => item.listingId));
		return dummyListings.filter((listing) => ids.has(listing.id));
	}, [savedItems]);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-text">Saved experiences</h1>
				<p className="text-sm text-text-subtle">Your short list of places to revisit.</p>
			</div>
			<ListingGrid
				listings={savedListings}
				emptyState={
					<div className="rounded-lg border border-dashed border-border p-8 text-sm text-text-subtle">
						You have no saved listings yet.
					</div>
				}
				actionRenderer={(listing) => (
					<div className="flex gap-2">
						<Button asChild variant="outline" size="sm">
							<Link to={`/listing/${listing.id}`}>View</Link>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setSavedItems(removeSavedListing(listing.id))}
						>
							Remove
						</Button>
					</div>
				)}
			/>
		</div>
	);
};
