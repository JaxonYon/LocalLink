import { Button, Input } from '@/components/ui';
import { useAuth, useSignIn } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ResetStage = 'email' | 'code' | 'password' | 'success';

export const AuthResetPassword = (): JSX.Element => {
	const { isSignedIn } = useAuth();
	const { signIn, isLoaded } = useSignIn();
	const navigate = useNavigate();
	const [stage, setStage] = useState<ResetStage>('email');
	const [email, setEmail] = useState('');
	const [code, setCode] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Redirect if already signed in (except when on success stage)
	useEffect(() => {
		if (isSignedIn && stage !== 'success') {
			navigate('/');
		}
	}, [isSignedIn, stage, navigate]);

	const handleRequestReset = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded || !signIn) return;

		setError('');
		setIsLoading(true);

		try {
			// Create sign-in attempt with the email identifier
			const signInAttempt = await signIn.create({
				identifier: email,
			});

			// Get the email address ID from the supported first factors
			const emailAddressId = signInAttempt.supportedFirstFactors?.find((factor) => factor.strategy === 'reset_password_email_code' && 'emailAddressId' in factor)?.emailAddressId;

			if (!emailAddressId) {
				throw new Error('Unable to find email address for reset');
			}

			// Prepare password reset with the email address ID
			await signIn.prepareFirstFactor({
				strategy: 'reset_password_email_code',
				emailAddressId: emailAddressId,
			});

			setStage('code');
		} catch (err: any) {
			console.error('Password reset error:', err);
			const errorMessage = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Failed to send reset email. Please check your email address.';
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerifyCode = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!signIn) return;

		setError('');
		setIsLoading(true);

		try {
			// Attempt to reset with the code
			const result = await signIn.attemptFirstFactor({
				strategy: 'reset_password_email_code',
				code,
			});

			if (result.status === 'needs_new_password') {
				setStage('password');
			}
		} catch (err: any) {
			console.error('Code verification error:', err);
			const errorMessage = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Invalid or expired code';
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!signIn) return;

		setError('');

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		if (password.length < 8) {
			setError('Password must be at least 8 characters');
			return;
		}

		setIsLoading(true);

		try {
			// Complete the password reset
			const result = await signIn.resetPassword({
				password,
			});

			if (result.status === 'complete') {
				setStage('success');
				// Auto-redirect to home after 3 seconds (user is now signed in)
				setTimeout(() => {
					navigate('/');
				}, 3000);
			}
		} catch (err: any) {
			console.error('Password reset error:', err);
			const errorMessage = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Failed to reset password';
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='space-y-6'>
			{stage === 'email' && (
				<>
					<div>
						<h1 className='text-2xl font-bold text-gray-900'>Reset your password</h1>
						<p className='text-sm text-gray-600 mt-1'>Enter your email and we'll send you a reset code</p>
					</div>

					<form onSubmit={handleRequestReset} className='space-y-4'>
						{error && <div className='rounded-lg bg-red-50 p-4 text-sm text-red-700'>{error}</div>}

						<Input label='Email' type='email' placeholder='you@example.com' value={email} onChange={(e) => setEmail(e.target.value)} required />

						<Button type='submit' disabled={isLoading} fullWidth>
							{isLoading ? 'Sending reset code...' : 'Send Reset Code'}
						</Button>
					</form>
				</>
			)}

			{stage === 'code' && (
				<>
					<div>
						<h1 className='text-2xl font-bold text-gray-900'>Verify your code</h1>
						<p className='text-sm text-gray-600 mt-1'>Check your email for the reset code</p>
					</div>

					<form onSubmit={handleVerifyCode} className='space-y-4'>
						{error && <div className='rounded-lg bg-red-50 p-4 text-sm text-red-700'>{error}</div>}

						<Input label='Reset Code' placeholder='Enter 6-digit code' value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={6} required />

						<Button type='submit' disabled={isLoading} fullWidth>
							{isLoading ? 'Verifying...' : 'Verify Code'}
						</Button>

						<Button
							type='button'
							variant='link'
							size='sm'
							fullWidth
							onClick={() => {
								setStage('email');
								setError('');
								setCode('');
							}}>
							Back to email
						</Button>
					</form>
				</>
			)}

			{stage === 'password' && (
				<>
					<div>
						<h1 className='text-2xl font-bold text-gray-900'>Create new password</h1>
						<p className='text-sm text-gray-600 mt-1'>Enter a strong password for your account</p>
					</div>

					<form onSubmit={handleResetPassword} className='space-y-4'>
						{error && <div className='rounded-lg bg-red-50 p-4 text-sm text-red-700'>{error}</div>}

						<Input label='New Password' type='password' placeholder='At least 8 characters' value={password} onChange={(e) => setPassword(e.target.value)} required />

						<Input label='Confirm Password' type='password' placeholder='Re-enter your password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

						<Button type='submit' disabled={isLoading} fullWidth>
							{isLoading ? 'Resetting password...' : 'Reset Password'}
						</Button>
					</form>
				</>
			)}

			{stage === 'success' && (
				<div className='text-center space-y-4'>
					<div className='inline-block p-4 bg-green-50 rounded-full'>
						<svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
						</svg>
					</div>
					<div>
						<h2 className='text-2xl font-bold text-gray-900'>Password reset successful!</h2>
						<p className='text-sm text-gray-600 mt-2'>You're now signed in and ready to explore</p>
					</div>
					<Button onClick={() => navigate('/')} fullWidth className='mt-4'>
						Go to Home
					</Button>
					<p className='text-xs text-gray-500 mt-4'>Redirecting in a few seconds...</p>
				</div>
			)}

			<div className='text-center text-sm text-gray-600 pt-4'>
				<a href='/auth/sign-in' className='font-semibold text-orange-600 hover:text-orange-700'>
					Back to Sign In
				</a>
			</div>
		</div>
	);
};
