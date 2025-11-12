# Next.js 15 TypeScript Boilerplate

A comprehensive, production-ready Next.js 15 boilerplate with App Router, strict TypeScript enforcement, and modern best practices.

## 🚀 Features

- **Next.js 15**: Latest Next.js with App Router and Server Components
- **Strict TypeScript**: Configured with the strictest TypeScript settings
- **File Extension Enforcement**: ESLint rules that prevent `.js` and `.jsx` files
- **App Router**: Modern file-based routing with layouts, loading, and error boundaries
- **Comprehensive ESLint**: Extended rules for code quality and consistency
- **Prettier Integration**: Automatic code formatting with Tailwind CSS plugin
- **Tailwind CSS**: Pre-configured with custom design system
- **Path Mapping**: Absolute imports with `@/` prefix
- **Development Tools**: Type checking, linting, and formatting scripts
- **VSCode Integration**: Recommended extensions and settings

## 📁 Project Structure

```
src/
├── app/                # App Router pages and layouts
│   ├── api/           # API routes
│   ├── dashboard/     # Dashboard pages with nested layout
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Home page
│   ├── loading.tsx    # Global loading UI
│   ├── error.tsx      # Global error UI
│   └── not-found.tsx  # 404 page
├── components/         # Reusable UI components
│   └── ui/            # Base UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries and configurations
├── styles/            # Global styles and CSS
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## 🛠️ Getting Started

1. **Install dependencies:**

   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Run type checking:**

   ```bash
   npm run type-check
   ```

4. **Lint and format code:**
   ```bash
   npm run lint
   npm run format
   ```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript compiler check
- `npm run type-check:watch` - Run TypeScript compiler in watch mode
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run pre-commit` - Run all checks (type, lint, format)
- `npm run clean` - Clean build artifacts
- `npm run analyze` - Analyze bundle size

## 🔧 Configuration

### TypeScript Strict Mode

This boilerplate uses the strictest TypeScript configuration:

- `strict: true` - Enable all strict type checking options
- `noImplicitAny: true` - Error on expressions with implied 'any' type
- `strictNullChecks: true` - Enable strict null checks
- `noUnusedLocals: true` - Error on unused local variables
- `noUnusedParameters: true` - Error on unused parameters
- `exactOptionalPropertyTypes: true` - Interpret optional properties exactly
- `noUncheckedIndexedAccess: true` - Add undefined to unindexed access
- `allowJs: false` - Disallow JavaScript files

### ESLint Rules

Key ESLint rules enforced:

- **File Extension Blocking**: Prevents creation of `.js` and `.jsx` files
- **Naming Conventions**: Enforces consistent file and folder naming
- **Import Organization**: Automatic import sorting and unused import removal
- **TypeScript Best Practices**: Strict TypeScript-specific rules
- **React Best Practices**: React and React Hooks rules
- **Accessibility**: JSX accessibility rules

### File Naming Conventions

<!-- - **Components**: PascalCase (e.g., `Button.tsx`, `UserProfile.tsx`) -->
- **App Router Pages**: kebab-case (e.g., `page.tsx`, `layout.tsx`, `loading.tsx`)
- **API Routes**: kebab-case (e.g., `route.ts`)
- **Utilities**: camelCase (e.g., `formatters.ts`, `apiHelpers.ts`)
- **Hooks**: camelCase starting with 'use' (e.g., `useLocalStorage.ts`)
- **Types**: camelCase (e.g., `userTypes.ts`, `apiTypes.ts`)

## 🎨 Styling

This boilerplate uses Tailwind CSS with:

- Custom design system variables
- Dark mode support
- Prettier plugin for class sorting
- Custom component patterns

## 🔍 Type Safety

- All files must use `.ts` or `.tsx` extensions
- Strict TypeScript configuration prevents common errors
- ESLint rules enforce TypeScript best practices
- Path mapping for clean imports (`@/components`, `@/utils`, etc.)

## 📦 Dependencies

### Core Dependencies

- Next.js 15
- React 18.3
- TypeScript 5.6
- Radix UI Slot (for composable components)

### Development Dependencies

- ESLint 9 with TypeScript support
- Prettier 3 with Tailwind plugin
- Various ESLint plugins for enhanced rules

## 🚫 What's Not Allowed

- `.js` and `.jsx` files (blocked by ESLint)
- `any` types (error level)
- Unused variables and imports
- Non-null assertions
- Implicit returns in functions
- Console.log statements (only console.error allowed)

## 🤝 Contributing

1. Follow the established naming conventions
2. Ensure all TypeScript checks pass
3. Run `npm run pre-commit` before committing
4. Write type-safe code with proper interfaces

## 📄 License

MIT License - feel free to use this boilerplate for your projects!
