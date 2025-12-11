import { z } from 'zod';

export const profileUpdateSchema = z.object({
  first_name: z.string().max(100, 'Too long').optional(),
  last_name: z.string().max(100, 'Too long').optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, 'Current password is required'),
    new_password: z.string().min(5, 'New password must be at least 5 characters'),
    confirm_password: z.string().min(5, 'Confirm your new password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
