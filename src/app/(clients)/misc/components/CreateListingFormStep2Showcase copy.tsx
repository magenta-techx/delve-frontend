'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Trash, ChevronLeft, ChevronRight, Upload, ChevronDown, Image as ImageIcon, Video } from 'lucide-react';

// Cloudinary global type declaration
declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: unknown, result: { event: string; info: Record<string, unknown> }) => void
      ) => { open: () => void; close: () => void };
    };
  }
}

const CLOUDINARY_CLOUD_NAME = process.env['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'] || 'your_cloud_name';
const CLOUDINARY_UPLOAD_PRESET = process.env['NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'] || 'your_upload_preset';

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
  setCloudImages?: (images: { id: number; image: string; uploaded_at: string }[]) => void;
  initialCloudImages?: { id: number; image: string; uploaded_at: string }[];
  /** Called whenever a video is successfully uploaded via Cloudinary */
  onVideoUploaded?: (result: VideoUploadResult) => void;
}

const BusinessShowCaseForm: React.FC<BusinessShowCaseFormProps> = ({
  setBusinessShowCaseFile,
  setCloudImages,
  initialCloudImages = [],
  onVideoUploaded,
}) => {
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [cloudImages, setCloudImagesState] = useState<{ id: number; image: string; uploaded_at: string }[]>(initialCloudImages);
  const [previews, setPreviews] = useState<ImageData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const cloudImagePreviews: ImageData[] = initialCloudImages.map(img => ({
      type: 'cloud',
      source: img.image,
      id: img.id,
    }));
    setPreviews(cloudImagePreviews);
    setLocalFiles([]);
    setBusinessShowCaseFile([]);
    setCurrentIndex(0);
  }, [initialCloudImages, setBusinessShowCaseFile]);

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

  const getVisibleSlots = () => {
    const total = previews.length;
    if (total === 0) return [];
    if (total === 1) return [{ index: 0, slot: 'C' }];
    if (total === 2) return [{ index: 0, slot: 'C' }, { index: 1, slot: 'D' }];
    if (total === 3) return [{ index: 0, slot: 'B' }, { index: 1, slot: 'C' }, { index: 2, slot: 'D' }];
    if (total === 4) return [
      { index: 0, slot: 'A' },
      { index: 1, slot: 'B' },
      { index: 2, slot: 'C' },
      { index: 3, slot: 'D' },
    ];
    return [
      { index: currentIndex, slot: 'A' },
      { index: currentIndex + 1, slot: 'B' },
      { index: currentIndex + 2, slot: 'C' },
      { index: currentIndex + 3, slot: 'D' },
      { index: currentIndex + 4, slot: 'E' },
    ];
  };

  const visibleSlots = getVisibleSlots();
  const canGoLeft = previews.length >= 5 && currentIndex > 0;
  const canGoRight = previews.length >= 5 && currentIndex < previews.length - 5;

  const handlePrev = () => { if (canGoLeft) setCurrentIndex(prev => Math.max(0, prev - 1)); };
  const handleNext = () => { if (canGoRight) setCurrentIndex(prev => Math.min(previews.length - 5, prev + 1)); };

  const getSlotWidth = (slot: string) => {
    switch (slot) {
      case 'A': case 'E': return 20;
      case 'B': case 'D': return 25;
      case 'C': return 30;
      default: return 25;
    }
  };

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

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onerror = () => console.error('Failed to read file:', file.name);
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setPreviews((prev) => {
            const newItem: ImageData = { type: 'local', source: result };
            const updated = [...prev, newItem];
            if (updated.length >= 5) setCurrentIndex(updated.length - 5);
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
          const thumbnailUrl = (info.thumbnail_url as string | undefined) ||
            `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/so_0/${info.public_id}.jpg`;

          setPreviews((prev) => {
            const newItem: ImageData = {
              type: 'video',
              source: thumbnailUrl,
              publicId: info.public_id as string,
            };
            const updated = [...prev, newItem];
            if (updated.length >= 5) setCurrentIndex(updated.length - 5);
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
      const cloudImagesBefore = previews.slice(0, index).filter(p => p.type === 'cloud').length;
      const newCloudImages = cloudImages.filter((_, i) => i !== cloudImagesBefore);
      setCloudImages?.(newCloudImages);
      setCloudImagesState(newCloudImages);
    } else if (imageData.type === 'local') {
      const localFilesBefore = previews.slice(0, index).filter(p => p.type === 'local').length;
      const newFiles = localFiles.filter((_, i) => i !== localFilesBefore);
      setLocalFiles(newFiles);
      setBusinessShowCaseFile(newFiles);
    }
    // video type: managed externally via onVideoUploaded callback

    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);

    if (newPreviews.length >= 5 && currentIndex > newPreviews.length - 5) {
      setCurrentIndex(Math.max(0, newPreviews.length - 5));
    } else if (newPreviews.length < 5) {
      setCurrentIndex(0);
    }
  };

  const totalImages = cloudImages.length + localFiles.length;

  return (
    <section className="space-y-6">
      {/* Carousel */}
      {previews.length > 0 && (
        <div className="w-full relative">
          <div className="flex items-center justify-center gap-4 px-16 py-4">
            {visibleSlots.map(({ index, slot }) => {
              const imageData = previews[index];
              if (!imageData) return null;

              const imgSrc = typeof imageData.source === 'string' ? imageData.source : '';
              const isVideo = imageData.type === 'video';
              const widthPercent = getSlotWidth(slot);

              return (
                <div
                  key={`${slot}-${index}`}
                  style={{
                    width: `${widthPercent}%`,
                    aspectRatio: '15 / 10',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  className="relative overflow-hidden rounded-lg flex-shrink-0"
                >
                  <img
                    src={imgSrc}
                    alt={`Business showcase ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      console.error('Image failed to load:', imgSrc);
                      (e.target as HTMLImageElement).style.background = '#f0f0f0';
                    }}
                  />
                  {/* Video badge */}
                  {isVideo && (
                    <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      <Video size={10} />
                      Video
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute left-2 top-2 rounded-md bg-white p-1.5 text-[#BC1B06] shadow-lg hover:bg-red-300 transition-colors z-30"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          {previews.length >= 5 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                disabled={!canGoLeft}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Previous slide"
              >
                <ChevronLeft size={24} className="text-gray-700" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoRight}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Next slide"
              >
                <ChevronRight size={24} className="text-gray-700" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Upload Area */}
      <div className="relative max-w-xl mx-auto">
        <div className="flex flex-col items-center justify-center rounded-lg border-[1.75px] border-dashed border-[#9AA4B2] bg-[#FBFAFF] p-8 gap-3">
          <Upload className="h-12 w-12 text-purple-600" />
          <p className="text-sm font-inter text-gray-900">Upload service media</p>

          {/* Dropdown trigger button */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              disabled={totalImages >= 10}
              onClick={() => setDropdownOpen(prev => !prev)}
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Upload size={15} />
              Upload
              <ChevronDown size={15} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-44 rounded-xl border border-gray-100 bg-white shadow-xl z-50 overflow-hidden">
                {/* Photo option */}
                <label
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-purple-50 transition-colors text-sm text-gray-700 font-medium"
                  onClick={() => setDropdownOpen(false)}
                >
                  <ImageIcon size={16} className="text-purple-600 flex-shrink-0" />
                  Photo
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="sr-only"
                    disabled={totalImages >= 10}
                  />
                </label>

                <div className="h-px bg-gray-100" />

                {/* Video option */}
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    openCloudinaryWidget();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors text-sm text-gray-700 font-medium"
                >
                  <Video size={16} className="text-purple-600 flex-shrink-0" />
                  Video
                </button>
              </div>
            )}
          </div>
        </div>

        {totalImages >= 10 && (
          <p className="mt-2 text-sm text-amber-600 text-center">
            Maximum of 10 items allowed
          </p>
        )}
      </div>

      {previews.length > 0 && (
        <p className="text-center text-sm text-gray-600">
          {previews.length} item{previews.length !== 1 ? 's' : ''} uploaded
        </p>
      )}
    </section>
  );
};

export default BusinessShowCaseForm;