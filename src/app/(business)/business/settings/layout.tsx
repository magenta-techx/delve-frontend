'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button, LinkButton } from '@/components/ui';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { DeactivateBusinessModal } from '@/app/(business)/misc/components/DeactivateBusinessModal';
import { BusinessActivationModal } from '@/app/(business)/misc/components/BusinessActivationModal';
import { useBooleanStateControl } from '@/hooks';
import { BoxedArrow, LogoLoadingIcon } from '@/assets/icons';
import { cn } from '@/lib/utils';
import { useRequestBusinessApproval } from '@/app/(business)/misc/api/business';
import { toast } from 'sonner';

const tabs = [
  { name: 'General', href: '/business/settings/general' },
  { name: 'Profile', href: '/business/settings/profile' },
  { name: 'Services', href: '/business/settings/services' },
  { name: 'Contact', href: '/business/settings/contact' },
  { name: 'Opening hours', href: '/business/settings/hours' },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentBusiness, isLoading, refetchBusinesses } =
    useBusinessContext();
  const {
    state: isDeactivateModalOpen,
    setTrue: openDeactivateModal,
    setFalse: closeDeactivateModal,
  } = useBooleanStateControl();
  const {
    state: isActivateModalOpen,
    setTrue: openActivateModal,
    setFalse: closeActivateModal,
  } = useBooleanStateControl();

  const requestApprovalMutation = useRequestBusinessApproval();

  const handleRequestApproval = async () => {
    if (!currentBusiness?.id) {
      toast.error('No business selected');
      return;
    }

    try {
      await requestApprovalMutation.mutateAsync({
        business_id: currentBusiness.id,
      });
      toast.success('Approval request sent successfully');
      refetchBusinesses();
    } catch (error) {
      toast.error('Error', {
        description: String(error) || 'Failed to request approval',
      });
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <LogoLoadingIcon />
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'h-full w-full space-y-3 overflow-hidden md:space-y-6',
          pathname !== '/business/settings/gallery' &&
            'grid grid-rows-[max-content,max-content,1fr]'
        )}
      >
        {pathname !== '/business/settings/gallery' && (
          <>
            {' '}
            {/* Header */}
            <header className='flex items-center p-4 !pb-0 lg:justify-between lg:p-6'>
              <div className='max-lg:w-full'>
                <div className='flex items-start justify-between gap-4 md:items-center'>
                  <h1 className='font-inter text-xl font-semibold lg:text-3xl'>
                    {currentBusiness?.name || 'Business Settings'}
                    <span className='max-w-[30ch] text-balance text-xs font-normal text-[#4B5565] max-lg:block lg:hidden'>
                      Manage your business details and account settings
                    </span>
                  </h1>
                  <div className='ml-auto flex flex-col gap-1.5'>
                    {currentBusiness?.status === 'archived' ? (
                      <Button
                        onClick={openActivateModal}
                        variant='light_green'
                        size='sm'
                        className='ml-auto border-destructive lg:hidden'
                      >
                        Activate
                      </Button>
                    ) : (
                      <Button
                        onClick={openDeactivateModal}
                        variant='destructive_outline'
                        size='sm'
                        className='ml-auto border-destructive bg-[#FFF4ED] text-destructive hover:bg-destructive/10 lg:hidden'
                      >
                        Deactivate
                      </Button>
                    )}

                    {currentBusiness?.admin_approval_status === 'approved' ? (
                      <LinkButton
                        href={`/businesses/${currentBusiness?.id}`}
                        size='sm'
                      >
                        Preview Business Profile
                        <BoxedArrow className='ml-2' />
                      </LinkButton>
                    ) : currentBusiness?.admin_approval_status ===
                      'rejected' ? (
                      <Button
                        onClick={handleRequestApproval}
                        disabled={requestApprovalMutation.isPending}
                        size='sm'
                        variant='light'
                      >
                        {requestApprovalMutation.isPending
                          ? 'Requesting...'
                          : 'Request Approval'}
                      </Button>
                    ) : null}
                  </div>
                </div>
                <p className='hidden text-balance text-xs text-[#4B5565] lg:block lg:text-sm'>
                  Manage your business details and account settings
                </p>
              </div>
              {currentBusiness?.admin_approval_status === 'approved' ? (
                <LinkButton
                  href={`/businesses/${currentBusiness?.id}`}
                  className='bg-primary text-white hover:bg-primary/90 max-md:hidden'
                  size='lg'
                >
                  Preview Business Profile
                  <BoxedArrow className='ml-2' />
                </LinkButton>
              ) : currentBusiness?.admin_approval_status === 'rejected' ? (
                <Button
                  onClick={handleRequestApproval}
                  disabled={requestApprovalMutation.isPending}
                  size='lg'
                  variant='light'
                  className='max-md:hidden'
                >
                  {requestApprovalMutation.isPending
                    ? 'Requesting...'
                    : 'Request Approval'}
                </Button>
              ) : null}
            </header>
            {/* Tabs Navigation */}
            <div className='border-border px-4 lg:px-6'>
              <nav className='flex gap-2 lg:gap-5'>
                {tabs.map(tab => {
                  const isActive = pathname === tab.href;
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={`rounded-xl border px-3 py-1.5 font-inter text-[0.8rem] font-normal transition-colors max-lg:w-max md:px-4 md:text-sm ${
                        isActive
                          ? 'border-[#D9D6FE] bg-[#F5F3FF] text-primary'
                          : 'border-[#D9D6FE] text-[#697586]'
                      }`}
                    >
                      {tab.name}
                    </Link>
                  );
                })}
                {currentBusiness?.status === 'archived' ? (
                  <Button
                    onClick={openActivateModal}
                    variant='green'
                    className='ml-auto'
                  >
                    Activate Business
                  </Button>
                ) : (
                  <Button
                    onClick={openDeactivateModal}
                    variant='destructive_outline'
                    className='ml-auto hidden rounded-lg border-destructive text-destructive hover:bg-destructive/10 lg:block'
                  >
                    Deactivate Business
                  </Button>
                )}
              </nav>
            </div>
          </>
        )}

        <div className='overflow-y-auto p-4 max-md:pb-16'>{children}</div>
      </div>

      {isDeactivateModalOpen && (
        <DeactivateBusinessModal
          businessId={currentBusiness?.id || 0}
          businessName={currentBusiness?.name || ''}
          onClose={closeDeactivateModal}
        />
      )}
      {isActivateModalOpen && (
        <BusinessActivationModal
          business_id={currentBusiness?.id || 0}
          isOpen={isActivateModalOpen}
          onClose={closeActivateModal}
          onActivated={refetchBusinesses}
        />
      )}
    </>
  );
}
