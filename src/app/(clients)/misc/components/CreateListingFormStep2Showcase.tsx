'use client';
import React, { useState, useEffect, useRef } from 'react';
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

// Cloudinary global type declaration
declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (
          error: unknown,
          result: { event: string; info: Record<string, unknown> }
        ) => void
      ) => { open: () => void; close: () => void };
    };
  }
}

const CLOUDINARY_CLOUD_NAME =
  process.env['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'] || 'your_cloud_name';
const CLOUDINARY_UPLOAD_PRESET =
  process.env['NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'] || 'your_upload_preset';

interface ImageData {
  type: 'cloud' | 'local' | 'video';
  source: string | File;
  id?: number;
  /** For video uploads, the public_id returned by Cloudinary */
  publicId?: string;
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
  setBusinessShowCaseFile: (files: File[]) => void;
  setCloudImages?: (
    images: { id: number; image: string; uploaded_at: string }[]
  ) => void;
  initialCloudImages?: { id: number; image: string; uploaded_at: string }[];
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [cloudImages, setLocalCloudImages] = useState(initialCloudImages || []);
  const [previews, setPreviews] = useState<ImageData[]>(() => {
    const images: ImageData[] = (initialCloudImages || []).map(img => ({
      type: 'cloud',
      source: img.image,
      id: img.id,
    }));

    if (initialVideoUrl) {
      // For existing videos, we might not have a thumbnail easily available
      // but we can try to guess it or just use a placeholder
      const thumbnailUrl = initialVideoUrl.replace(/\.[^/.]+$/, ".jpg");
      images.push({
        type: 'video',
        source: thumbnailUrl, // Cloudinary usually supports this replacement for thumbnails
        // Note: we don't have publicId here easily, but ImageData uses source for display
      });
    }
    return images;
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // This effect is now partially redundant due to direct initialization of previews
    // However, it still clears local files and resets current index if initialCloudImages changes
    const cloudImagePreviews: ImageData[] = (initialCloudImages || []).map(img => ({
      type: 'cloud',
      source: img.image,
      id: img.id,
    }));

    const videoPreview: ImageData[] = initialVideoUrl ? [{
      type: 'video',
      source: initialVideoUrl.replace(/\.[^/.]+$/, ".jpg"),
    }] : [];

    setPreviews([...cloudImagePreviews, ...videoPreview]);
    setLocalFiles([]);
    setBusinessShowCaseFile([]);
    setCurrentIndex(0);
  }, [initialCloudImages, initialVideoUrl, setBusinessShowCaseFile]);

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

  const getSlotWidth = (position: number) => {
    // Position relative to center (0 = center)
    const relativePos = position - 2; // -2, -1, 0, 1, 2

    if (relativePos === 0) return 30; // Center slot C
    if (relativePos === -1 || relativePos === 1) return 25; // B and D
    return 20; // A and E (edges)
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

  // ─── Upload handlers ─────────────────────────────────────────────────────────

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const totalCurrent = cloudImages.length + localFiles.length;
    const remainingSlots = 10 - totalCurrent;
    const filesToAdd = files.slice(0, remainingSlots);

    const newFiles = [...localFiles, ...filesToAdd];
    setLocalFiles(newFiles);
    setBusinessShowCaseFile(newFiles);

    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onerror = () => console.error('Failed to read file:', file.name);
      reader.onload = e => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setPreviews(prev => {
            const newItem: ImageData = { type: 'local', source: result };
            const updated = [...prev, newItem];
            setCurrentIndex(updated.length - 1);
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const openCloudinaryWidget = () => {
    if (!window.cloudinary) {
      console.error('Cloudinary widget script not loaded yet.');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        resourceType: 'video',
        clientAllowedFormats: ['mp4', 'mov', 'avi', 'webm', 'mkv'],
        maxFileSize: 500000000, // 500 MB
        showAdvancedOptions: false,
        cropping: false,
        multiple: false,
      },
      (error, result) => {
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
    } else if (imageData.type === 'local') {
      const localFilesBefore = previews
        .slice(0, index)
        .filter(p => p.type === 'local').length;
      const newFiles = localFiles.filter((_, i) => i !== localFilesBefore);
      setLocalFiles(newFiles);
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
      const position = index - currentIndex + 2; // Position in 0-4 range where 2 is center

      // Only render if within visible range
      if (position < -1 || position > 5) return null;

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
      const centerOffset = (20 + 25 + 30 + 25 + 20) / 2; // Half of total width (60%)
      leftPercent = leftPercent - centerOffset + 50;

      return (
        <div
          key={index}
          style={{
            position: 'absolute',
            width: `${widthPercent}%`,
            aspectRatio: '15 / 10',
            left: `${leftPercent}%`,
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: position === 2 ? 10 : 5,
          }}
          className='flex-shrink-0 cursor-pointer pr-4 lg:pr-6'
          onClick={() => setCurrentIndex(index)}
        >
          <div className='relative h-full w-full overflow-hidden rounded-lg'>
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
            {/* Video badge */}
            {isVideo && (
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

  const totalImages = cloudImages.length + localFiles.length;

  return (
    <section className='space-y-6'>
      {/* Carousel */}
      {previews.length > 0 && (
        <div className='relative w-full overflow-hidden'>
          <div className='relative flex min-h-96 w-full items-center gap-4 px-16 py-4'>
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

          {/* Edge fade effects */}
          <div className='pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-32 bg-gradient-to-r from-white to-transparent' />
          <div className='pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-32 bg-gradient-to-l from-white to-transparent' />
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
              disabled={totalImages >= 10}
              onClick={() => setDropdownOpen(prev => !prev)}
              className='inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Upload size={15} />
              Upload
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
                  className='flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-purple-50'
                  onClick={() => {
                    setDropdownOpen(false);
                    fileInputRef.current?.click();
                  }}
                >
                  <ImageIcon
                    size={16}
                    className='flex-shrink-0 text-purple-600'
                  />
                  Photo
                </button>

                <div className='h-px bg-gray-100' />

                {/* Video option */}
                <button
                  type='button'
                  onClick={() => {
                    setDropdownOpen(false);
                    openCloudinaryWidget();
                  }}
                  className='flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-purple-50'
                >
                  <Video size={16} className='flex-shrink-0 text-purple-600' />
                  Video
                </button>
              </div>
            )}
          </div>

          {/* Hidden file input — lives outside the dropdown so it persists in the DOM */}
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            multiple
            onChange={handlePhotoUpload}
            className='sr-only'
            disabled={totalImages >= 10}
          />
        </div>

        {totalImages >= 10 && (
          <p className='mt-2 text-center text-sm text-amber-600'>
            Maximum of 10 items allowed
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
