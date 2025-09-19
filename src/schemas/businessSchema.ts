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

export const contactInformationSchema = Yup.object({
  phone_number: Yup.string()
    .matches(/^(?:\+234|0(70|80|90|81|91|71))\d{8}$/, 'Invalid phone number')
    .required('Phone number is required'),
  registration_number: Yup.string().required(
    'Business registration number is required'
  ),
  socials: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().required(),
      text: Yup.string().required(),
      url_input: Yup.string()
        .url('Must be a valid URL')
        .required('Social media link is required'),
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
