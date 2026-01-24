import { cloneElement, isValidElement } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	asChild?: boolean;
	children?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
	primary:
		'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500',
	secondary:
		'bg-surface-subtle text-text hover:bg-surface-muted focus-visible:ring-brand-500',
	outline:
		'border border-border text-text hover:border-border-strong hover:bg-surface-subtle focus-visible:ring-brand-500',
	ghost: 'text-text hover:bg-surface-subtle focus-visible:ring-brand-500',
	link: 'text-brand-700 underline-offset-4 hover:underline focus-visible:ring-brand-500'
};

const sizeClasses: Record<ButtonSize, string> = {
	sm: 'h-9 px-3 text-sm',
	md: 'h-11 px-4 text-sm',
	lg: 'h-12 px-5 text-base'
};

export const Button = ({
	className,
	variant = 'primary',
	size = 'md',
	type = 'button',
	asChild = false,
	children,
	...props
}: ButtonProps): JSX.Element => {
	const buttonClasses = cn(
		'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
		variantClasses[variant],
		sizeClasses[size],
		className
	);

	if (asChild && isValidElement(children)) {
		return cloneElement(children, {
			className: cn(buttonClasses, (children.props as { className?: string }).className),
			...props
		});
	}

	return (
		<button type={type} className={buttonClasses} {...props}>
			{children}
		</button>
	);
};
