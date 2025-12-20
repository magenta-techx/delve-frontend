'use client';

import { EmptyState, Input } from '@/components/ui';
import { Search, Image as ImageIcon } from 'lucide-react';
import { useUserChats } from '@/app/(clients)/misc/api/useUserChats';
import Link from 'next/link';
import { LogoLoadingIcon } from '@/assets/icons';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { EmptyChatMedia } from '../misc/icons';
import { cn } from '@/lib/utils';

export default function UserChatsPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: chats, isLoading: isLoadingChats } = useUserChats();
  const params = useParams();
  const current_chat_id = (params?.['chat_id'] as string) || null;

  return (
    <div className='flex h-screen gap-x-4 !overflow-hidden bg-[#FCFCFD] pb-6 pt-20 lg:pt-24 lg:px-6 xl:px-8'>
      <section
        className={cn(
          'flex w-full flex-col overflow-y-scroll rounded-2xl border border-[#ECE9FE] bg-background lg:w-80'
        )}
      >
        <nav className='border-b border-border p-2'>
          <div className='relative'>
            <Search className='absolute left-3 top-2.5 h-4 w-4 text-purple-700' />
            <Input placeholder='Search chats' className='!border-none pl-10' />
          </div>
        </nav>
        <div className='space-y-1'>
          {chats?.data.map(chat => {
            return (
              <Link
                key={chat.id}
                href={`/chats/${chat.id}`}
                className={cn(
                  'flex w-full items-center gap-2 bg-[#F8FAFC] px-4 py-2.5 text-left transition-colors hover:bg-muted/50 md:gap-3',
                  current_chat_id === String(chat.id) && '!bg-[#F5F3FF]'
                )}
              >
                <div className='relative size-10 overflow-hidden rounded-full md:size-14'>
                  <Image
                    src={chat.business.logo || '/default-avatar.png'}
                    alt={chat.business.name}
                    fill
                    objectFit='cover'
                  />
                </div>
                <div className='flex min-w-0 flex-1 flex-col'>
                  <p className='font-medium'>{chat.business.name}</p>
                  <p
                    className={cn(
                      'xs:text-xs line-clamp-2 min-h-[2lh] text-[0.825rem] leading-tight text-[#111927]',
                      chat.last_message?.is_image_message && 'flex items-center gap-1 text-[#551FB9]'
                    )}
                  >
                    {chat.last_message?.is_image_message ? (
                      <>
                        <ImageIcon className='h-3.5 w-3.5' aria-hidden='true' />
                        <span>Image</span>
                      </>
                    ) : (
                      chat.last_message?.content || 'No messages yet'
                    )}
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
