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
          background: '#F5F3FF',
          color: '#551FB9',
          border: '1px solid hsl(var(--border))',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        className: 'font-inter',
        classNames: {
          toast: 'group relative flex items-center gap-3 p-4 rounded-lg bg-[#F5F3FF] text-[#551FB9] font-inter',
          title: 'text-base !font-semibold !font-inter',
          description: 'text-sm opacity-90',
          actionButton: 'bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-md px-3 text-xs font-medium',
          cancelButton: 'bg-muted text-muted-foreground hover:bg-muted/80 h-8 rounded-md px-3 text-xs font-medium border border-border',
          closeButton: 'absolute right-2 top-2 text-foreground/50 hover:text-foreground transition-colors',
          error: '!bg-[#FDEBE0] !border-[#FDEBE0] [&>svg]:text-[#BC1B06] !text-[#BC1B06]',
          success: '!bg-green-500 !border-green-500/80 [&>svg]:text-green-500 !text-white',
          warning: '!bg-yellow-500/90 !border-yellow-500/80 [&>svg]:text-yellow-500 !text-white',
          info: '!bg-blue-500/90 !border-blue-500/80 [&>svg]:text-blue-500 !text-white',
          icon: '!flex-shrink-0 !contents',
          content: 'flex-1 flex flex-col gap-0.5',
        },
      }}
      {...props}
    />
  );
}