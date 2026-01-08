'use client';
import React, { useState, useEffect } from 'react';
import { Trash, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

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

  // Get slot width percentage - intentionally over 100% for overflow
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
            
            // Auto-scroll to show the newest item
            setCurrentIndex(updated.length - 1);
            
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
    if (currentIndex >= newPreviews.length && newPreviews.length > 0) {
      setCurrentIndex(newPreviews.length - 1);
    }
  };

  const totalImages = cloudImages.length + localFiles.length;

  // Render carousel items with proper positioning
  const renderCarouselItems = () => {
    if (previews.length === 0) return null;
    
    return previews.map((imageData, index) => {
      // Calculate position relative to currentIndex
      const position = index - currentIndex + 2; // Position in 0-4 range where 2 is center
      
      // Only render if within visible range
      if (position < -1 || position > 5) return null;

      let imgSrc = '';
      if (typeof imageData.source === 'string') {
        imgSrc = imageData.source;
      }

      const widthPercent = getSlotWidth(position);
      
      // Calculate the left position by accumulating widths from position 0
      let leftPercent = 0;
      for (let i = 0; i < position; i++) {
        leftPercent += getSlotWidth(i);
      }
      
      // Center the entire carousel strip
      const centerOffset = (20 + 25 + 30 + 25 + 20) / 2; // Half of total width (60%)
      leftPercent = leftPercent - centerOffset + 50; // Adjust to center in viewport

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
          className="flex-shrink-0 pr-4 lg:pr-6"
        >
          <div className="relative overflow-hidden rounded-lg w-full h-full">
            <Image
              src={imgSrc}
              fill
              style={{ objectFit: 'cover' }}
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
        </div>
      );
    });
  };

  return (
    <section className="space-y-6">
      {/* Custom Carousel with Smooth Transitions */}
      {previews.length > 0 && (
        <div className="w-full relative overflow-hidden">
          <div className="flex items-center relative w-full min-h-96 px-16 py-4 gap-4">
            {renderCarouselItems()}
          </div>

          {/* Navigation Buttons */}
          {previews.length > 1 && (
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

          {/* Edge fade effects */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-20" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-20" />
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