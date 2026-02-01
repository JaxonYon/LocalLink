import { useUser } from '@clerk/clerk-react';
import { AlertTriangle, Edit2, Lock, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { Button, Card, Input } from '@/components/ui';
import { clearOnboarding, getOnboardingData } from '@/store';

export const Account = (): JSX.Element => {
	const { user } = useUser();
	const onboarding = getOnboardingData();

	const [isEditingProfile, setIsEditingProfile] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const [profileData, setProfileData] = useState({
		firstName: user?.firstName || '',
		lastName: user?.lastName || '',
	});

	const [passwordData, setPasswordData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const handleSaveProfile = async () => {
		try {
			await user?.update({
				firstName: profileData.firstName,
				lastName: profileData.lastName,
			});
			setIsEditingProfile(false);
		} catch (error) {
			console.error('Failed to update profile:', error);
			alert('Failed to update profile. Please try again.');
		}
	};

	const handleChangePassword = async () => {
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			alert('New passwords do not match');
			return;
		}
		if (passwordData.newPassword.length < 8) {
			alert('Password must be at least 8 characters');
			return;
		}

		try {
			// Clerk handles password change through their API
			// This is a placeholder - you'll need to implement via Clerk's methods
			alert('Password change is handled through Clerk. Please use the Clerk User Button for security settings.');
			setIsChangingPassword(false);
			setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
		} catch (error) {
			console.error('Failed to change password:', error);
			alert('Failed to change password. Please try again.');
		}
	};

	const handleDeleteAccount = async () => {
		try {
			await user?.delete();
			clearOnboarding();
			window.location.href = '/';
		} catch (error) {
			console.error('Failed to delete account:', error);
			alert('Failed to delete account. Please try again.');
		}
	};

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-2xl font-semibold text-text'>Account Settings</h1>
				<p className='text-sm text-text-subtle'>Manage your profile, security, and account preferences.</p>
			</div>

			<div className='grid gap-6 lg:grid-cols-2'>
				{/* Profile Card */}
				<Card className='space-y-4 p-6'>
					<div className='flex items-center justify-between'>
						<h2 className='text-lg font-semibold text-text'>Profile Information</h2>
						{!isEditingProfile ? (
							<Button variant='ghost' size='sm' onClick={() => setIsEditingProfile(true)} className='gap-2'>
								<Edit2 className='h-4 w-4' />
								Edit
							</Button>
						) : (
							<div className='flex gap-2'>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => {
										setIsEditingProfile(false);
										setProfileData({
											firstName: user?.firstName || '',
											lastName: user?.lastName || '',
										});
									}}>
									<X className='h-4 w-4' />
								</Button>
								<Button variant='primary' size='sm' onClick={handleSaveProfile} className='gap-2'>
									<Save className='h-4 w-4' />
									Save
								</Button>
							</div>
						)}
					</div>

					{isEditingProfile ? (
						<div className='space-y-4'>
							<div>
								<label className='text-xs font-semibold uppercase tracking-widest text-text-subtle'>First Name</label>
								<Input value={profileData.firstName} onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })} className='mt-1' />
							</div>
							<div>
								<label className='text-xs font-semibold uppercase tracking-widest text-text-subtle'>Last Name</label>
								<Input value={profileData.lastName} onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })} className='mt-1' />
							</div>
						</div>
					) : (
						<div className='space-y-3'>
							<div>
								<p className='text-xs font-semibold uppercase tracking-widest text-text-subtle'>Name</p>
								<p className='text-sm text-text'>{user?.fullName ?? 'Local Link traveler'}</p>
							</div>
							<div>
								<p className='text-xs font-semibold uppercase tracking-widest text-text-subtle'>Email</p>
								<p className='text-sm text-text'>{user?.primaryEmailAddress?.emailAddress ?? 'Not provided'}</p>
							</div>
						</div>
					)}
				</Card>

				{/* Onboarding Summary Card */}
				<Card className='space-y-3 p-6'>
					<h2 className='text-lg font-semibold text-text'>Onboarding Summary</h2>
					{onboarding ? (
						<div className='space-y-2 text-sm text-text'>
							<p>
								<span className='font-medium'>Trip style:</span> {onboarding.tripStyle}
							</p>
							<p>
								<span className='font-medium'>Budget:</span> {onboarding.budget}
							</p>
							<p>
								<span className='font-medium'>Activities:</span> {onboarding.activities.join(', ') || 'Not set'}
							</p>
							<p>
								<span className='font-medium'>Party size:</span> {onboarding.partySize}
							</p>
							<p>
								<span className='font-medium'>Home location:</span> {onboarding.homeLocation}
							</p>
							<p>
								<span className='font-medium'>Accessibility:</span> {onboarding.accessibility.join(', ') || 'None'}
							</p>
						</div>
					) : (
						<p className='text-sm text-text-subtle'>Onboarding details are not available.</p>
					)}
				</Card>

				{/* Security Card */}
				<Card className='space-y-4 p-6'>
					<div className='flex items-center justify-between'>
						<h2 className='text-lg font-semibold text-text'>Security</h2>
						{!isChangingPassword && (
							<Button variant='ghost' size='sm' onClick={() => setIsChangingPassword(true)} className='gap-2'>
								<Lock className='h-4 w-4' />
								Change Password
							</Button>
						)}
					</div>

					{isChangingPassword ? (
						<div className='space-y-4'>
							<div>
								<label className='text-xs font-semibold uppercase tracking-widest text-text-subtle'>Current Password</label>
								<Input type='password' value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className='mt-1' />
							</div>
							<div>
								<label className='text-xs font-semibold uppercase tracking-widest text-text-subtle'>New Password</label>
								<Input type='password' value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className='mt-1' />
							</div>
							<div>
								<label className='text-xs font-semibold uppercase tracking-widest text-text-subtle'>Confirm New Password</label>
								<Input type='password' value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className='mt-1' />
							</div>
							<div className='flex gap-2'>
								<Button
									variant='outline'
									size='sm'
									onClick={() => {
										setIsChangingPassword(false);
										setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
									}}
									className='flex-1'>
									Cancel
								</Button>
								<Button variant='primary' size='sm' onClick={handleChangePassword} className='flex-1'>
									Update Password
								</Button>
							</div>
						</div>
					) : (
						<div className='space-y-3'>
							<div>
								<p className='text-xs font-semibold uppercase tracking-widest text-text-subtle'>Password</p>
								<p className='text-sm text-text'>••••••••••••</p>
							</div>
							<p className='text-xs text-text-subtle'>Last changed: {new Date().toLocaleDateString()}</p>
						</div>
					)}
				</Card>

				{/* Danger Zone Card */}
				<Card className='space-y-4 p-6 border-red-200 dark:border-red-900'>
					<div className='flex items-center gap-2'>
						<AlertTriangle className='h-5 w-5 text-red-600' />
						<h2 className='text-lg font-semibold text-red-600'>Danger Zone</h2>
					</div>

					{!showDeleteConfirm ? (
						<div className='space-y-3'>
							<p className='text-sm text-text-subtle'>Once you delete your account, there is no going back. This action cannot be undone.</p>
							<Button variant='outline' onClick={() => setShowDeleteConfirm(true)} className='w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950 gap-2'>
								<Trash2 className='h-4 w-4' />
								Delete Account
							</Button>
						</div>
					) : (
						<div className='space-y-4'>
							<div className='bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg p-4'>
								<p className='text-sm font-semibold text-red-900 dark:text-red-100 mb-2'>⚠️ Are you absolutely sure?</p>
								<p className='text-xs text-red-700 dark:text-red-300'>This will permanently delete your account, all saved itineraries, and preferences. This action cannot be undone.</p>
							</div>
							<div className='flex gap-2'>
								<Button variant='outline' size='sm' onClick={() => setShowDeleteConfirm(false)} className='flex-1'>
									Cancel
								</Button>
								<Button variant='outline' size='sm' onClick={handleDeleteAccount} className='flex-1 bg-red-600 text-white hover:bg-red-700 border-red-600'>
									Yes, Delete My Account
								</Button>
							</div>
						</div>
					)}
				</Card>
			</div>
		</div>
	);
};
