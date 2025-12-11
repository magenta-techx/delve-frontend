'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { LinkButton } from '@/components/ui';
import { Button } from '@/components/ui';
import { Image as ImageIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useUserChats } from '@/app/(clients)/misc/api/useUserChats';
import { useChatSocket } from '@/hooks/chat/useChatSocket';
import { useAddImage } from '@/hooks/chat/useAddImage';
import { useChatMessages } from '../../misc/api';
import { useUserContext } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

export default function ChatDetailPage({
  params,
}: {
  // `params` may be a Promise in newer Next.js versions; unwrap with React.use
  params: { chat_id: string } | Promise<{ chat_id: string }>;
}) {
  // `React.use()` unwraps a promise provided by Next.js routing. Use it when available.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolvedParams = (React as any).use ? (React as any).use(params) : params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { chat_id } = resolvedParams as any;
  const { data: session } = useSession();
  const token = session?.user?.accessToken ?? '';

  const { data: chats, isLoading: isLoadingChats } = useUserChats();
  const { userId } = useUserContext();
  const {
    data: messages,
    isLoading: messagesLoading,
    refetch: refreshMessages,
  } = useChatMessages(chat_id);

  const selectedChat =
    chats?.data.find(c => String(c.id) === String(chat_id)) || null;

  const [connectionState, setConnectionState] = useState<'idle' | 'connecting' | 'open' | 'closed' | 'error'>('idle');

  const { sendText } = useChatSocket({
    businessId: String(selectedChat?.business.id ?? ''),
    chatId: String(chat_id),
    token: token ?? '',
    onMessage: () => {
      void refreshMessages();
    },
    onImages: () => {
      void refreshMessages();
    },
    debug: true,
    onOpen: () => setConnectionState('open'),
    onClose: () => setConnectionState('closed'),
    onDebug: entry => {
      // update local connection state for UI
      if (entry.type === 'connect_attempt') setConnectionState('connecting');
      if (entry.type === 'open') setConnectionState('open');
      if (entry.type === 'close') setConnectionState('closed');
      if (entry.type === 'error') setConnectionState('error');
      console.log('chat debug entry', entry);
    },
  });

  const { addImage } = useAddImage();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // Scroll helper: scroll the messages container to bottom
  const scrollToBottom = (smooth = true) => {
    const el = messagesContainerRef.current;
    if (!el) return;
    try {
      if (smooth && 'scrollTo' in el) {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      } else {
        el.scrollTop = el.scrollHeight;
      }
    } catch (e) {
      try {
        el.scrollTop = el.scrollHeight;
      } catch {}
    }
  };

  // Scroll when message count changes and when content size changes (images load)
  useEffect(() => {
    // small delay to allow DOM updates
    const id = window.setTimeout(() => scrollToBottom(true), 50);
    return () => window.clearTimeout(id);
  }, [messages?.data?.length]);

  // Use ResizeObserver to detect content size changes and keep scrolled to bottom
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      // when content size changes, ensure bottom is visible
      scrollToBottom(false);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // auto-resize textarea based on content
  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    // add 2px to avoid scrollbar in some browsers
    el.style.height = `${Math.min(el.scrollHeight + 2, 400)}px`;
  };

  useEffect(() => {
    resizeTextarea();
  }, [text]);

  const sendFileFromInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    const fd = new FormData();
    fd.append('images', file);
    fd.append('chat_id', String(chat_id));
    try {
      await addImage(fd);
      void refreshMessages();
    } catch (err) {
      // ignore
    }
    if (e.target) e.target.value = '';
  };

  const handleSend = async () => {
    if (!text) return;
    if (sending) return;
    setSending(true);
    try {
      await sendText(text);
      setText('');
      await refreshMessages();
    } catch (err) {
      console.error('send failed', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className='flex h-full flex-1 grid-rows-[auto_1fr_auto] flex-col'>
      <nav className='flex h-16 items-center justify-between border-b border-border px-6'>
        <div>
          {isLoadingChats ? (
            <div className='h-6 w-40 animate-pulse rounded bg-gray-200' />
          ) : (
            <div className='flex items-center gap-3'>
              <span
                title={connectionState}
                className={
                  'inline-block h-2.5 w-2.5 rounded-full ' +
                  (connectionState === 'open'
                    ? 'bg-green-500'
                    : connectionState === 'connecting'
                    ? 'bg-amber-400'
                    : connectionState === 'error'
                    ? 'bg-red-500'
                    : 'bg-gray-300')
                }
              />
              <h2 className='font-semibold'>
                {selectedChat?.business.name ?? 'Conversation'}
              </h2>
            </div>
          )}
        </div>
        <div className='flex items-center gap-2'>
          {isLoadingChats ? (
            <div className='h-8 w-32 animate-pulse rounded-[0.825rem] bg-gray-200' />
          ) : (
            <LinkButton
              href={`/businesses/${selectedChat?.business.id ?? ''}`}
              className='rounded-[0.825rem] border border-purple-500 py-1.5 text-[#551FB9] hover:!text-[#551FB9]'
              variant='light'
              size='md'
            >
              View profile
            </LinkButton>
          )}
        </div>
      </nav>

      <div
        ref={messagesContainerRef}
        className='flex flex-1 flex-col justify-end space-y-4 overflow-y-auto p-6'
      >
        {messagesLoading && <div>Loading messages...</div>}
        {messages && messages.data.length === 0 && (
          <div className='py-6 text-center text-gray-500'>No messages yet</div>
        )}
        {messages &&
          messages.data
            .slice()
            .reverse()
            .map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender.id === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={cn(
                    'w-max max-w-md rounded-lg px-4 py-2 text-sm font-normal leading-snug',
                    msg.sender.id === userId
                      ? 'text-sidebar-primary-foreground bg-[#F8FAFC]'
                      : 'bg-[#F8FAFC] text-foreground'
                  )}
                >
                  <p className='text-sm'>{msg.content ?? ''}</p>
                  {msg.is_image_message && (
                    <div className='mt-2 max-w-full overflow-hidden rounded'>
                      <Image
                        src={String(msg.image)}
                        alt='img'
                        width={400}
                        height={300}
                        className='h-auto w-full rounded'
                        onLoadingComplete={() => {
                          // ensure we scroll after image loads and layout updates
                          scrollToBottom(false);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
        <div ref={bottomRef} />
      </div>

      <div className='w-full p-3'>
        <div className='flex w-full items-center rounded-2xl bg-[#F8FAFC] p-1.5'>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onInput={resizeTextarea}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
            rows={1}
            placeholder='Write your message...'
            className='max-h-[400px] w-full resize-none border-none bg-transparent px-2 py-1 outline-none focus:border-none'
          />
          <div className='flex items-center gap-2'>
            <label className='flex cursor-pointer items-center gap-2'>
              <input
                type='file'
                accept='image/*'
                onChange={sendFileFromInput}
                className='hidden'
              />
              <Button
                size='icon'
                // className='bg-[#ECE9FE]'
                variant='ghost'
              >
                <ImageIcon className='h-4 w-4' />
              </Button>
            </label>
            <Button
              size='icon'
              onClick={handleSend}
              className='bg-[#ECE9FE]'
              variant='unstyled'
              disabled={sending || connectionState !== 'open'}
            >
              {sending ? (
                <svg className='h-4 w-4 animate-spin' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <circle cx='12' cy='12' r='10' stroke='#551FB9' strokeWidth='4' strokeLinecap='round' strokeDasharray='60' strokeDashoffset='0'></circle>
                </svg>
              ) : (
                <svg
                  width='23'
                  height='22'
                  viewBox='0 0 23 22'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M4.50998 0.31458L20.7502 8.0073C23.1525 9.14525 23.1525 12.5636 20.7502 13.7016L4.50998 21.3943C1.86889 22.6453 -0.904434 19.9382 0.282464 17.2676L2.56412 12.1339C2.62286 12.0018 2.67206 11.8666 2.71174 11.7293H11.0087C11.492 11.7293 11.8837 11.3376 11.8837 10.8543C11.8837 10.3711 11.492 9.97933 11.0087 9.97933H2.71168C2.67202 9.84216 2.62283 9.70703 2.56412 9.57493L0.282464 4.44121C-0.904433 1.77069 1.86889 -0.93646 4.50998 0.31458Z'
                    fill={text?.length > 0 ? '#551FB9' : '#9AA4B2'}
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
