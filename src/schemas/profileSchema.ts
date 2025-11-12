import { z } from 'zod';

export const profileUpdateSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100, 'Too long'),
  last_name: z.string().min(1, 'Last name is required').max(100, 'Too long'),
  email: z.string().email(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export const changePasswordSchema = z
  .object({
    old_password: z.string().min(8, 'Old password is required'),
    new_password: z.string().min(10, 'New password must be at least 10 characters'),
    confirm_password: z.string().min(10, 'Confirm your new password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
