'use client';

import type React from 'react';
import { Sidebar } from '../misc/components/layout/Sidebar';
import { NavbarTop, NavbarBottom } from '../misc/components';
import {
  BusinessProvider,
  useBusinessContext,
} from '@/contexts/BusinessContext';
import { useIsMobile } from '@/hooks';
import { cn } from '@/lib/utils';
import { BusinessNotificationsProvider } from '@/contexts/BusinessNotificationsContext';
import { useUserContext } from '@/contexts/UserContext';
import { useOngoingBusinessOnboarding } from '../misc/api/business';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <BusinessProvider>
      <BusinessNotificationsProvider>
        <BusinessLayoutWrapper>{children}</BusinessLayoutWrapper>
      </BusinessNotificationsProvider>
    </BusinessProvider>
  );
}

const BusinessLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isMobile, isLoading: calculatingScreenWidth } = useIsMobile();
  const { user } = useUserContext();
  const { businesses } = useBusinessContext();
  const router = useRouter();

  const { data: onboardingData, isLoading: isLoadingOnboarding } =
    useOngoingBusinessOnboarding();

  useEffect(() => {
    const data = onboardingData?.data;
    // data can be an empty array [] when onboarding is finished;
    // [] is truthy in JS, so we must explicitly reject arrays and empty objects.
    const hasOngoingOnboarding =
      data &&
      !Array.isArray(data) &&
      typeof data === 'object' &&
      Object.keys(data).length > 0;

    if (!isLoadingOnboarding && hasOngoingOnboarding) {
      // If there's an ongoing onboarding, redirect to the create listing page
      router.push('/businesses/create-listing');
    }
  }, [onboardingData, isLoadingOnboarding, router]);

  return (
    <div
      className={cn(
        'flex h-dvh bg-background',
        isMobile && businesses?.length > 0
          ? 'grid !h-dvh grid-rows-[auto,1fr,auto]'
          : isMobile
            ? 'flex !h-dvh flex-col'
            : ''
      )}
    >
      {calculatingScreenWidth ? null : isMobile ? (
        <NavbarTop />
      ) : businesses?.length ? (
        <Sidebar />
      ) : null}

      {/* Main content */}
      <div className='flex flex-1 flex-col overflow-hidden bg-[#FCFCFD]'>
        {children}
      </div>

      {isMobile && user && user.is_brand_owner && businesses?.length > 0 && (
        <NavbarBottom />
      )}
    </div>
  );
};
