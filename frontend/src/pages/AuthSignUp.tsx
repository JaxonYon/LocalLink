import { Button, Input } from '@/components/ui';
import { useAuth, useSignUp } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthSignUp = (): JSX.Element => {
	const { isSignedIn } = useAuth();
	const { signUp, isLoaded } = useSignUp();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Redirect if already signed in
	useEffect(() => {
		if (isSignedIn) {
			navigate('/');
		}
	}, [isSignedIn, navigate]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded || !signUp) return;

		setError('');

		// Validation
		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		if (formData.password.length < 8) {
			setError('Password must be at least 8 characters');
			return;
		}

		setIsLoading(true);

		try {
			await signUp.create({
				firstName: formData.firstName,
				lastName: formData.lastName,
				emailAddress: formData.email,
				password: formData.password,
			});

			// Email verification would happen here
			navigate('/onboarding');
		} catch (err: any) {
			console.error('Sign up error:', err);
			const errorMessage = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Failed to create account';
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-2xl font-bold text-gray-900'>Create your account</h1>
				<p className='text-sm text-gray-600 mt-1'>Join millions exploring the world's best experiences</p>
			</div>

			<form onSubmit={handleSignUp} className='space-y-4'>
				{error && <div className='rounded-lg bg-red-50 p-4 text-sm text-red-700'>{error}</div>}

				<div className='grid grid-cols-2 gap-3'>
					<Input label='First name' placeholder='John' name='firstName' value={formData.firstName} onChange={handleChange} required />
					<Input label='Last name' placeholder='Doe' name='lastName' value={formData.lastName} onChange={handleChange} required />
				</div>

				<Input label='Email' type='email' placeholder='you@example.com' name='email' value={formData.email} onChange={handleChange} required />

				<Input label='Password' type='password' placeholder='At least 8 characters' name='password' value={formData.password} onChange={handleChange} required />

				<Input label='Confirm password' type='password' placeholder='Re-enter your password' name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} required />

				<Button type='submit' disabled={isLoading} fullWidth>
					{isLoading ? 'Creating account...' : 'Create Account'}
				</Button>
			</form>

			<div className='text-center text-sm text-gray-600'>
				Already have an account?{' '}
				<a href='/auth/sign-in' className='font-semibold text-orange-600 hover:text-orange-700'>
					Sign in
				</a>
			</div>
		</div>
	);
};
