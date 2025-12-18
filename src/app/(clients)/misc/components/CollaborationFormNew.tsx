'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Textarea, Button } from '@/components/ui';
import {
  useCreateCollaboration,
  useCurrentUser,
  useReplaceCollaborationBusinesses,
  useSendInvitation,
} from '../api';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { PlusIcon, TrashIcon } from '@/assets/icons';
import { toast } from 'sonner';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import CollaborationFormBusinessSelector from './CollaborationFormBusinessSelector';
import { useBooleanStateControl } from '@/hooks';
import { useSavedBusinessesContext } from '@/contexts/SavedBusinessesContext';
import FeaturedListingCard from './ListingCard';
import { useRouter } from 'next/navigation';

const collaborationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  business_ids: z.array(z.number()).default([]).optional(),
});
type CollaborationFormData = z.infer<typeof collaborationSchema>;

export default function CollaborationForm() {
  const {
    register,
    getValues,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CollaborationFormData>({
    resolver: zodResolver(collaborationSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });
  const { data: currentUser } = useCurrentUser(true);
  const [emailToInvite, setEmailToInvite] = React.useState('');
  const [isEditingEmailInvite, setIsEditingEmailInvite] = React.useState(false);
  const [invitedMembers, setInvitedMembers] = React.useState<
    Array<{ email: string; status: 'Pending'; priviledge: string }>
  >([]);
  const { mutate: sendInvitation, isPending: isSendingInvite } =
    useSendInvitation();
  const { mutate: createCollaboration, isPending: isCreatingColabo } =
    useCreateCollaboration();
  const {
    state: isBusinessSelectorModalOpen,
    setTrue: openBusinessSelectorModal,
    setFalse: closeBusinessSelectorModal,
  } = useBooleanStateControl();

  const { savedBusinesses } = useSavedBusinessesContext();
  const selectedSavedBusiness = useMemo(() => {
    const businessIds = watch('business_ids') || [];
    return savedBusinesses.filter(business =>
      businessIds.includes(business.id)
    );
  }, [savedBusinesses, watch('business_ids')]);
  const { mutateAsync: updateCCollabBusinesses } =
    useReplaceCollaborationBusinesses();

  const router = useRouter();

  const handleAddInvite = () => {
    if (!emailToInvite.trim()) {
      toast.error('Please enter an email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToInvite)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Check if email already invited
    if (invitedMembers.some(member => member.email === emailToInvite)) {
      toast.error('This email has already been invited.');
      return;
    }

    // Add to invited members list for preview
    setInvitedMembers(prev => [
      ...prev,
      { email: emailToInvite, status: 'Pending', priviledge: 'Member' },
    ]);
    setEmailToInvite('');
    setIsEditingEmailInvite(false);
    toast.success('Member added to invite list!');
  };

  const removeInvitedMember = (email: string) => {
    setInvitedMembers(prev => prev.filter(member => member.email !== email));
    toast.success('Member removed from invite list.');
  };

  const onSubmit = async () => {
    const data = getValues();
    const valid = await trigger();

    if (!valid) return;

    createCollaboration(data, {
      onSuccess: async collabResponse => {
        const collabId = collabResponse.data.id;

        try {
          // Step 1: Update businesses if any were selected
          if ((watch('business_ids') ?? []).length > 0) {
            await updateCCollabBusinesses({
              collab_id: collabId,
              business_ids: watch('business_ids') || [],
            });
          }

          // Step 2: Send invitations to all invited members
          if (invitedMembers.length > 0) {
            const invitePromises = invitedMembers.map(member =>
              new Promise((resolve, reject) => {
                sendInvitation(
                  {
                    email: member.email,
                    collab_id: collabId,
                  },
                  {
                    onSuccess: () => resolve(member.email),
                    onError: () => reject(member.email),
                  }
                );
              })
            );

            // Wait for all invitations to be sent
            await Promise.allSettled(invitePromises);
          }

          toast.success('Collaboration created successfully!');
          router.push(`/businesses/saved/collaboration/${collabId}/edit`);
        } catch (error) {
          toast.error('Collaboration created but some operations failed.');
          router.push(`/businesses/saved/collaboration/${collabId}/edit`);
        }
      },
      onError: () => {
        toast.error('Failed to create collaboration. Please try again.');
      },
    });
  };

  return (
    <div className='grid h-screen w-full grid-rows-[max-content,1fr] gap-3 overflow-hidden py-8 xl:pb-12 xl:pt-28'>
      <header className='mx-auto flex w-full container items-center justify-between px-4'>
        <Link href='/businesses/saved/collaboration' className='flex items-center gap-2'>
          <ChevronLeft className='size-6 cursor-pointer text-gray-700 hover:text-gray-900' />
          Back
        </Link>

        <Button
          size='dynamic_lg'
          onClick={onSubmit}
          disabled={isSubmitting || !isValid}
          className='bg-[#551FB9]'
          isLoading={isCreatingColabo || isSendingInvite}
        >
          Save and Create
        </Button>
      </header>
      <section className='mx-auto grid w-full container gap-8 overflow-hidden px-4 xl:grid-cols-2 xl:gap-16'>
        <form className='flex flex-col gap-4'>
          <h1 className='mb-2 text-base font-semibold md:text-lg'>
            Collaborate With Your Crew
          </h1>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700'
            >
              Group Name
            </label>
            <Input
              id='name'
              {...register('name')}
              placeholder='Enter group name'
              className='mt-1'
              haserror={!!errors.name}
            />
            {errors.name && (
              <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700'
            >
              Description
            </label>
            <Textarea
              id='description'
              {...register('description')}
              placeholder='Enter description'
              rows={5}
              className='mt-1'
              haserror={!!errors.description}
              errormessage={errors.description?.message}
            />
          </div>

          <section className='mt-4'>
            <h5 className='mb-2 text-sm font-medium'>Group Members</h5>
            <div className='custom-scrollbar max-h-[400px] space-y-3 overflow-y-auto'>
              {/* Owner */}
              <div className='flex items-center justify-between rounded-md bg-[#FFFFFF] px-3 py-2'>
                <div className='flex items-center gap-3'>
                  <img
                    src={
                      currentUser?.user.profile_image ||
                      '/collaboration/user_1.png'
                    }
                    alt={`${currentUser?.user.first_name} ${currentUser?.user.last_name}`}
                    className='size-6 md:size-10 rounded-full object-cover'
                  />
                  <span className='text-[0.625rem] lg:text-xs'>
                    {currentUser?.user.first_name} {currentUser?.user.last_name}
                  </span>
                </div>
                <span className='rounded-md bg-[#FEFDF0] px-3 py-2 text-[0.625rem] lg:text-xs font-medium text-yellow-600'>
                  Owner
                </span>
                <span className='flex items-center gap-2 text-[0.8rem] text-[#9AA4B2]'>
                  <svg
                    width='15'
                    height='15'
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.03567 9.70905C7.88475 9.7783 7.70719 9.81292 7.503 9.81292C7.29703 9.81292 7.1177 9.77741 6.965 9.70639C6.81408 9.63537 6.69689 9.53682 6.61344 9.41076C6.52999 9.28291 6.48915 9.13554 6.49093 8.96864C6.48915 8.79463 6.53176 8.64105 6.61877 8.50788C6.70755 8.37294 6.82828 8.26729 6.98098 8.19094C7.13368 8.11459 7.30769 8.07642 7.503 8.07642C7.69654 8.07642 7.86877 8.11459 8.01969 8.19094C8.17239 8.26729 8.29224 8.37294 8.37924 8.50788C8.46802 8.64105 8.5133 8.79463 8.51507 8.96864C8.5133 9.13554 8.47069 9.28291 8.38723 9.41076C8.30378 9.5386 8.18659 9.63803 8.03567 9.70905Z'
                      fill='#9AA4B2'
                    />
                    <path
                      d='M7.94512 7.22681C7.81728 7.29428 7.6699 7.32801 7.503 7.32801C7.33432 7.32801 7.18429 7.29428 7.05289 7.22681C6.92328 7.15756 6.82118 7.06345 6.74661 6.94449C6.67381 6.82375 6.6383 6.68437 6.64007 6.52635C6.6383 6.37009 6.67292 6.23338 6.74395 6.11619C6.81674 5.99723 6.91795 5.90578 7.04757 5.84186C7.17896 5.77617 7.33077 5.74332 7.503 5.74332C7.67168 5.74332 7.82083 5.77617 7.95044 5.84186C8.08006 5.90578 8.18127 5.99723 8.25407 6.11619C8.32686 6.23338 8.36415 6.37009 8.36593 6.52635C8.36415 6.68437 8.32598 6.82375 8.2514 6.94449C8.17683 7.06523 8.07473 7.15934 7.94512 7.22681Z'
                      fill='#9AA4B2'
                    />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M4.3125 0H10.6875V2.25C10.6875 2.56066 10.9393 2.8125 11.25 2.8125C11.5607 2.8125 11.8125 2.56066 11.8125 2.25V0H12C13.6569 0 15 1.34315 15 3V11.25C15 12.9069 13.6569 14.25 12 14.25H3C1.34315 14.25 0 12.9069 0 11.25V3C0 1.34315 1.34315 0 3 0H3.1875V2.25C3.1875 2.56066 3.43934 2.8125 3.75 2.8125C4.06066 2.8125 4.3125 2.56066 4.3125 2.25V0ZM6.44831 10.3749C6.75549 10.5081 7.10705 10.5746 7.503 10.5746C7.89718 10.5746 8.24608 10.5081 8.5497 10.3749C8.8551 10.2417 9.0948 10.0597 9.2688 9.8289C9.44281 9.5963 9.52981 9.33263 9.52981 9.03789C9.52981 8.80884 9.47832 8.59843 9.37534 8.40667C9.27413 8.21491 9.13741 8.05511 8.96518 7.92727C8.79473 7.79765 8.60297 7.71509 8.3899 7.67958V7.64229C8.66511 7.58015 8.88972 7.43721 9.06372 7.21349C9.23951 6.98799 9.3274 6.72787 9.3274 6.43313C9.3274 6.15259 9.2475 5.90223 9.0877 5.68206C8.92967 5.46189 8.71305 5.28877 8.43784 5.16271C8.1644 5.03487 7.85279 4.97095 7.503 4.97095C7.14966 4.97095 6.83539 5.03487 6.56017 5.16271C6.28496 5.28877 6.06834 5.46189 5.91032 5.68206C5.75229 5.90223 5.67417 6.15259 5.67594 6.43313C5.67417 6.72787 5.75939 6.98799 5.93162 7.21349C6.10563 7.43721 6.3329 7.58015 6.61344 7.64229V7.67958C6.40037 7.71509 6.20684 7.79765 6.03283 7.92727C5.8606 8.05511 5.72388 8.21491 5.62267 8.40667C5.52147 8.59843 5.47175 8.80884 5.47353 9.03789C5.47175 9.33263 5.55698 9.5963 5.72921 9.8289C5.90321 10.0597 6.14292 10.2417 6.44831 10.3749Z'
                      fill='#9AA4B2'
                    />
                  </svg>

                  {format(new Date(), 'MM-dd-yyyy')}
                </span>
                <span className='text-[0.625rem] lg:text-xs capitalize text-primary'>
                  Active
                </span>
              </div>

              {/* Pending Invited Members */}
              {invitedMembers.map((member, idx) => (
                <div
                  key={`pending-${idx}`}
                  className='flex items-center justify-between rounded-md bg-white px-3 py-2'
                >
                  <div className='flex items-center gap-3'>
                    <img
                      src='/collaboration/user_1.png'
                      alt={member.email}
                      className='size-6 md:size-10 rounded-full object-cover'
                    />
                    <span className='text-[0.625rem] lg:text-xs text-gray-600'>
                      {member.email}
                    </span>
                  </div>
                  <span className='rounded-md bg-[#FEFDF0] px-3 py-2 text-[0.625rem] lg:text-xs font-medium text-yellow-600'>
                    {member.priviledge}
                  </span>

                  <span className='flex items-center gap-2'>
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      className='size-3 md:size-5'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 7C12.75 6.58579 12.4142 6.25 12 6.25C11.5858 6.25 11.25 6.58579 11.25 7V13C11.25 13.4142 11.5858 13.75 12 13.75H16C16.4142 13.75 16.75 13.4142 16.75 13C16.75 12.5858 16.4142 12.25 16 12.25H12.75V7Z'
                        fill='#A09DA6'
                      />
                    </svg>

                    <span className='rounded bg-gray-200 px-2 py-1 text-[0.625rem] lg:text-xs text-gray-500'>
                      Invited
                    </span>
                  </span>
                  <button
                    type='button'
                    onClick={() => removeInvitedMember(member.email)}
                    className='text-red-500 hover:text-red-700'
                  >
                    <TrashIcon className='size-4' />
                  </button>
                </div>
              ))}
            </div>
            {isEditingEmailInvite ? (
              <div className='mt-2.5 flex w-full items-center gap-3 rounded-xl border p-1 pl-2'>
                <button
                  type='button'
                  onClick={() => {
                    setIsEditingEmailInvite(false);
                    setEmailToInvite('');
                  }}
                  className='flex-shrink-0 text-gray-500 hover:text-gray-700'
                >
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M15 5L5 15M5 5L15 15'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
                <Input
                  defaultValue={emailToInvite}
                  onChange={e => setEmailToInvite(e.target.value)}
                  placeholder='enter email to send an invite'
                  className='!px-2'
                  size='sm'
                  variant='ghost'
                  containerClassName='flex-1 px-2'
                />
                <Button
                  type='button'
                  size='default'
                  onClick={handleAddInvite}
                  className='flex-shrink-0'
                  disabled={
                    isSubmitting ||
                    !emailToInvite.trim() ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToInvite)
                  }
                >
                  Add Invite
                </Button>
              </div>
            ) : (
              <Button
                size='dynamic_lg'
                variant='colored_outline'
                type='button'
                className='mt-2.5'
                icon={<PlusIcon className='!size-3' />}
                onClick={() => setIsEditingEmailInvite(true)}
                iconPosition='right'
              >
                Add team members
              </Button>
            )}
          </section>

          <section className='mt-4'>
            <h5 className='text-sm font-medium'>Group Listings</h5>
            <Button
              size='dynamic_lg'
              variant='colored_outline'
              type='button'
              className='mt-2.5'
              icon={<PlusIcon className='!size-3' />}
              onClick={openBusinessSelectorModal}
              iconPosition='right'
            >
              Add listings
            </Button>
          </section>
        </form>

        <article className='custom-scrollbar flex flex-col overflow-y-auto rounded-lg bg-[#FFFFFF] p-5 xl:h-full'>
          {/* Preview Header */}
          <div className='mb-5 flex items-center justify-between border-b pb-3'>
            <h2 className='text-xl font-bold text-[#0D121C]'>Preview</h2>
            <button
              type='button'
              onClick={() => {
                setInvitedMembers([]);
              }}
              className='text-sm text-[#9AA4B2] hover:text-[#0D121C]'
            >
              Clear
            </button>
          </div>

          {/* Group Name Section */}
          <div className='mb-4'>
            <h3 className='mb-1.5 text-xs font-normal text-[#9AA4B2]'>
              Group name
            </h3>
            {watch('name') ? (
              <p className='text-base font-semibold text-[#0D121C]'>
                {watch('name')}
              </p>
            ) : (
              <div className='space-y-2'>
                <div className='h-4 w-1/2 rounded bg-gray-200'></div>
              </div>
            )}
          </div>

          {/* Group Description Section */}
          <div className='mb-4'>
            <h3 className='mb-1.5 text-xs font-normal text-[#9AA4B2]'>
              Group description
            </h3>
            {watch('description') ? (
              <p className='min-h-16 text-base font-normal leading-relaxed text-[#0D121C]'>
                {watch('description')}
              </p>
            ) : (
              <div className='space-y-2'>
                <div className='h-4 w-full rounded bg-gray-200'></div>
                <div className='h-4 w-full rounded bg-gray-200'></div>
                <div className='h-4 w-1/2 rounded bg-gray-200'></div>
              </div>
            )}
          </div>

          {/* Group Members Section */}
          {(currentUser || invitedMembers.length > 0) && (
            <div className='mb-4'>
              <h3 className='mb-3 text-xs font-normal text-[#9AA4B2]'>
                Group Members
              </h3>
              <div className='space-y-3'>
                {/* Owner */}
                {currentUser && (
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <img
                        src={
                          currentUser?.user.profile_image ||
                          '/collaboration/user_1.png'
                        }
                        alt={`${currentUser?.user.first_name} ${currentUser?.user.last_name}`}
                        className='size-6 md:size-10 rounded-full object-cover'
                      />
                      <span className='text-[0.6125rem] lg:text-xs font-normal text-[#0D121C]'>
                        {currentUser?.user.first_name}{' '}
                        {currentUser?.user.last_name}
                      </span>
                    </div>
                    <span className='rounded-md bg-[#F8FAFC] px-3 py-2 text-[0.6125rem] lg:text-xs font-normal text-[#0D121C]'>
                      Owner
                    </span>
                    <span className='text-[0.6125rem] lg:text-xs font-normal text-[#4F5E71]'>
                      Joined {format(new Date(), 'MM-d-yyyy')}
                    </span>
                    <span className='text-[0.6125rem] lg:text-xs font-normal text-[#7C3AED]'>
                      Active
                    </span>
                  </div>
                )}
                {/* Invited Members */}
                {invitedMembers.map((member, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded-md bg-[#F8FAFC] px-3 py-2'
                  >
                    <div className='flex items-center gap-3'>
                      <img
                        src='/collaboration/user_1.png'
                        alt={member.email}
                        className='size-6 md:size-10 rounded-full object-cover'
                      />
                      <span className='text-[0.6125rem] lg:text-xs font-normal text-[#0D121C]'>
                        {(() => {
                          const username = member.email.split('@')[0];
                          return username && username.length > 15
                            ? username.substring(0, 15) + '...'
                            : username || member.email;
                        })()}
                      </span>
                    </div>
                    <span className='rounded-md bg-white p-1 md:px-2 text-[0.6125rem] lg:text-xs font-normal text-[#0D121C]'>
                      Member
                    </span>
                    <span className='text-[0.625rem] lg:text-xs font-normal text-[#4F5E71]'>
                      Joined {format(new Date(), 'MM-d-yyyy')}
                    </span>
                    <span className='text-[0.625rem] lg:text-xs font-normal text-[#9AA4B2]'>
                      {member.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group Listings Section */}
          {Array.isArray(watch('business_ids')) &&
            (watch('business_ids')?.length ?? 0) > 0 && (
              <div>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-sm font-normal text-[#9AA4B2]'>
                    Group Listings
                  </h3>
                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      className='text-[#9AA4B2] hover:text-[#0D121C]'
                    >
                      <svg
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M12 8L8 12M8 8L12 12'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                        />
                      </svg>
                    </button>
                    <button
                      type='button'
                      className='text-[#9AA4B2] hover:text-[#0D121C]'
                    >
                      <svg
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M8 12L12 8M12 12L8 8'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2'>
                  {selectedSavedBusiness.map(business => (
                    <div className='max-md:px-8 md:basis-1/2 lg:basis-1/2'>
                      <FeaturedListingCard
                        key={business.id}
                        business={business}
                        isSelectable={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
        </article>
      </section>

      <CollaborationFormBusinessSelector
        selectedBusinesses={watch('business_ids') ?? []}
        setSelectedBusinesses={(businesses: number[]) => {
          setValue('business_ids', businesses);
        }}
        isBusinessSelectorModalOpen={isBusinessSelectorModalOpen}
        closeBusinessSelectorModal={closeBusinessSelectorModal}
      />
    </div>
  );
}
