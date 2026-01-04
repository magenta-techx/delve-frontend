'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmptyState,
} from '@/components/ui';
import Link from 'next/link';
import { LogoLoadingIcon } from '@/assets/icons';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { EmptyChatMedia } from '@/app/(clients)/misc/icons';
import { useBusinessChats } from '../../misc/api';
import { useBusinessContext } from '@/contexts/BusinessContext';
import React from 'react';

export default function UserChatsPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentBusiness } = useBusinessContext();
  const { data: chats, isLoading: isLoadingChats } = useBusinessChats(
    currentBusiness?.id || ''
  );
  const params = useParams();
  const current_chat_id = (params?.['chat_id'] as string) || null;
  const [chatsToShow, setChatsToShow] = React.useState('All');
  const [filteredChats, setFilteredChats] = React.useState(chats);

  React.useEffect(() => {
    if (chats) {
      if (chatsToShow === 'All') {
        setFilteredChats(chats);
      } else {
        setFilteredChats({
          ...chats,
          data: chats.data.filter(chat => !chat.last_message.is_read),
        });
      }
    }
  }, [chatsToShow, chats]);

  return (
    <div className='container mx-auto flex h-screen gap-x-4 !overflow-hidden bg-[#FCFCFD] pb-4 md:pt-20 lg:!pt-28'>
      <section
        className={cn(
          'relative flex w-full flex-col overflow-hidden rounded-2xl border border-[#ECE9FE] bg-background lg:w-80 xl:rounded-3xl'
        )}
      >
        <nav className='sticky top-0 flex items-center justify-between border-b border-border bg-white p-2 xl:px-6 xl:py-4'>
          <h1 className='font-inter text-lg font-semibold text-[#0F0F0F]'>
            Messages
          </h1>
          <div className='flex items-center gap-4'>
            <button>
              <svg
                className='size-4'
                width='19'
                height='19'
                viewBox='0 0 19 19'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M12.8453 14.3663C11.5006 15.3913 9.82137 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 10.0713 15.2128 11.9587 13.9214 13.3794C13.9479 13.3975 13.9736 13.4175 13.9983 13.4394L18.4983 17.4394C18.8079 17.7146 18.8357 18.1887 18.5606 18.4983C18.2854 18.8079 17.8113 18.8357 17.5017 18.5606L13.0017 14.5606C12.9373 14.5033 12.8851 14.4375 12.8453 14.3663ZM14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8Z'
                  fill='#0F0F0F'
                />
              </svg>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <svg
                    className='size-4'
                    width='3'
                    height='18'
                    viewBox='0 0 3 18'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M1.25 2.509C0.559644 2.509 0 1.94936 0 1.259V1.25C0 0.559644 0.559644 0 1.25 0C1.94036 0 2.5 0.559644 2.5 1.25V1.259C2.5 1.94936 1.94036 2.509 1.25 2.509Z'
                      fill='#0F0F0F'
                    />
                    <path
                      d='M1.25 10.009C0.559644 10.009 0 9.44936 0 8.759V8.75C0 8.05964 0.559644 7.5 1.25 7.5C1.94036 7.5 2.5 8.05964 2.5 8.75V8.759C2.5 9.44936 1.94036 10.009 1.25 10.009Z'
                      fill='#0F0F0F'
                    />
                    <path
                      d='M0 16.259C0 16.9494 0.559644 17.509 1.25 17.509C1.94036 17.509 2.5 16.9494 2.5 16.259V16.25C2.5 15.5596 1.94036 15 1.25 15C0.559644 15 0 15.5596 0 16.25V16.259Z'
                      fill='#0F0F0F'
                    />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setChatsToShow('All')}>
                  All Chats
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChatsToShow('Unread')}>
                  Unread Chats
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
        <div className='custom-scrollbar flex-1 space-y-1 overflow-y-scroll'>
          {filteredChats?.data.map(chat => {
            return (
              <Link
                key={chat.id}
                href={`/business/messages/${chat.id}`}
                className={cn(
                  'flex w-full items-center gap-2 bg-[#F8FAFC] px-4 py-2.5 text-left transition-colors hover:bg-muted/50 md:gap-3',
                  current_chat_id === String(chat.id) && '!bg-[#F5F3FF]'
                )}
              >
                <div className='relative size-10 overflow-hidden rounded-full md:size-14'>
                  <Image
                    src={chat.customer.profile_image || '/default-avatar.png'}
                    alt={`${chat.customer.first_name} ${chat.customer.last_name}`}
                    fill
                    objectFit='cover'
                  />
                </div>
                <div className='flex min-w-0 flex-1 flex-col'>
                  <p className='text-sm md:text-base font-medium'>
                    {chat.customer.first_name} {chat.customer.last_name}
                  </p>
                  <p className='text-xs line-clamp-2 min-h-[2lh] md:text-[0.825rem] leading-tight text-[#111927]'>
                    {chat.last_message?.content}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* <section className='grid flex-1 grid-rows-[max-content,1fr] bg-background border border-[#ECE9FE] rounded-2xl overflow-hidden'> */}
      <section
        className={cn(
          'hidden h-full flex-1 overflow-hidden rounded-2xl border border-[#ECE9FE] bg-background lg:block',
          !!current_chat_id ? 'max-lg:hidden' : ''
        )}
      >
        {isLoadingChats ? (
          <div className='flex h-full w-full items-center justify-center'>
            <LogoLoadingIcon />
          </div>
        ) : !current_chat_id ? (
          <div className='flex h-full w-full items-center justify-center'>
            <EmptyState
              media={<EmptyChatMedia />}
              title='No chat selected'
              description='Select a chat to view messages'
            />
          </div>
        ) : (
          children
        )}
      </section>
    </div>
  );
}
