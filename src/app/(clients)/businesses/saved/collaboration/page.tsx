import CollaborationList from '@/app/(clients)/misc/components/CollaborationList';
import { LinkButton } from '@/components/ui';

export default function CollaborationsPage() {
  return (
    <div className='container relative mx-auto flex w-full flex-col items-center overflow-x-hidden py-8 lg:w-[80vw]'>
      <header className='z-10 mt-20 w-full px-4 sm:px-0 md:mt-28'>
        <div className='mb-6 flex w-full items-center justify-between'>
          <section>
            <h1 className='font-inter text-lg font-semibold text-[#0F0F0F] sm:text-xl md:text-2xl'>
              Collaborations
            </h1>
          </section>
          <LinkButton
            href='/businesses/saved/collaboration/new'
            variant='light'
            className='flex items-center justify-center gap-2 bg-[#551FB9] text-white'
            size='dynamic_lg'
          >
            <svg
              width='10'
              height='10'
              viewBox='0 0 10 10'
              className='!size-3'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M5 1L5 9M9 5L1 5'
                stroke='white'
                stroke-width='2'
                stroke-linecap='round'
              />
            </svg>

            <span>Create</span>
          </LinkButton>
        </div>
      </header>

      <CollaborationList />
    </div>
  );
}
