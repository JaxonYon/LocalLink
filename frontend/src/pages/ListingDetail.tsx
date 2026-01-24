import { useAuth } from '@clerk/clerk-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { listingCategories } from '@/data';
import type { Listing } from '@/types';
import { Badge, Button, Card } from '@/components/ui';
import { ListingGallery } from '@/components/listing';
import { getListingById } from '@/services';
import { isListingSaved, removeSavedListing, saveListing } from '@/store';

const getCategoryLabel = (categoryId: string): string => {
	return listingCategories.find((category) => category.id === categoryId)?.label ?? 'Experience';
};

export const ListingDetail = (): JSX.Element => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { isSignedIn } = useAuth();
	const [listing, setListing] = useState<Listing | null>(null);
	const [saved, setSaved] = useState<boolean>(false);

	useEffect(() => {
		const loadListing = async (): Promise<void> => {
			if (!id) {
				return;
			}
			const data = await getListingById(id);
			setListing(data);
			setSaved(data ? isListingSaved(data.id) : false);
		};
		void loadListing();
	}, [id]);

	const ratingText = useMemo(() => {
		if (!listing) {
			return '';
		}
		return `${listing.rating.toFixed(1)} (${listing.reviewCount} reviews)`;
	}, [listing]);

	const handleSave = (): void => {
		if (!listing) {
			return;
		}
		if (!isSignedIn) {
			navigate('/auth/sign-in');
			return;
		}
		if (saved) {
			removeSavedListing(listing.id);
			setSaved(false);
			return;
		}
		saveListing(listing.id);
		setSaved(true);
	};

	if (!listing) {
		return (
			<div className="space-y-3">
				<h1 className="text-2xl font-semibold text-text">Listing not found</h1>
				<p className="text-sm text-text-subtle">
					The experience you are looking for is not available. Browse the latest listings in{' '}
					<Link to="/discover" className="text-brand-700">
						Discover
					</Link>
					.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="space-y-3">
				<Badge variant="muted">{getCategoryLabel(listing.categoryId)}</Badge>
				<h1 className="text-3xl font-semibold text-text">{listing.title}</h1>
				<p className="text-sm text-text-subtle">{listing.location}</p>
				<p className="text-sm text-text-subtle">{ratingText}</p>
			</div>
			<ListingGallery title={listing.title} />
			<div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
				<Card className="space-y-4 p-6">
					<div className="grid gap-3 sm:grid-cols-2">
						<div>
							<p className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
								Duration
							</p>
							<p className="text-sm text-text">{listing.durationHours} hours</p>
						</div>
						<div>
							<p className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
								Languages
							</p>
							<p className="text-sm text-text">{listing.languages.join(', ')}</p>
						</div>
						<div>
							<p className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
								Availability
							</p>
							<p className="text-sm text-text">{listing.availability}</p>
						</div>
						<div>
							<p className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
								Host
							</p>
							<p className="text-sm text-text">{listing.hostName}</p>
						</div>
					</div>
					<p className="text-sm text-text-subtle">{listing.description}</p>
					<div>
						<h3 className="text-sm font-semibold text-text">Highlights</h3>
						<ul className="mt-2 space-y-2 text-sm text-text-subtle">
							{listing.highlights.map((highlight) => (
								<li key={highlight}>- {highlight}</li>
							))}
						</ul>
					</div>
				</Card>
				<Card className="space-y-4 p-6">
					<div>
						<p className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
							Price
						</p>
						<p className="text-2xl font-semibold text-text">${listing.pricePerPerson}</p>
						<p className="text-xs text-text-subtle">Per person</p>
					</div>
					<Button variant={saved ? 'secondary' : 'outline'} onClick={handleSave}>
						{saved ? 'Saved to your list' : 'Save experience'}
					</Button>
					<Button>Book now</Button>
				</Card>
			</div>
		</div>
	);
};
