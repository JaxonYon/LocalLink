import { dummyListings } from '@/data';
import { ListingCard } from '@/components/listing';
import { Slider } from '@/components/ui';

export const PopularPlacesSlider = (): JSX.Element => {
	const popular = dummyListings.filter((listing) => listing.tags.includes('popular'));

	return (
		<Slider
			title="Popular Places"
			subtitle="Neighborhood favorites with strong traveler demand."
		>
			{popular.map((listing) => (
				<ListingCard key={listing.id} listing={listing} layout="compact" />
			))}
		</Slider>
	);
};
