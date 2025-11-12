'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  MessageCircle,
  BarChart3,
  Zap,
  CreditCard,
  Star,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BusinessSwitcher } from './BusinessSwitcher';
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
} from './icons';
import { Logo } from '@/assets/icons/logo';

const navItems = [
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
    href: '/business/subscription',
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

const supportItems = [
  { name: 'Help & Contact', href: '/business/help', icon: HelpCircle },
  { name: 'Logout', href: '/logout', icon: LogOut },
];


export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className='bg-white border-r border-[#FBFAFF] flex w-[19rem] flex-col overflow-y-auto '>
      <div className='flex flex-col gap-8 p-6 h-40'>
        <Logo className='h-[40px] ' textColor='black' />
        <BusinessSwitcher />
      </div>

      <nav className='flex-1 space-y-4 py-4'>
        <div className='text-sidebar-foreground p-4 px-8 text-xs font-semibold uppercase opacity-50'>
          Overview
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const IconSelected = item.iconSelected;
          const isActive =
            pathname === item.href ||
            (!item.exact &&
              item.href !== '/business' &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                  'relative flex items-center gap-3 px-6 py-3 text-sm text-[#4B5565] transition-colors font-inter',
                isActive
                  ? 'text-[#5F2EEA] font-semibold bg-[#FBFAFF]'
                  : 'hover:bg-[#fbfaffcb]'
              )}
            >
              {isActive ? (
                <IconSelected className='h-5 w-5' />
              ) : (
                <Icon className='h-5 w-5' />
              )}
              {item.name}

              {
                isActive && <div className='absolute !h-[60%] -translate-y-1/2 top-1/2 right-0 w-1 rounded-l-xl bg-primary'></div>
              }
            </Link>
          );
        })}

        {/* Support section */}
        <div className='text-sidebar-foreground mt-6 px-2 py-4 text-xs font-semibold uppercase opacity-50'>
          Support
        </div>
        {supportItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <Icon className='h-5 w-5' />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
