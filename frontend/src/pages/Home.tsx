import { FeaturedSlider, Hero, PopularPlacesSlider, TopRatedGuidesSlider } from '@/components/home';

const Home = (): JSX.Element => {
	return (
		<div className='space-y-10'>
			<Hero />
			<FeaturedSlider />
			<PopularPlacesSlider />
			<TopRatedGuidesSlider />
		</div>
	);
};

export { Home };
