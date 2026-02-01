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
		<Card className={cn('flex h-full flex-col overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white', isCompact ? 'min-w-[280px] max-w-[300px] shrink-0 rounded-2xl' : 'w-full rounded-xl')}>
			<div className={cn('flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 text-xs text-white font-semibold relative overflow-hidden group', isCompact ? 'h-40' : 'h-56')}>
				<div className='absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300'></div>
				<span className='relative'>📸 Photo coming soon</span>
			</div>
			<div className='flex flex-1 flex-col gap-3 p-5'>
				<div className='flex items-center justify-between'>
					<Badge variant='muted' className='bg-orange-100 text-orange-700 font-semibold'>
						{getCategoryLabel(listing.categoryId)}
					</Badge>
					<span className='text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full'>{listing.durationHours}h</span>
				</div>
				<div className='space-y-1'>
					<h3 className='text-base font-bold text-gray-900'>{listing.title}</h3>
					<p className='text-sm text-gray-600'>{listing.location}</p>
				</div>
				<div className='flex items-center justify-between text-sm mt-auto'>
					<span className='font-bold text-lg text-orange-600'>${listing.pricePerPerson}</span>
					<span className='text-gray-700 font-semibold'>
						⭐ {listing.rating.toFixed(1)} <span className='text-gray-500 font-normal'>({listing.reviewCount})</span>
					</span>
				</div>
				<div className='mt-auto'>
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
