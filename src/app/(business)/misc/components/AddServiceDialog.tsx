'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button, Input, Textarea } from '@/components/ui';
import { Label } from '@/components/ui/label';
import { useCreateServices } from '@/app/(business)/misc/api/business';
import { useBusinessContext } from '@/contexts/BusinessContext';

// Schema for form validation
const serviceSchema = z.object({
  title: z.string().min(1, 'Service title is required').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description too long'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface AddServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddServiceDialog({ isOpen, onClose }: AddServiceDialogProps) {
  const { currentBusiness, refetchBusinesses } = useBusinessContext();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const createServicesMutation = useCreateServices();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const handleImageSelect = (file: File | null) => {
    if (!file) {
      setSelectedImage(null);
      setImagePreview('');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    reset();
    setSelectedImage(null);
    setImagePreview('');
    onClose();
  };

  const onSubmit = async (data: ServiceFormData) => {
    if (!currentBusiness?.id) {
      toast.error('No business selected');
      return;
    }

    try {
      // Prepare service data
      const serviceData = {
        title: data.title,
        description: data.description,
        image: selectedImage,
      };

      await createServicesMutation.mutateAsync({
        business_id: currentBusiness.id,
        services: [serviceData],
      });

      toast.success('Service created successfully');
      refetchBusinesses();
      handleClose();
    } catch (error: any) {
      toast.error(`Failed to create service: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              {/* Service Title */}
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Service Title *
                </Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="e.g., Hair Cut, Web Design, Consultation"
                  className="mt-1"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe what this service includes and what clients can expect..."
                  rows={8}
                  className="mt-1"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Service Image (Optional)
              </Label>
              <div className="mt-1">
                <input
                  type="file"
                  id="service-image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleImageSelect(file);
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="service-image"
                  className="relative flex h-48 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-purple-400 hover:bg-purple-50"
                >
                  {imagePreview ? (
                    <div className="relative h-full w-full rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Service preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="px-4 py-1.5 rounded-full bg-white text-black text-sm font-medium">
                          Click to change
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleImageSelect(null);
                        }}
                        className="absolute top-2 right-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200 z-10"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2 text-gray-500">
                      <Upload className="h-12 w-12 text-purple-600" />
                      <span className="text-sm">Click to upload image</span>
                      <span className="text-xs text-gray-400">Max 5MB</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createServicesMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createServicesMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {createServicesMutation.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating...
                </>
              ) : (
                'Create Service'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}