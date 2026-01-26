import { OnboardingGuard } from '@/app/guards';
import { Header } from '@/components/layout/header';
import { Outlet } from 'react-router-dom';
import { Container } from './Container';

const AppLayout = (): JSX.Element => {
	return (
		<OnboardingGuard>
			{/* <div className='min-h-screen bg-white'> */}
			<Header />

			<main
			// className='py-10'
			>
				{/* <Container> */}
				<Outlet />
				{/* </Container> */}
			</main>
			{/* </div> */}
		</OnboardingGuard>
	);
};

export { AppLayout };
