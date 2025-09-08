import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import checkFile from 'eslint-plugin-check-file';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/dist/**',
      '**/build/**',
      '**/.env*',
      '**/*.log',
      '**/coverage/**',
      '**/.vscode/**',
      '**/.idea/**',
      '**/.DS_Store',
      '**/Thumbs.db',
      '**/*.tsbuildinfo',
      '**/next-env.d.ts',
      'postcss.config.js',
      'tailwind.config.js',
    ],
  },
  // Configuration for JS/JSX files - BLOCKS THEM
  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: {
      'check-file': checkFile,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      // File Extension Blocking - CRITICAL for TypeScript-only enforcement
      'check-file/filename-blocklist': [
        'error',
        {
          '**/*.js': '*.ts',
          '**/*.jsx': '*.tsx',
        },
      ],
    },
  },
  // Configuration for TypeScript files
  ...compat.extends(
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      // File Extension Blocking
      'check-file/filename-blocklist': [
        'error',
        {
          '**/*.js': '*.ts',
          '**/*.jsx': '*.tsx',
          '**/*.model.ts': '*.models.ts',
          '**/*.util.ts': '*.utils.ts',
        },
      ],
      'check-file/filename-naming-convention': [
        'error',
        {
          'src/**/*.{ts,tsx}': '+(+([a-z0-9])|*([A-Z]*([a-z0-9])))',
          'src/components/**/*.{ts,tsx}': 'PASCAL_CASE',
          'src/app/**/*.{ts,tsx}': 'KEBAB_CASE',
          'src/utils/**/*.ts': 'CAMEL_CASE',
          'src/hooks/**/*.ts': 'CAMEL_CASE',
          'src/types/**/*.ts': 'CAMEL_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      // TypeScript Strict Rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      // General Rules
      'no-console': [
        'error',
        {
          allow: ['error', 'warn', 'log'],
        },
      ],
      'prefer-const': 'error',
    },
  },
  // App Router specific overrides
  {
    files: ['src/app/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },
  // Next.js special files exceptions
  {
    files: [
      'src/app/**/not-found.tsx',
      'src/app/**/global-error.tsx',
      'src/app/**/default.tsx',
    ],
    rules: {
      'check-file/filename-naming-convention': 'off',
    },
  },
];
