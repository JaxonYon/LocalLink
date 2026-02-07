import { OnboardingGuard } from '@/app/guards';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Outlet } from 'react-router-dom';

const AppLayout = (): JSX.Element => {
	return (
		<OnboardingGuard>
			<div className='min-h-screen flex flex-col'>
				<Header />

				<main className='flex-1'>
					<Outlet />
				</main>

				<Footer />
			</div>
		</OnboardingGuard>
	);
};

export { AppLayout };
