/**
 * Application constants
 */

export const APP_CONFIG = {
  name: 'Next.js TypeScript Boilerplate',
  description: 'A strict TypeScript Next.js boilerplate with best practices',
  version: '1.0.0',
  author: 'Your Name',
  url: 'https://your-domain.com',
} as const;

export const API_ENDPOINTS = {
  users: '/api/users',
  auth: '/api/auth',
  posts: '/api/posts',
} as const;

export const ROUTES = {
  home: '/',
  about: '/about',
  contact: '/contact',
  login: '/login',
  dashboard: '/dashboard',
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const THEME_COLORS = {
  primary: 'hsl(222.2 47.4% 11.2%)',
  secondary: 'hsl(210 40% 96%)',
  accent: 'hsl(210 40% 96%)',
  destructive: 'hsl(0 84.2% 60.2%)',
  muted: 'hsl(210 40% 96%)',
} as const;
