import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';

interface GalleryModalProps {
  images: string[];
  open: boolean;
  initialIndex: number;
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  images,
  open,
  initialIndex,
  onClose,
}) => {
  const [current, setCurrent] = React.useState(initialIndex);

  const prev = useCallback(
    () => setCurrent(c => (c === 0 ? images.length - 1 : c - 1)),
    [images.length]
  );
  const next = useCallback(
    () => setCurrent(c => (c === images.length - 1 ? 0 : c + 1)),
    [images.length]
  );

  useEffect(() => {
    if (open) setCurrent(initialIndex);
  }, [open, initialIndex]);

  // Lock body scroll when the modal is open (important on mobile)
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, current, onClose, prev, next]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm'>
      {/* Click-away overlay (kept below content) */}
      <div className='absolute inset-0 z-0' onClick={onClose} />
      <div className='relative z-10 flex w-full max-w-3xl flex-col items-center px-3 sm:px-4'>
        <button
          className='absolute right-3 top-3 rounded-full bg-white/80 p-1 shadow-sm hover:bg-white sm:right-4 sm:top-4 sm:p-2'
          onClick={onClose}
          aria-label='Close gallery'
        >
          <svg
            className='h-5 w-5 sm:h-7 sm:w-7'
            fill='none'
            viewBox='0 0 24 24'
          >
            <path
              d='M6 6l12 12M6 18L18 6'
              stroke='#222'
              strokeWidth='2'
              strokeLinecap='round'
            />
          </svg>
        </button>
        <div className='relative flex w-full items-center justify-center pt-10 sm:pt-12'>
          <button
            className='absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow-sm hover:bg-white sm:left-3 sm:p-2'
            onClick={prev}
            aria-label='Previous image'
          >
            <svg
              className='h-6 w-6 sm:h-8 sm:w-8'
              fill='none'
              viewBox='0 0 24 24'
            >
              <path
                d='M15 19l-7-7 7-7'
                stroke='#222'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
          </button>
          <div className='relative w-full'>
            <Image
              src={images[current]!}
              alt='Gallery'
              className='mx-auto rounded-xl bg-white object-contain shadow-xl'
              sizes='(max-width: 640px) 100vw, 80vw'
              width={800}
              height={600}
              style={{ maxHeight: '70vh', width: '100%', height: 'auto' }}
            />
          </div>
          <button
            className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow-sm hover:bg-white sm:right-3 sm:p-2'
            onClick={next}
            aria-label='Next image'
          >
            <svg
              className='h-6 w-6 sm:h-8 sm:w-8'
              fill='none'
              viewBox='0 0 24 24'
            >
              <path
                d='M9 5l7 7-7 7'
                stroke='#222'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
          </button>
        </div>
        {images.length > 1 && (
          <div className='mt-4 flex max-w-full gap-2 overflow-x-auto px-1 sm:px-2'>
            {images.map((img, idx) => (
              <button
                key={img + idx}
                className={`overflow-hidden rounded-lg border-2 transition ${idx === current ? 'border-white shadow-lg' : 'border-transparent'}`}
                style={{ width: 44, height: 44, minWidth: 44 }}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to image ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt='Thumb'
                  className='h-full w-full object-cover'
                  width={56}
                  height={56}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
