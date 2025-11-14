'use client';

import { useBusinessContext } from '@/contexts/BusinessContext';
import { Button, Input, Textarea } from '@/components/ui';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Loader2, Edit, X } from 'lucide-react';
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
    website: ''
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
        website: currentBusiness.website || ''
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
        website: currentBusiness.website || ''
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
    } = {
      business_id: currentBusiness.id,
    };

    // Add the specific field being updated along with current values for other fields
    if (field === 'name') updateData.business_name = value as string;
    else updateData.business_name = currentBusiness.name;

    if (field === 'description') updateData.description = value as string;
    else if (currentBusiness.description) updateData.description = currentBusiness.description;

    if (field === 'website') updateData.website = value as string;
    else if (currentBusiness.website) updateData.website = currentBusiness.website;

    if (field === 'logo' && value instanceof File) {
      updateData.logo = value;
    }

    updateBusiness(updateData, {
      onSuccess: () => {
        toast.success(`${field === 'logo' ? 'Business logo' : field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
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
      [field]: value
    }));
  };

  if (!currentBusiness) {
    return <div className="py-12 text-center text-muted-foreground">No business selected</div>;
  }

  return (
    <div className="lg:space-y-6 max-w-5xl">
      {/* Business Logo */}
      <section className="space-y-4 lg:grid grid-cols-[240px,1fr] lg:items-end border-b-[0.7px] border-[#E3E8EF] p-4 lg:py-8">
        <Label className="text-sm font-medium text-[#0F0F0F]">Business Logo</Label>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border">
            {logoPreview ? (
              <Image
                src={logoPreview}
                alt="Business Logo"
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-xl font-semibold text-gray-400">
                {currentBusiness.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1.5">
              .png, .jpeg files up to 8MB. Recommended size is 256 × 256px
            </p>
            <Label
              htmlFor="logo"
              className="cursor-pointer inline-flex items-center px-2 py-1 text-xs font-medium text-primary border border-[#D9D6FE] rounded-md bg-primary/5"
            >

              {isUpdating ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <GalleryIcon className='size-3 mr-1' />
                  Change
                </>
              )}
            </Label>
            <input
              id="logo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
              disabled={isUpdating}
            />

          </div>
        </div>
      </section>

      {/* Business Name */}
      <section className="flex flex-col lg:grid grid-cols-[240px,1fr,150px] xl:items-center xl:gap-12 border-b-[0.7px] border-[#E3E8EF] p-4 lg:py-8">
        <Label className="text-sm font-medium text-[#0F0F0F]">Business Name</Label>
        <div className="flex-1">
          {editingField === 'name' ? (
            <>
              <div className="space-y-2">
                <Input
                  value={tempValues.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full"
                  placeholder="Enter business name"
                  autoFocus
                />
              </div>

            </>
          ) : (
            <div className="p-3 border rounded-xl bg-gray-50">
              <span className="text-gray-900 text-sm">{currentBusiness.name}</span>
            </div>
          )}
        </div>

        <div className='flex items-center lg:justify-end lg:self-end mt-2'>
          {editingField !== 'name' ? (
            <Button
              onClick={() => handleEdit('name')}
              variant="outline"
              size="sm"
              className="text-gray-500 hover:text-primary"
              disabled={isUpdating}
            >
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => handleSave('name', tempValues.name)}
                disabled={isUpdating || !tempValues.name.trim()}
                className="bg-primary text-white px-4 py-1.5 text-sm"
                size={"sm"}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button
                onClick={handleCancel}
                variant="ghost"
                size={"icon"}
                disabled={isUpdating}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* About Business */}
      <section className="flex flex-col lg:grid grid-cols-[240px,1fr,150px] lg:items-end xl:gap-12 border-b-[0.7px] border-[#E3E8EF] p-4 lg:py-8">
        <Label className="text-sm font-medium text-[#0F0F0F]">About Business</Label>
        <div className="flex-1">
          {editingField === 'description' ? (
            <div className="space-y-2">
              <Textarea
                value={tempValues.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full min-h-[120px] resize-none"
                placeholder="Tell us about your business..."
                autoFocus
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {tempValues.description.length}/250 words
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 border rounded-xl bg-gray-50">
              <p className="text-gray-900 text-sm">
                {currentBusiness.description || 'No description provided'}
              </p>
            </div>
          )}
        </div>
        <div className='flex items-center lg:justify-end lg:self-end mt-2'>
          {editingField !== 'description' ? (
            <Button
              onClick={() => handleEdit('description')}
              variant="outline"
              size="sm"
              disabled={isUpdating}
              className="text-gray-500 hover:text-primary"
            >
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => handleSave('description', tempValues.description)}
                disabled={isUpdating || !tempValues.name.trim()}
                className="bg-primary text-white px-4 py-1.5 text-sm"
                size={"sm"}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button
                onClick={handleCancel}
                variant="ghost"
                size={"icon"}
                disabled={isUpdating}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

      </section>

      {/* Website */}
      <section className="flex flex-col lg:grid grid-cols-[240px,1fr,150px] lg:items-end xl:gap-12 border-b-[0.7px] border-[#E3E8EF] p-4 lg:py-8">
        <Label className="text-sm font-medium text-[#0F0F0F]">
          Website <span className="text-gray-500 font-normal">(Optional)</span>
        </Label>
        <div className="flex-1">
          {editingField === 'website' ? (
            <Input
              value={tempValues.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full"
              placeholder="www.example.com"
              autoFocus
            />

          ) : (
            <div className="p-3 border rounded-xl bg-gray-50">
              <span className="text-gray-900 text-sm">
                {currentBusiness.website || 'No website provided'}
              </span>
            </div>
          )}
        </div>

        <div className='flex items-center lg:justify-end lg:self-end mt-2'>
          {editingField !== 'website' ? (
            <Button
              onClick={() => handleEdit('website')}
              variant="outline"
              size="sm"
              className="text-gray-500 hover:text-primary"
              disabled={isUpdating}
            >
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => handleSave('website', tempValues.website)}
                disabled={isUpdating || !tempValues.website.trim()}
                className="bg-primary text-white px-4 py-1.5 text-sm"
                size={"sm"}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button
                onClick={handleCancel}
                variant="ghost"
                size={"icon"}
                disabled={isUpdating}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>)}

        </div>
      </section>
    </div>
  );
}
