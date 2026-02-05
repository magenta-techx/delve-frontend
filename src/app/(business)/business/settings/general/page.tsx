'use client';

import { useBusinessContext } from '@/contexts/BusinessContext';
import { Button, Input, Textarea } from '@/components/ui';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { useUpdateBusiness } from '@/app/(business)/misc/api';
import { GalleryIcon } from '@/app/(clients)/misc/icons';

type EditableField = 'logo' | 'name' | 'description' | 'website' | null;

export default function GeneralPage() {
  const { currentBusiness, refetchBusinesses } = useBusinessContext();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<EditableField>(null);
  const [tempValues, setTempValues] = useState({
    name: '',
    description: '',
    website: '',
  });

  // Mutations
  const { mutate: updateBusiness, isPending: isUpdating } = useUpdateBusiness();

  useEffect(() => {
    if (currentBusiness) {
      if (currentBusiness.logo) {
        setLogoPreview(currentBusiness.logo);
      }
      setTempValues({
        name: currentBusiness.name || '',
        description: currentBusiness.description || '',
        website: currentBusiness.website || '',
      });
    }
  }, [currentBusiness]);

  const handleEdit = (field: EditableField) => {
    setEditingField(field);
  };

  const handleCancel = () => {
    setEditingField(null);
    // Reset temp values to original values
    if (currentBusiness) {
      setTempValues({
        name: currentBusiness.name || '',
        description: currentBusiness.description || '',
        website: currentBusiness.website || '',
      });
    }
  };

  const handleSave = (field: string, value: string | File) => {
    if (!currentBusiness?.id) return;

    const updateData: {
      business_id: number;
      business_name?: string;
      description?: string;
      website?: string;
      logo?: File;
      thumbnail_image_id?: string;
    } = {
      business_id: currentBusiness.id,
    };

    if (field === 'name') updateData.business_name = value as string;

    if (field === 'description') updateData.description = value as string;

    if (field === 'website') updateData.website = value as string;

    if (field === 'logo' && value instanceof File) {
      updateData.logo = value;
    }

    updateBusiness(updateData, {
      onSuccess: () => {
        toast.success(
          `${field === 'logo' ? 'Business logo' : field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`
        );
        setEditingField(null);
        refetchBusinesses();
      },
      onError: () => {
        toast.error(`Failed to update ${field}`);
      },
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Immediately save the logo
      handleSave('logo', file);
    }
  };

  const handleInputChange = (field: keyof typeof tempValues, value: string) => {
    setTempValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!currentBusiness) {
    return (
      <div className='py-12 text-center text-muted-foreground'>
        No business selected
      </div>
    );
  }

  return (
    <div className='max-w-5xl lg:space-y-6'>
      {/* Business Logo */}
      <section className='grid-cols-[240px,1fr] space-y-4 border-b-[0.7px] border-[#E3E8EF] p-4 lg:grid lg:items-end lg:py-8'>
        <Label className='text-sm font-medium text-[#0F0F0F]'>
          Business Logo
        </Label>
        <div className='flex items-center gap-4'>
          <div className='relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border bg-gray-100'>
            {logoPreview ? (
              <Image
                src={logoPreview}
                alt='Business Logo'
                fill
                className='object-cover'
              />
            ) : (
              <span className='text-xl font-semibold text-gray-400'>
                {currentBusiness.name.charAt(0)}
              </span>
            )}
          </div>
          <div className='flex-1'>
            <p className='mb-1.5 text-xs text-gray-500'>
              .png, .jpeg files up to 8MB. Recommended size is 256 × 256px
            </p>
            <Label
              htmlFor='logo'
              className='inline-flex cursor-pointer items-center rounded-md border border-[#D9D6FE] bg-primary/5 px-2 py-1 text-xs font-medium text-primary'
            >
              {isUpdating ? (
                <>
                  <Loader2 className='mr-1 h-3 w-3 animate-spin' />
                  Updating...
                </>
              ) : (
                <>
                  <GalleryIcon className='mr-1 size-3' />
                  Change
                </>
              )}
            </Label>
            <input
              id='logo'
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleLogoChange}
              disabled={isUpdating}
            />
          </div>
        </div>
      </section>

      {/* Business Name */}
      <section className='flex flex-col border-b-[0.7px] border-[#E3E8EF] p-4 lg:grid lg:grid-cols-[240px,1fr,150px] lg:py-8 xl:items-center xl:gap-12'>
        <Label className='mb-2 text-sm font-medium text-[#0F0F0F] lg:mb-0'>
          Business Name
        </Label>
        <div className='flex-1'>
          {editingField === 'name' ? (
            <>
              <div className='space-y-2'>
                <Input
                  value={tempValues.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  className='w-full'
                  placeholder='Enter business name'
                  autoFocus
                />
              </div>
            </>
          ) : (
            <div className='rounded-xl border bg-gray-50 p-3'>
              <span className='text-sm text-gray-900'>
                {currentBusiness.name}
              </span>
            </div>
          )}
        </div>

        <div className='mt-3 flex items-center lg:mt-0 lg:justify-end lg:self-end'>
          {editingField !== 'name' ? (
            <Button
              // onClick={() => handleEdit('name')}
              variant='outline'
              size='sm'
              className='w-full text-gray-500 hover:text-primary md:w-auto'
              disabled
              title='Contact support to change business name'
            >
              Edit
            </Button>
          ) : (
            <div className='flex w-full gap-2 md:w-auto'>
              <Button
                onClick={() => handleSave('name', tempValues.name)}
                disabled={isUpdating || !tempValues.name.trim()}
                className='flex-1 bg-primary px-4 py-1.5 text-sm text-white md:flex-none'
                size={'sm'}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className='mr-1 h-3 w-3 animate-spin' />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button
                onClick={handleCancel}
                variant='ghost'
                size={'icon'}
                disabled={isUpdating}
              >
                <X className='h-3 w-3' />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* About Business */}
      <section className='flex flex-col border-b-[0.7px] border-[#E3E8EF] p-4 lg:grid lg:grid-cols-[240px,1fr,150px] lg:items-end lg:py-8 xl:gap-12'>
        <Label className='mb-2 text-sm font-medium text-[#0F0F0F] lg:mb-0'>
          About Business
        </Label>
        <div className='flex-1'>
          {editingField === 'description' ? (
            <div className='space-y-2'>
              <Textarea
                value={tempValues.description}
                onChange={e => handleInputChange('description', e.target.value)}
                className='min-h-[120px] w-full resize-none whitespace-pre-wrap'
                placeholder='Tell us about your business...'
                autoFocus
              />
              <div className='flex items-center justify-between'>
                <span className='text-xs text-gray-500'>
                  {tempValues.description.length}/250 words
                </span>
              </div>
            </div>
          ) : (
            <div className='rounded-xl border bg-gray-50 p-3'>
              <p className='text-sm text-gray-900'>
                {currentBusiness.description || 'No description provided'}
              </p>
            </div>
          )}
        </div>
        <div className='mt-3 flex items-center lg:mt-0 lg:justify-end lg:self-end'>
          {editingField !== 'description' ? (
            <Button
              onClick={() => handleEdit('description')}
              variant='outline'
              size='sm'
              disabled={isUpdating}
              className='w-full text-gray-500 hover:text-primary md:w-auto'
            >
              Edit
            </Button>
          ) : (
            <div className='flex w-full gap-2 md:w-auto'>
              <Button
                onClick={() =>
                  handleSave('description', tempValues.description)
                }
                disabled={isUpdating || !tempValues.name.trim()}
                className='flex-1 bg-primary px-4 py-1.5 text-sm text-white md:flex-none'
                size={'sm'}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className='mr-1 h-3 w-3 animate-spin' />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button
                onClick={handleCancel}
                variant='ghost'
                size={'icon'}
                disabled={isUpdating}
              >
                <X className='h-3 w-3' />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Website */}
      <section className='flex flex-col border-b-[0.7px] border-[#E3E8EF] p-4 lg:grid lg:grid-cols-[240px,1fr,150px] lg:items-end lg:py-8 xl:gap-12'>
        <Label className='mb-2 text-sm font-medium text-[#0F0F0F] lg:mb-0'>
          Website <span className='font-normal text-gray-500'>(Optional)</span>
        </Label>
        <div className='flex-1'>
          {editingField === 'website' ? (
            <Input
              value={tempValues.website}
              onChange={e => handleInputChange('website', e.target.value)}
              className='w-full'
              placeholder='www.example.com'
              autoFocus
            />
          ) : (
            <div className='rounded-xl border bg-gray-50 p-3'>
              <span className='text-sm text-gray-900'>
                {currentBusiness.website || 'No website provided'}
              </span>
            </div>
          )}
        </div>

        <div className='mt-3 flex items-center lg:mt-0 lg:justify-end lg:self-end'>
          {editingField !== 'website' ? (
            <Button
              onClick={() => handleEdit('website')}
              variant='outline'
              size='sm'
              className='w-full text-gray-500 hover:text-primary md:w-auto'
              disabled={isUpdating}
            >
              Edit
            </Button>
          ) : (
            <div className='flex w-full gap-2 md:w-auto'>
              <Button
                onClick={() => handleSave('website', tempValues.website)}
                disabled={isUpdating || !tempValues.website.trim()}
                className='flex-1 bg-primary px-4 py-1.5 text-sm text-white md:flex-none'
                size={'sm'}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className='mr-1 h-3 w-3 animate-spin' />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button
                onClick={handleCancel}
                variant='ghost'
                size={'icon'}
                disabled={isUpdating}
              >
                <X className='h-3 w-3' />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
