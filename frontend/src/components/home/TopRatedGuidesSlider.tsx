import { dummyListings } from '@/data';
import { ListingCard } from '@/components/listing';
import { Slider } from '@/components/ui';

export const TopRatedGuidesSlider = (): JSX.Element => {
	const topRated = dummyListings.filter((listing) => listing.tags.includes('top-rated'));

	return (
		<Slider
			title="Top-rated Guides"
			subtitle="Local hosts with consistently high reviews."
		>
			{topRated.map((listing) => (
				<ListingCard key={listing.id} listing={listing} layout="compact" />
			))}
		</Slider>
	);
};
