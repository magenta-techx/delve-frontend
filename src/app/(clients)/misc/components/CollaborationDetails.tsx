'use client';
import { useCollaboration } from '@/app/(clients)/misc/api';
import { LogoLoadingIcon } from '@/assets/icons';
import { EmptyState, Button, LinkButton } from '@/components/ui';
import { EmptyListingIcon } from '../icons';
import { format } from 'date-fns';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import FeaturedListingCard from './ListingCard';
import { useMemo } from 'react';
import { useUserContext } from '@/contexts/UserContext';

export default function CollaborationDetails({
  collabId,
}: {
  collabId: number;
}) {
  const { data: collabData, isLoading } = useCollaboration(collabId);
  const { user } = useUserContext();

  const isUserOwner = useMemo(
    () =>
      collabData?.data?.owner?.id === user?.id ||
      collabData?.data?.members?.some(
        m => m.priviledge === 'owner' && m.member?.id === user?.id
      ),
    [user, collabData]
  );
  console.log(
    collabData?.data?.owner?.id === user?.id,
    collabData?.data?.owner?.id,
    user?.id
  );
  const isUserContributor = useMemo(
    () =>
      collabData?.data?.members?.some(
        m => m.priviledge === 'contributor' && m.member?.id === user?.id
      ),
    [user, collabData]
  );

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
        description='The collaboration you are trying to view does not exist.'
      />
    );
  }

  const collab = collabData.data;
  const owner = collab.owner;
  const members = collab.members || [];
  const businesses = collab.businesses || [];

  // Filter members by status
  const activeMembers = members.filter(
    m =>
      (m.status === 'accepted' || m.status === 'active') &&
      m.priviledge !== 'owner' &&
      m.member !== null
  );
  const pendingMembers = members.filter(
    m => m.status === 'pending' && m.unregistered_user_email
  );

  return (
    <div className='w-full overflow-hidden py-8 pt-16 lg:h-screen xl:pb-12 xl:pt-28'>
      <header className='mx-auto mb-2.5 flex h-10 w-full max-w-[1356px] items-center justify-between px-4'>
        <Link
          href='/businesses/saved/collaboration'
          className='flex items-center gap-2'
        >
          <ChevronLeft className='size-6 cursor-pointer text-gray-700 hover:text-gray-900' />
          Back
        </Link>

        <div>
          {
            ((isUserContributor || isUserOwner) && (
              <LinkButton
                href={`./${collabId}/edit`}
                size='md'
                variant={'light'}
                className='text-primary hover:text-primary/90'
              >
                <span className='md:hidden'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  >
                    <path d='M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                    <path d='M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z' />
                  </svg>
                </span>
                <span className='max-md:hidden'>Edit</span>
              </LinkButton>
            ))}
          <Button
            size='md'
            variant={'unstyled'}
            className='text-[#E6283C] hover:text-[#E6283C]/90'
          >
            <span className='md:hidden'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
              >
                <path d='m16 17 5-5-5-5' />
                <path d='M21 12H9' />
                <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
              </svg>
            </span>
            <span className='max-md:hidden'>Exit Group</span>
          </Button>
        </div>
      </header>

      <section className='custom-scrollbar mx-auto h-[calc(100%-40px)] w-full max-w-[1356px] flex-1 overflow-y-scroll rounded-2xl bg-[#FFFFFF] p-5 px-4 md:px-8'>
        <article className=''>
          {/* Preview Header */}
          <div className='mb-6 flex items-center justify-between border-b pb-4'>
            <h2 className='text-xl font-bold text-[#0D121C] md:text-2xl'>
              Preview
            </h2>
          </div>

          {/* Group Name Section */}
          <div className='mb-6'>
            <h3 className='mb-2 text-xs font-normal text-[#9AA4B2]'>
              Group name
            </h3>
            <p className='text-base font-semibold text-[#0D121C] md:text-lg'>
              {collab.name}
            </p>
          </div>

          {/* Group Description Section */}
          <div className='mb-6'>
            <h3 className='mb-2 text-xs font-normal text-[#9AA4B2]'>
              Group description
            </h3>
            <p className='text-sm font-normal leading-relaxed text-[#0D121C] md:text-base'>
              {collab.description}
            </p>
          </div>

          {/* Group Members Section */}
          <div className='mb-6'>
            <h3 className='mb-4 text-xs font-normal text-[#9AA4B2] lg:text-sm'>
              Group Members
            </h3>
            <div className='space-y-3 overflow-y-auto'>
              {/* Owner */}
              {owner && (
                <div className='flex items-center justify-between rounded-md bg-[#F9FAFB] px-4 py-3'>
                  <div className='flex items-center gap-3'>
                    <img
                      src={owner.profile_image || '/collaboration/user_1.png'}
                      alt={`${owner.first_name} ${owner.last_name}`}
                      className='size-10 rounded-full object-cover md:size-12'
                    />
                    <span className='text-xs font-medium text-[#0D121C] md:text-sm'>
                      {owner.first_name} {owner.last_name}
                    </span>
                  </div>
                  <span className='rounded-md bg-[#FEFDF0] px-3 py-1.5 text-xs font-medium text-yellow-600'>
                    Owner
                  </span>
                  <span className='flex items-center gap-2 text-xs text-[#9AA4B2]'>
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
                    {collab.created_when
                      ? format(new Date(collab.created_when), 'MM-dd-yyyy')
                      : ''}
                  </span>
                  <span className='text-xs capitalize text-primary'>
                    Active
                  </span>
                </div>
              )}

              {/* Active Members */}
              {activeMembers.map((member, idx) => (
                <div
                  key={`member-${idx}`}
                  className='flex items-center justify-between rounded-md bg-[#F9FAFB] px-4 py-3'
                >
                  <div className='flex items-center gap-3'>
                    <img
                      src={
                        member.member?.profile_image ||
                        '/collaboration/user_1.png'
                      }
                      alt={`${member.member?.first_name} ${member.member?.last_name}`}
                      className='size-10 rounded-full object-cover md:size-12'
                    />
                    <span className='text-xs font-medium text-[#0D121C] md:text-sm'>
                      {member.member?.first_name} {member.member?.last_name}
                    </span>
                  </div>
                  <span className='rounded-md bg-[#F3F4F6] px-3 py-1.5 text-xs font-medium text-[#6B7280]'>
                    {member.priviledge}
                  </span>
                  <span className='flex items-center gap-2 text-xs text-[#9AA4B2]'>
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
                    {member.accepted_when
                      ? format(new Date(member.accepted_when), 'MM-dd-yyyy')
                      : ''}
                  </span>
                  <span className='text-xs capitalize text-primary'>
                    {member.status}
                  </span>
                </div>
              ))}

              {/* Pending Members */}
              {pendingMembers.map((member, idx) => (
                <div
                  key={`pending-${idx}`}
                  className='flex items-center justify-between rounded-md bg-[#F9FAFB] px-4 py-3'
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex size-10 items-center justify-center rounded-full bg-[#E5E7EB] text-xs font-medium text-[#6B7280] md:size-12'>
                      {member.unregistered_user_email?.charAt(0).toUpperCase()}
                    </div>
                    <span className='text-xs font-medium text-[#0D121C] md:text-sm'>
                      {member.unregistered_user_email}
                    </span>
                  </div>
                  <span className='rounded-md bg-[#F3F4F6] px-3 py-1.5 text-xs font-medium text-[#6B7280]'>
                    {member.priviledge}
                  </span>
                  <span className='text-xs capitalize text-[#9AA4B2]'>
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Group Listings Section */}
          {businesses.length > 0 && (
            <div>
              <h3 className='mb-4 text-xs font-normal text-[#9AA4B2]'>
                Group Listings
              </h3>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {businesses.map(business => (
                  <FeaturedListingCard key={business.id} business={business} />
                ))}
              </div>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
