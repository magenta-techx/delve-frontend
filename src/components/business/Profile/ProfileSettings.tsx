"use client";
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Loader from '@/components/ui/Loader';
import { showToastNotification } from '@/components/notifications/ToastNotification';
import KeyIcon from '@/assets/icons/auth/KeyIcon';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  profileUpdateSchema,
  type ProfileUpdateInput,
  changePasswordSchema,
  type ChangePasswordInput,
} from '@/schemas/profileSchema';
import { useGetProfile } from '@/hooks/user/useGetProfile';
import { useUpdateProfile } from '@/hooks/user/useUpdateProfile';
import { useChangePassword } from '@/hooks/user/useChangePassword';

const ProfileSettings = (): JSX.Element => {
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const email = session?.user?.email ?? null;

  const { data: profile, isLoading: isProfileLoading, refetch } = useGetProfile(email);
  const updateProfile = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const defaultValues = useMemo<ProfileUpdateInput>(
    () => ({
      first_name: (profile?.first_name as string) || '',
      last_name: (profile?.last_name as string) || '',
      email: (profile?.email as string) || (email || ''),
    }),
    [profile, email]
  );

  const profileForm = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues,
    mode: 'onChange',
    values: defaultValues, // keep in sync when profile loads
  });

  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { old_password: '', new_password: '', confirm_password: '' },
    mode: 'onChange',
  });

  async function onSubmitProfile(values: ProfileUpdateInput): Promise<void> {
    try {
      const res = await updateProfile.mutateAsync(values);
      if (res && typeof res === 'object' && 'error' in res && res.error) {
        throw new Error(String(res.error));
      }
      showToastNotification(
        { header: 'Successfull', body: 'Profile updated' },
        <KeyIcon />
      );
      await refetch();
    } catch (error) {
      showToastNotification(
        { header: 'Error', body: error instanceof Error ? error.message : 'Update failed' },
        <KeyIcon />
      );
    }
  }

  async function onSubmitPassword(values: ChangePasswordInput): Promise<void> {
    try {
      const res = await changePasswordMutation.mutateAsync(values);
      if (res && typeof res === 'object' && 'error' in res && res.error) {
        throw new Error(String(res.error));
      }
      showToastNotification(
        { header: 'Successfull', body: 'Password changed' },
        <KeyIcon />
      );
      passwordForm.reset();
      setChangePassword(false);
    } catch (error) {
      showToastNotification(
        { header: 'Error', body: error instanceof Error ? error.message : 'Password change failed' },
        <KeyIcon />
      );
    }
  }

  const sessionLoading = status === 'loading';

  return (
    <div>
      <div className='flex w-full items-start gap-[150px]'>
        <div className='relative rounded-3xl border-[1px] border-[#E3E8EF] p-10 sm:min-h-[866px] sm:w-[880px]'>
          <div className='mb-14 flex items-start justify-between'>
            <div className='flex items-end gap-3'>
              <div className='relative flex items-end justify-center rounded-full border-[2px] border-[#E3E8EF] sm:h-[100px] sm:w-[100px]'>
                <Image
                  src={'/profile/person-graphics.jpg'}
                  alt='Delve user profile'
                  width={80}
                  height={50}
                  className='rounded-full'
                />
              </div>
              <button className='flex items-center justify-center gap-2 rounded-md border-[1px] border-[#E3E8EF] bg-[#EEF2F6] text-[14px] text-[#181D27] hover:bg-[#E3E8EF] sm:h-[40px] sm:w-[130px]'>
                Change profile
              </button>
            </div>
            <div className='flex items-center justify-center gap-2 rounded-md bg-[#FFF4ED] text-[14px] sm:h-[44px] sm:w-[194px]'>
              <span className='text-[#9AA4B2]'>Joined</span>{' '}
              <span>24th June, 2025</span>
            </div>
          </div>

          {sessionLoading || isProfileLoading ? (
            <div className='flex items-center gap-2 text-[#697586]'>
              <Loader borderColor='border-primary' />
              <span>Loading profile…</span>
            </div>
          ) : (
            <FormProvider {...profileForm}>
              <form className='w-full' onSubmit={profileForm.handleSubmit(onSubmitProfile)}>
                <h1 className='mb-10 text-[18px] font-semibold'>Account Management</h1>
                <div className='flex w-full flex-col gap-2'>
                  <div className='flex flex-col gap-5 sm:flex-row sm:items-center'>
                    <Input
                      type='text'
                      placeholder='Enter first name'
                      label='First name'
                      containerClassName='w-full'
                      hasError={Boolean(profileForm.formState.errors.first_name)}
                      errorMessage={profileForm.formState.errors.first_name?.message}
                      {...profileForm.register('first_name')}
                    />

                    <Input
                      type='text'
                      placeholder='Enter last name'
                      label='Last name'
                      containerClassName='w-full'
                      hasError={Boolean(profileForm.formState.errors.last_name)}
                      errorMessage={profileForm.formState.errors.last_name?.message}
                      {...profileForm.register('last_name')}
                    />
                  </div>

                  <Input
                    disabled
                    type='email'
                    placeholder='Enter Email'
                    label='Email address'
                    optional
                    hasError={Boolean(profileForm.formState.errors.email)}
                    errorMessage={profileForm.formState.errors.email?.message}
                    {...profileForm.register('email')}
                  />
                </div>

                <div className='mt-6 w-1/2'>
                  <Button type='submit' isSubmitting={profileForm.formState.isSubmitting} disabled={!profileForm.formState.isValid}>
                    Save changes
                  </Button>
                </div>
              </form>
            </FormProvider>
          )}

          <div className='mt-10 w-1/2'>
            <Button type='button' onClick={() => setChangePassword((p) => !p)}>
              {changePassword ? 'Cancel' : 'Change password'}
            </Button>
          </div>

          {changePassword && (
            <div className='pt-10 sm:w-[515px]'>
              <div className='mb-10 flex items-center justify-between'>
                <h3 className='text-[18px] font-semibold'>Change Password</h3>
                <button className='text-[14px] text-[#697586]' onClick={() => setChangePassword(false)}>
                  Cancel
                </button>
              </div>

              <FormProvider {...passwordForm}>
                <form className='w-full' onSubmit={passwordForm.handleSubmit(onSubmitPassword)}>
                  <div className='flex w-full flex-col gap-2'>
                    <Input
                      type='password'
                      placeholder='Enter old password'
                      label='Old password'
                      hasError={Boolean(passwordForm.formState.errors.old_password)}
                      errorMessage={passwordForm.formState.errors.old_password?.message}
                      {...passwordForm.register('old_password')}
                    />

                    <Input
                      type='password'
                      placeholder='New password'
                      label='New password'
                      hasError={Boolean(passwordForm.formState.errors.new_password)}
                      errorMessage={passwordForm.formState.errors.new_password?.message}
                      {...passwordForm.register('new_password')}
                    />

                    <Input
                      type='password'
                      placeholder='Confirm password'
                      label='Confirm password'
                      hasError={Boolean(passwordForm.formState.errors.confirm_password)}
                      errorMessage={passwordForm.formState.errors.confirm_password?.message}
                      {...passwordForm.register('confirm_password')}
                    />
                  </div>

                  <div className='mt-6 w-1/3'>
                    <Button type='submit' isSubmitting={passwordForm.formState.isSubmitting} disabled={!passwordForm.formState.isValid}>
                      Change
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </div>
          )}
        </div>

        <div className='w-[571px]'>
          <div className='rounded-lg border border-dashed border-[#E3E8EF] p-6 text-sm text-[#697586]'>
            Notifications will appear here.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
