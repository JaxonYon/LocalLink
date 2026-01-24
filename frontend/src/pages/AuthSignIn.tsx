import { SignIn } from '@clerk/clerk-react';

export const AuthSignIn = (): JSX.Element => {
	return (
		<SignIn
			routing="path"
			path="/auth/sign-in"
			signUpUrl="/auth/sign-up"
			afterSignInUrl="/"
		/>
	);
};
