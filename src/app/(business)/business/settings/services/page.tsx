'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Image from 'next/image';
import { useState } from 'react';
import { Loader2, Trash2, Upload } from 'lucide-react';
import { useBusinessServices, useCreateServices, useDeleteService } from '@/app/(business)/misc/api/business';

const serviceSchema = z.object({
  title: z.string().min(2, 'Service name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().optional(),
  duration: z.string().optional(),
  image: z.any().optional(),
});

const servicesSchema = z.object({
  services: z.array(serviceSchema).min(1, 'At least one service is required'),
});

type ServicesFormData = z.infer<typeof servicesSchema>;

export default function ServicesPage() {
  const { currentBusiness } = useBusinessContext();
  const [imagePreviews, setImagePreviews] = useState<{ [key: number]: string }>({});

  const { control, register, handleSubmit, formState: { errors } } = useForm<ServicesFormData>({
    resolver: zodResolver(servicesSchema),
    defaultValues: {
      services: [{ title: '', description: '', price: '', duration: '', image: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services',
  });

  // Fetch existing services
  const { data: servicesData, isLoading } = useBusinessServices(currentBusiness?.id || 0);
  
  // Mutations
  const { mutate: createServices, isPending: isCreating } = useCreateServices();
  const { mutate: deleteService } = useDeleteService();

  const onSubmit = (data: ServicesFormData) => {
    if (!currentBusiness?.id) return;

    const servicesToCreate = data.services.map(service => {
      const serviceData: { title: string; description: string; price?: string; duration?: string } = {
        title: service.title,
        description: service.description,
      };
      if (service.price) serviceData.price = service.price;
      if (service.duration) serviceData.duration = service.duration;
      return serviceData;
    });

    createServices(
      {
        business_id: currentBusiness.id,
        services: servicesToCreate,
      },
      {
        onSuccess: () => {
          toast.success('Services saved successfully');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to save services');
        },
      }
    );
  };

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => ({ ...prev, [index]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!currentBusiness) {
    return <div className="py-12 text-center text-muted-foreground">No business selected</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Existing Services */}
      {servicesData?.data && servicesData.data.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Existing Services</h3>
          {servicesData.data.map((service) => (
            <div key={service.id} className="border rounded-lg p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{service.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                  {(service.price || service.duration) && (
                    <div className="flex gap-4 mt-2 text-sm">
                      {service.price && <span>Price: ₦{service.price}</span>}
                      {service.duration && <span>Duration: {service.duration}</span>}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (!currentBusiness?.id) return;
                    deleteService(
                      { business_id: currentBusiness.id, service_id: service.id },
                      {
                        onSuccess: () => {
                          toast.success('Service deleted successfully');
                        },
                      }
                    );
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Services */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Add New Services</h3>
          
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-medium">Service {index + 1}</Label>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>

              {/* Service Name */}
              <div className="space-y-2">
                <Label htmlFor={`services.${index}.title`}>Service</Label>
                <Input
                  {...register(`services.${index}.title`)}
                  placeholder="Event Planning & Coordination"
                />
                {errors.services?.[index]?.title && (
                  <p className="text-sm text-red-500">{errors.services[index]?.title?.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor={`services.${index}.description`}>Description</Label>
                <Textarea
                  {...register(`services.${index}.description`)}
                  placeholder="Full-Service Event Planning, Partial Planning, Day-Of Coordination, Event Consultation Sessions, Destination Event Planning, Proposal & Elopement Planning."
                  rows={4}
                />
                {errors.services?.[index]?.description && (
                  <p className="text-sm text-red-500">{errors.services[index]?.description?.message}</p>
                )}
              </div>

              {/* Service Image */}
              <div className="space-y-2">
                <Label>Service Image</Label>
                <div className="flex items-center gap-4">
                  {imagePreviews[index] && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                      <Image src={imagePreviews[index]} alt="Service" fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <Label
                        htmlFor={`services.${index}.image`}
                        className="cursor-pointer border rounded-md px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">Select from files</span>
                      </Label>
                      <Button type="button" variant="outline" size="sm">
                        Upload
                      </Button>
                    </div>
                    <Input
                      id={`services.${index}.image`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      {...register(`services.${index}.image`)}
                      onChange={(e) => {
                        register(`services.${index}.image`).onChange(e);
                        handleImageChange(index, e);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add More Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ title: '', description: '', price: '', duration: '', image: null })}
            className="w-full"
          >
            + Add Another Service
          </Button>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isCreating}
            className="bg-primary text-white"
          >
            {isCreating ? (
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
    </div>
  );
}
