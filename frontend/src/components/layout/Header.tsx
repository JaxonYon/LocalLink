import { Button } from '@/components/ui';
import { cn } from '@/utils';
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/clerk-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

type NavLinkType = {
	label: string;
	to: string;
};

const navItems: NavLinkType[] = [
	{ label: 'Discover', to: '/discover' },
	{ label: 'Plan Trip', to: '/plan' },
	{ label: 'Saved', to: '/account/saved' },
];

const Header = (): JSX.Element => {
	const { user } = useUser();
	const { signOut } = useClerk();
	const navigate = useNavigate();
	const dropdownRef = useRef<HTMLDivElement>(null);

	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const [isScrolled, setIsScrolled] = useState<boolean>(false);

	const handleSignOut = async () => {
		await signOut();
		navigate('/');
		setIsDropdownOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 80);
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<div className={cn('fixed z-50 w-full flex items-center justify-center transition-colors duration-300', isScrolled ? 'bg-orange-600/95 shadow-lg backdrop-blur' : 'bg-transparent')}>
			<header className='h-20 w-full max-w-6xl'>
				<div className='h-full w-full mx-auto px-6 py-4 flex items-center justify-start gap-8'>
					<Link to='/' className='flex items-center gap-2 font-bold text-2xl tracking-tight text-white transition-all duration-300 ease-in-out'>
						<span>🌍</span>
						Local Link
					</Link>

					<nav className='hidden md:flex items-center gap-8 flex-1 ml-8'>
						{navItems.map((item: NavLinkType, idx: number) => (
							<NavLink key={idx} to={item.to} end={item.to === '/'} className={({ isActive }) => cn('select-none cursor-pointer font-semibold text-white hover:text-yellow-300 transition-all duration-300 ease-in-out', isActive ? 'text-yellow-300' : '')}>
								{item.label}
							</NavLink>
						))}
					</nav>

					<div className='ml-auto flex items-center gap-3'>
						<SignedOut>
							<Button asChild variant='ghost' size='sm' className='text-white hover:bg-white hover:bg-opacity-10 border border-white border-opacity-30'>
								<Link to='/auth/sign-in'>Sign In</Link>
							</Button>

							<Button asChild variant='primary' size='sm' className='bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold'>
								<Link to='/auth/sign-up'>Sign Up</Link>
							</Button>
						</SignedOut>

						<SignedIn>
							<div className='relative' ref={dropdownRef}>
								<button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className='flex items-center gap-2 px-3 py-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 border border-white border-opacity-30'>
									<div className='w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-gray-900 text-sm'>{user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || 'U'}</div>
									<svg className={cn('w-4 h-4 text-white transition-transform', isDropdownOpen ? 'rotate-180' : '')} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
									</svg>
								</button>

								{isDropdownOpen && (
									<div className='absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 py-2'>
										<div className='px-4 py-3 border-b border-gray-200'>
											<p className='font-semibold text-gray-900'>{user?.fullName || 'User'}</p>
											<p className='text-sm text-gray-600'>{user?.emailAddresses?.[0]?.emailAddress}</p>
										</div>

										<div className='py-2'>
											<Link to='/account' onClick={() => setIsDropdownOpen(false)} className='flex items-center gap-3 px-4 py-2 hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors'>
												<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
													<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
												</svg>
												<span className='font-medium'>My Account</span>
											</Link>

											<Link to='/account/saved' onClick={() => setIsDropdownOpen(false)} className='flex items-center gap-3 px-4 py-2 hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors'>
												<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
													<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' />
												</svg>
												<span className='font-medium'>Saved</span>
											</Link>

											<Link to='/plan' onClick={() => setIsDropdownOpen(false)} className='flex items-center gap-3 px-4 py-2 hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors'>
												<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
													<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
												</svg>
												<span className='font-medium'>Plan a Trip</span>
											</Link>
										</div>

										<div className='border-t border-gray-200 pt-2'>
											<button onClick={handleSignOut} className='flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors w-full text-left'>
												<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
													<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
												</svg>
												<span className='font-medium'>Sign Out</span>
											</button>
										</div>
									</div>
								)}
							</div>
						</SignedIn>
					</div>
				</div>
			</header>
		</div>
	);
};

export { Header };
