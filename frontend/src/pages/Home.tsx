import { FeaturedSlider, PopularPlacesSlider, TopRatedGuidesSlider } from '@/components/home';
import { listingCategories } from '@/data';

const categoryOptions = listingCategories.map((category) => ({
	value: category.id,
	label: category.label,
}));

const Home = (): JSX.Element => {
	return (
		<div className='space-y-10'>
			<section className='h-screen w-full flex items-center justify-center bg-orange-600  relative overflow-hidden'>
				
				<div className='w-full max-w-6xl mx-auto px-6 py-20 flex flex-col items-center justify-center gap-8 relative z-10'>
					<div className='flex flex-col items-center justify-center gap-4'>
						<span className='inline-block px-4 py-2 bg-white bg-opacity-20 text-white rounded-full text-sm font-medium backdrop-blur-sm'>✨ Discover Your Next Adventure</span>
						<h1 className='max-w-4xl font-bold text-5xl md:text-7xl text-white text-center leading-tight'>Explore the World's Best Destinations</h1>
						<p className='max-w-3xl font-normal text-lg text-orange-100 text-center'>Find and book amazing travel experiences, guided tours, and unforgettable itineraries curated by local experts around the globe.</p>
					</div>

					<div className='w-full max-w-2xl flex flex-col gap-4 mt-4'>
						<div className='flex flex-col sm:flex-row gap-3'>
							<input type='text' placeholder='Where do you want to go?' className='flex-1 px-6 py-4 font-normal text-base text-gray-900 rounded-xl outline-none shadow-lg hover:shadow-xl transition-shadow' />
							<button className='flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all whitespace-nowrap'>
								<span>Search</span>
								<span>🔍</span>
							</button>
						</div>
						<p className='text-sm text-orange-100'>Popular searches: Paris, Tokyo, Bali, New York, Barcelona</p>
					</div>

					{/* <div className='grid grid-cols-3 gap-8 pt-12'>
						<div className='text-center'>
							<p className='font-bold text-3xl md:text-4xl text-white'>500+</p>
							<p className='font-normal text-sm text-orange-100 mt-2'>Destinations</p>
						</div>

						<div className='text-center'>
							<p className='font-bold text-3xl md:text-4xl text-white'>50K+</p>
							<p className='font-normal text-sm text-orange-100 mt-2'>Happy Travelers</p>
						</div>

						<div className='text-center'>
							<p className='font-bold text-3xl md:text-4xl text-white flex items-center justify-center gap-2'>
								4.8 <span className='text-yellow-300'>★</span>
							</p>
							<p className='font-normal text-sm text-orange-100 mt-2'>Average Rating</p>
						</div>
					</div> */}
				</div>
			</section>

			<FeaturedSlider />
			<PopularPlacesSlider />
			<TopRatedGuidesSlider />
		</div>
	);
};

export { Home };
