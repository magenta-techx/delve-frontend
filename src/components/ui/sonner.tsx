'use client';

import { Toaster as SonnerToaster, type ToasterProps } from 'sonner';

export function Toaster({ ...props }: ToasterProps) {
  return (
    <SonnerToaster
      position="top-right"
      theme="light"
      richColors
      closeButton
      expand={false}
      visibleToasts={3}
      gap={12}
      toastOptions={{
        style: {
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        className: 'font-inter',
        classNames: {
          toast: 'group relative flex items-start gap-3 p-4 rounded-lg bg-background',
          title: 'text-sm font-medium',
          description: 'text-sm opacity-90 mt-1',
          actionButton: 'bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-md px-3 text-xs font-medium',
          cancelButton: 'bg-muted text-muted-foreground hover:bg-muted/80 h-8 rounded-md px-3 text-xs font-medium border border-border',
          closeButton: 'absolute right-2 top-2 text-foreground/50 hover:text-foreground transition-colors',
          error: '!bg-red-400 !border-destructive/80 [&>svg]:text-destructive !text-white',
          success: '!bg-green-500 !border-green-500/80 [&>svg]:text-green-500 !text-white',
          warning: '!bg-yellow-500/90 !border-yellow-500/80 [&>svg]:text-yellow-500 !text-white',
          info: '!bg-blue-500/90 !border-blue-500/80 [&>svg]:text-blue-500 !text-white',
        },
      }}
      {...props}
    />
  );
}