import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';

interface GalleryModalProps {
  images: string[];
  open: boolean;
  initialIndex: number;
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ images, open, initialIndex, onClose }) => {
  const [current, setCurrent] = React.useState(initialIndex);

  const prev = useCallback(() => setCurrent(c => (c === 0 ? images.length - 1 : c - 1)), [images.length]);
  const next = useCallback(() => setCurrent(c => (c === images.length - 1 ? 0 : c + 1)), [images.length]);

  useEffect(() => {
    if (open) setCurrent(initialIndex);
  }, [open, initialIndex]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto">
        <button
          className="absolute top-4 right-4 bg-white/80 rounded-full p-2 hover:bg-white"
          onClick={onClose}
          aria-label="Close gallery"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" stroke="#222" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div className="relative flex items-center justify-center w-full h-[60vh] max-h-[80vw]">
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
            onClick={prev}
            aria-label="Previous image"
          >
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <Image
            src={images[current]!}
            alt="Gallery"
            className="object-contain rounded-xl max-h-full max-w-full shadow-xl bg-white"
            style={{ maxHeight: '60vh', maxWidth: '80vw' }}
            width={800}
            height={600}
          />
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
            onClick={next}
            aria-label="Next image"
          >
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="#222" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="flex gap-2 mt-4 overflow-x-auto px-2">
          {images.map((img, idx) => (
            <button
              key={img + idx}
              className={`rounded-lg overflow-hidden border-2 ${idx === current ? 'border-white shadow-lg' : 'border-transparent'} transition`}
              style={{ width: 56, height: 56, minWidth: 56 }}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to image ${idx + 1}`}
            >
              <Image src={img} alt="Thumb" className="object-cover w-full h-full" width={56} height={56} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
