'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Button, Input, Textarea } from '@/components/ui';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  useUpdateService,
  useDeleteService,
} from '@/app/(business)/misc/api/business';
import { UploadIcon } from '@/app/(clients)/misc/icons';
import { useBooleanStateControl } from '@/hooks/useBooleanStateControl';
import { AddServiceDialog } from '@/app/(business)/misc/components';
import ServiceImageUploadDialog from '@/app/(business)/misc/components/ServiceImageUploadDialog';
import { BusinessService } from '@/types/api';
import ConfirmationModal, {
  useConfirmationModal,
} from '@/components/ui/ConfirmationModal';

interface EditableField {
  id: string;
  value: string | string[];
  displayValue?: string | undefined;
}

export default function ServicesPage() {
  const { currentBusiness, refetchBusinesses } = useBusinessContext();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, EditableField>>(
    {}
  );
  const [selectedServiceForImage, setSelectedServiceForImage] =
    useState<BusinessService | null>(null);

  // Dialog state management
  const addServiceDialog = useBooleanStateControl();
  const imageUploadDialog = useBooleanStateControl();
  const deleteConfirmation = useConfirmationModal();

  // Mutations
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  const handleEdit = (
    serviceId: number,
    field: string,
    currentValue: string
  ) => {
    setEditingField(`${serviceId}-${field}`);
    setFieldValues({
      [`${serviceId}-${field}`]: {
        id: `${serviceId}-${field}`,
        value: currentValue,
      },
    });
  };

  const handleCancel = () => {
    setEditingField(null);
    setFieldValues({});
  };

  const handleFieldChange = (fieldKey: string, newValue: string) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldKey]: {
        id: fieldKey,
        value: newValue,
        displayValue: prev[fieldKey]?.displayValue,
      },
    }));
  };

  const handleSave = async (serviceId: number, field: string) => {
    const fieldKey = `${serviceId}-${field}`;
    const newValue = fieldValues[fieldKey]?.value as string;

    if (!currentBusiness?.id || !newValue) return;

    try {
      await updateServiceMutation.mutateAsync({
        business_id: currentBusiness.id,
        service_id: serviceId,
        service: {
          [field]: newValue,
        },
      });

      toast.success('Service updated successfully');
      setEditingField(null);
      setFieldValues({});
      refetchBusinesses();
    } catch (error) {
      toast.error(`Failed to update service: ${error}`);
    }
  };

  const handleDelete = async (serviceId: number) => {
    if (!currentBusiness?.id) return;

    try {
      await deleteServiceMutation.mutateAsync({
        business_id: currentBusiness.id,
        service_id: serviceId,
      });

      toast.success('Service deleted successfully');
      refetchBusinesses();
      deleteConfirmation.closeConfirmation();
    } catch (error) {
      toast.error(`Failed to delete service: ${error}`);
    }
  };

  const handleDeleteClick = (serviceId: number, serviceName: string) => {
    deleteConfirmation.openConfirmation({
      title: 'Delete Service',
      description: `Are you sure you want to delete "${serviceName}"? This action cannot be undone.`,
      confirmText: 'Delete Service',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: () => handleDelete(serviceId),
    });
  };

  const handleImageUpload = (service: BusinessService) => {
    setSelectedServiceForImage(service);
    imageUploadDialog.setTrue();
  };

  const handleImageDialogClose = () => {
    setSelectedServiceForImage(null);
    imageUploadDialog.setFalse();
  };

  if (!currentBusiness) {
    return (
      <div className='py-12 text-center text-muted-foreground'>
        No business selected
      </div>
    );
  }

  return (
    <div className='lg:p-6'>
      {/* Services List */}
      <div className='space-y-8'>
        {/* Add New Service */}
        <section className='flex grid-cols-[240px,1fr,150px] flex-col border-b-[0.7px] border-[#E3E8EF] p-4 xl:grid xl:items-center xl:gap-12'>
          <Label className='text-sm font-medium text-[#0F0F0F]'>
            Add New Service
          </Label>

          <div className='flex-1'>
            <span className='text-sm text-gray-600'>
              Create a new service for your business
            </span>
          </div>

          <div className='mt-2 flex items-center lg:justify-end lg:self-end'>
            <Button
              size='sm'
              onClick={addServiceDialog.setTrue}
              className='bg-purple-600 hover:bg-purple-700'
            >
              <Plus size={16} className='mr-1' />
              Add Service
            </Button>
          </div>
        </section>

        <div className='divide-y-[0.7px] divide-[#E3E8EF]'>
          {currentBusiness?.services?.map((service, index) => (
            <div key={service.id || index}>
              {/* //////////////////////// */}
              {/* Service Title */}
              {/* //////////////////////// */}
              <section className='flex grid-cols-[240px,1fr,150px] flex-col p-4 xl:grid xl:items-end xl:gap-12'>
                <Label className='text-sm font-medium text-[#0F0F0F]'>
                  Service
                </Label>

                {editingField === `${service.id}-title` ? (
                  <div className='flex-1'>
                    <Input
                      value={
                        (fieldValues[`${service.id}-title`]?.value as string) ||
                        ''
                      }
                      onChange={e =>
                        handleFieldChange(`${service.id}-title`, e.target.value)
                      }
                      placeholder='Service name'
                      className='w-full'
                    />
                  </div>
                ) : (
                  <div className='flex-1 rounded-xl border bg-gray-50 p-3'>
                    <span className='text-sm text-gray-900'>
                      {service.title}
                    </span>
                  </div>
                )}

                <div className='mt-2 flex items-center lg:justify-end lg:self-end'>
                  {editingField === `${service.id}-title` ? (
                    <div className='flex gap-2'>
                      <Button
                        size='sm'
                        onClick={() => handleSave(service.id!, 'title')}
                        disabled={updateServiceMutation.isPending}
                      >
                        {updateServiceMutation.isPending ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() =>
                        handleEdit(service.id!, 'title', service.title)
                      }
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </section>

              {/* //////////////////////// */}
              {/* Service Description */}
              {/* //////////////////////// */}
              <section className='flex grid-cols-[240px,1fr,150px] flex-col p-4 lg:items-end xl:grid xl:gap-12'>
                <Label className='text-sm font-medium text-[#0F0F0F]'>
                  Description
                </Label>

                {editingField === `${service.id}-description` ? (
                  <div className='flex-1'>
                    <Textarea
                      value={
                        (fieldValues[`${service.id}-description`]
                          ?.value as string) || ''
                      }
                      onChange={e =>
                        handleFieldChange(
                          `${service.id}-description`,
                          e.target.value
                        )
                      }
                      placeholder='Service description'
                      rows={5}
                      className='w-full'
                    />
                  </div>
                ) : (
                  <div className='min-h-[5lh] flex-1 rounded-xl border bg-gray-50 p-3'>
                    <p className='text-sm text-gray-900'>
                      {service.description}
                    </p>
                  </div>
                )}

                <div className='mt-2 flex items-center lg:justify-end lg:self-end'>
                  {editingField === `${service.id}-description` ? (
                    <div className='flex gap-2'>
                      <Button
                        size='sm'
                        onClick={() => handleSave(service.id!, 'description')}
                        disabled={updateServiceMutation.isPending}
                      >
                        {updateServiceMutation.isPending ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() =>
                        handleEdit(
                          service.id!,
                          'description',
                          service.description || ''
                        )
                      }
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </section>

              {/* //////////////////////// */}
              {/* Service Image */}
              {/* //////////////////////// */}
              <section className='flex grid-cols-[240px,1fr,150px] flex-col p-4 lg:items-end xl:grid xl:gap-12'>
                <Label className='text-sm font-medium text-[#0F0F0F]'>
                  Service Image
                </Label>

                <div className='flex-1'>
                  {service.image ? (
                    <div className='relative aspect-[15/10] max-h-[200px] w-full overflow-hidden rounded-lg border bg-gray-100'>
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className='object-cover'
                        sizes='128px'
                      />
                    </div>
                  ) : (
                    <div className='flex aspect-[15/10] max-h-[200px] w-full flex-col items-center justify-center gap-2 text-gray-500'>
                      <div className='flex h-6 w-6 items-center justify-center rounded bg-gray-100'>
                        <UploadIcon className='h-4 w-4' />
                      </div>
                      <span className='text-sm'>No image uploaded</span>

                      <div className='space-y-1'>
                        <p className='text-xs'>Select from files</p>
                        <Button
                          size='sm'
                          variant='outline'
                          className='border-purple-200 text-purple-600'
                          onClick={() => handleImageUpload(service)}
                        >
                          <UploadIcon className='mr-1 h-4 w-4' />
                          Upload
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className='mt-2 flex items-center lg:justify-start lg:self-end'>
                  {service.image && (
                    <div className='gap-2'>
                      <p className='text-xs'>Select from files</p>
                      <Button
                        size='sm'
                        variant='outline'
                        className='border-purple-200 text-purple-600'
                        onClick={() => handleImageUpload(service)}
                      >
                        <UploadIcon className='mr-1 h-4 w-4' />
                        Upload
                      </Button>
                    </div>
                  )}
                </div>
              </section>

              {/* Delete Service Section */}
              <section className='flex grid-cols-[240px,1fr,150px] flex-col border-b-[0.7px] border-[#E3E8EF] p-4 xl:grid xl:items-center xl:gap-12'>
                <Label className='invisible text-sm font-medium text-[#0F0F0F]'>
                  Delete Service
                </Label>

                <div className='invisible flex-1'>
                  <span className='text-sm text-gray-600'>
                    Remove this service from your business listing
                  </span>
                </div>

                <div className='mt-2 flex items-center lg:justify-end lg:self-end'>
                  <Button
                    size='sm'
                    variant='destructive'
                    onClick={() =>
                      handleDeleteClick(service.id!, service.title)
                    }
                    disabled={deleteServiceMutation.isPending}
                  >
                    {deleteServiceMutation.isPending ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </section>

              {/* Spacer between services */}
              {index < (currentBusiness?.services?.length ?? 0) - 1 && (
                <div className='h-8 border-b-2 border-gray-100'></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Service Dialog */}
      <AddServiceDialog
        isOpen={addServiceDialog.state}
        onClose={addServiceDialog.setFalse}
      />

      {/* Image Upload Dialog */}
      {selectedServiceForImage && (
        <ServiceImageUploadDialog
          isOpen={imageUploadDialog.state}
          onClose={handleImageDialogClose}
          serviceId={selectedServiceForImage.id!}
          serviceName={selectedServiceForImage.title}
          currentImage={selectedServiceForImage.image}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.config && (
        <ConfirmationModal
          isOpen={deleteConfirmation.isOpen}
          onClose={deleteConfirmation.closeConfirmation}
          onConfirm={deleteConfirmation.config.onConfirm}
          title={deleteConfirmation.config.title}
          description={deleteConfirmation.config.description}
          confirmText={deleteConfirmation.config.confirmText || 'Confirm'}
          cancelText={deleteConfirmation.config.cancelText || 'Cancel'}
          variant={deleteConfirmation.config.variant || 'default'}
          isLoading={deleteServiceMutation.isPending}
        />
      )}
    </div>
  );
}
