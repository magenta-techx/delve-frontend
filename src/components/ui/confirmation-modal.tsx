'use client';

/**
 * ConfirmationModal - A reusable confirmation dialog component with variants
 * 
 * Usage Examples:
 * 
 * // Using the component directly
 * <ConfirmationModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Delete Item"
 *   description="Are you sure you want to delete this item? This action cannot be undone."
 *   variant="destructive"
 *   confirmText="Delete"
 *   cancelText="Cancel"
 * />
 * 
 * // Using the useConfirmationModal hook
 * const confirmation = useConfirmationModal();
 * 
 * const handleDeleteClick = () => {
 *   confirmation.openConfirmation({
 *     title: 'Delete Service',
 *     description: 'Are you sure you want to delete this service?',
 *     variant: 'destructive',
 *     confirmText: 'Delete',
 *     onConfirm: () => performDelete(),
 *   });
 * };
 * 
 * Variants: 'default', 'destructive', 'warning', 'info'
 */

import React from 'react';
import { AlertCircle, Trash2, AlertTriangle, Info } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/Button';
import { cva, type VariantProps } from 'class-variance-authority';

const confirmationVariants = cva('', {
  variants: {
    variant: {
      default: '',
      destructive: '',
      warning: '',
      info: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const variantConfig = {
  default: {
    icon: Info,
    iconColor: 'text-blue-600',
    actionButtonClass: 'bg-blue-600 hover:bg-blue-700',
  },
  destructive: {
    icon: Trash2,
    iconColor: 'text-red-600',
    actionButtonClass: 'bg-red-600 hover:bg-red-700',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    actionButtonClass: 'bg-yellow-600 hover:bg-yellow-700',
  },
  info: {
    icon: AlertCircle,
    iconColor: 'text-blue-600',
    actionButtonClass: 'bg-blue-600 hover:bg-blue-700',
  },
};

interface ConfirmationModalProps extends VariantProps<typeof confirmationVariants> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  showIcon?: boolean;
  customIcon?: React.ReactNode;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  showIcon = true,
  customIcon,
  variant = 'default',
}: ConfirmationModalProps) {
  const config = variantConfig[variant || 'default'];
  const IconComponent = config.icon;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {showIcon && (
              <div className="flex-shrink-0">
                {customIcon || (
                  <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
                )}
              </div>
            )}
            <div className="flex-1">
              <AlertDialogTitle className="text-left">{title}</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-left mt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className={config.actionButtonClass}
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Loading...
                </>
              ) : (
                confirmText
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Export variants for type checking
export type ConfirmationModalVariant = VariantProps<typeof confirmationVariants>['variant'];

// Helper hook for managing confirmation modal state
export function useConfirmationModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<{
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: ConfirmationModalVariant;
    confirmText?: string;
    cancelText?: string;
  } | null>(null);

  const openConfirmation = React.useCallback((newConfig: {
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: ConfirmationModalVariant;
    confirmText?: string;
    cancelText?: string;
  }) => {
    setConfig(newConfig);
    setIsOpen(true);
  }, []);

  const closeConfirmation = React.useCallback(() => {
    setIsOpen(false);
    setConfig(null);
  }, []);

  return {
    isOpen,
    config,
    openConfirmation,
    closeConfirmation,
  };
}