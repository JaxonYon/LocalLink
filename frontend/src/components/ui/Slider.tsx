import { Button } from '@/components/ui/Button';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { cn } from '@/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { FC, ReactNode } from 'react';
import { useRef } from 'react';

interface SliderActionsProps {
	handleScroll: (direction: 'left' | 'right') => void;
	title: string;
}

const SliderActions: FC<SliderActionsProps> = ({ handleScroll, title }) => {
	return (
		<div className='flex items-center gap-2'>
			<Button variant='outline' size='sm' className='!size-9 !p-2 !rounded-full' onClick={() => handleScroll('left')} aria-label={`Scroll ${title} left`}>
				<ChevronLeft className='size-8' />
			</Button>

			<Button variant='outline' size='sm' className='!size-9 !p-2 !rounded-full' onClick={() => handleScroll('right')} aria-label={`Scroll ${title} right`}>
				<ChevronRight className='size-8' />
			</Button>
		</div>
	);
};

interface SliderProps {
	title: string;
	subtitle?: string;
	children: ReactNode;
	className?: string;
}

const Slider = ({ title, subtitle, children, className }: SliderProps): JSX.Element => {
	const scrollRef = useRef<HTMLDivElement | null>(null);

	const handleScroll = (direction: 'left' | 'right'): void => {
		if (!scrollRef.current) {
			return;
		}

		const amount = Math.round(scrollRef.current.clientWidth * 0.85);

		scrollRef.current.scrollBy({
			left: direction === 'left' ? -amount : amount,
			behavior: 'smooth',
		});
	};

	return (
		<section className={cn('space-y-4', className)}>
			<SectionTitle title={title} subtitle={subtitle} action={<SliderActions handleScroll={handleScroll} title={title} />} />

			<div ref={scrollRef} className='flex gap-4 overflow-x-auto hide-scrollbar' role='region' aria-label={`${title} slider`}>
				{children}
			</div>
		</section>
	);
};

export { Slider };
