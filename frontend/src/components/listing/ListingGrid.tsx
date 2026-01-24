import type { ReactNode } from 'react';

import type { Listing } from '@/types';
import { ListingCard } from '@/components/listing/ListingCard';

export interface ListingGridProps {
	listings: Listing[];
	actionRenderer?: (listing: Listing) => ReactNode;
	emptyState?: ReactNode;
}

export const ListingGrid = ({
	listings,
	actionRenderer,
	emptyState
}: ListingGridProps): JSX.Element => {
	if (listings.length === 0) {
		return <>{emptyState ?? <p className="text-sm text-text-subtle">No listings found.</p>}</>;
	}

	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{listings.map((listing) => (
				<ListingCard
					key={listing.id}
					listing={listing}
					action={actionRenderer ? actionRenderer(listing) : undefined}
				/>
			))}
		</div>
	);
};
