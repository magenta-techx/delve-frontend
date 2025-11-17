'use client';

import React, { useState, useRef } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useUploadBusinessImages, useDeleteBusinessImages } from '@/app/(business)/misc/api/business';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Upload2Icon, UploadIcon } from '@/app/(clients)/misc/icons';
import { TrashIcon } from '@/assets/icons';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { LinkButton } from '@/components/ui';

const GalleryPage = () => {
    const { currentBusiness, refetchBusinesses, isLoading: isLoadingBusinesses } = useBusinessContext();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropzoneRef = useRef<HTMLInputElement>(null);
    const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);

    // Mutations
    const uploadImagesMutation = useUploadBusinessImages();
    const deleteImagesMutation = useDeleteBusinessImages();

    // Get business images with proper typing
    const getBusinessImages = () => {
        if (!currentBusiness?.images) return [];
        return currentBusiness.images.map((img, index) => {
            if (typeof img === 'string') {
                return { id: index, image: img };
            }
            return img;
        });
    };

    const handleFileSelect = (files: FileList | File[]) => {
        if (!files || !currentBusiness?.id) return;

        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not an image file`);
                return false;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                toast.error(`${file.name} is too large (max 10MB)`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // Add to existing files instead of replacing
        setFilesToUpload(prevFiles => [...prevFiles, ...validFiles]);
        setShowUploadModal(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            handleFileSelect(files);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);
        const files = event.dataTransfer.files;
        if (files) {
            handleFileSelect(files);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);
    };

    const confirmUpload = () => {
        if (!currentBusiness?.id || filesToUpload.length === 0) return;

        uploadImagesMutation.mutate(
            {
                business_id: currentBusiness.id,
                images: filesToUpload
            },
            {
                onSuccess: () => {
                    toast.success(`${filesToUpload.length} image(s) uploaded successfully`);
                    refetchBusinesses();
                    setFilesToUpload([]);
                    setShowUploadModal(false);
                    // Reset file inputs
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                    if (dropzoneRef.current) {
                        dropzoneRef.current.value = '';
                    }
                },
                onError: (error) => {
                    toast.error(`Upload failed: ${error.message}`);
                }
            }
        );
    };

    const removeFileToUpload = (index: number) => {
        setFilesToUpload(files => files.filter((_, i) => i !== index));
    };

    const cancelUpload = () => {
        setFilesToUpload([]);
        setShowUploadModal(false);
        // Reset file inputs
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (dropzoneRef.current) {
            dropzoneRef.current.value = '';
        }
    };

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
                onError: (error) => {
                    toast.error(`Delete failed: ${error.message}`);
                }
            }
        );
    };

    const toggleSelectionMode = () => {
        setIsSelecting(!isSelecting);
        setSelectedImages(new Set());
    };


   const businessImages = getBusinessImages();


    if (!currentBusiness) {
        return <div className="py-12 text-center text-muted-foreground">No business selected</div>;
    }

 
    return (
        <div className="lg:p-6 space-y-6">
            {/* Header */}
            <header className="flex sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <LinkButton className="size-6" variant="ghost" size="icon" href={"/business/settings/profile"}>
                        <ArrowLeft />
                    </LinkButton>
                    <h1 className="text-2xl font-inter font-semibold text-gray-900">Gallery</h1>

                </div>

                <div className="flex gap-2 items-center">

                    {isSelecting && businessImages.length > 0 && (
                        <div className="flex items-center gap-1.5 cursor-pointer text-primary font-medium mr-4"
                            onClick={() => {
                                if (selectedImages.size === businessImages.length) {
                                    setSelectedImages(new Set());
                                } else {
                                    setSelectedImages(new Set(businessImages.map(img => img.id)));
                                }
                            }}
                        >
                            <div className="flex items-center justify-center border-[1.6px] border-primary text-primary rounded-md p-1 size-5">
                                <Check className={cn(selectedImages.size === businessImages.length ? "opacity-100" : "opacity-0", "transition-all text-primary size-4")} />
                            </div>
                            All

                        </div>
                    )}
                    {businessImages.length > 0 && (
                        <>
                            <Button
                                variant="outline"
                                onClick={toggleSelectionMode}
                                disabled={uploadImagesMutation.isPending}
                                size="dynamic_lg"
                            >
                                {isSelecting ? 'Cancel' : 'Select & Delete'}
                                <TrashIcon className={cn("text-[#4B5565] hover:text-red-500 max-lg:size-2.5", isSelecting && "hidden")} />
                            </Button>

                            {isSelecting && (
                                <Button
                                    size="dynamic_lg"
                                    variant="destructive"
                                    onClick={handleDeleteSelected}
                                    disabled={selectedImages.size === 0 || deleteImagesMutation.isPending}
                                >
                                    {deleteImagesMutation.isPending ? 'Deleting...' : `Delete Selected (${selectedImages.size})`}
                                    <TrashIcon className="text-[#4B5565] hover:text-red-500 max-lg:size-2.5" />
                                </Button>
                            )}
                        </>
                    )}
                    {
                        !isSelecting &&
                        <Button
                            onClick={() => setShowUploadModal(true)}
                            disabled={uploadImagesMutation.isPending}
                            size="dynamic_lg"
                            className='max-lg:hidden'
                        >
                            {uploadImagesMutation.isPending ? 'Uploading...' : 'Upload Media'}
                            <Upload2Icon />
                        </Button>
                    }
                </div>
            </header >



            {/* Image Grid */}
            < div className="space-y-4" >
                {
                    businessImages.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {businessImages.map((image) => (
                                <div
                                    key={image.id}
                                    className={cn(
                                        "relative group aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200",
                                        isSelecting ? "cursor-pointer" : "",
                                        "border-gray-200 hover:border-gray-300"
                                    )}
                                    onClick={() => handleImageSelect(image.id)}
                                >
                                    <Image
                                        src={image.image}
                                        alt={`Business gallery image ${image.id}`}
                                        fill
                                        className={cn(
                                            "object-cover transition-all duration-200",
                                            isSelecting && selectedImages.has(image.id)
                                                ? "opacity-50"
                                                : "opacity-100"
                                        )}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                    />

                                    {/* Selection Checkbox - Top Left */}
                                    {isSelecting && (
                                        <div className="absolute top-2 left-2">
                                            <div className={cn(
                                                "size-6 rounded-md border-[0.5px] border-[#BC1B06] flex items-center justify-center transition-all duration-200",
                                                selectedImages.has(image.id)
                                                    ? "bg-white border-gray-300"
                                                    : "bg-white border-gray-300"
                                            )}>
                                                {selectedImages.has(image.id) && (
                                                    <svg className="size-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Image Index */}
                                    {!isSelecting && (
                                        <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                            {businessImages.findIndex(img => img.id === image.id) + 1}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
                            <p className="text-gray-600 mb-4">
                                Upload images to showcase your business
                            </p>
                            <Button
                                onClick={() => setShowUploadModal(true)}
                                disabled={uploadImagesMutation.isPending}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                Upload Your First Images
                            </Button>
                        </div>
                    )
                }
            </div >

            {/* Hidden File Input */}
            < input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
            />

            {/* Upload Modal */}
            < Dialog open={showUploadModal} onOpenChange={setShowUploadModal} >
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold mb-4 sr-only">Upload service image</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Dropzone */}
                        <div
                            className={cn(
                                "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                                isDragOver
                                    ? "border-purple-500 bg-purple-50"
                                    : "border-gray-300 hover:border-gray-400"
                            )}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            <input
                                ref={dropzoneRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleInputChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />

                            <div className="space-y-4">
                                <UploadIcon className="size-12 mx-auto" />

                                <div>
                                    <p className="text-gray-900 font-inter">
                                        Upload service images
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                        Maximum file size 10MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Selected Files Preview */}
                        {filesToUpload.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-medium text-gray-900">
                                    Selected Images ({filesToUpload.length})
                                </h3>

                                <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                                    {filesToUpload.map((file, index) => {
                                        const preview = URL.createObjectURL(file);
                                        return (
                                            <div key={index} className="relative group">
                                                <div className="aspect-square rounded-lg overflow-hidden border">
                                                    <Image
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        width={100}
                                                        height={100}
                                                        className="w-full h-full object-cover"
                                                        onLoad={() => URL.revokeObjectURL(preview)}
                                                    />
                                                </div>

                                                {/* Remove button */}
                                                <button
                                                    onClick={() => removeFileToUpload(index)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>

                                                {/* File name */}
                                                <p className="text-xs text-gray-600 mt-1 truncate">
                                                    {file.name}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={cancelUpload}
                                disabled={uploadImagesMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmUpload}
                                disabled={filesToUpload.length === 0 || uploadImagesMutation.isPending}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                {uploadImagesMutation.isPending
                                    ? 'Uploading...'
                                    : `Upload ${filesToUpload.length} Image${filesToUpload.length !== 1 ? 's' : ''}`
                                }
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog >

            {/* Delete Confirmation Modal */}
            < Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal} >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Images</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Are you sure you want to delete {selectedImages.size} selected image{selectedImages.size !== 1 ? 's' : ''}?
                            This action cannot be undone.
                        </p>

                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleteImagesMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                                disabled={deleteImagesMutation.isPending}
                            >
                                {deleteImagesMutation.isPending ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog >
        </div >
    );
};

export default GalleryPage;