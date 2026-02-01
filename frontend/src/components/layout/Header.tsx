import { Button } from '@/components/ui';
import { cn } from '@/utils';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Link, NavLink } from 'react-router-dom';

type NavLinkType = {
	label: string;
	to: string;
};

const navItems: NavLinkType[] = [
	{ label: 'Explore', to: '/explore' },
	{ label: 'Plan', to: '/plan' },
	{ label: 'My Trips', to: '/trips' },
];

const Header = (): JSX.Element => {
	return (
		<div className='fixed z-50 w-full flex items-center justify-center bg-orange-600'>
			<header className='h-20 w-full max-w-6xl'>
				<div className='h-full w-full mx-auto px-6 py-4 flex items-center justify-start gap-8'>
					<Link to='/' className='flex items-center gap-2 font-bold text-2xl tracking-tight text-white hover:text-yellow-300 transition-colors duration-300'>
						<span>🌍</span>
						Local Link
					</Link>

					<nav className='hidden md:flex items-center gap-8 flex-1 ml-8'>
						{navItems.map((item: NavLinkType, idx: number) => (
							<NavLink key={idx} to={item.to} end={item.to === '/'} className={({ isActive }) => cn('select-none cursor-pointer font-semibold text-white hover:text-yellow-300 transition-all duration-300', isActive ? 'text-yellow-300' : '')}>
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
							<UserButton afterSignOutUrl='/' />
						</SignedIn>
					</div>
				</div>
			</header>
		</div>
	);
};

export { Header };
