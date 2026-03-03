'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui';
import Link from 'next/link';
import { useIsMobile } from '@/hooks';
import { useSession } from 'next-auth/react';
import { useChatSocket, type ChatDebugEntry } from '@/hooks/chat/useChatSocket';
import { useAddImage } from '@/hooks/chat/useAddImage';
import { useUserContext } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { useChatMessages } from '@/app/(clients)/misc/api';
import { useParams } from 'next/navigation';
import { useBusinessChats } from '@/app/(business)/misc/api';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { GalleryModal } from '@/components/GalleryModal';
import { useQueryClient } from '@tanstack/react-query';
import type { ApiEnvelope, ChatMessage } from '@/types/api';

export default function ChatDetailPage() {
  const { chat_id } = useParams() as { chat_id: string };
  const { data: session } = useSession();
  const token = session?.user?.accessToken ?? '';
  const { currentBusiness } = useBusinessContext();
  const { data: chats, isLoading: isLoadingChats } = useBusinessChats(
    currentBusiness?.id || ''
  );
  const queryClient = useQueryClient();
  const { userId } = useUserContext();
  const { data: messages, isLoading: messagesLoading } =
    useChatMessages(chat_id);

  const selectedChat =
    chats?.data.find(c => String(c.id) === String(chat_id)) || null;

  const handleSocketPayload = useCallback(
    (payload: any) => {
      if (payload && typeof payload === 'object') {
        queryClient.setQueryData(
          ['chat-messages', chat_id],
          (old: ApiEnvelope<ChatMessage[]> | undefined) => {
            if (!old) return old;

            // Avoid duplicate messages
            const exists = old.data.some(
              (m: ChatMessage) => m.id === payload.id
            );
            if (exists) return old;

            return {
              ...old,
              data: [payload, ...old.data],
            };
          }
        );
      }
    },
    [chat_id, queryClient]
  );

  const handleSocketDebug = useCallback((entry: ChatDebugEntry) => {
    console.log('chat debug entry', entry);
  }, []);

  const { sendText } = useChatSocket({
    businessId: String(currentBusiness?.id ?? ''),
    chatId: String(chat_id),
    token: token ?? '',
    onMessage: handleSocketPayload,
    onImages: handleSocketPayload,
    debug: true,
    onDebug: handleSocketDebug,
  });

  const { addImage } = useAddImage();
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingUploads, setPendingUploads] = useState<
    Array<{ id: string; url: string; status: 'uploading' | 'error' }>
  >([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const shouldAutoScrollRef = useRef(true);

  // Scroll helper: scroll the messages container to bottom
  const scrollToBottom = useCallback((smooth = true, force = false) => {
    const el = messagesContainerRef.current;
    if (!el) return;
    if (!force && !shouldAutoScrollRef.current) return;
    try {
      if (smooth && 'scrollTo' in el) {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      } else {
        el.scrollTop = el.scrollHeight;
      }
    } catch (e) {
      try {
        el.scrollTop = el.scrollHeight;
      } catch { }
    }
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom < 80;
  }, []);

  // Scroll when message count changes and when content size changes (images load)
  useEffect(() => {
    // small delay to allow DOM updates
    const id = window.setTimeout(() => scrollToBottom(true), 50);
    return () => window.clearTimeout(id);
  }, [messages?.data?.length, pendingUploads.length, scrollToBottom]);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      scrollToBottom(false);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [scrollToBottom]);

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

  const removePendingUpload = useCallback((id: string) => {
    setPendingUploads(prev => {
      const target = prev.find(item => item.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter(item => item.id !== id);
    });
  }, []);

  const sendFileFromInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter(Boolean);
    if (!files.length) return;

    const entries = files.map(file => {
      const url = URL.createObjectURL(file);
      const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;
      return { file, url, id };
    });

    setPendingUploads(prev => [
      ...prev,
      ...entries.map(entry => ({
        id: entry.id,
        url: entry.url,
        status: 'uploading' as const,
      })),
    ]);

    shouldAutoScrollRef.current = true;
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => scrollToBottom(true, true));
    } else {
      scrollToBottom(false, true);
    }

    for (const entry of entries) {
      const fd = new FormData();
      fd.append('images', entry.file);
      fd.append('chat_id', String(chat_id));
      try {
        await addImage(fd);
        removePendingUpload(entry.id);
      } catch (err) {
        setPendingUploads(prev =>
          prev.map(item =>
            item.id === entry.id ? { ...item, status: 'error' } : item
          )
        );
      }
    }

    if (e.target) e.target.value = '';
  };

  const handleSelectImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleSend = async () => {
    if (!text) return;
    shouldAutoScrollRef.current = true;
    scrollToBottom(true, true);
    sendText(text);
    setText('');
  };

  const orderedMessages = useMemo(() => {
    if (!messages?.data) return [];
    return [...messages.data].reverse();
  }, [messages?.data]);

  const imageGallery = useMemo(
    () =>
      orderedMessages
        .filter(msg => msg.is_image_message && msg.image)
        .map(msg => String(msg.image)),
    [orderedMessages]
  );

  const openLightbox = useCallback(
    (imageUrl: string) => {
      const index = imageGallery.indexOf(imageUrl);
      if (index >= 0) {
        setLightboxIndex(index);
        setLightboxOpen(true);
      }
    },
    [imageGallery]
  );

  const { isMobile } = useIsMobile();

  return (
    <div className='flex h-full flex-1 grid-rows-[auto_1fr_auto] flex-col'>
      <nav className='flex h-16 items-center justify-between border-b border-border px-4 lg:px-6'>
        <div className='flex items-center gap-1.5'>
          {isMobile && (
            <Link
              href='/business/messages'
              className='mr-1 flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted'
            >
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='m15 18-6-6 6-6' />
              </svg>
            </Link>
          )}
          {isLoadingChats ? (
            <div className='h-6 w-32 animate-pulse rounded bg-gray-200' />
          ) : (
            <h2 className='text-lg font-semibold'>
              {isMobile ? 'Messages' : `${selectedChat?.customer.first_name ?? ''} ${selectedChat?.customer.last_name ?? ''}`}
            </h2>
          )}
        </div>
        <div className='flex items-center gap-2'>
          {isMobile && (
            <button className='flex h-8 w-8 items-center justify-center hover:bg-muted rounded-full'>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
            </button>
          )}
        </div>
      </nav>

      <div
        ref={messagesContainerRef}
        className='flex flex-1 flex-col space-y-4 overflow-y-auto p-4 lg:p-6 pb-2 lg:pb-6'
        onScroll={handleScroll}
      >
        <div className='flex w-full flex-col items-center justify-center pb-6 pt-4'>
          <div className='relative mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-black text-white'>
            {selectedChat?.customer?.profile_image ? (
              <Image src={selectedChat.customer.profile_image} alt='' fill className="object-cover" />
            ) : (
              <span className='text-xl uppercase'>{selectedChat?.customer?.first_name?.[0]}</span>
            )}
          </div>
          <p className='text-sm text-gray-500'>
            Conversation with <span className='font-semibold text-black'>{selectedChat?.customer?.first_name} {selectedChat?.customer?.last_name}</span>
          </p>
        </div>
        {messagesLoading && <div className="text-center w-full">Loading messages...</div>}
        {messages && messages.data.length === 0 && (
          <div className='py-6 text-center text-gray-500'>No messages yet</div>
        )}
        {messages &&
          orderedMessages.map(msg => (
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
                <p className='text-[0.8rem] md:text-sm'>{msg.content ?? ''}</p>
                {msg.is_image_message && (
                  <button
                    type='button'
                    onClick={() => openLightbox(String(msg.image))}
                    className='mt-2 block focus:outline-none'
                  >
                    <div className='relative h-40 w-40 overflow-hidden rounded-xl bg-[#E2E8F0]'>
                      <Image
                        src={String(msg.image)}
                        alt='Chat image'
                        fill
                        sizes='160px'
                        className='object-cover'
                        onLoadingComplete={() => {
                          scrollToBottom(false);
                        }}
                      />
                    </div>
                  </button>
                )}
              </div>
            </div>
          ))}
        {pendingUploads.map(upload => (
          <div key={upload.id} className='flex justify-end'>
            <div className='text-sidebar-primary-foreground w-max max-w-md rounded-lg bg-[#F8FAFC] px-4 py-2 text-sm font-normal leading-snug'>
              <div className='relative mt-2 h-40 w-40 overflow-hidden rounded-xl bg-[#E2E8F0]'>
                <img
                  src={upload.url}
                  alt='Uploading preview'
                  className='h-full w-full object-cover opacity-70'
                />
                {upload.status === 'uploading' && (
                  <div className='absolute inset-0 flex items-center justify-center bg-white/60'>
                    <svg
                      className='h-6 w-6 animate-spin text-[#551FB9]'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <circle
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                        strokeLinecap='round'
                        strokeDasharray='60'
                        strokeDashoffset='20'
                      ></circle>
                    </svg>
                  </div>
                )}
                {upload.status === 'error' && (
                  <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-red-50/90 p-3 text-center text-xs font-medium text-red-600'>
                    <span>Image failed to send</span>
                    <button
                      type='button'
                      className='rounded bg-white/70 px-2 py-1 text-[11px] font-semibold text-red-600 shadow-sm'
                      onClick={() => removePendingUpload(upload.id)}
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className='w-full p-4 lg:p-6'>
        <div className='flex w-full items-center rounded-3xl border border-[#FAFAFA] bg-[#FAFAFA] md:bg-[#F8FAFC] py-2 pl-4 pr-2 drop-shadow-sm shadow-sm ring-1 ring-gray-100'>
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
            placeholder='Write your message..'
            className='max-h-[200px] text-sm md:text-base w-full resize-none border-none bg-transparent py-1 outline-none placeholder:text-gray-500 focus:border-none'
          />
          <div className='flex items-center gap-1.5'>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              multiple
              onChange={sendFileFromInput}
              className='hidden'
            />
            <button
              type='button'
              className='flex h-8 w-8 items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full transition-colors'
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" x2="9.01" y1="9" y2="9" /><line x1="15" x2="15.01" y1="9" y2="9" /></svg>
            </button>
            <button
              type='button'
              onClick={handleSelectImage}
              className='flex h-8 w-8 items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full transition-colors'
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
            </button>
            <Button
              size='icon'
              onClick={handleSend}
              className='h-10 w-10 shrink-0 rounded-full bg-[#FAF5FF] hover:bg-[#F3E8FF] ml-1'
              variant='unstyled'
            >
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M22 2L11 13' stroke={text?.length > 0 ? '#551FB9' : '#9EA5B5'} strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'
                />
                <path
                  d='M22 2L15 22L11 13L2 9L22 2Z' stroke={text?.length > 0 ? '#551FB9' : '#9EA5B5'} strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      {lightboxOpen && imageGallery.length > 0 && (
        <GalleryModal
          images={imageGallery}
          open={lightboxOpen}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
