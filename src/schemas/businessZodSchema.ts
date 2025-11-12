import { z } from 'zod';

export const businessIntroductionZodSchema = z.object({
  business_name: z.string().min(1, { message: 'Business name is required' }),
  description: z.string().min(1, { message: 'About business field is required' }),
  website: z.union([z.literal(''), z.string().url('Enter a valid URL (e.g. https://example.com)')]).optional(),
});

export const businessCategoryZodSchema = z.object({
  categories: z.array(z.string()).min(1, { message: 'Please select at least one business category' }),
});

export const businessShowcaseZodSchema = z.object({
  images: z.array(z.any()).optional(), // Optional since images can be skipped
});

export const amenityZodSchema = z.object({
  amenity: z.union([z.literal(''), z.string().min(4, 'Amenity too short')]).optional(),
});

export const locationZodSchema = z.object({
  state: z.string().min(1, 'State is required'),
  address: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  operates_without_location: z.boolean().optional(),
}).refine(
  (data) => {
    // If they don't operate without a location, then address is required
    if (!data.operates_without_location) {
      return data.address && data.address.length > 0;
    }
    return true;
  },
  {
    message: 'Address is required when you have a physical location',
    path: ['address'],
  }
).refine(
  (data) => {
    // If they don't operate without a location, latitude/longitude should be provided
    if (!data.operates_without_location) {
      return data.latitude !== undefined && data.longitude !== undefined;
    }
    return true;
  },
  {
    message: 'Location coordinates are required when you have a physical location',
    path: ['latitude'],
  }
);

export const servicesZodSchema = z.object({
  services: z.array(
    z.object({
      title: z.union([z.literal(''), z.string().min(1, 'Title is required')]),
      description: z.union([z.literal(''), z.string().min(1, 'Description is required')]),
      image_field: z.any().optional(),
    })
  ).min(1, { message: 'Please add at least one service' }),
});

export const contactInformationZodSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone_number: z.string().regex(/^(?:\+234|0(70|80|90|81|91|71))\d{8}$/, 'Invalid phone number'),
  registration_number: z.string().min(1, 'Business registration number is required'),
  whatsapp_link: z.union([z.literal(''), z.string().url('Must be a valid URL')]).optional(),
  facebook_link: z.union([z.literal(''), z.string().url('Must be a valid URL')]).optional(),
  instagram_link: z.union([z.literal(''), z.string().url('Must be a valid URL')]).optional(),
  twitter_link: z.union([z.literal(''), z.string().url('Must be a valid URL')]).optional(),
  tiktok_link: z.union([z.literal(''), z.string().url('Must be a valid URL')]).optional(),
});

export type BusinessIntroductionInput = z.infer<typeof businessIntroductionZodSchema>;
export type BusinessCategoryInput = z.infer<typeof businessCategoryZodSchema>;
export type BusinessShowcaseInput = z.infer<typeof businessShowcaseZodSchema>;
export type ServicesInput = z.infer<typeof servicesZodSchema>;
export type ContactInformationInput = z.infer<typeof contactInformationZodSchema>;
export type LocationInput = z.infer<typeof locationZodSchema>;
