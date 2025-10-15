// src/schemas/authSchema.ts
import * as Yup from 'yup';

/* Common reusable fields */
const emailField = {
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
};

const basicPasswordField = {
  password: Yup.string().required('Password is required'),
};

const strongPasswordField = {
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(
      /[!@#$%^&*()_+{}:"<>?]/,
      'Must contain at least one special character'
    )
    .required('Password is required'),
};

const confirmPasswordField = {
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
};

/* Schemas */

export const baseSchema = Yup.object(emailField);

export const emailSchema= Yup.object(emailField)

export const loginSchema = baseSchema.shape(basicPasswordField);

export const signupSchema = baseSchema.shape({
  first_name: Yup.string().required('First Name is required'),
  last_name: Yup.string().required('Last Name is required'),
  ...strongPasswordField,
  ...confirmPasswordField,
});

export const forgotPasswordSchema = baseSchema;
export const createPasswordSchema = Yup.object({
  ...strongPasswordField,
  ...confirmPasswordField,
});
