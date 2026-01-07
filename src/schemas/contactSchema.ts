import { z } from 'zod';

export const contactFormSchema = z.object({
  full_name: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(100, { message: 'Full name must not exceed 100 characters' }),
  business_name: z
    .string()
    .max(100, { message: 'Business name must not exceed 100 characters' })
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(250, { message: 'Message must not exceed 250 characters' }),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
