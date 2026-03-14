'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BusinessSwitcher } from '../BusinessSwitcher';
import {
  DashboardIcon,
  DashboardSelectedIcon,
  HelpIcon,
  HelpSelectedIcon,
  MessagesIcon,
  MessagesSelectedIcon,
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
import { Logo, LogoIcon } from '@/assets/icons';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

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
    iconSelected: MessagesSelectedIcon,
    exact: false,
  },
  {
    name: 'Performance',
    href: '/business/performance',
    icon: PerformanceIcon,
    iconSelected: PerformanceSelectedIcon,
    exact: true,
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
    icon: HelpIcon,
    iconSelected: HelpSelectedIcon,
  },
  { name: 'Logout', href: '/logout', icon: LogOut, onClick: logout },
];

/** Icon-only version of the Delve logo (the 4 colored shapes) */
// const LogoIcon = ({ className }: { className?: string }) => (
//   <Link href='/' className={className}>
//     <svg
//       width={26}
//       height={26}
//       viewBox='84 0 26 25'
//       fill='none'
//       xmlns='http://www.w3.org/2000/svg'
//     >
//       <path
//         d='M88.9189 0H91.8573C92.9908 0.000264822 94.0778 0.444394 94.8791 1.23471C95.6805 2.02503 96.1307 3.09682 96.1307 4.21437V7.1115C96.1307 7.66493 96.0202 8.21295 95.8054 8.72426C95.5905 9.23557 95.2757 9.70016 94.8788 10.0915C94.4819 10.4828 94.0107 10.7933 93.4921 11.0051C92.9735 11.2169 92.4176 11.3259 91.8563 11.3259H88.9189C87.7853 11.3259 86.6981 10.8819 85.8965 10.0915C85.0949 9.30116 84.6445 8.22922 84.6445 7.1115V4.21437C84.6445 3.09665 85.0949 2.02471 85.8965 1.23436C86.6981 0.444012 87.7853 0 88.9189 0Z'
//         fill='#551FB9'
//       />
//       <path
//         d='M104.259 0C105.395 0 106.506 0.332119 107.45 0.954359C108.395 1.5766 109.131 2.46101 109.565 3.49576C110 4.53051 110.114 5.66912 109.892 6.7676C109.671 7.86608 109.124 8.8751 108.32 9.66706C107.517 10.459 106.494 10.9984 105.38 11.2169C104.265 11.4354 103.111 11.3232 102.061 10.8946C101.012 10.466 100.115 9.74018 99.4836 8.80893C98.8525 7.87769 98.5156 6.78284 98.5156 5.66283C98.5156 4.16096 99.1207 2.72059 100.198 1.65861C101.275 0.596618 102.736 0 104.259 0Z'
//         fill='#FF0054'
//       />
//       <path
//         d='M88.9189 13.6738H91.8573C92.9908 13.6741 94.0778 14.1182 94.8791 14.9085C95.6805 15.6989 96.1307 16.7706 96.1307 17.8882V20.7853C96.1307 21.3388 96.0202 21.8868 95.8054 22.3981C95.5905 22.9094 95.2757 23.374 94.8788 23.7653C94.4819 24.1567 94.0107 24.4671 93.4921 24.6789C92.9735 24.8907 92.4176 24.9997 91.8563 24.9997H88.9189C87.7853 24.9997 86.6981 24.5557 85.8965 23.7653C85.0949 22.975 84.6445 21.903 84.6445 20.7853V17.8882C84.6445 16.7705 85.0949 15.6985 85.8965 14.9082C86.6981 14.1178 87.7853 13.6738 88.9189 13.6738Z'
//         fill='#551FB9'
//       />
//       <path
//         d='M102.79 13.6738H105.728C106.862 13.6741 107.949 14.1182 108.75 14.9085C109.552 15.6989 110.002 16.7706 110.002 17.8882V20.7853C110.002 21.3388 109.891 21.8868 109.676 22.3981C109.462 22.9094 109.147 23.374 108.75 23.7653C108.353 24.1567 107.882 24.4671 107.363 24.6789C106.845 24.8907 106.289 24.9997 105.727 24.9997H102.79C101.656 24.9997 100.569 24.5557 99.7676 23.7653C98.966 22.975 98.5156 21.903 98.5156 20.7853V17.8882C98.5156 16.7705 98.966 15.6985 99.7676 14.9082C100.569 14.1178 101.656 13.6738 102.79 13.6738Z'
//         fill='#FAB40A'
//       />
//     </svg>
//   </Link>
// );

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'scrollbar-hide relative flex flex-col overflow-visible overflow-y-auto border-r border-[#FBFAFF] bg-white transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-[7.5rem]' : 'w-[17rem] lg:w-[19rem]'
      )}
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

      {/* Header: Logo + Business Switcher */}
      <div className='relative top-0 space-y-4 p-6'>
        {collapsed ? (
          <div className='pl-1'>
            <LogoIcon className='h-[40px]' />
          </div>
        ) : (
          <Logo className='h-[40px]' textColor='black' />
        )}
        <BusinessSwitcher collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(c => !c)}
          className='absolute right-0 top-0 flex items-center gap-3 px-6 py-3 font-inter text-sm text-[#9AA4B2] transition-colors hover:text-[#4B5565]'
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={collapsed ? { justifyContent: 'center', padding: '12px' } : {}}
        >
          {collapsed ? (
            <PanelLeftOpen className='h-5 w-5 shrink-0' />
          ) : (
            <>
              <PanelLeftClose className='h-5 w-5 shrink-0' />
              <span className='sr-only max-md:hidden'>Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className='flex flex-1 flex-col gap-y-2.5 py-4'>
        <div className='text-sidebar-foreground p-4 px-8 text-[0.6rem] font-semibold uppercase opacity-50 md:text-xs'>
          Overview
        </div>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const IconSelected = item.iconSelected;
          const isActive =
            (item.exact && pathname === item.href) ||
            (!item.exact &&
              item.href !== '/business' &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={index + Date.now()}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={cn(
                'relative flex items-center gap-3 py-3 font-inter text-sm text-[#4B5565] transition-colors',
                'px-6',
                isActive
                  ? 'bg-[#FBFAFF] font-semibold text-[#5F2EEA]'
                  : 'hover:bg-[#fbfaffcb]'
              )}
            >
              {isActive ? (
                <IconSelected className='h-5 w-5 shrink-0' />
              ) : (
                <Icon className='h-5 w-5 shrink-0' />
              )}
              <span
                className={cn(
                  'overflow-hidden whitespace-nowrap transition-all duration-300',
                  collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                )}
              >
                {item.name}
              </span>

              {isActive && (
                <div className='absolute right-0 top-1/2 !h-[60%] w-1 -translate-y-1/2 rounded-l-xl bg-primary'></div>
              )}
            </Link>
          );
        })}

        {/* Support section */}
        <div className='text-sidebar-foreground mt-auto p-4 px-8 text-[0.6rem] font-semibold uppercase opacity-50 md:text-xs'>
          Support
        </div>
        <div className={cn(collapsed && '')}>
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
                    title={collapsed ? item.name : undefined}
                    className={cn(
                      'relative flex w-full items-center gap-3 py-3 font-inter text-sm text-[#4B5565] transition-colors',
                      'md:px-6',
                      isActive
                        ? 'bg-[#FBFAFF] font-semibold text-[#5F2EEA]'
                        : 'hover:bg-[#fbfaffcb]'
                    )}
                  >
                    <Icon className='h-5 w-5 shrink-0' />
                    <span
                      className={cn(
                        'overflow-hidden whitespace-nowrap transition-all duration-300',
                        collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                      )}
                    >
                      {item.name}
                    </span>
                  </button>
                ) : (
                  <Link
                    key={index + Date.now()}
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    className={cn(
                      'relative flex items-center gap-3 py-3 font-inter text-sm text-[#4B5565] transition-colors',
                      'md:px-6',
                      isActive
                        ? 'bg-[#FBFAFF] font-semibold text-[#5F2EEA]'
                        : 'hover:bg-[#fbfaffcb]'
                    )}
                  >
                    {isActive ? (
                      <IconSelected className='h-5 w-5 shrink-0' />
                    ) : (
                      <Icon className='h-5 w-5 shrink-0' />
                    )}
                    <span
                      className={cn(
                        'overflow-hidden whitespace-nowrap transition-all duration-300',
                        collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                      )}
                    >
                      {item.name}
                    </span>

                    {isActive && (
                      <div className='absolute right-0 top-1/2 !h-[60%] w-1 -translate-y-1/2 rounded-l-xl bg-primary'></div>
                    )}
                  </Link>
                )}
              </>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
