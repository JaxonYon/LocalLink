import { Button, Input, Select } from '@/components/ui';
import { listingCategories } from '@/data';

const categoryOptions = listingCategories.map((category) => ({
	value: category.id,
	label: category.label,
}));

const Hero = (): JSX.Element => {
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
							Fast Convenient
							<br />
							Laundry For You
						</h1>

						<p className='font-normal text-base text-gray-600 max-w-md'>Our modern washers and dryers are designed to get your clothes clean and fresh in no time. We also offer a variety of wash cycles to suit your specific needs, from delicates to heavy-duty.</p>

						<div className='flex w-full max-w-md items-center overflow-hidden rounded-xl border border-gray-200'>
							<input type='text' placeholder='Enter your ZIP code' className='w-full px-4 py-3 font-normal text-sm text-gray-700 outline-none' />
							<button className='flex h-full items-center justify-center bg-yellow-400 px-5'>➜</button>
						</div>

						<div className='flex gap-10 pt-6'>
							<div>
								<p className='font-semibold text-lg text-gray-900'>18</p>
								<p className='font-normal text-sm text-gray-500'>Laundromats</p>
							</div>

							<div>
								<p className='font-semibold text-lg text-gray-900'>5,000+</p>
								<p className='font-normal text-sm text-gray-500'>Customers</p>
							</div>

							<div>
								<p className='font-semibold text-lg text-gray-900 flex items-center gap-1'>
									4.5 <span className='text-yellow-400'>★</span>
								</p>
								<p className='font-normal text-sm text-gray-500'>Average Rating</p>
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
