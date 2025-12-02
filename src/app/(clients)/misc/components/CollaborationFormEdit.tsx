'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Textarea, Button } from '@/components/ui';
import {
  useCollaboration,
  useCreateCollaboration,
  useCurrentUser,
  useSendInvitation,
} from '../api';
import { format } from 'date-fns';
import { BusinessDetail } from '@/types/api';
import React, { useMemo } from 'react';
import { PlusIcon, TrashIcon } from '@/assets/icons';
import { toast } from 'sonner';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import CollaborationFormBusinessSelector from './CollaborationFormBusinessSelector';
import { useBooleanStateControl } from '@/hooks';
import { useSavedBusinessesContext } from '@/contexts/SavedBusinessesContext';
import FeaturedListingCard from './ListingCard';

const collaborationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  business_ids: z.array(z.number()).default([]).optional(),
});
type CollaborationFormData = z.infer<typeof collaborationSchema>;

export default function CollaborationForm() {
  const collab_id = useParams()['collabId'] as string;
  const { data: collabData } = useCollaboration(collab_id);
  const {
    register,
    getValues,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CollaborationFormData>({
    resolver: zodResolver(collaborationSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const {
    state: isBusinessSelectorModalOpen,
    setTrue: openBusinessSelectorModal,
    setFalse: closeBusinessSelectorModal,
  } = useBooleanStateControl();
  const { data: currentUser } = useCurrentUser(true);
  const [emailToInvite, setEmailToInvite] = React.useState('');
  const [isEditingEmailInvite, setIsEditingEmailInvite] = React.useState(false);
  const [invitedMembers, setInvitedMembers] = React.useState<
    Array<{ email: string; status: 'Pending' }>
  >([]);
  const { mutate: sendInvitation, isPending: isSendingInvite } =
    useSendInvitation();
  const { mutate: createCollaboration, isPending: isCreatingColabo } =
    useCreateCollaboration();
  const { savedBusinesses } = useSavedBusinessesContext();
  const selectedSavedBusiness = useMemo(() => {
    const businessIds = watch('business_ids') || [];
    return savedBusinesses.filter(business =>
      businessIds.includes(business.id)
    );
  }, [savedBusinesses, watch('business_ids')]);

  const onSubmit = async (where_from?: 'submit' | 'invite') => {
    if (where_from === 'invite') {
      if (!emailToInvite.trim()) {
        toast.error('Please enter an email address.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailToInvite)) {
        toast.error('Please enter a valid email address.');
        return;
      }

      if (
        !watch('name') ||
        watch('name')?.trim() == '' ||
        !watch('description') ||
        watch('description')?.trim() == ''
      ) {
        toast.error("Can't send invite without group name and description.", {
          description: 'Please fill out the group name and description first.',
          icon: <TrashIcon className='size-5 text-red-600' />,
        });
        return;
      }

      // Add to invited members list for preview
      setInvitedMembers(prev => [
        ...prev,
        { email: emailToInvite, status: 'Pending' },
      ]);
      setEmailToInvite('');
      setIsEditingEmailInvite(false);
      toast.success('Member added to preview!');
      return;
    }

    const data = getValues();
    const valid = await trigger();

    if (!valid) return;
    createCollaboration(data, {
      onSuccess: data => {
        toast.success('Collaboration created successfully!');
        // Send invitations to all invited members
        invitedMembers.forEach(member => {
          sendInvitation(
            {
              email: member.email,
              collab_id: data.data.id,
            },
            {
              onSuccess: () => {
                toast.success(`Invitation sent to ${member.email}!`);
              },
            }
          );
        });
      },
      onError: () => {
        toast.error('Failed to create collaboration. Please try again.');
      },
    });
  };

  return (
    <div className='grid h-screen w-full grid-rows-[max-content,1fr] gap-3 overflow-hidden py-8 xl:pb-12 xl:pt-28'>
      <header className='mx-auto flex w-full max-w-[1356px] items-center justify-between px-4'>
        <Link href='/misc/collaborations' className='flex items-center gap-2'>
          <ChevronLeft className='size-6 cursor-pointer text-gray-700 hover:text-gray-900' />
          Back
        </Link>

        <Button
          size='dynamic_lg'
          onClick={() => onSubmit('submit')}
          disabled={isSubmitting || !isValid}
          className='bg-[#551FB9]'
          isLoading={isCreatingColabo || isSendingInvite}
        >
          Save and Create
        </Button>
      </header>
      <section className='mx-auto grid w-full max-w-[1356px] gap-8 px-4 xl:grid-cols-2 xl:gap-16'>
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
            <h5 className='text-sm font-medium'>Group Members</h5>
            <div className='custom-scrollbar max-h-[400px] space-y-4 overflow-y-auto pl-4'>
              <div className='flex items-center justify-between border-b py-3'>
                <div className='flex items-center gap-3'>
                  <img
                    src={
                      currentUser?.user.profile_image ||
                      '/collaboration/user_1.png'
                    }
                    alt={`${currentUser?.user.first_name} ${currentUser?.user.last_name}`}
                    className='h-10 w-10 rounded-full'
                  />
                  <span>
                    {currentUser?.user.first_name} {currentUser?.user.last_name}
                  </span>
                </div>
                <span className='text-sm text-yellow-600'>Owner</span>
                <span className='text-sm text-gray-500'>
                  {format(new Date(), 'MM-dd-yyyy')}
                </span>
                <span className='text-sm text-purple-600'>Active</span>
              </div>
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
                  onClick={() => onSubmit('invite')}
                  className='flex-shrink-0'
                  disabled={
                    isSubmitting ||
                    !emailToInvite.trim() ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToInvite)
                  }
                >
                  Send Invite
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
                reset();
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
                        className='h-10 w-10 rounded-full object-cover'
                      />
                      <span className='text-sm font-normal text-[#0D121C]'>
                        {currentUser?.user.first_name}{' '}
                        {currentUser?.user.last_name}
                      </span>
                    </div>
                    <div className='flex items-center gap-8'>
                      <span className='text-sm font-normal text-[#0D121C]'>
                        Owner
                      </span>
                      <span className='text-sm font-normal text-[#4F5E71]'>
                        Joined {format(new Date(), 'MM-d-yyyy')}
                      </span>
                      <span className='text-sm font-normal text-[#7C3AED]'>
                        Active
                      </span>
                    </div>
                  </div>
                )}
                {/* Invited Members */}
                {invitedMembers.map((member, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center gap-3'>
                      <img
                        src='/collaboration/user_1.png'
                        alt={member.email}
                        className='h-10 w-10 rounded-full object-cover'
                      />
                      <span className='text-sm font-normal text-[#0D121C]'>
                        {(() => {
                          const username = member.email.split('@')[0];
                          return username && username.length > 15
                            ? username.substring(0, 15) + '...'
                            : username || member.email;
                        })()}
                      </span>
                    </div>
                    <div className='flex items-center gap-8'>
                      <span className='text-sm font-normal text-[#0D121C]'>
                        Member
                      </span>
                      <span className='text-sm font-normal text-[#4F5E71]'>
                        Joined {format(new Date(), 'MM-d-yyyy')}
                      </span>
                      <span className='text-sm font-normal text-[#9AA4B2]'>
                        {member.status}
                      </span>
                    </div>
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
                <div className='flex gap-4 overflow-x-auto'>
                 {
                  selectedSavedBusiness.map((business) => (
                    <FeaturedListingCard
                      key={business.id}
                      business={business}
                      isSelectable={true}
                    />
                  ))
                 }
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
