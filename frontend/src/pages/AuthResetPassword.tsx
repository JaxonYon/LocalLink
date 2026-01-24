import { SignIn } from '@clerk/clerk-react';

export const AuthResetPassword = (): JSX.Element => {
	return (
		<SignIn
			routing="path"
			path="/auth/reset-password"
			signUpUrl="/auth/sign-up"
			afterSignInUrl="/"
		/>
	);
};
