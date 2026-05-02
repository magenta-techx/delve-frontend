'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Trash,
  ChevronLeft,
  ChevronRight,
  Upload,
  ChevronDown,
  Image as ImageIcon,
  Video,
} from 'lucide-react';
import Image from 'next/image';
import { useUserContext } from '@/contexts/UserContext';
import { useIsMobile } from '@/hooks/useMobile';
import { toast } from 'sonner';
import { BusinessImage } from '@/types/business/types';

const CLOUDINARY_CLOUD_NAME =
  process.env['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'] || 'your_cloud_name';
const CLOUDINARY_UPLOAD_PRESET =
  process.env['NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'] || 'your_upload_preset';

interface ImageData {
  type: 'cloud' | 'new_cloud' | 'video';
  source: string;
  id?: number;
  /** For video uploads, the public_id returned by Cloudinary */
  publicId?: string;
  /** The actual video URL for playback */
  videoUrl?: string;
}

export interface VideoUploadResult {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  duration?: number;
  thumbnail_url?: string;
}

interface BusinessShowCaseFormProps {
  setBusinessShowCaseFile: (
    files: { url: string; public_id: string }[]
  ) => void;
  setCloudImages?: (images: BusinessImage[]) => void;
  initialCloudImages?: BusinessImage[];
  /** Called whenever a video is successfully uploaded via Cloudinary */
  onVideoUploaded?: (result: VideoUploadResult) => void;
  /** Called whenever a video is removed */
  onVideoRemoved?: () => void;
  initialVideoUrl?: string | undefined;
}

const BusinessShowCaseForm: React.FC<BusinessShowCaseFormProps> = ({
  setBusinessShowCaseFile,
  setCloudImages,
  initialCloudImages,
  onVideoUploaded,
  onVideoRemoved,
  initialVideoUrl,
}: BusinessShowCaseFormProps) => {
  const { user } = useUserContext();
  const { isMobile } = useIsMobile();
  const isPremium = user?.is_premium_plan_active;
  const maxImageCount = isPremium ? 20 : 10;
  const maxImageSize = isPremium ? 20000000 : 10000000; // 20MB vs 10MB
  const maxVideoSize = isPremium ? 500000000 : 100000000; // 500MB vs 100MB

  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<
    { url: string; public_id: string }[]
  >([]);
  const [cloudImages, setLocalCloudImages] = useState(initialCloudImages || []);
  const [previews, setPreviews] = useState<ImageData[]>(() => {
    const images: ImageData[] = (initialCloudImages || []).map(img => ({
      type: 'cloud',
      source: img.url,
      id: img.id,
    }));

    if (initialVideoUrl) {
      // For existing videos, we use a thumbnail for the carousel preview
      const thumbnailUrl = initialVideoUrl.replace(/\.[^/.]+$/, '.jpg');
      images.push({
        type: 'video',
        source: thumbnailUrl,
        videoUrl: initialVideoUrl,
      });
    }
    return images;
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const cloudImagePreviews: ImageData[] = (initialCloudImages || []).map(
      img => ({
        type: 'cloud',
        source: img.url,
        id: img.id,
      })
    );

    const videoPreview: ImageData[] = initialVideoUrl
      ? [
          {
            type: 'video',
            source: initialVideoUrl.replace(/\.[^/.]+$/, '.jpg'),
            videoUrl: initialVideoUrl,
          },
        ]
      : [];

    const newImagePreviews: ImageData[] = uploadedImages.map(img => ({
      type: 'new_cloud',
      source: img.url,
      publicId: img.public_id,
    }));

    setPreviews([...cloudImagePreviews, ...newImagePreviews, ...videoPreview]);
    // We don't reset uploadedImages here anymore to prevent them from disappearing
    // when other props like initialVideoUrl change.
  }, [initialCloudImages, initialVideoUrl, uploadedImages]); // added uploadedImages to ensure sync

  // Load Cloudinary Upload Widget script once
  useEffect(() => {
    if (document.getElementById('cloudinary-widget-script')) return;
    const script = document.createElement('script');
    script.id = 'cloudinary-widget-script';
    script.src = 'https://upload-widget.cloudinary.com/latest/global/all.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ─── Carousel helpers ────────────────────────────────────────────────────────

  const carouselConfig = useMemo(
    () => ({
      // Mobile: Large side slots (25%) so they appear prominent (taller)
      // while still perfectly positioning their inner edges at the 10% / 90% marks
      slotWidths: isMobile ? [25, 80, 25] : [20, 25, 30, 25, 20],
      centerPosition: isMobile ? 1 : 2,
    }),
    [isMobile]
  );

  const getSlotWidth = (position: number) => {
    if (position < 0) {
      return carouselConfig.slotWidths[0] ?? 0;
    }

    if (position >= carouselConfig.slotWidths.length) {
      return (
        carouselConfig.slotWidths[carouselConfig.slotWidths.length - 1] ?? 0
      );
    }

    return carouselConfig.slotWidths[position] ?? 0;
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < previews.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < previews.length - 1;

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const touchStartX = touchStartXRef.current;
    const touchEndX = event.changedTouches[0]?.clientX;

    touchStartXRef.current = null;

    if (touchStartX === null || touchEndX === undefined) {
      return;
    }

    const deltaX = touchEndX - touchStartX;

    if (Math.abs(deltaX) < 40) {
      return;
    }

    if (deltaX > 0) {
      handlePrev();
      return;
    }

    handleNext();
  };

  // ─── Upload handlers ─────────────────────────────────────────────────────────

  const openImageCloudinaryWidget = () => {
    if (!window.cloudinary) {
      toast.error('Upload service is loading. Please try again in a moment.');
      return;
    }

    const currentImageCount = cloudImages.length + uploadedImages.length;
    if (currentImageCount >= maxImageCount) {
      toast.error(
        `You have reached the maximum limit of ${maxImageCount} images for your ${isPremium ? 'Premium' : 'Free'} plan.`
      );
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        resourceType: 'image',
        clientAllowedFormats: ['png', 'jpeg', 'jpg', 'webp'],
        maxFileSize: maxImageSize,
        showAdvancedOptions: false,
        cropping: false,
        multiple: true,
        maxFiles: maxImageCount - currentImageCount,
      },
      (error: any, result: any) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return;
        }

        if (result.event === 'success') {
          const info = result.info as any;

          setPreviews(prev => {
            const newItem: ImageData = {
              type: 'new_cloud',
              source: info.secure_url,
              publicId: info.public_id,
            };
            const updated = [...prev, newItem];
            setCurrentIndex(updated.length - 1);
            return updated;
          });

          setUploadedImages(prev => {
            const newImages = [
              ...prev,
              { url: info.secure_url, public_id: info.public_id },
            ];
            return newImages;
          });
        }

        if (result.event === 'queues-end') {
          setUploadedImages(prev => {
            setBusinessShowCaseFile(prev);
            return prev;
          });
          widget.close();
        }
      }
    );

    widget.open();
  };

  const openCloudinaryWidget = () => {
    if (!window.cloudinary) {
      toast.error('Upload service is loading. Please try again in a moment.');
      return;
    }

    if (previews.some(p => p.type === 'video')) {
      toast.error('Only one video is allowed.');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        resourceType: 'video',
        clientAllowedFormats: ['mp4', 'mov', 'avi', 'webm', 'mkv'],
        maxFileSize: maxVideoSize,
        showAdvancedOptions: false,
        cropping: false,
        multiple: false,
        maxFiles: 1,
      },
      (error: any, result: any) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return;
        }

        if (result.event === 'success') {
          const info = result.info as unknown as VideoUploadResult;
          const thumbnailUrl =
            (info.thumbnail_url as string | undefined) ||
            `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/so_0/${info.public_id}.jpg`;

          setPreviews(prev => {
            const newItem: ImageData = {
              type: 'video',
              source: thumbnailUrl,
              publicId: info.public_id as string,
              videoUrl: info.secure_url as string,
            };
            const updated = [...prev, newItem];
            setCurrentIndex(updated.length - 1);
            return updated;
          });

          onVideoUploaded?.(info);
          widget.close();
        }
      }
    );

    widget.open();
  };

  // ─── Removal ─────────────────────────────────────────────────────────────────

  const removeFile = (index: number) => {
    const imageData = previews[index];
    if (!imageData) return;

    if (imageData.type === 'cloud') {
      const cloudImagesBefore = previews
        .slice(0, index)
        .filter(p => p.type === 'cloud').length;
      const newCloudImages = cloudImages.filter(
        (_, i) => i !== cloudImagesBefore
      );
      setLocalCloudImages(newCloudImages);
      setCloudImages?.(newCloudImages);
    } else if (imageData.type === 'new_cloud') {
      const newCloudBefore = previews
        .slice(0, index)
        .filter(p => p.type === 'new_cloud').length;
      const newFiles = uploadedImages.filter((_, i) => i !== newCloudBefore);
      setUploadedImages(newFiles);
      setBusinessShowCaseFile(newFiles);
    } else if (imageData.type === 'video') {
      onVideoRemoved?.();
    }

    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);

    if (currentIndex >= newPreviews.length && newPreviews.length > 0) {
      setCurrentIndex(newPreviews.length - 1);
    }
  };

  const renderCarouselItems = () => {
    if (previews.length === 0) return null;

    return previews.map((imageData, index) => {
      // Calculate position relative to currentIndex
      const position = index - currentIndex + carouselConfig.centerPosition;

      // Only render if within visible range
      if (position < -1 || position > carouselConfig.slotWidths.length) {
        return null;
      }

      const imgSrc =
        typeof imageData.source === 'string' ? imageData.source : '';
      const isVideo = imageData.type === 'video';

      const widthPercent = getSlotWidth(position);

      // Calculate the left position by accumulating widths from position 0
      let leftPercent = 0;
      for (let i = 0; i < position; i++) {
        leftPercent += getSlotWidth(i);
      }

      // Center the entire carousel strip
      const centerOffset =
        carouselConfig.slotWidths.reduce((total, width) => total + width, 0) /
        2;
      leftPercent = leftPercent - centerOffset + 50;

      return (
        <div
          key={index}
          style={{
            position: 'absolute',
            width: `${widthPercent}%`,
            // Square aspect on mobile for bolder presentation
            aspectRatio: isMobile ? '1 / 1' : '15 / 10',
            left: `${leftPercent}%`,
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: position === carouselConfig.centerPosition ? 10 : 5,
          }}
          className='flex-shrink-0 cursor-pointer pr-4 lg:pr-6'
          onClick={() => setCurrentIndex(index)}
        >
          <div className='relative h-full w-full overflow-hidden rounded-lg'>
            {isVideo &&
            position === carouselConfig.centerPosition &&
            imageData.videoUrl ? (
              <video
                src={imageData.videoUrl}
                controls
                className='h-full w-full rounded-lg object-cover'
              />
            ) : (
              <Image
                src={imgSrc}
                fill
                style={{ objectFit: 'cover' }}
                alt={`Business showcase ${index + 1}`}
                className='h-full w-full rounded-lg object-cover'
                onError={e => {
                  console.error('Image failed to load:', imgSrc);
                  (e.target as HTMLImageElement).style.background = '#f0f0f0';
                }}
              />
            )}
            {/* Video badge */}
            {isVideo && position !== carouselConfig.centerPosition && (
              <span className='absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white'>
                <Video size={10} />
                Video
              </span>
            )}
            <button
              type='button'
              onClick={e => {
                e.stopPropagation();
                removeFile(index);
              }}
              className='absolute left-2 top-2 z-30 rounded-md bg-white p-1.5 text-[#BC1B06] shadow-lg transition-colors hover:bg-red-300'
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
      );
    });
  };

  const totalImages = cloudImages.length + uploadedImages.length;

  return (
    <section className='space-y-6'>
      {/* Carousel */}
      {previews.length > 0 && (
        <div className='relative w-full overflow-hidden'>
          <div
            className='relative flex min-h-96 w-full items-center gap-4 px-4 py-4 md:px-16'
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={() => {
              touchStartXRef.current = null;
            }}
          >
            {renderCarouselItems()}
          </div>

          {/* Navigation Buttons */}
          {previews.length > 1 && (
            <>
              <button
                type='button'
                onClick={handlePrev}
                disabled={!canGoLeft}
                className='absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'
                aria-label='Previous slide'
              >
                <ChevronLeft size={24} className='text-gray-700' />
              </button>

              <button
                type='button'
                onClick={handleNext}
                disabled={!canGoRight}
                className='absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'
                aria-label='Next slide'
              >
                <ChevronRight size={24} className='text-gray-700' />
              </button>
            </>
          )}

          {/* Edge fade effects (hidden on mobile per new design) */}
          {!isMobile && (
            <>
              <div className='pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-16 bg-gradient-to-r from-white to-transparent md:w-32' />
              <div className='pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-16 bg-gradient-to-l from-white to-transparent md:w-32' />
            </>
          )}
        </div>
      )}

      {/* Upload Area */}
      <div className='relative mx-auto max-w-xl'>
        <div className='flex flex-col items-center justify-center gap-3 rounded-lg border-[1.75px] border-dashed border-[#9AA4B2] bg-[#FBFAFF] p-8'>
          <Upload className='h-12 w-12 text-purple-600' />
          <p className='font-inter text-sm text-gray-900'>
            Upload service media
          </p>

          {/* Dropdown trigger button */}
          <div className='relative' ref={dropdownRef}>
            <button
              type='button'
              disabled={totalImages >= maxImageCount}
              onClick={() => setDropdownOpen(prev => !prev)}
              className='inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Upload size={15} />
              {totalImages >= maxImageCount ? 'Limit Reached' : 'Upload'}
              <ChevronDown
                size={15}
                className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div className='absolute left-1/2 z-50 mt-2 w-44 -translate-x-1/2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl'>
                {/* Photo option */}
                <button
                  type='button'
                  disabled={totalImages >= maxImageCount}
                  className='flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50'
                  onClick={() => {
                    setDropdownOpen(false);
                    openImageCloudinaryWidget();
                  }}
                >
                  <ImageIcon
                    size={16}
                    className={`flex-shrink-0 ${totalImages >= maxImageCount ? 'text-gray-400' : 'text-purple-600'}`}
                  />
                  Photo ({totalImages}/{maxImageCount})
                </button>

                <div className='h-px bg-gray-100' />

                {/* Video option */}
                <button
                  type='button'
                  disabled={previews.some(p => p.type === 'video')}
                  onClick={() => {
                    setDropdownOpen(false);
                    openCloudinaryWidget();
                  }}
                  className='flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <Video
                    size={16}
                    className={`flex-shrink-0 ${previews.some(p => p.type === 'video') ? 'text-gray-400' : 'text-purple-600'}`}
                  />
                  Video {previews.some(p => p.type === 'video') && '(1 max)'}
                </button>
              </div>
            )}
          </div>
        </div>

        {totalImages >= maxImageCount && (
          <p className='mt-2 text-center text-sm font-medium text-amber-600'>
            Maximum of {maxImageCount} images allowed on your{' '}
            {isPremium ? 'Premium' : 'Free'} plan.
            {!isPremium && ' Upgrade for more storage.'}
          </p>
        )}
      </div>

      {previews.length > 0 && (
        <p className='text-center text-sm text-gray-600'>
          {previews.length} item{previews.length !== 1 ? 's' : ''} uploaded
        </p>
      )}
    </section>
  );
};

export default BusinessShowCaseForm;
