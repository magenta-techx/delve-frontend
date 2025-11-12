'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Button, Input,  } from '@/components/ui';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Loader2, X, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  useCategories, 
  useSubcategories,
  useAmenities, 
  useUpdateBusinessCategory, 
  useUpdateBusinessAmenities, 
  useUploadBusinessImages,
  useUpdateBusiness
} from '@/app/(business)/misc/api';

const profileSchema = z.object({
  thumbnail: z.any().optional(),
  category_id: z.number().min(1, 'Please select a category'),
  subcategory_ids: z.array(z.number()).optional(),
  amenities_ids: z.array(z.number()).optional(),
  gallery_images: z.any().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { currentBusiness, refetchBusinesses } = useBusinessContext();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      category_id: currentBusiness?.category?.id || 0,
      subcategory_ids: [],
      amenities_ids: [],
    },
  });

  // Fetch categories and amenities
  const { data: categoriesData } = useCategories();
  const { data: subcategoriesData } = useSubcategories(selectedCategoryId);
  const { data: amenitiesData } = useAmenities();
  
  // Mutations
  const { mutate: updateCategory, isPending: isUpdatingCategory } = useUpdateBusinessCategory();
  const { mutate: updateAmenities, isPending: isUpdatingAmenities } = useUpdateBusinessAmenities();
  const { mutate: uploadImages } = useUploadBusinessImages();
  const { mutate: updateThumbnail } = useUpdateBusiness();

  useEffect(() => {
    if (currentBusiness) {
      if (currentBusiness.thumbnail) {
        setThumbnailPreview(currentBusiness.thumbnail);
      }
      if (currentBusiness.category) {
        setSelectedCategoryId(currentBusiness.category.id);
        setValue('category_id', currentBusiness.category.id);
      }
      if (currentBusiness.subcategories) {
        const subcatIds = currentBusiness.subcategories.map(sc => sc.id);
        setSelectedSubcategories(subcatIds);
        setValue('subcategory_ids', subcatIds);
      }
      if (currentBusiness.images) {
        const imageUrls = currentBusiness.images.map(img => 
          typeof img === 'string' ? img : img.image
        );
        setGalleryPreviews(imageUrls);
      }
    }
  }, [currentBusiness, setValue]);

  const onSubmit = (data: ProfileFormData) => {
    if (!currentBusiness?.id) return;

    // Update category
    if (data.category_id) {
      updateCategory(
        {
          business_id: currentBusiness.id,
          category_id: data.category_id,
          subcategory_ids: selectedSubcategories,
        },
        {
          onSuccess: () => {
            toast.success('Category updated successfully');
            refetchBusinesses();
          },
        }
      );
    }

    // Update amenities
    if (selectedAmenities.length > 0) {
      updateAmenities(
        {
          business_id: currentBusiness.id,
          amenities_ids: selectedAmenities,
        },
        {
          onSuccess: () => {
            toast.success('Amenities updated successfully');
          },
        }
      );
    }

    // Upload thumbnail
    if (data.thumbnail && data.thumbnail[0]) {
      updateThumbnail(
        {
          business_id: currentBusiness.id,
          thumbnail: data.thumbnail[0],
        },
        {
          onSuccess: () => {
            toast.success('Profile picture updated successfully');
            refetchBusinesses();
          },
        }
      );
    }

    // Upload gallery images
    if (data.gallery_images && data.gallery_images.length > 0) {
      uploadImages(
        {
          business_id: currentBusiness.id,
          images: data.gallery_images,
        },
        {
          onSuccess: (response) => {
            toast.success('Images uploaded successfully');
            if (response.data) {
              setGalleryPreviews(prev => [...prev, ...response.data]);
            }
            refetchBusinesses();
          },
        }
      );
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSubcategory = (subcatId: number) => {
    setSelectedSubcategories(prev => {
      if (prev.includes(subcatId)) {
        return prev.filter(id => id !== subcatId);
      } else {
        return [...prev, subcatId];
      }
    });
  };

  const toggleAmenity = (amenityId: number) => {
    setSelectedAmenities(prev => {
      if (prev.includes(amenityId)) {
        return prev.filter(id => id !== amenityId);
      } else {
        return [...prev, amenityId];
      }
    });
  };

  if (!currentBusiness) {
    return <div className="py-12 text-center text-muted-foreground">No business selected</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      {/* Profile Picture */}
      <div className="space-y-2">
        <Label>Profile Picture</Label>
        <div className="flex items-start gap-4">
          <div className="relative w-full max-w-2xl h-48 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {thumbnailPreview ? (
              <Image src={thumbnailPreview} alt="Profile" fill className="object-cover" />
            ) : (
              <span className="text-4xl font-bold text-gray-400">
                {currentBusiness.name.charAt(0)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="thumbnail" className="cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              <span className="text-sm">Change</span>
            </div>
          </Label>
          <Input
            id="thumbnail"
            type="file"
            accept="image/*"
            className="hidden"
            {...control.register('thumbnail')}
            onChange={(e) => {
              control.register('thumbnail').onChange(e);
              handleThumbnailChange(e);
            }}
          />
          <p className="text-sm text-muted-foreground">Select from your uploads</p>
        </div>
      </div>

      {/* Gallery */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Gallery</Label>
          <Button type="button" variant="outline" size="sm" asChild>
            <Label htmlFor="gallery_images" className="cursor-pointer">
              View and upload
            </Label>
          </Button>
        </div>
        <Input
          id="gallery_images"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          {...control.register('gallery_images')}
        />
        <div className="grid grid-cols-4 gap-4">
          {galleryPreviews.slice(0, 4).map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Business Categories */}
      <div className="space-y-2">
        <Label>Business Categories</Label>
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                field.onChange(value);
                setSelectedCategoryId(value);
                setSelectedSubcategories([]);
              }}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select a category</option>
              {categoriesData?.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          )}
        />
        {errors.category_id && (
          <p className="text-sm text-red-500">{errors.category_id.message}</p>
        )}
      </div>

      {/* Subcategories */}
      {subcategoriesData && subcategoriesData.length > 0 && (
        <div className="space-y-2">
          <Label>Subcategories</Label>
          <div className="flex flex-wrap gap-2">
            {subcategoriesData.map(subcat => (
              <Badge
                key={subcat.id}
                variant={selectedSubcategories.includes(subcat.id) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleSubcategory(subcat.id)}
              >
                {subcat.name}
                {selectedSubcategories.includes(subcat.id) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Business Amenities */}
      <div className="space-y-2">
        <Label>
          Business Amenities <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <Input placeholder="Type here to add" className="mb-2" readOnly />
        <div className="flex flex-wrap gap-2">
          {amenitiesData?.map(amenity => (
            <Badge
              key={amenity.id}
              variant={selectedAmenities.includes(amenity.id) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleAmenity(amenity.id)}
            >
              {amenity.name}
              {selectedAmenities.includes(amenity.id) && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isUpdatingCategory || isUpdatingAmenities}
          className="bg-primary text-white"
        >
          {(isUpdatingCategory || isUpdatingAmenities) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
}
