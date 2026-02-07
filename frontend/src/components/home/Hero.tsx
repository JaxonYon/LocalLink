import { Button } from '@/components/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = (): JSX.Element => {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState('');

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/discover?search=${encodeURIComponent(searchQuery.trim())}`);
		} else {
			navigate('/discover');
		}
	};

	return (
		<section className='h-screen w-full p-8 pt-28 flex items-center justify-center bg-orange-dark'>
			<div className='size-full max-w-7xl grid lg:grid-cols-[1.2fr_0.8fr] gap-8'>
				{/* <div className='space-y-4'>
					<p className='text-xs font-semibold uppercase tracking-[0.3em] text-text-subtle'>Local Link</p>
					<h1 className='text-3xl font-semibold text-text sm:text-4xl'>Design your trip with locals who know the city best.</h1>
					<p className='text-base text-text-subtle'>Discover curated experiences, trusted guides, and neighborhood favorites tailored to the way you travel.</p>
				</div>

				<div className='rounded-lg border border-border bg-surface-subtle p-5'>
					<form className='space-y-4' onSubmit={(event) => event.preventDefault()}>
						<Input label='Destination' placeholder='Where do you want to go?' />
						<Select label='Category' placeholder='All categories' options={categoryOptions} />
						<Input label='Dates' placeholder='Add dates' />
						<Button type='submit' className='w-full'>
							Search experiences
						</Button>
					</form>
				</div> */}

				<div className='mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2'>
					<div className='space-y-6'>
						<h1 className='font-semibold text-4xl text-gray-900 leading-tight'>
							Discover Your Next
							<br />
							Adventure With AI
						</h1>

						<p className='font-normal text-base text-gray-600 max-w-md'>Create personalized travel itineraries with our AI-powered planner. Get local insights, hidden gems, and tailored recommendations for your perfect trip.</p>

						<form onSubmit={handleSearch} className='flex w-full max-w-md items-center overflow-hidden rounded-xl border border-gray-200'>
							<input type='text' placeholder='Search destinations...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='w-full px-4 py-3 font-normal text-sm text-gray-700 outline-none' />
							<Button type='submit' variant='accent' size='md' className='h-full rounded-none rounded-r-xl px-5'>
								➜
							</Button>
						</form>

						<div className='flex gap-10 pt-6'>
							<div>
								<p className='font-semibold text-lg text-gray-900'>50+</p>
								<p className='font-normal text-sm text-gray-500'>Destinations</p>
							</div>

							<div>
								<p className='font-semibold text-lg text-gray-900'>10,000+</p>
								<p className='font-normal text-sm text-gray-500'>Itineraries</p>
							</div>

							<div>
								<p className='font-semibold text-lg text-gray-900 flex items-center gap-1'>
									4.8 <span className='text-yellow-400'>★</span>
								</p>
								<p className='font-normal text-sm text-gray-500'>User Rating</p>
							</div>
						</div>
					</div>

					<div className='relative'>
						<div className='absolute inset-y-0 left-0 w-20 bg-[radial-gradient(circle_at_left,_#000_20%,transparent_21%)] bg-[length:24px_24px] opacity-10' />
						<img src='/laundry.jpg' alt='Laundry machines' className='rounded-2xl object-cover shadow-lg' />
					</div>
				</div>
			</div>
		</section>
	);
};

export { Hero };
