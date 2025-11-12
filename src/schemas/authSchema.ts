// src/schemas/authSchema.ts
import { z } from 'zod';

/* Common reusable fields */
const emailField = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
});

const basicPasswordField = z.object({
  password: z.string().min(1, { message: 'Password is required' }),
});

const strongPasswordField = z.object({
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Must contain at least one number' })
    .regex(/[!@#$%^&*()_+{}:"<>?]/, {
      message: 'Must contain at least one special character',
    }),
});

const confirmPasswordField = z.object({
  password: z.string().min(1, { message: 'Password is required' }),
  confirm_password: z.string().min(1, { message: 'Please confirm your password' }),
}).refine(data => data.password === data.confirm_password, {
  message: 'Passwords must match',
  path: ['confirm_password'],
});

/* Schemas */

export const emailSchema = emailField;

export const loginSchema = emailField.merge(basicPasswordField);

export const signupSchema = emailField
  .merge(
    z.object({
      first_name: z.string().min(1, { message: 'First Name is required' }),
      last_name: z.string().min(1, { message: 'Last Name is required' }),
    })
  )
  .merge(strongPasswordField)
  .merge(confirmPasswordField);

export const forgotPasswordSchema = emailField;

export const createPasswordSchema = strongPasswordField.merge(
  confirmPasswordField
);

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type CreatePasswordInput = z.infer<typeof createPasswordSchema>;
