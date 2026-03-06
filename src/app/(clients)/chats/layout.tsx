'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmptyState,
} from '@/components/ui';
import { Image as ImageIcon } from 'lucide-react';
import { useUserChats } from '@/app/(clients)/misc/api/useUserChats';
import Link from 'next/link';
import { LogoLoadingIcon, MessagePin } from '@/assets/icons';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { EmptyChatMedia } from '../misc/icons';
import { cn, formatRelativeTime } from '@/lib/utils';
import { usePinChat } from '@/app/(clients)/misc/api/chat';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

export default function UserChatsPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: chats, isLoading: isLoadingChats } = useUserChats();
  const params = useParams();
  const current_chat_id = (params?.['chat_id'] as string) || null;
  const [chatsToShow, setChatsToShow] = React.useState('All');
  const [filteredChats, setFilteredChats] = React.useState(chats);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [pinConfirm, setPinConfirm] = React.useState<{ id: number; is_pinned: boolean } | null>(null);
  const pinMutation = usePinChat();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (chats) {
      let filtered = chats.data;
      if (chatsToShow === 'Unread') {
        filtered = filtered.filter(chat => !chat.last_message?.is_read);
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(chat => chat.business.name.toLowerCase().includes(query));
      }
      setFilteredChats({
        ...chats,
        data: filtered,
      });
    }
  }, [chatsToShow, chats, searchQuery]);

  return (
    <div className='container mx-auto flex h-screen gap-x-4 !overflow-hidden bg-[#FCFCFD] px-0 pb-16 md:p-4 md:pt-20 lg:!pt-28'>
      <section
        className={cn(
          'relative flex w-full flex-col overflow-hidden max-md:rounded-none max-md:border-none border border-[#ECE9FE] bg-background lg:w-80 rounded-2xl xl:rounded-3xl',
          !!current_chat_id && 'max-lg:hidden'
        )}
      >
        <nav className='sticky h-16 top-0 flex items-center justify-between border-b border-border bg-white p-2 xl:px-6 xl:py-4'>
          {isSearchOpen ? (
            <input
              type='text'
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder='Search messages...'
              className='mr-4 h-9 w-full flex-1 rounded-full bg-gray-100 px-4 text-[0.9rem] outline-none transition-all placeholder:text-gray-500 focus:ring-1 focus:ring-purple-500'
            />
          ) : (
            <h1 className='font-inter text-lg font-semibold text-[#0F0F0F]'>
              Messages
            </h1>
          )}
          <div className='flex shrink-0 items-center gap-3'>
            <button
              onClick={() => {
                if (isSearchOpen) {
                  setSearchQuery('');
                }
                setIsSearchOpen(!isSearchOpen);
              }}
              className='flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100'
            >
              {isSearchOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              ) : (
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
              )}
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
                href={`/chats/${chat.id}`}
                className={cn(
                  'flex w-full items-start gap-2 bg-[#F8FAFC] px-4 py-2.5 text-left transition-colors hover:bg-muted/50',
                  current_chat_id === String(chat.id) && '!bg-[#F5F3FF]'
                )}
              >
                <div className='relative size-12 shrink-0 overflow-hidden rounded-full md:size-14'>
                  <Image
                    src={chat.business.logo || '/default-avatar.png'}
                    alt={chat.business.name}
                    fill
                    objectFit='cover'
                  />
                </div>
                <div className='flex min-w-0 flex-1 flex-col'>
                  <p className='font-semibold text-sm md:text-base md:font-medium'>{chat.business.name}</p>
                  <p
                    className={cn(
                      'xs:text-xs line-clamp-2 min-h-[2lh] text-[0.825rem] leading-tight',
                      current_chat_id === String(chat.id)
                        ? 'text-[#551FB9]'
                        : 'text-[#111927]',
                      chat.last_message?.is_image_message &&
                      'flex items-center gap-1'
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

                <div className='flex shrink-0 flex-col items-end gap-1.5'>
                  <span className='whitespace-nowrap text-xs text-gray-500'>
                    {formatRelativeTime(chat.last_message_sent_at)}
                  </span>
                  <button
                    onClick={e => { e.preventDefault(); e.stopPropagation(); setPinConfirm({ id: chat.id, is_pinned: !!chat.is_pinned }); }}
                    className='p-0.5'
                    aria-label={chat.is_pinned ? 'Unpin chat' : 'Pin chat'}
                  >
                    <MessagePin style={{ color: chat.is_pinned ? '#FF4405' : '#9AA4B2' }} />
                  </button>
                </div>
              </Link>
            );
          })}

          {/* Pin Confirmation Dialog */}
          {pinConfirm && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
              <div className='w-full max-w-xs rounded-2xl bg-white p-5 shadow-xl'>
                <h3 className='text-base font-semibold text-[#0F0F0F]'>
                  {pinConfirm.is_pinned ? 'Unpin conversation?' : 'Pin conversation?'}
                </h3>
                <p className='mt-1 text-sm text-[#697586]'>
                  {pinConfirm.is_pinned
                    ? 'This conversation will be unpinned from the top.'
                    : 'This conversation will be pinned to the top.'}
                </p>
                <div className='mt-4 flex gap-3'>
                  <button
                    onClick={() => setPinConfirm(null)}
                    className='flex-1 rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#374151] transition-colors hover:bg-gray-50'
                  >
                    Cancel
                  </button>
                  <button
                    disabled={pinMutation.isPending}
                    onClick={() => {
                      pinMutation.mutate(
                        { chat_id: pinConfirm.id },
                        {
                          onSuccess: () => {
                            queryClient.invalidateQueries({ queryKey: ['user-chats'] });
                            setPinConfirm(null);
                          },
                          onError: () => setPinConfirm(null),
                        }
                      );
                    }}
                    className='flex-1 rounded-xl bg-[#5F2EEA] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5F2EEA]/90 disabled:opacity-60'
                  >
                    {pinMutation.isPending ? 'Saving…' : pinConfirm.is_pinned ? 'Unpin' : 'Pin'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* <section className='grid flex-1 grid-rows-[max-content,1fr] bg-background border border-[#ECE9FE] rounded-2xl overflow-hidden'> */}
      <section
        className={cn(
          'flex flex-1 overflow-hidden rounded-2xl border border-[#ECE9FE] bg-background max-lg:!rounded-none max-lg:!border-none xl:rounded-3xl',
          !current_chat_id ? 'hidden lg:flex' : 'max-lg:flex'
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
