'use client';
// src/schemas/businessSchema.ts
import * as Yup from 'yup';

/* Common reusable fields */
export const businessIntroductionSchema = Yup.object({
  // logo: Yup.mixed().required('A file is required'),

  business_name: Yup.string().required('Business name is required'),
  description: Yup.string().required('About business field is required'),
  website: Yup.string()
    .url('Enter a valid URL (e.g. https://example.com)')
    .nullable(), // allows it to be empty since it's optional
});
// service_title: Yup.string().required('service title is required'),

export const amenitySchema = Yup.object({
  amenity: Yup.string()
    .nullable('Amenity can not be empty')
    .min(4, 'Amenity too short'),
});
export const locationSchema = Yup.object({
  state: Yup.string()
    .nullable('Amenity can not be empty')
    .min(4, 'Amenity too short'),
});
export const servicesSchema = Yup.object({
  services: Yup.array().of(
    Yup.object({
      service_title: Yup.string().nullable('Title is required'),
      description: Yup.string().nullable('Description is required'),
      image: Yup.mixed().nullable(), // optional
    })
  ),
});

// export const businessSchema = [
//   businessIntroductionSchema,
//   '',
//   '',
//   amenitySchema,
//   servicesSchema,
//   locationSchema,
// ];
