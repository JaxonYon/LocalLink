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
		<div className='h-28 w-full mx-auto fixed flex items-center justify-center'>
			<header className='h-20 w-full max-w-7xl rounded-full border-b border-border bg-white'>
				<div className='h-full w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-start gap-8'>
					<Link to='/' className='font-semibold text-2xl tracking-tight text-slate-800'>
						Local Link
					</Link>

					<nav className='hidden md:flex items-center gap-6'>
						{navItems.map((item: NavLinkType, idx: number) => (
							<NavLink key={idx} to={item.to} end={item.to === '/'} className={({ isActive }) => cn('select-none cursor-pointer font-medium text-slate-600 hover:text-slate-800 transition-all duration-300 ease-in-out', isActive ? 'text-slate-800' : '')}>
								{item.label}
							</NavLink>
						))}
					</nav>

					<div className='ml-auto flex items-center gap-4'>
						<SignedOut>
							<Button asChild variant='ghost' size='sm'>
								<Link to='/auth/sign-in'>Sign In</Link>
							</Button>

							<Button asChild variant='primary' size='sm'>
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
