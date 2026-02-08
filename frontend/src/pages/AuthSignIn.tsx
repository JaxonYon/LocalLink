import { Button, Input } from '@/components/ui';
import { useAuth, useSignIn } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthSignIn = (): JSX.Element => {
	const { isSignedIn } = useAuth();
	const { signIn, isLoaded, setActive } = useSignIn();
	const navigate = useNavigate();
	type SecondFactorStrategy = 'phone_code' | 'email_code' | 'totp' | 'backup_code';
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [secondFactorCode, setSecondFactorCode] = useState('');
	const [secondFactorStrategy, setSecondFactorStrategy] = useState<SecondFactorStrategy | null>(null);
	const [secondFactorPhoneId, setSecondFactorPhoneId] = useState<string | null>(null);
	const [step, setStep] = useState<'form' | 'secondFactor'>('form');
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

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded || !signIn) {
			setError('Sign-in is not ready. Please try again.');
			return;
		}

		setError('');
		setErrorDetails(null);
		setIsLoading(true);

		try {
			const result = await signIn.create({
				identifier: email,
				password,
			});

			if (result.status === 'complete') {
				await setActive({ session: result.createdSessionId });
				navigate('/');
				return;
			}

			if (result.status === 'needs_second_factor') {
				const factor = result.supportedSecondFactors?.[0];
				const strategy = (factor?.strategy ?? 'totp') as SecondFactorStrategy;
				const phoneNumberId = 'phoneNumberId' in (factor ?? {}) ? ((factor as { phoneNumberId?: string }).phoneNumberId ?? null) : null;
				setSecondFactorStrategy(strategy);
				setSecondFactorPhoneId(phoneNumberId);
				if (strategy === 'phone_code' && phoneNumberId) {
					await signIn.prepareSecondFactor({
						strategy: 'phone_code',
						phoneNumberId,
					});
				}
				setStep('secondFactor');
				return;
			}

			setError('Additional verification is required to sign in.');
		} catch (err: any) {
			console.error('Sign in error:', err);
			const errorMessage =
				err?.errors
					?.map((e: { code?: string; longMessage?: string; message?: string }) => `${e.code ? `${e.code}: ` : ''}${e.longMessage ?? e.message ?? ''}`)
					?.filter(Boolean)
					.join(' ') ||
				err?.message ||
				'Invalid email or password';
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

	const handleSecondFactor = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded || !signIn) {
			setError('Sign-in is not ready. Please try again.');
			return;
		}
		if (!secondFactorStrategy) {
			setError('No second-factor strategy is available.');
			return;
		}

		setError('');
		setErrorDetails(null);
		setIsLoading(true);
		try {
			const result = await signIn.attemptSecondFactor({
				strategy: secondFactorStrategy,
				code: secondFactorCode,
				...(secondFactorStrategy === 'phone_code' && secondFactorPhoneId ? { phoneNumberId: secondFactorPhoneId } : {}),
			});
			if (result.status === 'complete') {
				await setActive({ session: result.createdSessionId });
				navigate('/');
				return;
			}
			setError('Second-factor verification is still required.');
		} catch (err: any) {
			console.error('Second factor error:', err);
			const errorMessage =
				err?.errors
					?.map((e: { code?: string; longMessage?: string; message?: string }) => `${e.code ? `${e.code}: ` : ''}${e.longMessage ?? e.message ?? ''}`)
					?.filter(Boolean)
					.join(' ') ||
				err?.message ||
				'Failed to verify second factor';
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
				<h1 className='text-2xl font-bold text-gray-900'>Welcome back</h1>
				<p className='text-sm text-gray-600 mt-1'>Sign in to access your itineraries and saved experiences</p>
			</div>

			{step === 'form' ? (
				<form onSubmit={handleSignIn} className='space-y-4'>
					{error && (
						<div className='rounded-lg bg-red-50 p-4 text-sm text-red-700'>
							<p>{error}</p>
							{isDev && errorDetails ? <pre className='mt-3 max-h-48 overflow-auto rounded-md bg-white/70 p-3 text-xs text-red-700'>{errorDetails}</pre> : null}
						</div>
					)}

					<Input label='Email' type='email' placeholder='you@example.com' value={email} onChange={(e) => setEmail(e.target.value)} required />

					<div className='flex items-center justify-between'>
						<label className='text-sm font-medium text-gray-700'>Password</label>
						<a href='/auth/reset-password' className='text-sm text-orange-600 hover:text-orange-700 font-semibold'>
							Forgot?
						</a>
					</div>
					<Input type='password' placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} required />

					<Button type='submit' disabled={isLoading} fullWidth>
						{isLoading ? 'Signing in...' : 'Sign In'}
					</Button>
				</form>
			) : (
				<form onSubmit={handleSecondFactor} className='space-y-4'>
					{error && (
						<div className='rounded-lg bg-red-50 p-4 text-sm text-red-700'>
							<p>{error}</p>
							{isDev && errorDetails ? <pre className='mt-3 max-h-48 overflow-auto rounded-md bg-white/70 p-3 text-xs text-red-700'>{errorDetails}</pre> : null}
						</div>
					)}
					<Input label='Verification code' placeholder='Enter your 2FA code' value={secondFactorCode} onChange={(e) => setSecondFactorCode(e.target.value)} required />
					<Button type='submit' disabled={isLoading} fullWidth>
						{isLoading ? 'Verifying...' : 'Verify'}
					</Button>
					<Button
						type='button'
						variant='link'
						size='sm'
						fullWidth
						onClick={() => {
							setStep('form');
							setError('');
							setSecondFactorCode('');
							setSecondFactorStrategy(null);
							setSecondFactorPhoneId(null);
						}}>
						Back to sign in
					</Button>
				</form>
			)}

			<div className='text-center text-sm text-gray-600'>
				Don't have an account?{' '}
				<a href='/auth/sign-up' className='font-semibold text-orange-600 hover:text-orange-700'>
					Sign up
				</a>
			</div>
		</div>
	);
};
