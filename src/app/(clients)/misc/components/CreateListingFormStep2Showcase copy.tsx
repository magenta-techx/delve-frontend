'use client';
import React, { useState, useEffect } from 'react';
import { Trash, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock UploadIcon component
const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

interface ImageData {
  type: 'cloud' | 'local';
  source: string | File;
  id?: number;
}

interface BusinessShowCaseFormProps {
  setBusinessShowCaseFile: (files: File[]) => void;
  setCloudImages?: (images: { id: number; image: string; uploaded_at: string }[]) => void;
  initialCloudImages?: { id: number; image: string; uploaded_at: string }[];
}

const BusinessShowCaseForm: React.FC<BusinessShowCaseFormProps> = ({
  setBusinessShowCaseFile,
  setCloudImages,
  initialCloudImages = [],
}) => {
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [cloudImages, setCloudImagesState] = useState<{ id: number; image: string; uploaded_at: string }[]>(initialCloudImages);
  const [previews, setPreviews] = useState<ImageData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Calculate which images are visible based on count and current index
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
      { index: 3, slot: 'D' }
    ];
    
    // 5 or more items - show 5 slots starting from currentIndex
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

  const handlePrev = () => {
    if (canGoLeft) {
      setCurrentIndex(prev => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    if (canGoRight) {
      setCurrentIndex(prev => Math.min(previews.length - 5, prev + 1));
    }
  };

  // Get slot width percentage
  const getSlotWidth = (slot: string) => {
    switch (slot) {
      case 'A': case 'E': return 20; // (100 - 35 - 20 - 20) / 2
      case 'B': case 'D': return 25;
      case 'C': return 30;
      default: return 25;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      reader.onerror = () => {
        console.error('Failed to read file:', file.name);
      };
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setPreviews((prev) => {
            const newItem: ImageData = {
              type: 'local',
              source: result,
            };
            const updated = [...prev, newItem];
            
            // Auto-scroll to show the newest item in slot E if we have 5+ items
            if (updated.length >= 5) {
              setCurrentIndex(updated.length - 5);
            }
            
            return updated;
          });
        } else {
          console.error('FileReader result is not a string for file:', file.name);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    const imageData = previews[index];

    if (!imageData) return;

    if (imageData.type === 'cloud') {
      const cloudImagesBefore = previews
        .slice(0, index)
        .filter(p => p.type === 'cloud').length;

      const newCloudImages = cloudImages.filter((_, i) => i !== cloudImagesBefore);
      setCloudImages?.(newCloudImages);
      setCloudImagesState(newCloudImages);
    } else {
      const localFilesBefore = previews
        .slice(0, index)
        .filter(p => p.type === 'local').length;

      const newFiles = localFiles.filter((_, i) => i !== localFilesBefore);
      setLocalFiles(newFiles);
      setBusinessShowCaseFile(newFiles);
    }

    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    
    // Adjust currentIndex if needed after deletion
    if (newPreviews.length >= 5 && currentIndex > newPreviews.length - 5) {
      setCurrentIndex(Math.max(0, newPreviews.length - 5));
    } else if (newPreviews.length < 5) {
      setCurrentIndex(0);
    }
  };

  const totalImages = cloudImages.length + localFiles.length;

  return (
    <section className="space-y-6">
      {/* Custom Carousel with 5 Slots */}
      {previews.length > 0 && (
        <div className="w-full relative">
          <div className="flex items-center justify-center gap-4 px-16 py-4">
            {visibleSlots.map(({ index, slot }) => {
              const imageData = previews[index];
              if (!imageData) return null;

              let imgSrc = '';
              if (typeof imageData.source === 'string') {
                imgSrc = imageData.source;
              }

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
        <div className="flex flex-col items-center justify-center rounded-lg border-[1.75px] border-dashed border-[#9AA4B2] bg-[#FBFAFF] p-8">
          <UploadIcon className="h-12 w-12 text-purple-600" />
          <p className="mt-4 text-sm font-inter text-gray-900">Upload service image</p>
         
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            disabled={totalImages >= 10}
          />
        </div>
        {totalImages >= 10 && (
          <p className="mt-2 text-sm text-amber-600">
            Maximum of 10 images allowed
          </p>
        )}
      </div>

      {totalImages > 0 && (
        <p className="text-center text-sm text-gray-600">
          {totalImages} image{totalImages !== 1 ? 's' : ''} uploaded
        </p>
      )}
    </section>
  );
};

export default BusinessShowCaseForm;