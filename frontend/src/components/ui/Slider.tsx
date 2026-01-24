import { Button } from '@/components/ui/Button';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { cn } from '@/utils';
import type { ReactNode } from 'react';
import { useRef } from 'react';

export interface SliderProps {
	title: string;
	subtitle?: string;
	children: ReactNode;
	className?: string;
}

export const Slider = ({ title, subtitle, children, className }: SliderProps): JSX.Element => {
	const scrollRef = useRef<HTMLDivElement | null>(null);

	const handleScroll = (direction: 'left' | 'right'): void => {
		if (!scrollRef.current) {
			return;
		}
		const amount = Math.round(scrollRef.current.clientWidth * 0.85);
		scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
	};

	return (
		<section className={cn('space-y-4', className)}>
			<SectionTitle
				title={title}
				subtitle={subtitle}
				action={
					<div className='flex items-center gap-2'>
						<Button variant='outline' size='sm' aria-label={`Scroll ${title} left`} onClick={() => handleScroll('left')}>
							<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
								<path d='M15 18l-6-6 6-6' />
							</svg>
						</Button>
						<Button variant='outline' size='sm' aria-label={`Scroll ${title} right`} onClick={() => handleScroll('right')}>
							<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
								<path d='M9 18l6-6-6-6' />
							</svg>
						</Button>
					</div>
				}
			/>
			<div ref={scrollRef} className='flex gap-4 overflow-x-auto pb-2' role='region' aria-label={`${title} slider`}>
				{children}
			</div>
		</section>
	);
};
