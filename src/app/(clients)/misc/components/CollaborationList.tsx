'use client';
import { useCollaborations } from '@/app/(clients)/misc/api';
import { EmptyState } from '@/components/ui';
import CollabCard from './CollabCard';
import CollabCardSkeleton from './CollabCardSkeleton';

export default function CollaborationList() {
  const { data: collaborations, isLoading, error } = useCollaborations();

  if (isLoading) {
    return (
      <div className='grid w-full items-stretch gap-7 md:grid-cols-2 xl:grid-cols-3 2xl:gap-10'>
        {Array.from({ length: 6 }).map((_, index) => (
          <CollabCardSkeleton key={index} />
        ))}
      </div>
    );
  }
  if (error) return <div className='text-red-500'>{error.message}</div>;
  if (!collaborations?.data.length)
    return (
      <EmptyState
        title='No Collaborations Yet'
        description='Collaborate with friends, family, or colleagues. Save and share vendors with ease.'
      />
    );
  return (
    <div className='grid w-full items-stretch gap-7 md:grid-cols-2 xl:grid-cols-3 2xl:gap-10'>
      {collaborations.data.map(collab => (
        <CollabCard key={collab.id} collab={collab} />
      ))}
    </div>
  );
}
