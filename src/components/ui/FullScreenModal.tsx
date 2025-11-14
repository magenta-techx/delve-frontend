import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeButtonPosition?: 'top-left' | 'top-right';
  className?: string;
}

export function FullScreenModal({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  closeButtonPosition = 'top-right',
  className,
}: FullScreenModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-white overflow-y-auto',
        className
      )}
    >
      {showCloseButton && (
        <button
          onClick={onClose}
          className={cn(
            'fixed z-10 p-2 rounded-md hover:bg-gray-100 transition-colors',
            closeButtonPosition === 'top-right' ? 'top-4 right-4' : 'top-4 left-4'
          )}
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>
      )}
      <div className="min-h-screen">
        {children}
      </div>
    </div>
  );
}
