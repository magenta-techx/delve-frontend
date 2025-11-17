'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navItems } from './Sidebar';

export function NavbarBottom() {
  const pathname = usePathname();

  // Show different number of items based on screen size
  // Mobile: 3 items, Tablet+: 5 items
  const mobileItems = navItems.slice(0, 4);
  const tabletItems = navItems.slice(0, 5);

  return (
    <>
      {/* Mobile: Show 3 items */}
      <nav className="h-14 fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-around px-4 py-2">
          {mobileItems.map((item) => {
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
                  'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-0',
                  isActive
                    ? 'text-[#5F2EEA]'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {isActive ? (
                  <IconSelected className="size-5" />
                ) : (
                  <Icon className="size-5" />
                )}
                <span className="text-[0.65rem] font-medium truncate max-w-full sr-only">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Tablet: Show 5 items */}
      <nav className="h-16 fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 hidden md:flex lg:hidden">
        <div className="flex items-center justify-around w-full px-4 py-2">
          {tabletItems.map((item) => {
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
                  'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-0 flex-1',
                  isActive
                    ? 'text-[#5F2EEA]'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {isActive ? (
                  <IconSelected className="size-5" />
                ) : (
                  <Icon className="size-5" />
                )}
                <span className="text-xs font-medium truncate max-w-full text-center sr-only">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}