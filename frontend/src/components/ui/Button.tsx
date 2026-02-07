import { cn } from '@/utils';
import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { cloneElement, isValidElement } from 'react';

type ButtonVariantType = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'accent' | 'success' | 'danger';
type ButtonSizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariantType;
	size?: ButtonSizeType;
	fullWidth?: boolean;
	asChild?: boolean;
	children?: ReactNode;
}

const variantClasses: Record<ButtonVariantType, string> = {
	primary: 'bg-orange-600 text-white hover:bg-orange-700 focus-visible:ring-orange-500',
	secondary: 'bg-surface text-text hover:bg-surface-muted focus-visible:ring-orange-500',
	outline: 'border border-border text-text hover:border-border-strong hover:bg-surface-subtle focus-visible:ring-orange-500',
	ghost: 'text-text hover:bg-surface-subtle focus-visible:ring-orange-500',
	link: 'text-orange-600 underline-offset-4 hover:underline focus-visible:ring-orange-500',
	accent: 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 focus-visible:ring-yellow-400',
	success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500',
	danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
};

const sizeClasses: Record<ButtonSizeType, string> = {
	xs: 'h-8 px-2 text-xs',
	sm: 'h-9 px-3 text-sm',
	md: 'h-11 px-4 text-sm',
	lg: 'h-12 px-5 text-base',
	xl: 'h-14 px-6 text-base',
};

const Button: FC<ButtonProps> = ({ className, variant = 'primary', size = 'md', fullWidth = false, type = 'button', asChild = false, children, ...props }): JSX.Element => {
	const buttonClasses = cn('select-none cursor-pointer inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', variantClasses[variant], sizeClasses[size], fullWidth ? 'w-full' : '', className);

	if (asChild && isValidElement(children)) {
		return cloneElement(children, {
			className: cn(buttonClasses, (children.props as { className?: string }).className),
			...props,
		});
	}

	return (
		<button type={type} className={buttonClasses} {...props}>
			{children}
		</button>
	);
};

export { Button };
