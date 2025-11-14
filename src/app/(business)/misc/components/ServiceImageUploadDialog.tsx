'use client';

import React, { useState, useRef, useCallback } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui';
import { useUpdateService } from '@/app/(business)/misc/api/business';
import { useBusinessContext } from '@/contexts/BusinessContext';

interface ServiceImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: number;
  currentImage?: string | null;
  serviceName: string;
}

export default function ServiceImageUploadDialog({
  isOpen,
  onClose,
  serviceId,
  currentImage,
  serviceName,
}: ServiceImageUploadDialogProps) {
  const { currentBusiness, refetchBusinesses } = useBusinessContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateServiceMutation = useUpdateService();

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragActive(false);

      const files = Array.from(event.dataTransfer.files);
      const file = files[0];

      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setIsUploading(false);
    setIsDragActive(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveImage = async () => {
    if (!currentBusiness?.id || !selectedFile) {
      toast.error('No image selected');
      return;
    }

    setIsUploading(true);
    try {
      await updateServiceMutation.mutateAsync({
        business_id: currentBusiness.id,
        service_id: serviceId,
        service: {
          image: selectedFile,
        }
      });

      toast.success('Service image updated successfully');
      refetchBusinesses();
      handleClose();
    } catch (error: any) {
      toast.error(`Failed to update service image: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveCurrentImage = async () => {
    if (!currentBusiness?.id) return;

    setIsUploading(true);
    try {
      await updateServiceMutation.mutateAsync({
        business_id: currentBusiness.id,
        service_id: serviceId,
        service:{
          image: null,
        }
      });

      toast.success('Service image removed successfully');
      refetchBusinesses();
      handleClose();
    } catch (error: any) {
      toast.error(`Failed to remove service image: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const displayImage = previewUrl || currentImage;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Update Service Image</DialogTitle>
          <p className='mt-1 text-sm text-gray-600'>
            Upload a new image for "{serviceName}"
          </p>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Current/Preview Image */}
          {displayImage && (
            <div className='relative'>
              <div className='relative aspect-[3/2] w-full overflow-hidden rounded-lg border bg-gray-100'>
                <Image
                  src={displayImage}
                  alt='Service image preview'
                  fill
                  className='object-cover'
                />
              </div>
              <button
                type='button'
                onClick={
                  selectedFile ? handleRemoveImage : handleRemoveCurrentImage
                }
                disabled={isUploading}
                className='absolute right-2 top-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200 disabled:opacity-50'
              >
                <X size={16} />
              </button>
              {selectedFile && (
                <div className='absolute bottom-2 left-2 rounded bg-green-600 px-2 py-1 text-xs text-white'>
                  New Image
                </div>
              )}
            </div>
          )}

          {/* Dropzone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${isDragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'} `}
          >
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              className='hidden'
            />

            {isDragActive ? (
              <>
                <Upload className='mb-2 h-8 w-8 text-purple-600' />
                <p className='text-sm font-medium text-purple-700'>
                  Drop your image here
                </p>
              </>
            ) : (
              <>
                <ImageIcon className='mb-2 h-8 w-8 text-gray-400' />
                <p className='mb-1 text-sm font-medium text-gray-600'>
                  Click to browse or drag and drop
                </p>
                <p className='text-xs text-gray-500'>PNG, JPG, GIF up to 5MB</p>
              </>
            )}
          </div>

          {selectedFile && (
            <div className='rounded-lg bg-blue-50 p-3'>
              <div className='flex items-center gap-2'>
                <ImageIcon className='h-4 w-4 text-blue-600' />
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium text-blue-900'>
                    {selectedFile.name}
                  </p>
                  <p className='text-xs text-blue-700'>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>

          {currentImage && !selectedFile && (
            <Button
              type='button'
              variant='destructive'
              onClick={handleRemoveCurrentImage}
              disabled={isUploading}
            >
              {isUploading ? 'Removing...' : 'Remove Image'}
            </Button>
          )}

          {selectedFile && (
            <Button
              type='button'
              onClick={handleSaveImage}
              disabled={isUploading}
              className='bg-purple-600 hover:bg-purple-700'
            >
              {isUploading ? (
                <>
                  <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                  Uploading...
                </>
              ) : (
                'Save Image'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
