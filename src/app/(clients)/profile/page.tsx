'use client';

import { useMemo, useRef, useState } from 'react';
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
import { useUserContext } from '@/contexts/UserContext';

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

  const { user: userFromContext, isLoading: userContextLoading } =
    useUserContext();

  // Profile form with RHF + Zod
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    values: useMemo(() => {
      const dataToUse = profileData || userFromContext;
      return {
        first_name:
          dataToUse?.first_name && dataToUse.first_name !== 'null'
            ? dataToUse.first_name
            : '',
        last_name:
          dataToUse?.last_name && dataToUse.last_name !== 'null'
            ? dataToUse.last_name
            : '',
      };
    }, [profileData, userFromContext]),
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

  const displayName = useMemo(() => {
    const fallback = session?.user?.name || 'Delve user';
    const fname =
      profileData?.first_name && profileData.first_name !== 'null'
        ? profileData.first_name
        : '';
    const lname =
      profileData?.last_name && profileData.last_name !== 'null'
        ? profileData.last_name
        : '';

    const composed = [fname, lname].filter(Boolean).join(' ');
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

    const originalFirstName =
      profileData?.first_name && profileData.first_name !== 'null'
        ? profileData.first_name
        : '';
    const originalLastName =
      profileData?.last_name && profileData.last_name !== 'null'
        ? profileData.last_name
        : '';

    if (
      data.first_name !== undefined &&
      data.first_name !== originalFirstName
    ) {
      payload.first_name = data.first_name;
    }
    if (data.last_name !== undefined && data.last_name !== originalLastName) {
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
    <form onSubmit={handlePasswordSubmit} className='flex flex-col gap-y-5'>
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
        className='my-8 w-full rounded-xl bg-[#551FB9] py-5 text-base font-semibold shadow-sm md:mt-6 md:max-w-[180px] md:rounded-2xl md:py-3'
        isLoading={updateProfileMutation.isPending}
      >
        Change
      </Button>
    </form>
  );

  return (
    <div className='min-h-dvh w-screen overflow-hidden bg-[#F8F7FB] sm:px-6 lg:px-12'>
      <section className='container mx-auto p-4 pt-16 md:pt-24'>
        <header className='flex w-full flex-col gap-2 pt-4 md:py-8'>
          <h1 className='flex items-center gap-2 text-base font-semibold text-[#0F172B] md:text-xl'>
            <svg
              width='23'
              height='24'
              viewBox='0 0 23 24'
              fill='none'
              className='size-4 md:size-6'
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

        <div
          className={cn(
            'grid gap-6',
            isPasswordPanelOpen && !isMobile
              ? 'lg:grid-cols-[minmax(0,1fr)_0.5fr]'
              : ''
          )}
        >
          <ProfilePanel
            isLoading={
              (profileLoading || userContextLoading) &&
              !profileData &&
              !userFromContext
            }
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
            selectedImage={selectedImage}
          />

          {/* Password Change Side Panel - Desktop Only */}
          {isPasswordPanelOpen && !isMobile && (
            <section className='h-max'>
              <div className='mb-6 flex items-center justify-between'>
                <h2 className='text-lg font-semibold text-[#0F172B]'>
                  Change Password
                </h2>
                <button
                  onClick={handleClosePasswordPanel}
                  className='text-sm font-medium text-[#5F2EEA] hover:underline'
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
      <Sheet
        open={isPasswordPanelOpen && isMobile}
        onOpenChange={setIsPasswordPanelOpen}
      >
        <SheetContent
          side='bottom'
          className='rounded-t-2xl px-6 pb-4 pt-4 md:pb-8'
          showCloseButton={false}
        >
          <SheetHeader className='mb-6'>
            <div className='flex items-center justify-between'>
              <SheetTitle className='text-base font-medium text-[#0F172B] md:text-lg'>
                Change Password
              </SheetTitle>
              <button
                onClick={handleClosePasswordPanel}
                className='text-sm font-medium text-[#5F2EEA] hover:underline'
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
  selectedImage?: File | null;
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
  selectedImage,
}: ProfilePanelProps) => {
  const firstName = profileForm.watch('first_name');
  const lastName = profileForm.watch('last_name');

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <section className='h-max !max-w-[853px] p-2 sm:p-8 md:rounded-[32px] md:border md:border-[#E3E8EF] md:bg-white md:p-6 md:shadow-[0_20px_60px_rgba(15,23,42,0.06)]'>
      {/* Top right joined badge */}
      <div className='mb-2 flex justify-end'>
        <Badge className='rounded-xl border-none bg-[#F8F7FB] px-3 py-1.5 text-[11px] font-medium text-[#8F90A6] shadow-none'>
          Joined{' '}
          <span className='ml-1.5 font-semibold text-[#0F172B]'>
            {joinDateLabel}
          </span>
        </Badge>
      </div>

      <div className='flex flex-col items-center gap-4 border-b border-[#F1F5F9] pb-4 md:pb-8'>
        <div className='relative'>
          <Avatar className='h-20 w-20 ring-[6px] ring-[#F8F7FB]'>
            <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
            <AvatarFallback className='bg-[#EEF2FF] text-xl font-semibold text-[#4C1D95]'>
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
          size='sm'
          className='rounded-xl border border-[#E3E8EF] bg-[#F8F7FB] px-5 py-2 text-[13px] font-medium text-[#551FB9] shadow-none hover:bg-[#F8F7FB]/80 max-md:py-4'
          onClick={() => fileInputRef.current?.click()}
        >
          Change profile
        </Button>
      </div>

      <form onSubmit={onSubmit}>
        <h3 className='mb-4 mt-8 text-sm font-semibold text-[#0F172B] md:text-base'>
          Account Management
        </h3>

        <div className='grid gap-5 sm:grid-cols-2'>
          <Input
            label='First name'
            placeholder='Enter first name'
            {...profileForm.register('first_name')}
            haserror={!!profileForm.formState.errors.first_name}
            errormessage={profileForm.formState.errors.first_name?.message}
          />
          <Input
            label='Last name'
            placeholder='Enter last name'
            {...profileForm.register('last_name')}
            haserror={!!profileForm.formState.errors.last_name}
            errormessage={profileForm.formState.errors.last_name?.message}
          />
          <Input
            label='Email address'
            containerClassName='sm:col-span-2'
            value={email}
            readOnly
            disabled
            placeholder='Email address'
          />
          <div className='flex flex-col gap-3 sm:col-span-2'>
            <Input
              label='Password'
              containerClassName='w-full'
              type='password'
              value='******************'
              readOnly
              disabled
            />
            <Button
              type='button'
              size='sm'
              className='w-fit rounded-xl border border-[#E3E8EF] bg-[#F8F7FB] px-5 py-2 text-[13px] font-medium text-[#551FB9] shadow-none hover:bg-[#F8F7FB]/80'
              onClick={onOpenPasswordPanel}
            >
              Change password
            </Button>
          </div>
        </div>

        <Button
          type='submit'
          size='lg'
          className={cn(
            'mt-8 w-full max-w-[400px] rounded-xl py-[14px] text-[0.9rem] font-medium shadow-none transition-all max-md:mb-12 md:rounded-2xl md:text-base md:font-semibold',
            !profileForm.formState.isDirty && !selectedImage
              ? 'bg-[#E3E8EF] text-[#8F90A6] hover:bg-[#E3E8EF]'
              : 'bg-[#551FB9] text-white hover:bg-[#551FB9]/90'
          )}
          disabled={!profileForm.formState.isDirty && !selectedImage}
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
