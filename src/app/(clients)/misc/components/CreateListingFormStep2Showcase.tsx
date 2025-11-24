'use client';
import React, { useState } from 'react';
import { Trash } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import { UploadIcon } from '../icons';

interface BusinessShowCaseFormProps {
  setBusinessShowCaseFile: (files: File[]) => void;
}

const BusinessShowCaseForm: React.FC<BusinessShowCaseFormProps> = ({
  setBusinessShowCaseFile,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Limit to 10 images total
    const remainingSlots = 10 - uploadedFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newFiles = [...uploadedFiles, ...filesToAdd];
    setUploadedFiles(newFiles);
    setBusinessShowCaseFile(newFiles);

    // Create previews for new files
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setUploadedFiles(newFiles);
    setPreviews(newPreviews);
    setBusinessShowCaseFile(newFiles);
  };

  return (
    <section className="space-y-6">
     


      {/* Uploaded Images Carousel */}
      {uploadedFiles.length > 0 && (
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
            {previews.map((preview, index) => {
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
                      src={preview}
                      alt={`Business showcase ${index + 1}`}
                      className={`w-full h-auto rounded-lg object-cover ${maxHeight}`}
                      style={{
                        aspectRatio: 'auto'
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
            disabled={uploadedFiles.length >= 10}
          />
        </div>
        {uploadedFiles.length >= 10 && (
          <p className="mt-2 text-sm text-amber-600">
            Maximum of 10 images allowed
          </p>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <p className="text-center text-sm text-gray-600">
          {uploadedFiles.length} image{uploadedFiles.length !== 1 ? 's' : ''} uploaded
        </p>
      )}
    </section>
  );
};

export default BusinessShowCaseForm;