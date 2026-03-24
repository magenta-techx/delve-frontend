'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LinkButton, Button } from '@/components/ui';
import { useSession } from 'next-auth/react';
import { useIsMobile } from '@/hooks/useMobile';
import { useUserChats } from '@/app/(clients)/misc/api/useUserChats';
import { useChatSocket, type ChatDebugEntry } from '@/hooks/chat/useChatSocket';
import { useAddImage } from '@/hooks/chat/useAddImage';
import { useChatMessages } from '../../misc/api';
import { useUserContext } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { GalleryModal } from '@/components/GalleryModal';
import { useQueryClient } from '@tanstack/react-query';
import type { ApiEnvelope, ChatMessage } from '@/types/api';

export default function ChatDetailPage({
  params,
}: {
  params: { chat_id: string } | Promise<{ chat_id: string }>;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolvedParams = (React as any).use
    ? (React as any).use(params)
    : params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { chat_id } = resolvedParams as any;
  const { data: session } = useSession();
  const token = session?.user?.accessToken ?? '';
  const queryClient = useQueryClient();

  const { data: chats, isLoading: isLoadingChats } = useUserChats();
  const userCtx = useUserContext();
  const { userId } = userCtx;
  const { data: messages, isLoading: messagesLoading } =
    useChatMessages(chat_id);

  const selectedChat =
    chats?.data.find(c => String(c.id) === String(chat_id)) || null;

  const [connectionState, setConnectionState] = useState<
    'idle' | 'connecting' | 'open' | 'closed' | 'error'
  >('idle');

  const handleSocketPayload = useCallback(
    (payload: any) => {
      if (payload && typeof payload === 'object') {
        // Ensure this message is for the current active chat
        if (payload.chat_id && String(payload.chat_id) !== String(chat_id)) {
          return;
        }

        const isImage =
          payload.message_type === 'images' ||
          payload.message_type === 'image' ||
          payload.is_image_message ||
          Array.isArray(payload.image_urls);

        // Fallback name resolution if sender_name is missing
        let firstName = payload.sender_name?.split(' ')[0] || '';
        const lastName = payload.sender_name?.split(' ')[1] || '';

        if (!firstName) {
          if (String(payload.sender_id) === String(userId)) {
            firstName = 'Me';
          } else if (
            selectedChat &&
            String(payload.sender_id) === String(selectedChat.business.id)
          ) {
            firstName = selectedChat.business.name;
          } else {
            firstName = 'User';
          }
        }

        const newMessage: ChatMessage = {
          id:
            typeof payload.id === 'number'
              ? payload.id
              : Math.floor(Math.random() * 100000000),
          content: payload.message || payload.content || '',
          sender: {
            id: payload.sender_id || 0,
            first_name: firstName,
            last_name: lastName,
            profile_image: payload.sender_profile_image || null,
          },
          is_image_message: isImage,
          image:
            payload.image ||
            (Array.isArray(payload.image_urls) ? payload.image_urls[0] : null),
          images: Array.isArray(payload.image_urls)
            ? payload.image_urls
            : payload.images || [],
          sent_at: payload.created_at || new Date().toISOString(),
          is_read: false,
        };

        queryClient.setQueryData(
          ['chat-messages', chat_id],
          (old: ApiEnvelope<ChatMessage[]> | undefined) => {
            if (!old) return old;

            // Avoid duplicate messages if they were already added (e.g. by optimistic update if we had one)
            const exists = old.data.some(
              (m: ChatMessage) => m.id === newMessage.id
            );
            if (exists) return old;

            return {
              ...old,
              data: [newMessage, ...old.data],
            };
          }
        );
      }
    },
    [chat_id, queryClient, userId, userCtx, selectedChat]
  );

  const handleSocketOpen = useCallback(() => {
    setConnectionState('open');
  }, []);

  const handleSocketClose = useCallback(() => {
    setConnectionState('closed');
  }, []);

  const handleSocketDebug = useCallback((entry: ChatDebugEntry) => {
    if (entry.type === 'connect_attempt') setConnectionState('connecting');
    if (entry.type === 'open') setConnectionState('open');
    if (entry.type === 'close') setConnectionState('closed');
    if (entry.type === 'error') setConnectionState('error');
    console.log('chat debug entry', entry);
  }, []);

  const { sendText } = useChatSocket({
    businessId: String(selectedChat?.business.id ?? ''),
    chatId: String(chat_id),
    token: token ?? '',
    onMessage: handleSocketPayload,
    onImages: handleSocketPayload,
    debug: true,
    onOpen: handleSocketOpen,
    onClose: handleSocketClose,
    onDebug: handleSocketDebug,
  });

  const { addImage } = useAddImage();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
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
      } catch {}
    }
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom < 80;
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => scrollToBottom(true), 50);
    return () => window.clearTimeout(id);
  }, [messages?.data?.length, pendingUploads.length, scrollToBottom]);

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
    if (sending) return;
    setSending(true);
    shouldAutoScrollRef.current = true;
    scrollToBottom(true, true);
    try {
      await sendText(text);
      setText('');
    } catch (err) {
      console.error('send failed', err);
    } finally {
      setSending(false);
    }
  };

  const orderedMessages = useMemo(() => {
    if (!messages?.data) return [];
    return [...messages.data].reverse();
  }, [messages?.data]);

  const imageGallery = useMemo(() => {
    const urls: string[] = [];
    orderedMessages?.forEach(msg => {
      if (msg.is_image_message) {
        if (Array.isArray(msg.images) && msg.images.length > 0) {
          urls.push(...msg.images.map(img => String(img)));
        } else if (msg.image) {
          urls.push(String(msg.image));
        }
      }
    });
    return urls;
  }, [orderedMessages]);

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
              href='/chats'
              className='mr-1 flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted'
            >
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='m15 18-6-6 6-6' />
              </svg>
            </Link>
          )}
          {isLoadingChats ? (
            <div className='h-6 w-32 animate-pulse rounded bg-gray-200' />
          ) : (
            <h2 className='text-lg font-semibold'>
              {isMobile
                ? 'Messages'
                : (selectedChat?.business.name ?? 'Conversation')}
            </h2>
          )}
        </div>
        <div className='flex items-center gap-2'>
          {isLoadingChats ? (
            <div className='h-8 w-32 animate-pulse rounded-[0.825rem] bg-gray-200' />
          ) : isMobile ? (
            <button className='flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted'>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='12' cy='12' r='1' />
                <circle cx='12' cy='5' r='1' />
                <circle cx='12' cy='19' r='1' />
              </svg>
            </button>
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
        className='flex flex-1 flex-col space-y-4 overflow-y-auto p-4 pb-2 lg:p-6 lg:pb-6'
        onScroll={handleScroll}
      >
        <div className='flex w-full flex-col items-center justify-center pb-6 pt-4'>
          <div className='relative mb-2 flex size-20 items-center justify-center overflow-hidden rounded-full bg-black text-white'>
            {selectedChat?.business?.logo ? (
              <Image
                src={selectedChat.business.logo}
                alt=''
                fill
                className='object-cover'
              />
            ) : (
              <span className='text-xl uppercase'>
                {selectedChat?.business?.name?.[0]}
              </span>
            )}
          </div>
          <p className='text-sm text-gray-500'>
            Conversation with{' '}
            <span className='font-semibold text-black'>
              {selectedChat?.business?.name}
            </span>
          </p>
        </div>
        {messagesLoading && (
          <div className='w-full text-center'>Loading messages...</div>
        )}
        {messages && messages.data.length === 0 && (
          <div className='py-6 text-center text-gray-500'>No messages yet</div>
        )}
        {messages &&
          orderedMessages.map(msg => {
            const isOwn = msg.sender.id === userId;
            return (
              <div
                key={msg.id}
                className={`flex items-center gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                {/* Other person's avatar (left side) */}
                {!isOwn && (
                  <div className='relative size-4 shrink-0 overflow-hidden rounded-full bg-gray-200 md:size-5'>
                    {msg.sender.profile_image ? (
                      <Image
                        src={msg.sender.profile_image}
                        alt={msg.sender.first_name}
                        fill
                        className='object-cover'
                      />
                    ) : (
                      <span className='flex h-full w-full items-center justify-center text-[0.6rem] font-semibold uppercase text-gray-600'>
                        {msg.sender.first_name?.[0]}
                      </span>
                    )}
                  </div>
                )}

                {/* Bubble */}
                <div className='relative'>
                  {/* Tail */}
                  {!isOwn && (
                    <span
                      className='absolute -left-[5px] bottom-0 h-0 w-0'
                      style={{
                        borderBottom: '6px solid #F8FAFC',
                        borderLeft: '5px solid transparent',
                      }}
                    />
                  )}
                  {isOwn && (
                    <span
                      className='absolute -right-[5px] top-0 h-0 w-0'
                      style={{
                        borderTop: '6px solid #F8FAFC',
                        borderRight: '5px solid transparent',
                      }}
                    />
                  )}
                  <div
                    className={cn(
                      'w-max max-w-[min(72vw,26rem)] rounded-xl bg-[#F8FAFC] px-3.5 py-2 font-normal leading-snug text-[#0F0F0F]',
                      isOwn ? 'rounded-tr-none' : 'rounded-bl-none'
                    )}
                  >
                    <p className='text-[0.8rem] md:text-sm'>
                      {msg.content ?? ''}
                    </p>
                    {msg.is_image_message && (
                      <div className='mt-2 flex flex-wrap gap-2'>
                        {msg.images && msg.images.length > 0 ? (
                          msg.images.map((img, idx) => (
                            <button
                              key={`${msg.id}-img-${idx}`}
                              type='button'
                              onClick={() => openLightbox(String(img))}
                              className='block focus:outline-none'
                            >
                              <div className='relative size-32 overflow-hidden rounded-xl bg-[#E2E8F0] md:size-40'>
                                <Image
                                  src={String(img)}
                                  alt='Chat image'
                                  fill
                                  sizes='160px'
                                  className='object-cover'
                                  onLoadingComplete={() =>
                                    scrollToBottom(false)
                                  }
                                />
                              </div>
                            </button>
                          ))
                        ) : msg.image ? (
                          <button
                            type='button'
                            onClick={() => openLightbox(String(msg.image))}
                            className='block focus:outline-none'
                          >
                            <div className='relative size-32 overflow-hidden rounded-xl bg-[#E2E8F0] md:size-40'>
                              <Image
                                src={String(msg.image)}
                                alt='Chat image'
                                fill
                                sizes='160px'
                                className='object-cover'
                                onLoadingComplete={() => scrollToBottom(false)}
                              />
                            </div>
                          </button>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>

                {/* Own avatar (right side) */}
                {isOwn && (
                  <div className='relative size-4 shrink-0 overflow-hidden rounded-full bg-gray-200 md:size-5'>
                    {msg.sender.profile_image ? (
                      <Image
                        src={msg.sender.profile_image}
                        alt={msg.sender.first_name}
                        fill
                        className='object-cover'
                      />
                    ) : (
                      <span className='flex h-full w-full items-center justify-center text-[0.6rem] font-semibold uppercase text-gray-600'>
                        {msg.sender.first_name?.[0]}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        {pendingUploads.map(upload => (
          <div key={upload.id} className='flex justify-end'>
            <div className='text-sidebar-primary-foreground w-max max-w-md rounded-lg bg-[#F8FAFC] px-4 py-2 text-sm font-normal leading-snug'>
              <div className='relative mt-2 size-32 overflow-hidden rounded-xl bg-[#E2E8F0] md:size-40'>
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

      <div className='w-full p-2 md:p-4 lg:p-6'>
        {selectedChat && (selectedChat.business.is_free_trial_active || selectedChat.business.owner?.is_premium_plan_active) ? (
        <div className='flex w-full items-center rounded-3xl border border-[#FAFAFA] bg-[#FAFAFA] p-2 shadow-sm ring-1 ring-gray-100 drop-shadow-sm md:bg-[#F8FAFC] md:pl-4'>
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
            className='max-h-[200px] w-full resize-none border-none bg-transparent py-1 text-xs outline-none placeholder:text-gray-500 focus:border-none md:text-sm lg:text-base'
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
              className='flex size-6 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 md:size-8'
            >
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='12' cy='12' r='10' />
                <path d='M8 14s1.5 2 4 2 4-2 4-2' />
                <line x1='9' x2='9.01' y1='9' y2='9' />
                <line x1='15' x2='15.01' y1='9' y2='9' />
              </svg>
            </button>
            <button
              type='button'
              onClick={handleSelectImage}
              className='flex size-6 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 md:size-8'
            >
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48' />
              </svg>
            </button>
            <Button
              size='icon'
              onClick={handleSend}
              className='ml-1 h-10 w-12 shrink-0 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF]'
              variant='unstyled'
              disabled={sending || connectionState !== 'open'}
            >
              {sending ? (
                <svg
                  className='h-5 w-5 animate-spin'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <circle
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='#551FB9'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeDasharray='60'
                    strokeDashoffset='0'
                  ></circle>
                </svg>
              ) : (
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M22 2L11 13'
                    stroke={text?.length > 0 ? '#551FB9' : '#9EA5B5'}
                    strokeWidth='2.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M22 2L15 22L11 13L2 9L22 2Z'
                    stroke={text?.length > 0 ? '#551FB9' : '#9EA5B5'}
                    strokeWidth='2.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>
        ) : (
          <div className='flex w-full items-center justify-center rounded-3xl border border-[#FAFAFA] bg-[#FAFAFA] p-4 text-sm text-gray-500 shadow-sm md:bg-[#F8FAFC]'>
            This business cannot receive messages at this time.
          </div>
        )}
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
