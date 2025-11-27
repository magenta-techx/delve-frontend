'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HelpCircle, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BusinessSwitcher } from '../BusinessSwitcher';
import {
  DashboardIcon,
  DashboardSelectedIcon,
  MessagesIcon,
  PaymentsIcon,
  PaymentsSelectedIcon,
  PerformanceIcon,
  PerformanceSelectedIcon,
  PromotionsIcon,
  PromotionsSelectedIcon,
  ReviewsIcon,
  ReviewsSelectedIcon,
  SettingsIcon,
  SettingsSelectedIcon,
} from '../icons';
import { Logo } from '@/assets/icons';
import { signOut } from 'next-auth/react';

export const navItems = [
  {
    name: 'Dashboard',
    href: '/business',
    icon: DashboardIcon,
    iconSelected: DashboardSelectedIcon,
    exact: true,
  },
  {
    name: 'Messages',
    href: '/business/messages',
    icon: MessagesIcon,
    iconSelected: MessagesIcon,
    exact: false,
  },
  {
    name: 'Performance',
    href: '/business/performance',
    icon: PerformanceIcon,
    iconSelected: PerformanceSelectedIcon,
    exact: false,
  },
  {
    name: 'Promotions and Ads',
    href: '/business/promotions',
    icon: PromotionsIcon,
    iconSelected: PromotionsSelectedIcon,
    exact: false,
  },
  {
    name: 'Payment & Subscription',
    href: '/business/payments',
    icon: PaymentsIcon,
    iconSelected: PaymentsSelectedIcon,
    exact: false,
  },
  {
    name: 'Review Management',
    href: '/business/review-management',
    icon: ReviewsIcon,
    iconSelected: ReviewsSelectedIcon,
    exact: false,
  },
  {
    name: 'Settings',
    href: '/business/settings',
    icon: SettingsIcon,
    iconSelected: SettingsSelectedIcon,
    exact: false,
  },
];

const logout = () => {
  signOut({ callbackUrl: '/' });
};

export const supportItems = [
  {
    name: 'Help & Contact',
    href: '/business/help',
    icon: HelpCircle,
    iconSelected: HelpCircle,
  },
  { name: 'Logout', href: '/logout', icon: LogOut, onClick: logout },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside
      className='scrollbar-hide relative flex w-[17rem] flex-col overflow-y-auto border-r border-[#FBFAFF] bg-white lg:w-[19rem]'
      style={{ scrollbarGutter: 'auto' }}
    >
      <style jsx global>{`
        .scrollbar-hide {
          scrollbar-width: none !important;
          scrollbar-gutter: auto !important;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
      <div className='top-0 h-40 space-y-4 p-6'>
        <Logo className='h-[40px]' textColor='black' />
        <BusinessSwitcher />
      </div>

      <nav className='flex flex-1 flex-col gap-y-2.5 py-4'>
        <div className='text-sidebar-foreground p-4 px-8 text-xs font-semibold uppercase opacity-50'>
          Overview
        </div>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const IconSelected = item.iconSelected;
          const isActive =
            pathname === item.href ||
            (!item.exact &&
              item.href !== '/business' &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={index + Date.now()}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-6 py-3 font-inter text-sm text-[#4B5565] transition-colors',
                isActive
                  ? 'bg-[#FBFAFF] font-semibold text-[#5F2EEA]'
                  : 'hover:bg-[#fbfaffcb]'
              )}
            >
              {isActive ? (
                <IconSelected className='h-5 w-5' />
              ) : (
                <Icon className='h-5 w-5' />
              )}
              {item.name}

              {isActive && (
                <div className='absolute right-0 top-1/2 !h-[60%] w-1 -translate-y-1/2 rounded-l-xl bg-primary'></div>
              )}
            </Link>
          );
        })}

        {/* Support section */}
        <div className='text-sidebar-foreground mt-auto p-4 px-8 text-xs font-semibold uppercase opacity-50'>
          Support
        </div>
        {supportItems.map((item, index) => {
          const Icon = item.icon;
          const IconSelected = item.icon;
          const isActive = pathname === item.href;

          return (
            <>
              {item.onClick ? (
                <button
                  key={index + Date.now()}
                  onClick={item.onClick}
                  className={cn(
                    'relative flex items-center gap-3 px-6 py-3 font-inter text-sm text-[#4B5565] transition-colors',
                    isActive
                      ? 'bg-[#FBFAFF] font-semibold text-[#5F2EEA]'
                      : 'hover:bg-[#fbfaffcb]'
                  )}
                >
                  <Icon className='h-5 w-5' />
                  {item.name}
                </button>
              ) : (
                <Link
                  key={index + Date.now()}
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-3 px-6 py-3 font-inter text-sm text-[#4B5565] transition-colors',
                    isActive
                      ? 'bg-[#FBFAFF] font-semibold text-[#5F2EEA]'
                      : 'hover:bg-[#fbfaffcb]'
                  )}
                >
                  {isActive ? (
                    <IconSelected className='h-5 w-5' />
                  ) : (
                    <Icon className='h-5 w-5' />
                  )}
                  {item.name}

                  {isActive && (
                    <div className='absolute right-0 top-1/2 !h-[60%] w-1 -translate-y-1/2 rounded-l-xl bg-primary'></div>
                  )}
                </Link>
              )}
            </>
          );
        })}
      </nav>
    </aside>
  );
}
