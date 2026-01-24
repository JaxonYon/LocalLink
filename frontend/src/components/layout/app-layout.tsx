import { OnboardingGuard } from '@/app/guards';
import { Container } from '@/components/layout/Container';
import { Header } from '@/components/layout/Header';
import { Outlet } from 'react-router-dom';

const AppLayout = (): JSX.Element => {
	return (
		<OnboardingGuard>
			<div className='min-h-screen bg-surface-subtle'>
				<Header />

				<main className='py-10'>
					<Container>
						<Outlet />
					</Container>
				</main>
			</div>
		</OnboardingGuard>
	);
};

export { AppLayout };
