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
      <div className='flex h-full w-full flex-col gap-3 overflow-hidden md:gap-6'>
        {pathname !== '/business/settings/gallery' && (
          <>
            {' '}
            {/* Header */}
            <header className='flex w-full min-w-0 items-center p-4 !pb-0 lg:justify-between lg:p-6'>
              <div className='min-w-0 max-lg:w-full'>
                <div className='flex w-full min-w-0 items-start justify-between gap-4 md:items-center'>
                  <h1 className='min-w-0 break-words font-inter text-xl font-semibold lg:text-3xl'>
                    {currentBusiness?.name || 'Business Settings'}
                    <span className='mt-1 max-w-[32ch] text-xs font-normal text-[#4B5565] max-lg:block lg:hidden'>
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

                    {currentBusiness?.status !== 'rejected' && (
                      <LinkButton
                        href={`/business/preview`}
                        size='lg'
                        className='max-md:fixed max-md:bottom-20 max-md:left-4 max-md:right-4 max-md:z-50 max-md:w-auto md:hidden'
                      >
                        <span className='hidden md:block'>
                          Preview Business Profile
                        </span>
                        <span className='md:hidden'>Preview</span>

                        <BoxedArrow className='ml-2' />
                      </LinkButton>
                    )}

                    {currentBusiness?.admin_approval_status === 'rejected' && (
                      <Button
                        onClick={handleRequestApproval}
                        disabled={requestApprovalMutation.isPending}
                        size='sm'
                        variant='light'
                        className='max-md:fixed max-md:bottom-4 max-md:left-4 max-md:right-4 max-md:z-50'
                      >
                        {requestApprovalMutation.isPending
                          ? 'Requesting...'
                          : 'Request Approval'}
                      </Button>
                    )}
                  </div>
                </div>
                <p className='hidden text-balance text-xs text-[#4B5565] lg:block lg:text-sm'>
                  Manage your business details and account settings
                </p>
              </div>
              <div className='flex items-center gap-3 max-md:hidden'>
                {currentBusiness?.status !== 'archived' && (
                  <LinkButton
                    href={`/business/preview`}
                    className='bg-primary text-white hover:bg-primary/90'
                    size='lg'
                  >
                    <span className='hidden md:inline-block'>
                      Preview Business Profile
                    </span>
                    <span className='md:hidden'>Preview </span>
                    <BoxedArrow className='ml-2' />
                  </LinkButton>
                )}
                {currentBusiness?.admin_approval_status === 'rejected' && (
                  <Button
                    onClick={handleRequestApproval}
                    disabled={requestApprovalMutation.isPending}
                    size='lg'
                    variant='light'
                  >
                    {requestApprovalMutation.isPending
                      ? 'Requesting...'
                      : 'Request Approval'}
                  </Button>
                )}
              </div>
            </header>
            {/* Tabs Navigation */}
            <div className='w-full min-w-0 overflow-hidden border-border'>
              <nav className='!scrollbar-hide flex gap-2 overflow-x-auto pb-2 pl-4 lg:gap-5 lg:px-6 lg:pb-0'>
                {tabs.map(tab => {
                  const isActive = pathname === tab.href;
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={cn(
                        'w-max whitespace-nowrap rounded-xl border px-3 py-1.5 font-inter text-[0.75rem] font-normal transition-colors md:px-4 md:text-sm',
                        isActive
                          ? 'border-[#D9D6FE] bg-[#F5F3FF] text-primary'
                          : 'border-[#D9D6FE] text-[#697586]'
                      )}
                    >
                      {tab.name}
                    </Link>
                  );
                })}
                {currentBusiness?.status === 'archived' ? (
                  <Button
                    onClick={openActivateModal}
                    variant='green'
                    className='ml-auto max-md:hidden'
                  >
                    Activate Business
                  </Button>
                ) : (
                  <Button
                    onClick={openDeactivateModal}
                    variant='destructive_outline'
                    className='ml-auto rounded-lg border-destructive text-destructive hover:bg-destructive/10 max-md:hidden lg:block'
                  >
                    Deactivate Business
                  </Button>
                )}
              </nav>
            </div>
          </>
        )}

        <div className='w-full min-w-0 flex-1 overflow-y-auto p-4 max-md:pb-32'>
          {children}
        </div>
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
