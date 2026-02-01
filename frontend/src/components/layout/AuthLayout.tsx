import { Link, Outlet } from 'react-router-dom';

export const AuthLayout = (): JSX.Element => {
	return (
		<div className='min-h-screen bg-gradient-to-br from-orange-dark via-orange-600 to-orange-700 relative overflow-hidden flex items-center justify-center'>
			{/* Decorative elements */}
			<div className='absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48'></div>
			<div className='absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full -ml-40 -mb-40'></div>

			<div className='mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 relative z-10'>
				<div className='w-full max-w-md'>
					<Link to='/' className='flex items-center gap-2 text-2xl font-bold text-white hover:text-yellow-300 transition-colors duration-300 mb-8'>
						<span>🌍</span>
						Local Link
					</Link>
					<div className='rounded-2xl border-0 bg-white bg-opacity-95 backdrop-blur-sm p-8 shadow-2xl'>
						<Outlet />
					</div>
					<p className='text-center text-sm text-white text-opacity-80 mt-6'>Discover your next adventure with Local Link</p>
				</div>
			</div>
		</div>
	);
};
