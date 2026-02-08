import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Badge, Button, Card } from '@/components/ui';
import { listingCategories } from '@/data';
import type { Listing } from '@/types';
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
		<Card className={cn('flex h-full flex-col overflow-hidden transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md', isCompact ? 'min-w-[280px] max-w-[320px] shrink-0' : 'w-full')}>
			<div className={cn('flex items-center justify-center border-b border-border bg-surface-muted text-xs font-medium text-text-subtle', isCompact ? 'h-40' : 'h-56')}>
				<span>Photo coming soon</span>
			</div>
			<div className='flex flex-1 flex-col gap-3 p-4'>
				<div className='flex items-center justify-between'>
					<Badge>{getCategoryLabel(listing.categoryId)}</Badge>
					<Badge variant='outline'>{listing.durationHours}h</Badge>
				</div>
				<div className='space-y-1'>
					<h3 className='text-base font-semibold text-text'>{listing.title}</h3>
					<p className='text-sm text-text-subtle'>{listing.location}</p>
				</div>
				<div className='flex items-center justify-between text-sm mt-auto'>
					<span className='text-base font-semibold text-text'>${listing.pricePerPerson}</span>
					<span className='text-text-subtle'>
						<span className='font-semibold text-text'>⭐ {listing.rating.toFixed(1)}</span>
						<span> ({listing.reviewCount})</span>
					</span>
				</div>
				<div className='mt-2'>
					{action ?? (
						<Button asChild variant='outline' size='sm'>
							<Link to={`/listing/${listing.id}`}>View details</Link>
						</Button>
					)}
				</div>
			</div>
		</Card>
	);
};
