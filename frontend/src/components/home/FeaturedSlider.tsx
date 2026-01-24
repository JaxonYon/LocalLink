import { ListingCard } from '@/components/listing';
import { Slider } from '@/components/ui';
import { dummyListings } from '@/data';

const FeaturedSlider = (): JSX.Element => {
	const featured = dummyListings.filter((listing) => listing.tags.includes('featured'));

	return (
		<Slider title='Featured Experiences' subtitle='Hand-picked tours and tastings to anchor your trip.'>
			{featured.map((listing) => (
				<ListingCard key={listing.id} listing={listing} layout='compact' />
			))}
		</Slider>
	);
};

export { FeaturedSlider };
