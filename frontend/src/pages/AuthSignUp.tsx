import { SignUp } from '@clerk/clerk-react';

export const AuthSignUp = (): JSX.Element => {
	return (
		<SignUp
			routing="path"
			path="/auth/sign-up"
			signInUrl="/auth/sign-in"
			afterSignUpUrl="/onboarding"
		/>
	);
};
