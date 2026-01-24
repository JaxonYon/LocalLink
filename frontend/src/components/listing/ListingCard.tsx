import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { listingCategories } from '@/data';
import type { Listing } from '@/types';
import { Badge, Button, Card } from '@/components/ui';
import { cn } from '@/utils';

export interface ListingCardProps {
	listing: Listing;
	layout?: 'grid' | 'compact';
	action?: ReactNode;
}

const getCategoryLabel = (categoryId: string): string => {
	return listingCategories.find((category) => category.id === categoryId)?.label ?? 'Experience';
};

export const ListingCard = ({ listing, layout = 'grid', action }: ListingCardProps): JSX.Element => {
	const isCompact = layout === 'compact';

	return (
		<Card
			className={cn(
				'flex h-full flex-col overflow-hidden',
				isCompact ? 'min-w-[260px] max-w-[280px] shrink-0' : 'w-full'
			)}
		>
			<div
				className={cn(
					'flex items-center justify-center bg-surface-muted text-xs text-text-subtle',
					isCompact ? 'h-36' : 'h-48'
				)}
			>
				Photo coming soon
			</div>
			<div className="flex flex-1 flex-col gap-3 p-4">
				<div className="flex items-center justify-between">
					<Badge variant="muted">{getCategoryLabel(listing.categoryId)}</Badge>
					<span className="text-xs text-text-subtle">{listing.durationHours} hrs</span>
				</div>
				<div className="space-y-1">
					<h3 className="text-base font-semibold text-text">{listing.title}</h3>
					<p className="text-sm text-text-subtle">{listing.location}</p>
				</div>
				<div className="flex items-center justify-between text-sm">
					<span className="font-semibold text-text">${listing.pricePerPerson} / person</span>
					<span className="text-text-subtle">
						{listing.rating.toFixed(1)} ({listing.reviewCount})
					</span>
				</div>
				<div className="mt-auto">
					{action ?? (
						<Button asChild variant="outline" size="sm">
							<Link to={`/listing/${listing.id}`}>View details</Link>
						</Button>
					)}
				</div>
			</div>
		</Card>
	);
};
