import { Link, Outlet } from 'react-router-dom';

export const AuthLayout = (): JSX.Element => {
	return (
		<div className="min-h-screen bg-surface-subtle">
			<div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
				<div className="w-full max-w-md">
					<Link to="/" className="text-lg font-semibold text-text">
						Local Link
					</Link>
					<div className="mt-6 rounded-lg border border-border bg-surface p-6 shadow-subtle">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
};
