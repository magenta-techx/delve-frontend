'use client';
import React, { useState, useEffect } from 'react';
import { Trash } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';

// Import Swiper styles
// @ts-ignore - Swiper CSS modules don't have type declarations
import 'swiper/css';
// @ts-ignore
import 'swiper/css/effect-coverflow';
// @ts-ignore
import 'swiper/css/navigation';
import { UploadIcon } from '../icons';

interface ImageData {
  type: 'cloud' | 'local';
  source: string | File; // URL string for cloud, File object for local
  id?: number; // Only for cloud images
}

interface BusinessShowCaseFormProps {
  setBusinessShowCaseFile: (files: File[]) => void;
  setCloudImages?: (images: { id: number; image: string; uploaded_at: string }[]) => void;
  initialCloudImages?: { id: number; image: string; uploaded_at: string }[];
}

const BusinessShowCaseForm: React.FC<BusinessShowCaseFormProps> = ({
  setBusinessShowCaseFile,
  setCloudImages,
  initialCloudImages = [] as { id: number; image: string; uploaded_at: string }[],
}) => {
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [cloudImages, setCloudImagesState] = useState<{ id: number; image: string; uploaded_at: string }[]>(initialCloudImages);
  const [previews, setPreviews] = useState<ImageData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Initialize with cloud images on mount
  useEffect(() => {
    const cloudImagePreviews: ImageData[] = initialCloudImages.map(img => ({
      type: 'cloud',
      source: img.image,
      id: img.id,
    }));
    setPreviews(cloudImagePreviews);
    setLocalFiles([]);
    // Reset businessShowCaseFile to empty when initializing with cloud images
    // Did this to ensure we don't re-upload files from a previous session
    setBusinessShowCaseFile([]);
  }, [initialCloudImages, setBusinessShowCaseFile]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Total limit is 10 images (cloud + local combined)
    const totalCurrent = cloudImages.length + localFiles.length;
    const remainingSlots = 10 - totalCurrent;
    const filesToAdd = files.slice(0, remainingSlots);

    const newFiles = [...localFiles, ...filesToAdd];
    setLocalFiles(newFiles);
    setBusinessShowCaseFile(newFiles);

    // Create previews for new files
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onerror = () => {
        console.error('Failed to read file:', file.name);
      };
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setPreviews((prev) => [
            ...prev,
            {
              type: 'local',
              source: result, 
            },
          ]);
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
      // Count how many cloud images come before this one
      const cloudImagesBefore = previews
        .slice(0, index)
        .filter(p => p.type === 'cloud').length;
      
      // Remove from cloud images
      const newCloudImages = cloudImages.filter((_, i) => i !== cloudImagesBefore);
      setCloudImages?.(newCloudImages);
      setCloudImagesState(newCloudImages);
    } else {
      // Count how many local files come before this one
      const localFilesBefore = previews
        .slice(0, index)
        .filter(p => p.type === 'local').length;
      
      // Remove from local files
      const newFiles = localFiles.filter((_, i) => i !== localFilesBefore);
      setLocalFiles(newFiles);
      setBusinessShowCaseFile(newFiles);
    }

    // Remove from previews
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  const totalImages = cloudImages.length + localFiles.length;

  return (
    <section className="space-y-6">
      {/* Uploaded Images Carousel */}
      {previews.length > 0 && (
        <div className="w-full overflow-hidden flex justify-center">
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            slideToClickedSlide={true}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.activeIndex);
            }}
            modules={[EffectCoverflow]}
            className="w-full py-8 flex justify-center items-center"
            breakpoints={{
              // Mobile: Regular carousel
              320: {
                slidesPerView: 1.2,
                spaceBetween: 15,
                centeredSlides: true,
              },
              640: {
                slidesPerView: 2.2,
                spaceBetween: 20,
                centeredSlides: true,
              },
              // Desktop: Diminishing carousel with coverflow effect
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
                centeredSlides: true,
                effect: 'coverflow',
                coverflowEffect: {
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 2,
                  slideShadows: false,
                },
              },
            }}
          >
            {previews.map((imageData, index) => {
              const distance = Math.abs(index - activeIndex);
              
              // Calculate scale and dimensions based on distance from center (desktop only)
              let scaleClass = '';
              let containerWidth = '';
              let maxHeight = '';
              
              if (distance === 0) {
                // Center slide - largest
                scaleClass = 'lg:scale-110';
                containerWidth = 'w-full';
                maxHeight = 'lg:max-h-[400px]';
              } else if (distance === 1) {
                // Adjacent slides - medium
                scaleClass = 'lg:scale-75';
                containerWidth = 'w-full';
                maxHeight = 'lg:max-h-[300px]';
              } else {
                // Far slides - smallest
                scaleClass = 'lg:scale-70';
                containerWidth = 'w-full';
                maxHeight = 'lg:max-h-[250px]';
              }

              const opacityClass = distance === 0 
                ? 'opacity-100' 
                : distance === 1 
                ? 'opacity-80' 
                : 'opacity-60';
              
              // Determine the image source
              let imgSrc = '';
              if (typeof imageData.source === 'string') {
                imgSrc = imageData.source;
              }
              
              return (
                <SwiperSlide
                  key={index}
                  className="!flex !justify-center !items-center"
                >
                  <div
                    className={`relative transition-all duration-500 ease-out overflow-hidden rounded-lg ${scaleClass} ${containerWidth} ${opacityClass} z-10 mx-auto flex justify-center`}
                    style={{
                      transformOrigin: 'center center'
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt={`Business showcase ${index + 1}`}
                      className={`w-full h-auto rounded-lg object-cover ${maxHeight}`}
                      style={{
                        aspectRatio: 'auto'
                      }}
                      onError={(e) => {
                        console.error('Image failed to load:', imgSrc);
                        (e.target as HTMLImageElement).style.background = '#f0f0f0';
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', imgSrc);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute left-4 top-4 rounded-md bg-[#FFFFFF] p-1.5 text-[#BC1B06] shadow-lg hover:bg-red-300 transition-colors z-30"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
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