import type { FC } from 'react';
import { Container } from './layout';

interface SectionHeroProps {
	title: string;
	subTitle: string;
}

const SectionHero: FC<SectionHeroProps> = ({ title, subTitle }) => {
	return (
		<section className='relative overflow-hidden bg-orange-600'>
			<div className='absolute inset-0'>
				<div className='absolute -top-24 right-8 h-64 w-64 rounded-full bg-white/10' />
				<div className='absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-white/10' />
			</div>

			<Container className='relative mt-20 py-12'>
				<div className='max-w-2xl space-y-4 text-white'>
					<span className='px-3 py-1 inline-flex items-center gap-2 rounded-full bg-white/20 font-semibold text-xs uppercase tracking-wide'>Let us personalize your trip</span>
					<h1 className='font-semibold text-3xl sm:text-4xl'>{title}</h1>
					<p className='text-sm sm:text-base text-orange-100'>{subTitle}</p>
				</div>
			</Container>
		</section>
	);
};

export { SectionHero };
