'use client';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import type {
  ApiEnvelope,
  ApiMessage,
  BusinessDashboardDetail,
  BusinessDetail,
  BusinessPerformanceData,
  BusinessService,
} from '@/types/api';
import { authAwareFetch } from '@/utils/authAwareFetch';
import { useAuthErrorHandler } from '@/hooks/useAuthErrorHandler';

// Minimal shapes
export type BusinessId = number | string;

// Category and subcategory types
export interface Category {
  id: number;
  name: string;
}

export interface Subcategory {
  id: number;
  name: string;
  category_id: number;
}

export interface Amenity {
  id: number;
  name: string;
  icon_name: string;
}

export type CreateBusinessData = {
  business_name: string;
  description: string;
  website?: string;
  logo: string | File;
};

// New service creation types
export type CreateServiceData = {
  title: string;
  description: string;
  image?: string | undefined;
};

export type CreateMultipleServicesData = {
  services: CreateServiceData[];
};

export type BusinessHours = {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
};

export type ContactInfo = {
  email: string;
  phone_number: string;
  website?: string;
  whatsapp_link?: string;
  facebook_link?: string;
  instagram_link?: string;
  twitter_link?: string;
  tiktok_link?: string;
  business_hours?: BusinessHours[];
  special_instructions?: string;
};

export type LocationAndContactInfo = {
  address?: string;
  state?: string;
  longitude?: number;
  latitude?: number;
  phone_number?: string;
  registration_number?: string;
  whatsapp_link?: string;
  facebook_link?: string;
  instagram_link?: string;
  twitter_link?: string;
  tiktok_link?: string;
};

// API hooks for categories and subcategories
export function useCategories(): UseQueryResult<Category[], Error> {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await authAwareFetch('/api/business/categories');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch categories');
      return data?.data || data;
    },
  });
}

export function useSubcategories(
  categoryId: number | null
): UseQueryResult<Subcategory[], Error> {
  return useQuery({
    queryKey: ['subcategories', categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const res = await authAwareFetch(
        `/api/business/subcategories?category_id=${categoryId}`
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || 'Failed to fetch subcategories');
      return data?.data || data;
    },
    enabled: Boolean(categoryId),
  });
}

export function useAmenities(): UseQueryResult<Amenity[], Error> {
  return useQuery({
    queryKey: ['amenities'],
    queryFn: async () => {
      const res = await authAwareFetch('/api/business/amenities');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch amenities');
      return data?.data || data;
    },
  });
}

export interface BusinessState {
  id: number;
  name: string;
}

export function useBusinessStates(): UseQueryResult<BusinessState[], Error> {
  return useQuery({
    queryKey: ['business-states'],
    queryFn: async () => {
      const res = await authAwareFetch('/api/business/states');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch states');
      return data?.data || data;
    },
  });
}

export function useCreateBusiness(): UseMutationResult<
  ApiEnvelope<{ business_id: BusinessId }>,
  Error,
  CreateBusinessData
> {
  const qc = useQueryClient();
  const { handleErrorObject } = useAuthErrorHandler();

  return useMutation({
    mutationFn: async data => {
      const formData = new FormData();
      formData.append('business_name', data.business_name);
      formData.append('description', data.description);
      if (data.website) {
        formData.append('website', data.website);
      }

      // Handle logo file
      if (data.logo instanceof File) {
        formData.append('logo', data.logo);
      } else if (typeof data.logo === 'string' && data.logo) {
        formData.append('logo', data.logo);
      }

      const res = await authAwareFetch('/api/business/create/', {
        method: 'POST',
        body: formData,
      });
      const responseData = await res.json();
      if (!res.ok)
        throw new Error(responseData?.error || 'Failed to create business');

      return {
        status: responseData.status,
        message: responseData.message,
        data: {
          business_id: responseData.data.id,
        },
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['business'] });
    },
    onError: error => {
      handleErrorObject(error);
    },
  });
}

export function useBusinessDetails(
  businessId?: BusinessId,
  advertisment_id?: string,
  page?: string
): UseQueryResult<ApiEnvelope<BusinessDetail>, Error> {
  const searchParams = new URLSearchParams();
  if (page) searchParams.set('page', page);
  if (advertisment_id) searchParams.set('advertisment_id', advertisment_id);
  return useQuery({
    queryKey: ['business', businessId, { page, advertisment_id }],

    queryFn: async () => {
      const res = await authAwareFetch(
        `/api/business/${businessId}?${searchParams.toString()}`
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || 'Failed to fetch business details');
      return data;
    },
    enabled: Boolean(businessId),
  });
}
export function useBusinessDashboardDetails(
  businessId?: BusinessId,
  page?: string
): UseQueryResult<ApiEnvelope<BusinessDashboardDetail>, Error> {
  const searchParams = new URLSearchParams();
  if (page) searchParams.set('page', page);
  return useQuery({
    queryKey: ['business', businessId, { page, }],

    queryFn: async () => {
      const res = await authAwareFetch(
        `/api/business/${businessId}?${searchParams.toString()}`
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || 'Failed to fetch business details');
      return data;
    },
    enabled: Boolean(businessId),
  });
}

export function useBusinessPerformance(
  businessId: BusinessId,
  params?: { filter?: string; metric?: string }
): UseQueryResult<ApiEnvelope<BusinessPerformanceData>, Error> {
  const qs = new URLSearchParams();
  if (params?.filter) qs.set('filter', params.filter);
  if (params?.metric) qs.set('metric', params.metric);
  return useQuery({
    queryKey: ['business-performance', businessId, params],
    queryFn: async () => {
      const res = await authAwareFetch(
        `/api/business/${businessId}/performance?${qs.toString()}`
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || 'Failed to fetch performance');
      return data;
    },
    enabled: Boolean(businessId),
  });
}

export function useRequestBusinessApproval(): UseMutationResult<
  ApiMessage,
  Error,
  { business_id: BusinessId }
> {
  const { handleErrorObject } = useAuthErrorHandler();

  return useMutation<ApiMessage, Error, { business_id: BusinessId }>({
    mutationFn: async ({ business_id }) => {
      const res = await authAwareFetch(
        `/api/business/${business_id}/request-approval`,
        { method: 'POST' }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Request approval failed');
      return data;
    },
    onError: handleErrorObject,
  });
}

export function useUpdateBusinessAmenities(): UseMutationResult<
  ApiMessage,
  Error,
  { business_id: BusinessId; amenities_ids: number[] }
> {
  const { handleErrorObject } = useAuthErrorHandler();

  return useMutation<
    ApiMessage,
    Error,
    { business_id: BusinessId; amenities_ids: number[] }
  >({
    mutationFn: async ({ business_id, amenities_ids }) => {
      const res = await authAwareFetch(
        `/api/business/${business_id}/update-amenities`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amenities_ids }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Update amenities failed');
      return data;
    },
    onError: handleErrorObject,
  });
}

export function useUpdateBusinessCategory(): UseMutationResult<
  ApiMessage,
  Error,
  { business_id: BusinessId; category_id: number; subcategory_ids: number[] }
> {
  const { handleErrorObject } = useAuthErrorHandler();

  return useMutation<
    ApiMessage,
    Error,
    { business_id: BusinessId; category_id: number; subcategory_ids: number[] }
  >({
    mutationFn: async ({ business_id, category_id, subcategory_ids }) => {
      const res = await authAwareFetch(
        `/api/business/${business_id}/update-category`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category_id, subcategory_ids }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Update category failed');
      return data;
    },
    onError: handleErrorObject,
  });
}

export type LocationContact = {
  address?: string;
  state?: string;
  longitude?: number;
  latitude?: number;
  phone_number?: string;
  registration_number?: string;
  whatsapp_link?: string;
  facebook_link?: string;
  instagram_link?: string;
  twitter_link?: string;
  tiktok_link?: string;
};

export function useUpdateLocationAndContact(): UseMutationResult<
  ApiMessage,
  Error,
  { business_id: BusinessId } & LocationAndContactInfo
> {
  const { handleErrorObject } = useAuthErrorHandler();

  return useMutation<
    ApiMessage,
    Error,
    { business_id: BusinessId } & LocationAndContactInfo
  >({
    mutationFn: async ({ business_id, ...rest }) => {
      const res = await authAwareFetch(
        `/api/business/${business_id}/update-location`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rest),
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || 'Update location and contact failed');
      return data;
    },
    onError: handleErrorObject,
  });
}

export function useUpdateBusinessServices(): UseMutationResult<
  ApiMessage,
  Error,
  { business_id: BusinessId; services: BusinessService[] }
> {
  const { handleErrorObject } = useAuthErrorHandler();

  return useMutation<
    ApiMessage,
    Error,
    { business_id: BusinessId; services: BusinessService[] }
  >({
    mutationFn: async ({ business_id, services }) => {
      const res = await authAwareFetch(
        `/api/business/${business_id}/update-services`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ services }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Update services failed');
      return data;
    },
    onError: handleErrorObject,
  });
}

export function useCreateBusinessServices(): UseMutationResult<
  ApiMessage,
  Error,
  { business_id: BusinessId } & CreateMultipleServicesData
> {
  const { handleErrorObject } = useAuthErrorHandler();

  return useMutation<
    ApiMessage,
    Error,
    { business_id: BusinessId } & CreateMultipleServicesData
  >({
    mutationFn: async ({ business_id, services }) => {
      const res = await authAwareFetch(
        `/api/business/${business_id}/create-service`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ services }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Create services failed');
      return data;
    },
    onError: handleErrorObject,
  });
}

export function useBusinessActivation(): UseMutationResult<
  ApiMessage,
  Error,
  {
    business_id: BusinessId;
    activation_status: 'activate' | 'deactivate';
    business_name?: string;
    reason_for_deactivation?: string;
  }
> {
  const qc = useQueryClient();
  const { handleErrorObject } = useAuthErrorHandler();

  return useMutation<
    ApiMessage,
    Error,
    {
      business_id: BusinessId;
      activation_status: 'activate' | 'deactivate';
      business_name?: string;
      reason_for_deactivation?: string;
    }
  >({
    mutationFn: async payload => {
      const { business_id, ...body } = payload;
      const res = await authAwareFetch(
        `/api/business/${business_id}/activation`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Activation update failed');
      return data;
    },
    onSuccess: (_data, { business_id }) => {
      qc.invalidateQueries({ queryKey: ['business', business_id] });
    },
    onError: handleErrorObject,
  });
}

export function useUploadBusinessImages(): UseMutationResult<
  ApiEnvelope<string[]>,
  Error,
  { business_id: BusinessId; images: FileList | File[] }
> {
  const qc = useQueryClient();
  const { handleErrorObject } = useAuthErrorHandler();

  return useMutation<
    ApiEnvelope<string[]>,
    Error,
    { business_id: BusinessId; images: FileList | File[] }
  >({
    mutationFn: async ({ business_id, images }) => {
      const fd = new FormData();
      Array.from(images).forEach(file => fd.append('images', file));
      const res = await authAwareFetch(
        `/api/business/${business_id}/upload-image`,
        {
          method: 'POST',
          body: fd,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Image upload failed');
      return data;
    },
    onSuccess: (_data, { business_id }) => {
      qc.invalidateQueries({ queryKey: ['business', business_id] });
    },
    onError: handleErrorObject,
  });
}

export function useDeleteBusinessImages(): UseMutationResult<
  ApiMessage,
  Error,
  { image_ids: number[] }
> {
  const qc = useQueryClient();
  const { handleErrorObject } = useAuthErrorHandler();

  return useMutation<ApiMessage, Error, { image_ids: number[] }>({
    mutationFn: async ({ image_ids }) => {
      const res = await authAwareFetch(`/api/business/image/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_ids }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error((data as any)?.error || 'Delete image failed');
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['business'] });
    },
    onError: handleErrorObject,
  });
}

// ALLLLOW!. This is just for Backward-compatible alias (singular name)
export const useDeleteBusinessImage = useDeleteBusinessImages;

// General business update (name, description, website, logo, thumbnail)
export function useUpdateBusiness(): UseMutationResult<
  ApiMessage,
  Error,
  {
    business_id: BusinessId;
    business_name?: string;
    description?: string;
    website?: string;
    logo?: File;
    thumbnail_image_id?: string;
  }
> {
  const qc = useQueryClient();
  const { handleErrorObject } = useAuthErrorHandler();

  return useMutation<
    ApiMessage,
    Error,
    {
      business_id: BusinessId;
      business_name?: string;
      description?: string;
      website?: string;
      logo?: File;
      thumbnail_image_id?: string;
    }
  >({
    mutationFn: async ({
      business_id,
      business_name,
      description,
      website,
      logo,
      thumbnail_image_id,
    }) => {
      const fd = new FormData();
      if (business_name) fd.append('business_name', business_name);
      if (description) fd.append('description', description);
      if (website) fd.append('website', website);
      if (logo) fd.append('logo', logo);
      if (thumbnail_image_id)
        fd.append('thumbnail_image_id', thumbnail_image_id);

      const res = await authAwareFetch(`/api/business/${business_id}/`, {
        method: 'PATCH',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to update business');
      return data;
    },
    onSuccess: (_data, { business_id }) => {
      qc.invalidateQueries({ queryKey: ['business', business_id] });
      qc.invalidateQueries({ queryKey: ['user-businesses'] });
    },
    onError: handleErrorObject,
  });
}

// Fetch services for a business
export function useBusinessServices(
  businessId: BusinessId
): UseQueryResult<ApiEnvelope<BusinessService[]>, Error> {
  return useQuery({
    queryKey: ['business-services', businessId],
    queryFn: async () => {
      const res = await authAwareFetch(`/api/business/${businessId}/services/`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch services');
      return data;
    },
    enabled: Boolean(businessId),
  });
}

// Create new services
export function useCreateServices(): UseMutationResult<
  ApiMessage,
  Error,
  {
    business_id: BusinessId;
    services: Array<{
      title: string;
      description: string;
      image?: File | null;
    }>;
  }
> {
  const qc = useQueryClient();
  const { handleErrorObject } = useAuthErrorHandler();

  return useMutation<
    ApiMessage,
    Error,
    {
      business_id: BusinessId;
      services: Array<{
        title: string;
        description: string;
        image?: File | null;
      }>;
    }
  >({
    mutationFn: async ({ business_id, services }) => {
      const formData = new FormData();
      if (services.length === 1) {
        // Single service mode
        const service = services[0];
        if (service) {
          formData.append('title', service.title);
          formData.append('description', service.description);
          if (service.image) {
            formData.append('image_field', service.image);
          }
        }
      } else {
        // Multiple services mode
        services.forEach((service, index) => {
          formData.append(`services[${index}][title]`, service.title);
          formData.append(
            `services[${index}][description]`,
            service.description
          );
          if (service.image) {
            formData.append(`services[${index}][image_field]`, service.image);
          }
        });
      }
      const res = await authAwareFetch(
        `/api/business/${business_id}/services/`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to create services');
      return data;
    },
    onSuccess: (_data, { business_id }) => {
      qc.invalidateQueries({ queryKey: ['business-services', business_id] });
    },
    onError: handleErrorObject,
  });
}

// Delete a service
export function useDeleteService(): UseMutationResult<
  ApiMessage,
  Error,
  { business_id: BusinessId; service_id: number }
> {
  const qc = useQueryClient();
  const { handleErrorObject } = useAuthErrorHandler();

  return useMutation<
    ApiMessage,
    Error,
    { business_id: BusinessId; service_id: number }
  >({
    mutationFn: async ({ business_id, service_id }) => {
      const res = await authAwareFetch(
        `/api/business/${business_id}/services/${service_id}/`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error((data as any)?.error || 'Failed to delete service');
      return data;
    },
    onSuccess: (_data, { business_id }) => {
      qc.invalidateQueries({ queryKey: ['business-services', business_id] });
    },
    onError: handleErrorObject,
  });
}

// Update a service
export function useUpdateService(): UseMutationResult<
  ApiMessage,
  Error,
  {
    business_id?: BusinessId;
    service_id?: number;
    service?: { title?: string; description?: string; image?: File | null };
  }
> {
  const qc = useQueryClient();
  const { handleErrorObject } = useAuthErrorHandler();

  return useMutation<
    ApiMessage,
    Error,
    {
      business_id?: BusinessId;
      service_id?: number;
      service?: { title?: string; description?: string; image?: File | null };
    }
  >({
    mutationFn: async ({ business_id, service_id, service }) => {
      const fd = new FormData();
      if (service?.title) fd.append('title', service.title);
      if (service?.description) fd.append('description', service.description);
      if (service?.image) fd.append('image_field', service.image);

      console.log(service);
      const res = await authAwareFetch(
        `/api/business/${business_id}/services/${service_id}/`,
        {
          method: 'PATCH',
          body: fd,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to update service');
      return data;
    },
    onSuccess: (_data, { business_id }) => {
      qc.invalidateQueries({ queryKey: ['business-services', business_id] });
      qc.invalidateQueries({ queryKey: ['business', business_id] });
    },
    onError: handleErrorObject,
  });
}
