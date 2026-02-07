import { Button, Input } from '@/components/ui';
import { useAuth, useSignUp } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthSignUp = (): JSX.Element => {
	const { isSignedIn } = useAuth();
	const { signUp, isLoaded, setActive } = useSignUp();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [step, setStep] = useState<'form' | 'verify'>('form');
	const [verificationCode, setVerificationCode] = useState('');
	const [error, setError] = useState('');
	const [errorDetails, setErrorDetails] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const isDev = import.meta.env.DEV;

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
		setErrorDetails(null);

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

			if (signUp.status === 'complete') {
				await setActive({ session: signUp.createdSessionId });
				navigate('/onboarding');
				return;
			}

			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
			setStep('verify');
		} catch (err: any) {
			console.error('Sign up error:', err);
			const errorMessage =
				err?.errors
					?.map((e: { code?: string; longMessage?: string; message?: string }) => `${e.code ? `${e.code}: ` : ''}${e.longMessage ?? e.message ?? ''}`)
					?.filter(Boolean)
					.join(' ') ||
				err?.message ||
				'Failed to create account';
			setError(errorMessage);
			if (isDev) {
				try {
					setErrorDetails(JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
				} catch {
					setErrorDetails(String(err));
				}
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerify = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!signUp || !isLoaded) return;

		setError('');
		setErrorDetails(null);
		setIsLoading(true);
		try {
			const result = await signUp.attemptEmailAddressVerification({
				code: verificationCode,
			});
			if (result.status === 'complete') {
				await setActive({ session: result.createdSessionId });
				navigate('/onboarding');
				return;
			}
			setError('Verification pending. Please check your email and try again.');
		} catch (err: any) {
			console.error('Verification error:', err);
			const errorMessage =
				err?.errors
					?.map((e: { code?: string; longMessage?: string; message?: string }) => `${e.code ? `${e.code}: ` : ''}${e.longMessage ?? e.message ?? ''}`)
					?.filter(Boolean)
					.join(' ') ||
				err?.message ||
				'Failed to verify email';
			setError(errorMessage);
			if (isDev) {
				try {
					setErrorDetails(JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
				} catch {
					setErrorDetails(String(err));
				}
			}
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

			{step === 'form' ? (
				<form onSubmit={handleSignUp} className='space-y-4'>
					{error && (
						<div className='rounded-lg bg-red-50 p-4 text-sm text-red-700'>
							<p>{error}</p>
							{isDev && errorDetails ? <pre className='mt-3 max-h-48 overflow-auto rounded-md bg-white/70 p-3 text-xs text-red-700'>{errorDetails}</pre> : null}
						</div>
					)}

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
					<div id='clerk-captcha' className='min-h-[72px]' />
				</form>
			) : (
				<form onSubmit={handleVerify} className='space-y-4'>
					{error && (
						<div className='rounded-lg bg-red-50 p-4 text-sm text-red-700'>
							<p>{error}</p>
							{isDev && errorDetails ? <pre className='mt-3 max-h-48 overflow-auto rounded-md bg-white/70 p-3 text-xs text-red-700'>{errorDetails}</pre> : null}
						</div>
					)}
					<Input label='Verification code' placeholder='Enter the code from your email' value={verificationCode} onChange={(event) => setVerificationCode(event.target.value)} required />
					<Button type='submit' disabled={isLoading} fullWidth>
						{isLoading ? 'Verifying...' : 'Verify email'}
					</Button>
					<Button
						type='button'
						variant='link'
						size='sm'
						fullWidth
						onClick={() => {
							setStep('form');
							setError('');
							setVerificationCode('');
						}}>
						Back to sign up
					</Button>
				</form>
			)}

			<div className='text-center text-sm text-gray-600'>
				Already have an account?{' '}
				<a href='/auth/sign-in' className='font-semibold text-orange-600 hover:text-orange-700'>
					Sign in
				</a>
			</div>
		</div>
	);
};
