export default function CollabCardSkeleton() {
  return (
    <div
      className='relative block overflow-hidden rounded-2xl border p-4 xl:min-h-[150px]'
      style={{
        backgroundImage: 'url(/collaboration/collab_card.jpg)',
        backgroundSize: 'cover',
      }}
    >
      <div className='absolute inset-0 bg-[#000000AD]' />
      <div className='z-2 relative flex h-full flex-col gap-4'>
        {/* Header Skeleton */}
        <header className='z-2 flex w-full items-center justify-between rounded-xl bg-white p-2 md:p-3 md:px-4'>
          <div className='flex items-center gap-2'>
            {/* Icon placeholder */}
            <div className='h-5 w-5 animate-pulse rounded bg-gray-200' />
            {/* Title skeleton */}
            <div className='h-5 w-32 animate-pulse rounded bg-gray-200' />
          </div>
          {/* Delete icon placeholder */}
          <div className='h-5 w-5 animate-pulse rounded bg-gray-200' />
        </header>

        <div className='flex flex-1 flex-col justify-between gap-4 md:gap-6 lg:px-2'>
          {/* Description Section */}
          <div>
            <div className='mb-1 h-4 w-20 animate-pulse rounded bg-gray-400' />
            <div className='space-y-2'>
              <div className='h-3 w-full animate-pulse rounded bg-gray-300' />
              <div className='h-3 w-full animate-pulse rounded bg-gray-300' />
              <div className='h-3 w-3/4 animate-pulse rounded bg-gray-300' />
            </div>
          </div>

          {/* Footer */}
          <footer className='flex items-center justify-between'>
            {/* Members count skeleton */}
            <div className='flex items-center gap-2'>
              <div className='h-4 w-8 animate-pulse rounded bg-gray-300' />
              <div className='h-4 w-4 animate-pulse rounded-full bg-gray-300' />
            </div>
            {/* Button skeleton */}
            <div className='h-9 w-28 animate-pulse rounded-lg bg-white/50' />
          </footer>
        </div>
      </div>
    </div>
  );
}
