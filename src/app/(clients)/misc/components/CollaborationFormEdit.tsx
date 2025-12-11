'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Input,
  Textarea,
  Button,
  EmptyState,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui';
import {
  useCollaboration,
  useUpdateCollaboration,
  useCurrentUser,
  useReplaceCollaborationBusinesses,
  useSendInvitation,
  useUpdateMemberPrivilege,
  useRemoveCollaborationBusiness,
  useRemoveCollaborationMember,
} from '../api';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { LogoLoadingIcon, PlusIcon, TrashIcon } from '@/assets/icons';
import { toast } from 'sonner';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import CollaborationFormBusinessSelector from './CollaborationFormBusinessSelector';
import { useBooleanStateControl } from '@/hooks';
import { useSavedBusinessesContext } from '@/contexts/SavedBusinessesContext';
import FeaturedListingCard from './ListingCard';
import { EmptyListingIcon } from '../icons';
import ConfirmationModal, {
  useConfirmationModal,
} from '@/components/ui/ConfirmationModal';
import { CollabMember } from '@/types/api';

const collaborationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  business_ids: z.array(z.number()).default([]).optional(),
});
type CollaborationFormData = z.infer<typeof collaborationSchema>;

export default function CollaborationForm() {
  const collab_id = useParams()['collabId'] as string;
  const { data: collabData, isLoading, refetch } = useCollaboration(collab_id);
  const { mutate: updateMemberPrivilege } = useUpdateMemberPrivilege();
  const { mutate: updateCCollabBusinesses } =
    useReplaceCollaborationBusinesses();
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
    Array<{ email: string; status: 'Pending'; priviledge: string }>
  >([]);
  const [existingMembers, setExistingMembers] = React.useState<
    Array<CollabMember>
  >([]);
  const { mutate: sendInvitation, isPending: isSendingInvite } =
    useSendInvitation();
  const { mutate: updateCollaboration, isPending: isUpdatingCollab } =
    useUpdateCollaboration();
  const { savedBusinesses } = useSavedBusinessesContext();
  const deleteConfirmation = useConfirmationModal();
  const { mutate: removeBusinessFromCollab, isPending: isRemovingBusiness } =
    useRemoveCollaborationBusiness();
  const { mutate: removeMemberFromCollab, isPending: isRemovingMember } =
    useRemoveCollaborationMember();
  const selectedSavedBusiness = useMemo(() => {
    const businessIds = watch('business_ids') || [];
    return savedBusinesses.filter(business =>
      businessIds.includes(business.id)
    );
  }, [savedBusinesses, watch('business_ids')]);

  // Initialize form with collabData
  React.useEffect(() => {
    if (collabData?.data) {
      reset({
        name: collabData.data.name || '',
        description: collabData.data.description || '',
        business_ids: collabData.data.businesses?.map((b: any) => b.id) || [],
      });

      // Reset invitedMembers - only for newly entered emails (not from backend)
      setInvitedMembers([]);

      // Set all existing members (including pending) from backend (excluding owner)
      const allMembers =
        collabData.data.members
          ?.filter(m => m.priviledge !== 'owner')
          
      setExistingMembers(allMembers);
    }
  }, [collabData, reset]);

  const handleRemoveBusinessClick = (businessId: number) => {
    deleteConfirmation.openConfirmation({
      title: 'Remove Listing',
      description:
        'Are you sure you want to remove this listing from the group? This action will detach it from the collaboration.',
      confirmText: 'Remove',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: () => {
        removeBusinessFromCollab(
          { collab_id, business_id: businessId },
          {
            onSuccess: () => {
              toast.success('Listing removed from collaboration');
              refetch();
              deleteConfirmation.closeConfirmation();
            },
            onError: () => {
              toast.error('Failed to remove listing');
            },
          }
        );
      },
    });
  };

  const handleRemoveMemberClick = (memberId: number, memberName: string) => {
    deleteConfirmation.openConfirmation({
      title: 'Remove Member',
      description: `Are you sure you want to remove ${memberName} from this collaboration?`,
      confirmText: 'Remove',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: () => {
        removeMemberFromCollab(
          { member_id: memberId },
          {
            onSuccess: () => {
              toast.success('Member removed from collaboration');
              // Update local state
              setExistingMembers(prev => prev.filter(m => m.member?.id !== memberId));
              refetch();
              deleteConfirmation.closeConfirmation();
            },
            onError: () => {
              toast.error('Failed to remove member');
            },
          }
        );
      },
    });
  };
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
        { email: emailToInvite, status: 'Pending', priviledge: 'Member' },
      ]);
      setEmailToInvite('');
      setIsEditingEmailInvite(false);
      toast.success('Member added to preview!');
      return;
    }

    const data = getValues();
    const valid = await trigger();

    if (!valid) return;

    // Update collaboration name/description
    updateCollaboration(
      {
        collab_id,
        name: data.name,
        description: data.description,
      },
      {
        onSuccess: () => {
          toast.success('Collaboration updated successfully!');
          refetch();
          // Update businesses
          updateCCollabBusinesses(
            {
              collab_id,
              business_ids: data.business_ids || [],
            },
            {
              onSuccess: () => {
                toast.success('Businesses updated!');
                refetch();
              },
              onError: () => {
                toast.error('Failed to update businesses.');
              },
            }
          );

          // Send invitations to newly added members (only new emails, not from backend)
          if (invitedMembers.length > 0) {
            invitedMembers.forEach(member => {
              sendInvitation(
                {
                  email: member.email,
                  collab_id,
                },
                {
                  onSuccess: () => {
                    toast.success(`Invitation sent to ${member.email}!`);
                    // Clear invited members after successful send
                    setInvitedMembers([]);
                    refetch();
                  },
                  onError: () => {
                    toast.error(`Failed to send invite to ${member.email}`);
                  },
                }
              );
            });
          }
        },
        onError: () => {
          toast.error('Failed to update collaboration. Please try again.');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <LogoLoadingIcon />
      </div>
    );
  }

  if (!collabData?.data) {
    return (
      <EmptyState
        media={<EmptyListingIcon />}
        title='Collaboration Not Found'
        description='The collaboration you are trying to edit does not exist.'
      />
    );
  }

  return (
    <div className='w-full gap-3 py-8 pt-16 lg:grid lg:h-screen lg:grid-rows-[max-content,1fr] lg:overflow-hidden xl:pb-12 xl:pt-28'>
      <header className='mx-auto flex w-full max-w-[1356px] items-center justify-between px-4'>
        <Link href='/businesses/saved/collaboration' className='flex items-center gap-2'>
          <ChevronLeft className='size-6 cursor-pointer text-gray-700 hover:text-gray-900' />
          Back
        </Link>

        <Button
          size='dynamic_lg'
          onClick={() => onSubmit('submit')}
          disabled={isSubmitting || !isValid}
          className='bg-[#551FB9]'
          isLoading={isUpdatingCollab || isSendingInvite}
        >
          Save Changes
        </Button>
      </header>
      <section className='mx-auto grid w-full max-w-[1356px] gap-8 overflow-hidden px-4 xl:grid-cols-2 xl:gap-16'>
        <form className='custom-scrollbar flex flex-col gap-4 overflow-scroll rounded-lg pl-4 lg:h-full'>
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
            <div className='custom-scrollbar max-h-[400px] space-y-3 overflow-y-auto pl-4'>
              {/* Owner */}
              <div className='flex items-center justify-between rounded-md bg-[#FFFFFF] px-3 py-2'>
                <div className='flex items-center gap-3'>
                  <img
                    src={
                      collabData?.data?.owner?.profile_image ||
                      '/collaboration/user_1.png'
                    }
                    alt={`${collabData?.data?.owner?.first_name} ${collabData?.data?.owner?.last_name}`}
                    className='size-6 rounded-full object-cover md:size-10'
                  />
                  <span className='text-[0.625rem] lg:text-xs'>
                    {collabData?.data?.owner?.first_name}{' '}
                    {collabData?.data?.owner?.last_name}
                  </span>
                </div>
                <span className='rounded-md bg-[#FEFDF0] px-3 py-2 text-[0.625rem] font-medium text-yellow-600 lg:text-xs'>
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
                      clip-rule='evenodd'
                      d='M4.3125 0H10.6875V2.25C10.6875 2.56066 10.9393 2.8125 11.25 2.8125C11.5607 2.8125 11.8125 2.56066 11.8125 2.25V0H12C13.6569 0 15 1.34315 15 3V11.25C15 12.9069 13.6569 14.25 12 14.25H3C1.34315 14.25 0 12.9069 0 11.25V3C0 1.34315 1.34315 0 3 0H3.1875V2.25C3.1875 2.56066 3.43934 2.8125 3.75 2.8125C4.06066 2.8125 4.3125 2.56066 4.3125 2.25V0ZM6.44831 10.3749C6.75549 10.5081 7.10705 10.5746 7.503 10.5746C7.89718 10.5746 8.24608 10.5081 8.5497 10.3749C8.8551 10.2417 9.0948 10.0597 9.2688 9.8289C9.44281 9.5963 9.52981 9.33263 9.52981 9.03789C9.52981 8.80884 9.47832 8.59843 9.37534 8.40667C9.27413 8.21491 9.13741 8.05511 8.96518 7.92727C8.79473 7.79765 8.60297 7.71509 8.3899 7.67958V7.64229C8.66511 7.58015 8.88972 7.43721 9.06372 7.21349C9.23951 6.98799 9.3274 6.72787 9.3274 6.43313C9.3274 6.15259 9.2475 5.90223 9.0877 5.68206C8.92967 5.46189 8.71305 5.28877 8.43784 5.16271C8.1644 5.03487 7.85279 4.97095 7.503 4.97095C7.14966 4.97095 6.83539 5.03487 6.56017 5.16271C6.28496 5.28877 6.06834 5.46189 5.91032 5.68206C5.75229 5.90223 5.67417 6.15259 5.67594 6.43313C5.67417 6.72787 5.75939 6.98799 5.93162 7.21349C6.10563 7.43721 6.3329 7.58015 6.61344 7.64229V7.67958C6.40037 7.71509 6.20684 7.79765 6.03283 7.92727C5.8606 8.05511 5.72388 8.21491 5.62267 8.40667C5.52147 8.59843 5.47175 8.80884 5.47353 9.03789C5.47175 9.33263 5.55698 9.5963 5.72921 9.8289C5.90321 10.0597 6.14292 10.2417 6.44831 10.3749Z'
                      fill='#9AA4B2'
                    />
                  </svg>

                  {collabData?.data?.created_when
                    ? format(
                        new Date(collabData.data.created_when),
                        'MM-dd-yyyy'
                      )
                    : ''}
                </span>
                <span className='text-[0.625rem] capitalize text-primary lg:text-xs'>
                  Active
                </span>
              </div>

              {/* Existing Members (from backend - both accepted and pending) */}
              {existingMembers.map(member => (
                <div
                  key={member.member?.id}
                  className='flex items-center justify-between rounded-md bg-[#FFFFFF] px-3 py-2'
                >
                  <div className='flex items-center gap-3'>
                    <img
                      src={
                        member.member?.profile_image ||
                        '/collaboration/user_1.png'
                      }
                      alt={member.member ? `${member.member.first_name} ${member.member.last_name}` : member.unregistered_user_email || 'User'}
                      className='size-6 rounded-full object-cover md:size-10'
                    />
                    <span className='text-sm'>
                      {member.member 
                        ? `${member.member.first_name} ${member.member.last_name}`
                        : member.unregistered_user_email || 'Unknown'}
                    </span>
                  </div>
                  <div className='flex items-center gap-4'>
                    {member.status === 'pending' ? (
                      <span className='rounded-md bg-[#FEFDF0] px-3 py-2 text-[0.625rem] font-medium text-yellow-600 lg:text-xs'>
                        {member.priviledge}
                      </span>
                    ) : (
                      <select
                        value={member.priviledge}
                        onChange={e => {
                          const newRole = e.target.value;
                          updateMemberPrivilege(
                            { member_id: member.member?.id!, privilege: newRole },
                            {
                              onSuccess: () => {
                                toast.success('Member role updated!');
                                setExistingMembers(prev =>
                                  prev.map(m =>
                                    m.member?.id === member.member?.id
                                      ? { ...m, priviledge: newRole }
                                      : m
                                  )
                                );
                              },
                              onError: () => {
                                toast.error('Failed to update member role.');
                              },
                            }
                          );
                        }}
                        className='rounded border border-gray-300 px-2 py-1 text-[0.625rem] lg:text-xs'
                      >
                        <option value='contributor'>Contributor</option>
                        <option value='member'>Member</option>
                      </select>
                    )}
                    <span className='text-[0.625rem] text-gray-500 lg:text-xs'>
                      {member.accepted_when
                        ? format(new Date(member.accepted_when), 'MM-dd-yyyy')
                        : '-'}
                    </span>
                    <p className='flex items-center gap-2.5 text-[0.625rem] capitalize lg:text-xs' style={{ color: member.status === 'pending' ? '#9AA4B2' : '#7C3AED' }}>
                      {member.status}

                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <svg
                            width='3'
                            height='12'
                            viewBox='0 0 2 12'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M0.833333 1.67267C0.373096 1.67267 0 1.29957 0 0.839333V0.833333C0 0.373096 0.373096 0 0.833333 0C1.29357 0 1.66667 0.373096 1.66667 0.833333V0.839333C1.66667 1.29957 1.29357 1.67267 0.833333 1.67267Z'
                              fill='#4B5565'
                            />
                            <path
                              d='M0.833333 6.67267C0.373096 6.67267 0 6.29957 0 5.83933V5.83333C0 5.3731 0.373096 5 0.833333 5C1.29357 5 1.66667 5.3731 1.66667 5.83333V5.83933C1.66667 6.29957 1.29357 6.67267 0.833333 6.67267Z'
                              fill='#4B5565'
                            />
                            <path
                              d='M0 10.8393C0 11.2996 0.373096 11.6727 0.833333 11.6727C1.29357 11.6727 1.66667 11.2996 1.66667 10.8393V10.8333C1.66667 10.3731 1.29357 10 0.833333 10C0.373096 10 0 10.3731 0 10.8333V10.8393Z'
                              fill='#4B5565'
                            />
                          </svg>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align='end' className='w-40'>
                          <DropdownMenuItem
                            onClick={() =>
                              handleRemoveMemberClick(
                                member.member?.id!,
                                member.member ? `${member.member.first_name} ${member.member.last_name}` : member.unregistered_user_email || 'this member'
                              )
                            }
                          >
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </p>
                  </div>
                </div>
              ))}

              {/* Newly Invited Members (not yet sent to backend) */}
              {invitedMembers.map((member, idx) => (
                <div
                  key={`new-invite-${idx}`}
                  className='flex items-center justify-between rounded-md bg-white px-3 py-4'
                >
                  <div className='flex items-center gap-3'>
                    <img
                      src='/collaboration/user_1.png'
                      alt={member.email}
                      className='size-6 rounded-full object-cover md:size-10'
                    />
                    <span className='text-[0.625rem] text-gray-600 lg:text-xs'>
                      {member.email}
                    </span>
                  </div>
                  <span className='rounded-md bg-[#FEFDF0] px-3 py-2 text-[0.625rem] font-medium text-yellow-600 lg:text-xs'>
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
                        clip-rule='evenodd'
                        d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 7C12.75 6.58579 12.4142 6.25 12 6.25C11.5858 6.25 11.25 6.58579 11.25 7V13C11.25 13.4142 11.5858 13.75 12 13.75H16C16.4142 13.75 16.75 13.4142 16.75 13C16.75 12.5858 16.4142 12.25 16 12.25H12.75V7Z'
                        fill='#A09DA6'
                      />
                    </svg>

                    <span className='rounded bg-blue-100 px-2 py-1 text-[0.625rem] text-blue-600 lg:text-xs'>
                      Not Sent
                    </span>
                  </span>
                  <span className='text-[0.625rem] text-gray-400 lg:text-xs'>
                    -
                  </span>
                  <p className='flex items-center gap-2.5 text-[0.625rem] capitalize text-gray-500 lg:text-xs'>
                    {member.status}

                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <svg
                          width='3'
                          height='12'
                          viewBox='0 0 2 12'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M0.833333 1.67267C0.373096 1.67267 0 1.29957 0 0.839333V0.833333C0 0.373096 0.373096 0 0.833333 0C1.29357 0 1.66667 0.373096 1.66667 0.833333V0.839333C1.66667 1.29957 1.29357 1.67267 0.833333 1.67267Z'
                            fill='#4B5565'
                          />
                          <path
                            d='M0.833333 6.67267C0.373096 6.67267 0 6.29957 0 5.83933V5.83333C0 5.3731 0.373096 5 0.833333 5C1.29357 5 1.66667 5.3731 1.66667 5.83333V5.83933C1.66667 6.29957 1.29357 6.67267 0.833333 6.67267Z'
                            fill='#4B5565'
                          />
                          <path
                            d='M0 10.8393C0 11.2996 0.373096 11.6727 0.833333 11.6727C1.29357 11.6727 1.66667 11.2996 1.66667 10.8393V10.8333C1.66667 10.3731 1.29357 10 0.833333 10C0.373096 10 0 10.3731 0 10.8333V10.8393Z'
                            fill='#4B5565'
                          />
                        </svg>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align='end' className='w-40'>
                        <DropdownMenuItem
                          onClick={() => {
                            // Just remove from local state - not sent to backend yet
                            setInvitedMembers(prev =>
                              prev.filter((_, i) => i !== idx)
                            );
                            toast.success('Pending invitation removed');
                          }}
                        >
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </p>
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

        <article className='custom-scrollbar flex flex-col overflow-y-auto rounded-lg bg-[#FFFFFF] p-3 md:p-5 xl:h-full'>
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
            <h3 className='mb-1.5 text-[0.625rem] font-normal text-[#9AA4B2] lg:text-xs'>
              Group name
            </h3>
            {watch('name') ? (
              <p className='text-sm font-semibold text-[#0D121C] lg:text-base'>
                {watch('name')}
              </p>
            ) : (
              <div className='space-y-2'>
                <div className='h-2.5 w-1/2 rounded bg-gray-200 md:h-4'></div>
              </div>
            )}
          </div>

          {/* Group Description Section */}
          <div className='mb-4'>
            <h3 className='mb-1.5 text-[0.625rem] font-normal text-[#9AA4B2] lg:text-xs'>
              Group description
            </h3>
            {watch('description') ? (
              <p className='min-h-16 text-sm font-normal leading-relaxed text-[#0D121C] lg:text-base'>
                {watch('description')}
              </p>
            ) : (
              <div className='space-y-2'>
                <div className='h-2.5 w-full rounded bg-gray-200 md:h-4'></div>
                <div className='h-2.5 w-full rounded bg-gray-200 md:h-4'></div>
                <div className='h-2.5 w-1/2 rounded bg-gray-200 md:h-4'></div>
              </div>
            )}
          </div>

          {/* Group Members Section */}
          {(currentUser || invitedMembers.length > 0) && (
            <div className='mb-4'>
              <h3 className='mb-3 text-[0.625rem] font-normal text-[#9AA4B2] lg:text-xs'>
                Group Members
              </h3>
              <div className='space-y-3'>
                {/* Owner */}
                {currentUser && (
                  <div className='flex items-center justify-between rounded-md bg-[#F8FAFC] px-3 py-2'>
                    <div className='flex items-center gap-3'>
                      <img
                        src={
                          currentUser?.user.profile_image ||
                          '/collaboration/user_1.png'
                        }
                        alt={`${currentUser?.user.first_name} ${currentUser?.user.last_name}`}
                        className='size-6 rounded-full object-cover md:size-10'
                      />
                      <span className='text-[0.6125rem] font-normal text-[#0D121C] lg:text-xs'>
                        {currentUser?.user.first_name}{' '}
                        {currentUser?.user.last_name}
                      </span>
                    </div>
                    <span className='rounded-md bg-[#F8FAFC] px-3 py-2 text-[0.6125rem] font-normal text-[#0D121C] lg:text-xs'>
                      Owner
                    </span>
                    <span className='text-[0.6125rem] font-normal text-[#4F5E71] lg:text-xs'>
                      Joined {format(new Date(), 'MM-d-yyyy')}
                    </span>
                    <span className='text-[0.6125rem] font-normal text-[#7C3AED] lg:text-xs'>
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
                        className='size-6 rounded-full object-cover md:size-10'
                      />
                      <span className='text-[0.6125rem] font-normal text-[#0D121C] lg:text-xs'>
                        {(() => {
                          const username = member.email.split('@')[0];
                          return username && username.length > 15
                            ? username.substring(0, 15) + '...'
                            : username || member.email;
                        })()}
                      </span>
                    </div>
                    <span className='rounded-md bg-white p-1 text-[0.6125rem] font-normal text-[#0D121C] md:px-2 lg:text-xs'>
                      Member
                    </span>
                    <span className='text-[0.625rem] font-normal text-[#4F5E71] lg:text-xs'>
                      Joined {format(new Date(), 'MM-d-yyyy')}
                    </span>
                    <span className='text-[0.625rem] font-normal text-[#9AA4B2] lg:text-xs'>
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
                  </div>
                </div>
                <div className='flex gap-4 max-lg:flex-col lg:grid lg:grid-cols-2'>
                  {selectedSavedBusiness.map(business => (
                    <div className='max-md:px-8 md:basis-1/2 lg:basis-1/2' key={business.id}>
                      <FeaturedListingCard
                        business={business}
                        isSelectable={true}
                        isDeletable
                        onDelete={handleRemoveBusinessClick}
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

      {deleteConfirmation.config && (
        <ConfirmationModal
          isOpen={deleteConfirmation.isOpen}
          onClose={deleteConfirmation.closeConfirmation}
          onConfirm={deleteConfirmation.config.onConfirm}
          title={deleteConfirmation.config.title}
          description={deleteConfirmation.config.description}
          confirmText={deleteConfirmation.config.confirmText || 'Confirm'}
          cancelText={deleteConfirmation.config.cancelText || 'Cancel'}
          variant={deleteConfirmation.config.variant || 'default'}
          isLoading={isRemovingBusiness || isRemovingMember}
        />
      )}
    </div>
  );
}
