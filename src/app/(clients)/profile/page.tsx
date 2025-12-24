'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { useGetProfile } from '@/hooks/user/useGetProfile';
import { useUpdateProfile } from '@/hooks/user/useUpdateProfile';
import { cn } from '@/lib/utils';
import {
  profileUpdateSchema,
  changePasswordSchema,
} from '@/schemas/profileSchema';
import type { ChangePasswordInput } from '@/schemas/profileSchema';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/Sheet';
import { useIsMobile } from '@/hooks/useMobile';

type ProfileFormValues = z.infer<typeof profileUpdateSchema>;

const ProfilePage = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email ?? null;
  const { isMobile } = useIsMobile();

  const {
    data: profileData,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useGetProfile(userEmail);
  const updateProfileMutation = useUpdateProfile();

  const [isPasswordPanelOpen, setIsPasswordPanelOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile form with RHF + Zod
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
    },
  });

  // Password form with RHF + Zod
  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  useEffect(() => {
    if (profileData) {
      profileForm.reset({
        first_name: profileData.first_name ?? '',
        last_name: profileData.last_name ?? '',
      });
    }
  }, [profileData, profileForm]);

  const displayName = useMemo(() => {
    const fallback = session?.user?.name || 'Delve user';
    const composed = [profileData?.first_name, profileData?.last_name]
      .filter(Boolean)
      .join(' ');
    return composed || fallback;
  }, [profileData?.first_name, profileData?.last_name, session?.user?.name]);

  const joinedDate = profileData?.['date_joined'] as string | undefined;
  const joinDateLabel = useMemo(() => formatJoinDate(joinedDate), [joinedDate]);

  const avatarImage =
    imagePreview ??
    (profileData?.['profile_image'] as string | null | undefined) ??
    session?.user?.image ??
    null;

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = profileForm.handleSubmit(data => {
    const payload: {
      first_name?: string;
      last_name?: string;
      profile_image?: File;
    } = {};

    if (data.first_name && data.first_name !== profileData?.first_name) {
      payload.first_name = data.first_name;
    }
    if (data.last_name && data.last_name !== profileData?.last_name) {
      payload.last_name = data.last_name;
    }
    if (selectedImage) {
      payload.profile_image = selectedImage;
    }

    if (Object.keys(payload).length === 0) {
      toast.info('No changes to save');
      return;
    }

    updateProfileMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Profile updated successfully');
        refetchProfile();
        setSelectedImage(null);
      },
      onError: error => {
        toast.error(error.message || 'Failed to update profile');
      },
    });
  });

  const handlePasswordSubmit = passwordForm.handleSubmit(data => {
    updateProfileMutation.mutate(
      {
        old_password: data.old_password,
        new_password: data.new_password,
      },
      {
        onSuccess: () => {
          toast.success('Password changed successfully');
          setIsPasswordPanelOpen(false);
          passwordForm.reset();
        },
        onError: error => {
          toast.error(error.message || 'Failed to change password');
        },
      }
    );
  });

  const handleClosePasswordPanel = () => {
    setIsPasswordPanelOpen(false);
    passwordForm.reset();
  };

  // Password change form component (used both in side panel and sheet)
  const PasswordChangeForm = () => (
    <form onSubmit={handlePasswordSubmit} className='space-y-5'>
      <Input
        label='Old password'
        type='password'
        placeholder='Enter current password'
        {...passwordForm.register('old_password')}
        haserror={!!passwordForm.formState.errors.old_password}
        errormessage={passwordForm.formState.errors.old_password?.message}
      />
      <Input
        label='New password'
        type='password'
        placeholder='Enter new password'
        {...passwordForm.register('new_password')}
        haserror={!!passwordForm.formState.errors.new_password}
        errormessage={passwordForm.formState.errors.new_password?.message}
      />
      <Input
        label='Confirm new password'
        type='password'
        placeholder='Confirm new password'
        {...passwordForm.register('confirm_password')}
        haserror={!!passwordForm.formState.errors.confirm_password}
        errormessage={passwordForm.formState.errors.confirm_password?.message}
      />
      <Button
        type='submit'
        size='dynamic_lg'
        className='w-full rounded-xl py-3 text-base font-semibold shadow-sm bg-[#551FB9]'
        isLoading={updateProfileMutation.isPending}
      >
        Change
      </Button>
    </form>
  );

  return (
    <div className='min-h-screen w-screen overflow-hidden bg-[#F8F7FB] sm:px-6 lg:px-12'>
      <section className='container mx-auto p-4 pt-16 md:pt-20'>
        <header className='flex w-full flex-col gap-2 py-8'>
          <h1 className='flex items-center gap-2 text-xl font-semibold text-[#0F172B]'>
            <svg
              width='23'
              height='24'
              viewBox='0 0 23 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M9.33333 11.6667C12.555 11.6667 15.1667 9.05499 15.1667 5.83333C15.1667 2.61167 12.555 0 9.33333 0C6.11167 0 3.5 2.61167 3.5 5.83333C3.5 9.05499 6.11167 11.6667 9.33333 11.6667Z'
                fill='#0F0F0F'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M13.4527 11.4335C13.1627 10.9313 13.3348 10.2891 13.837 9.99918L14.7463 9.47418C15.2485 9.18423 15.8907 9.3563 16.1807 9.85851C16.5078 10.4251 17.3256 10.4251 17.6527 9.85851C17.9426 9.35631 18.5848 9.18424 19.087 9.47419L19.9963 9.99919C20.4985 10.2891 20.6706 10.9313 20.3807 11.4335C20.0535 12.0001 20.4624 12.7083 21.1167 12.7083C21.6966 12.7083 22.1667 13.1784 22.1667 13.7583V14.8083C22.1667 15.3882 21.6966 15.8583 21.1167 15.8583C20.4624 15.8583 20.0535 16.5665 20.3807 17.1331C20.6706 17.6353 20.4985 18.2775 19.9963 18.5674L19.087 19.0924C18.5848 19.3824 17.9426 19.2103 17.6527 18.7081C17.3256 18.1415 16.5078 18.1415 16.1807 18.7081C15.8907 19.2103 15.2485 19.3824 14.7463 19.0925L13.837 18.5675C13.3348 18.2775 13.1627 17.6353 13.4527 17.1331C13.7798 16.5665 13.3709 15.8583 12.7167 15.8583C12.1368 15.8583 11.6667 15.3882 11.6667 14.8083V13.7583C11.6667 13.1784 12.1368 12.7083 12.7167 12.7083C13.3709 12.7083 13.7798 12.0001 13.4527 11.4335ZM16.9164 16.3036C18.0316 16.3036 18.9357 15.3995 18.9357 14.2843C18.9357 13.1691 18.0316 12.2651 16.9164 12.2651C15.8013 12.2651 14.8972 13.1691 14.8972 14.2843C14.8972 15.3995 15.8013 16.3036 16.9164 16.3036Z'
                fill='#0F0F0F'
              />
              <path
                d='M10.7917 13.7583C10.7917 13.456 10.8614 13.1699 10.9856 12.9153C10.4493 12.8615 9.89716 12.8333 9.33333 12.8333C4.17868 12.8333 0 15.1838 0 18.0833C0 20.9828 4.17868 23.3333 9.33333 23.3333C13.2678 23.3333 16.6336 21.964 18.0067 20.0263C17.5665 19.8938 17.1727 19.6043 16.9167 19.1824C16.3753 20.0747 15.2172 20.3747 14.3088 19.8502L13.3995 19.3252C12.4912 18.8008 12.1719 17.6478 12.6739 16.7329C11.6305 16.7101 10.7917 15.8572 10.7917 14.8083V13.7583Z'
                fill='#0F0F0F'
              />
            </svg>
            Profile Settings
          </h1>
        </header>

        <div className={cn(
          'grid gap-6',
          isPasswordPanelOpen && !isMobile ? 'lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]' : ''
        )}>
          <ProfilePanel
            isLoading={profileLoading && !profileData}
            displayName={displayName}
            avatarUrl={avatarImage}
            email={profileData?.email ?? userEmail ?? ''}
            profileForm={profileForm}
            onSubmit={handleProfileSubmit}
            isSubmitting={updateProfileMutation.isPending}
            onOpenPasswordPanel={() => setIsPasswordPanelOpen(true)}
            onImageSelect={handleImageSelect}
            fileInputRef={fileInputRef}
            joinDateLabel={joinDateLabel!}
          />

          {/* Password Change Side Panel - Desktop Only */}
          {isPasswordPanelOpen && !isMobile && (
            <section className='h-max bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] border border-[#E3E8EF] rounded-xl sm:p-8'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-lg font-semibold text-[#0F172B]'>Change Password</h2>
                <button
                  onClick={handleClosePasswordPanel}
                  className='text-[#5F2EEA] text-sm font-medium hover:underline'
                >
                  Cancel
                </button>
              </div>
              <PasswordChangeForm />
            </section>
          )}
        </div>
      </section>

      {/* Password Change Bottom Sheet - Mobile Only */}
      <Sheet open={isPasswordPanelOpen && isMobile} onOpenChange={setIsPasswordPanelOpen}>
        <SheetContent side='bottom' className='rounded-t-2xl px-6 pb-8 pt-4'>
          <SheetHeader className='mb-6'>
            <div className='flex items-center justify-between'>
              <SheetTitle className='text-lg font-semibold text-[#0F172B]'>
                Change Password
              </SheetTitle>
              <button
                onClick={handleClosePasswordPanel}
                className='text-[#5F2EEA] text-sm font-medium hover:underline'
              >
                Cancel
              </button>
            </div>
          </SheetHeader>
          <PasswordChangeForm />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProfilePage;

type ProfilePanelProps = {
  isLoading: boolean;
  displayName: string;
  avatarUrl?: string | null;
  email: string;
  profileForm: ReturnType<typeof useForm<ProfileFormValues>>;
  onSubmit: () => void;
  isSubmitting: boolean;
  onOpenPasswordPanel: () => void;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  joinDateLabel?: string;
};

const ProfilePanel = ({
  isLoading,
  displayName,
  avatarUrl,
  email,
  profileForm,
  onSubmit,
  isSubmitting,
  onOpenPasswordPanel,
  onImageSelect,
  fileInputRef,
  joinDateLabel,
}: ProfilePanelProps) => {
  const firstName = profileForm.watch('first_name');
  const lastName = profileForm.watch('last_name');

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <section className='h-max bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] border border-[#E3E8EF] rounded-xl sm:p-8'>
      <div className='flex flex-wrap items-start justify-between gap-5 border-b border-[#F1F5F9] pb-6'>
        <section className='flex flex-col'>
          <div className='flex items-end gap-4'>
            <div className='relative'>
              <Avatar className='h-16 w-16 ring-4 ring-[#F2ECFF]'>
                <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
                <AvatarFallback className='bg-[#EEF2FF] text-lg font-semibold text-[#4C1D95]'>
                  {getInitials(firstName, lastName, displayName)}
                </AvatarFallback>
              </Avatar>
              <input
                ref={fileInputRef as React.RefObject<HTMLInputElement>}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={onImageSelect}
              />
            </div>

            <Button
              type='button'
              variant='colored_outline'
              size='sm'
              className='rounded-lg px-4 text-xs font-semibold text-[#5F2EEA]'
              onClick={() => fileInputRef.current?.click()}
            >
              Change profile
            </Button>
          </div>
        </section>

        <Badge className='rounded-2xl bg-[#FFF4ED] px-4 py-1 text-xs font-semibold text-[#4B5565] shadow-sm'>
          Joined&nbsp;{joinDateLabel}
        </Badge>
      </div>

      <form onSubmit={onSubmit}>
        <h3 className='mt-6 mb-4 text-base font-semibold text-[#0F172B]'>Account Management</h3>
        
        <div className='grid gap-5 sm:grid-cols-2'>
          <Input
            label='First name'
            optional
            placeholder='Enter first name'
            {...profileForm.register('first_name')}
            haserror={!!profileForm.formState.errors.first_name}
            errormessage={profileForm.formState.errors.first_name?.message}
          />
          <Input
            label='Last name'
            optional
            placeholder='Enter last name'
            {...profileForm.register('last_name')}
            haserror={!!profileForm.formState.errors.last_name}
            errormessage={profileForm.formState.errors.last_name?.message}
          />
          <Input
            label='Email address'
            containerClassName='sm:col-span-2'
            optional
            value={email}
            readOnly
            disabled
            placeholder='Email address'
          />
          <div className='flex flex-col gap-2 sm:col-span-2'>
            <Input
              label='Password'
              containerClassName='w-full'
              optional
              type='password'
              value='******************'
              readOnly
            />
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='w-fit rounded-full border-[#E2E8F0] px-4 text-xs font-semibold text-[#0F172B]'
              onClick={onOpenPasswordPanel}
            >
              Change password
            </Button>
          </div>
        </div>

        <Button
          type='submit'
          size='dynamic_lg'
          className='mt-8 w-full rounded-xl max-w-[400px] py-3 text-base font-semibold shadow-sm bg-[#551FB9]'
          isLoading={isSubmitting}
        >
          Save Changes
        </Button>
      </form>
    </section>
  );
};

const ProfileSkeleton = () => (
  <section className='rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] ring-1 ring-black/5 sm:p-8'>
    <div className='flex flex-col gap-6'>
      <div className='flex items-center gap-4'>
        <div className='h-16 w-16 animate-pulse rounded-full bg-[#E2E8F0]' />
        <div className='flex-1 space-y-2'>
          <div className='h-4 w-40 animate-pulse rounded-full bg-[#E2E8F0]' />
          <div className='h-3 w-32 animate-pulse rounded-full bg-[#E2E8F0]' />
        </div>
      </div>
      <div className='grid gap-4 sm:grid-cols-2'>
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={`profile-skeleton-${idx}`}
            className='h-12 animate-pulse rounded-2xl bg-[#E2E8F0]'
          />
        ))}
      </div>
      <div className='h-12 animate-pulse rounded-2xl bg-[#E2E8F0]' />
    </div>
  </section>
);

function getInitials(firstName?: string, lastName?: string, fallback?: string) {
  const letters = [firstName?.[0], lastName?.[0]].filter(Boolean).join('');
  if (letters) return letters.toUpperCase();
  if (fallback) {
    const parts = fallback.split(' ');
    return parts
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }
  return 'DM';
}

function formatJoinDate(input?: string) {
  if (!input) return undefined;
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return undefined;
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${day}${getOrdinal(day)} ${month}, ${year}`;
}

function getOrdinal(day: number) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}
