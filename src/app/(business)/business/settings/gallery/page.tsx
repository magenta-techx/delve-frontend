'use client';

import { useState, useEffect, useRef } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useUserContext } from '@/contexts/UserContext';
import {
  useUploadBusinessImages,
  useDeleteBusinessImage,
} from '@/app/(business)/misc/api/business';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Upload2Icon } from '@/app/(clients)/misc/icons';
import { TrashIcon } from '@/assets/icons';
import { ArrowLeft, Check } from 'lucide-react';
import { LinkButton } from '@/components/ui';

const CLOUDINARY_CLOUD_NAME =
  process.env['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'] || 'your_cloud_name';
const CLOUDINARY_UPLOAD_PRESET =
  process.env['NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'] || 'your_upload_preset';

const CLOUDINARY_WIDGET_STYLES = {
  palette: {
    window: '#FCFCFD',
    windowBorder: '#E8EAF6',
    tabIcon: '#7C3AED', // primary purple
    menuIcons: '#6B7280',
    textDark: '#111827',
    textLight: '#FFFFFF',
    link: '#1A73E8', // primary blue
    action: '#7C3AED',
    inactiveTabIcon: '#9CA3AF',
    error: '#EF4444',
    inProgress: '#1A73E8',
    complete: '#16A34A',
    sourceBg: '#F3F4F6',
  },
  fonts: {
    Inter:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  },
} as const;

const destroyUploadWidget = (widget: any | null) => {
  if (!widget) return;
  try {
    if (typeof widget.destroy === 'function') {
      widget.destroy();
      return;
    }
    if (typeof widget.close === 'function') {
      widget.close();
    }
  } catch (error) {
    console.error('Failed to clean up Cloudinary widget', error);
  }
};

const GalleryPage = () => {
  const { currentBusiness, refetchBusinesses } = useBusinessContext();
  const { user } = useUserContext();
  const isPremium = user?.is_premium_plan_active;
  const maxImageCount = isPremium ? 20 : 10;
  const maxFileSize = isPremium ? 20000000 : 10000000; // 20MB for premium, 10MB for free

  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showUploadWidget, setShowUploadWidget] = useState(false);
  const uploadWidgetRef = useRef<any | null>(null);

  // Load Cloudinary Upload Widget script once
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      !document?.getElementById('cloudinary-widget-script')
    ) {
      const script = document.createElement('script');
      script.id = 'cloudinary-widget-script';
      script.src = 'https://upload-widget.cloudinary.com/latest/global/all.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Mutations
  const uploadImagesMutation = useUploadBusinessImages();
  const deleteImagesMutation = useDeleteBusinessImage();

  // Get business images with proper typing
  const openCloudinaryWidget = () => {
    // Basic pre-checks before opening dialog
    if (!window.cloudinary) {
      toast.warning('Upload service is loading. Please try again in a moment.');
      return;
    }

    const currentImageCount = currentBusiness?.images?.length ?? 0;
    if (currentImageCount >= maxImageCount) {
      toast.error(
        `You have reached the maximum limit of ${maxImageCount} images for your ${
          isPremium ? 'Premium' : 'Free'
        } plan.`
      );
      return;
    }

    setShowUploadWidget(true);
  };

  // When the upload dialog is open, render the Cloudinary widget inline inside it
  useEffect(() => {
    if (!showUploadWidget) return;

    if (!window.cloudinary) {
      toast.error('Upload service is loading. Please try again in a moment.');
      setShowUploadWidget(false);
      return;
    }

    const currentImageCount = currentBusiness?.images?.length ?? 0;
    if (currentImageCount >= maxImageCount) {
      toast.error(
        `You have reached the maximum limit of ${maxImageCount} images for your ${
          isPremium ? 'Premium' : 'Free'
        } plan.`
      );
      setShowUploadWidget(false);
      return;
    }

    let uploadedImages: { url: string; public_id: string }[] = [];

    // Defer widget creation so the Dialog DOM is rendered and measured first.
    const timer = window.setTimeout(() => {
      const container = document.getElementById(
        'business-gallery-upload-widget'
      );
      if (!container) {
        console.error('Cloudinary inline container not found in DOM');
        toast.error('Upload dialog failed to open. Please try again.');
        setShowUploadWidget(false);
        return;
      }

      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          sources: ['local', 'url', 'camera'],
          resourceType: 'image',
          clientAllowedFormats: ['png', 'jpeg', 'jpg', 'webp'],
          maxFileSize,
          showAdvancedOptions: false,
          cropping: false,
          multiple: true,
          maxFiles: maxImageCount - currentImageCount,
          theme: 'white',
          styles: CLOUDINARY_WIDGET_STYLES,
          inlineContainer: '#business-gallery-upload-widget',
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            toast.error('Upload failed. Please try again.');
            return;
          }

          if (result.event === 'success') {
            const info = result.info;
            uploadedImages.push({
              url: info.secure_url,
              public_id: info.public_id,
            });
          }

          if (result.event === 'queues-end') {
            if (uploadedImages.length > 0 && currentBusiness?.id) {
              toast.info('Images uploaded to cloud. Saving to business...');
              uploadImagesMutation.mutate(
                {
                  business_id: currentBusiness.id,
                  images: uploadedImages,
                },
                {
                  onSuccess: () => {
                    toast.success(
                      `${uploadedImages.length} image(s) saved successfully`
                    );
                    refetchBusinesses();
                    uploadedImages = [];
                  },
                  onError: (err: any) => {
                    toast.error(`Save failed: ${err.message}`);
                  },
                }
              );
            }

            destroyUploadWidget(widget);
            setShowUploadWidget(false);
          }
        }
      );

      uploadWidgetRef.current = widget;
      widget.open();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      destroyUploadWidget(uploadWidgetRef.current);
      uploadWidgetRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showUploadWidget]);

  const handleImageSelect = (imageId: number) => {
    if (!isSelecting) return;

    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  const handleDeleteSelected = () => {
    if (selectedImages.size === 0) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const imageIds = Array.from(selectedImages);
    deleteImagesMutation.mutate(
      { image_ids: imageIds },
      {
        onSuccess: () => {
          toast.success(`${imageIds.length} image(s) deleted successfully`);
          setSelectedImages(new Set());
          setIsSelecting(false);
          setShowDeleteModal(false);
          refetchBusinesses();
        },
        onError: (error: any) => {
          toast.error(`Delete failed: ${error.message}`);
        },
      }
    );
  };

  const toggleSelectionMode = () => {
    setIsSelecting(!isSelecting);
    setSelectedImages(new Set());
  };

  if (!currentBusiness) {
    return (
      <div className='py-12 text-center text-muted-foreground'>
        No business selected
      </div>
    );
  }

  return (
    <div className='h-full space-y-6 overflow-y-auto lg:p-6'>
      {/* Header */}
      <header className='flex items-center justify-between gap-4 sm:flex-row'>
        <div className='flex items-center gap-4'>
          <LinkButton
            className='size-6'
            variant='ghost'
            size='icon'
            href={'/business/settings/profile'}
          >
            <ArrowLeft />
          </LinkButton>
          <h1 className='font-inter text-2xl font-medium text-[#0F0F0F]'>
            Gallery
          </h1>
        </div>

        <div className='flex items-center gap-2'>
          {isSelecting && (currentBusiness?.images?.length ?? 0) > 0 && (
            <div
              className='mr-4 flex cursor-pointer items-center gap-1.5 font-medium text-primary'
              onClick={() => {
                if (
                  selectedImages.size === (currentBusiness?.images?.length ?? 0)
                ) {
                  setSelectedImages(new Set());
                } else {
                  setSelectedImages(
                    new Set(currentBusiness?.images?.map(img => img.id))
                  );
                }
              }}
            >
              <div className='flex size-5 items-center justify-center rounded-md border-[1.6px] border-primary p-1 text-primary'>
                <Check
                  className={cn(
                    selectedImages.size ===
                      (currentBusiness?.images?.length ?? 0)
                      ? 'opacity-100'
                      : 'opacity-0',
                    'size-4 text-primary transition-all'
                  )}
                />
              </div>
              All
            </div>
          )}
          {(currentBusiness?.images?.length ?? 0) > 0 && (
            <>
              <Button
                variant='outline'
                onClick={toggleSelectionMode}
                disabled={uploadImagesMutation.isPending}
                size='dynamic_lg'
              >
                {isSelecting ? 'Cancel' : 'Select & Delete'}
                <TrashIcon
                  className={cn(
                    'text-[#4B5565] hover:text-red-500 max-lg:size-2.5',
                    isSelecting && 'hidden'
                  )}
                />
              </Button>

              {isSelecting && (
                <Button
                  size='dynamic_lg'
                  variant='destructive'
                  onClick={handleDeleteSelected}
                  disabled={
                    selectedImages.size === 0 || deleteImagesMutation.isPending
                  }
                >
                  {deleteImagesMutation.isPending
                    ? 'Deleting...'
                    : `Delete Selected (${selectedImages.size})`}
                  <TrashIcon className='text-[#4B5565] hover:text-red-500 max-lg:size-2.5' />
                </Button>
              )}
            </>
          )}
          {!isSelecting && (
            <Button
              onClick={openCloudinaryWidget}
              disabled={
                uploadImagesMutation.isPending ||
                (currentBusiness?.images?.length ?? 0) >= maxImageCount
              }
              size='dynamic_lg'
              className='max-lg:hidden'
            >
              {uploadImagesMutation.isPending
                ? 'Uploading...'
                : (currentBusiness?.images?.length ?? 0) >= maxImageCount
                  ? 'Limit Reached'
                  : 'Upload Media'}
              <Upload2Icon />
            </Button>
          )}
        </div>
      </header>

      {/* Plan limit indicator */}
      {!isSelecting && (
        <div className='flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2 text-sm text-gray-600'>
          <span>
            Storage:{' '}
            <span className='font-medium'>
              {currentBusiness?.images?.length ?? 0}
            </span>{' '}
            / {maxImageCount} images
          </span>
          {!isPremium && (
            <span className='text-xs text-amber-600'>
              Upgrade to Premium for 20 images and larger uploads
            </span>
          )}
        </div>
      )}

      {/* Image Grid */}
      {/* Mobile FAB for upload (visible only when not in selection mode and grid is visible) */}
      {!isSelecting && (currentBusiness?.images?.length ?? 0) > 0 && (
        <button
          type='button'
          onClick={openCloudinaryWidget}
          disabled={
            uploadImagesMutation.isPending ||
            (currentBusiness?.images?.length ?? 0) >= maxImageCount
          }
          className='fixed bottom-12 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#7C3AED] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 md:bottom-6 lg:hidden'
          aria-label='Upload media'
        >
          <svg
            className='h-6 w-6'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M12 3v12M12 3l-4 4M12 3l4 4M12 15v3a4 4 0 004 4h0a4 4 0 004-4v-3M4 12h16' />
          </svg>
        </button>
      )}

      <div className='space-y-4'>
        {(currentBusiness?.images?.length ?? 0) > 0 ? (
          <div className='grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4'>
            {currentBusiness?.images?.map(image => (
              <div
                key={image.id}
                className={cn(
                  'group relative aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200',
                  isSelecting ? 'cursor-pointer' : '',
                  'border-gray-200 hover:border-gray-300'
                )}
                onClick={() => handleImageSelect(image.id)}
              >
                <Image
                  src={image.url}
                  alt={`Business gallery image ${image.id}`}
                  fill
                  className={cn(
                    'object-cover transition-all duration-200',
                    isSelecting && selectedImages.has(image.id)
                      ? 'opacity-50'
                      : 'opacity-100'
                  )}
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'
                />

                {/* Selection Checkbox - Top Left */}
                {isSelecting && (
                  <div className='absolute left-2 top-2'>
                    <div
                      className={cn(
                        'flex size-6 items-center justify-center rounded-md border-[0.5px] border-[#BC1B06] transition-all duration-200',
                        selectedImages.has(image.id)
                          ? 'border-gray-300 bg-white'
                          : 'border-gray-300 bg-white'
                      )}
                    >
                      {selectedImages.has(image.id) && (
                        <svg
                          className='size-3.5 text-red-500'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                )}

                {/* Image Index */}
                {!isSelecting && (
                  <div className='absolute left-2 top-2 rounded bg-black bg-opacity-60 px-2 py-1 text-xs text-white'>
                    {(currentBusiness?.images?.findIndex(
                      img => img.id === image.id
                    ) ?? -1) + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className='rounded-lg bg-gray-50 py-12 text-center'>
            <div className='mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-lg bg-gray-200'>
              <svg
                className='h-10 w-10 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
            </div>
            <h3 className='mb-2 text-lg font-medium text-gray-900'>
              No images yet
            </h3>
            <p className='mb-4 text-gray-600'>
              Upload images to showcase your business
            </p>
            <Button
              onClick={openCloudinaryWidget}
              disabled={
                uploadImagesMutation.isPending ||
                (currentBusiness?.images?.length ?? 0) >= maxImageCount
              }
              className='bg-purple-600 hover:bg-purple-700'
            >
              {(currentBusiness?.images?.length ?? 0) >= maxImageCount
                ? 'Limit Reached'
                : 'Upload Your First Images'}
            </Button>
          </div>
        )}
      </div>

      {/* Cloudinary Upload Widget Modal */}
      <Dialog open={showUploadWidget} onOpenChange={setShowUploadWidget}>
        <DialogContent
          hideCloseButton
          className='w-[min(100%-1rem,900px)] max-w-3xl overflow-hidden rounded-2xl border border-[#E8EAF6] bg-[#FCFCFD] p-0 shadow-2xl'
        >
          <div className='flex items-center justify-between border-b border-[#EEF2F6] px-4 py-3 md:px-5'>
            <DialogHeader className='p-0'>
              <DialogTitle className='text-sm font-semibold text-[#111827]'>
                Upload media
              </DialogTitle>
            </DialogHeader>
            <button
              type='button'
              aria-label='Close upload'
              onClick={() => setShowUploadWidget(false)}
              className='inline-flex h-10 w-10 items-center justify-center rounded-full text-[#1A73E8] hover:bg-[#E0ECFF] active:bg-[#C3DAFF] max-md:h-11 max-md:w-11'
            >
              <svg
                className='h-4 w-4'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M6 6l12 12' />
                <path d='M6 18L18 6' />
              </svg>
            </button>
          </div>
          <div className='px-4 pb-4 pt-3 md:px-5 md:pb-5 md:pt-4'>
            <div
              id='business-gallery-upload-widget'
              className='h-[70dvh] min-h-[460px] w-full overflow-hidden rounded-xl border border-dashed border-[#EEF2F6] bg-[#F9FAFB] max-md:h-[68dvh] max-md:min-h-[420px]'
            />
            <p className='mt-3 text-xs text-[#6B7280] md:text-[0.8rem]'>
              Drag and drop images here, or click inside the area to browse from
              your device. PNG, JPG, JPEG or WEBP up to{' '}
              {isPremium ? '20MB' : '10MB'} per file.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Delete Images</DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <p className='text-gray-600'>
              Are you sure you want to delete {selectedImages.size} selected
              image{selectedImages.size !== 1 ? 's' : ''}? This action cannot be
              undone.
            </p>

            <div className='flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteImagesMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={confirmDelete}
                disabled={deleteImagesMutation.isPending}
              >
                {deleteImagesMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryPage;
