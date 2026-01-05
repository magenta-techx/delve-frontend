'use client';

import { Menu } from 'lucide-react';
import {
  Button,
  LinkButton,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import { useState } from 'react';
import { BusinessSwitcher } from '../BusinessSwitcher';
import { navItems, supportItems } from './Sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface TopNavProps {
  onNotificationsClick?: () => void;
}

export function NavbarTop({}: TopNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className='border-b border-border bg-background'>
      <div className='flex h-14 items-center justify-between px-6'>
        <div className='flex items-center gap-4'>
          <BusinessSwitcher />
        </div>

        {/* Right side - Menu button */}
        <div className='flex items-center gap-4'>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Menu className='size-8' />
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-80'>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <nav className='mt-6 flex flex-col gap-2'>
                <div className='mb-2 text-xs font-semibold uppercase opacity-50'>
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
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'relative flex items-center gap-3 rounded-lg px-4 py-3 font-inter text-sm transition-colors',
                        isActive
                          ? 'bg-[#FBFAFF] font-semibold text-[#5F2EEA]'
                          : 'text-[#4B5565] hover:bg-[#fbfaffcb]'
                      )}
                    >
                      {isActive ? (
                        <IconSelected className='h-5 w-5' />
                      ) : (
                        <Icon className='h-5 w-5' />
                      )}
                      {item.name}

                      {isActive && (
                        <div className='absolute right-0 top-1/2 h-[60%] w-1 -translate-y-1/2 rounded-l-xl bg-primary'></div>
                      )}
                    </Link>
                  );
                })}

                {/* Support section */}
                <div className='mb-2 mt-6 text-xs font-semibold uppercase opacity-50'>
                  Support
                </div>
                {supportItems.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-[#FBFAFF] text-[#5F2EEA]'
                          : 'text-[#4B5565] hover:bg-[#fbfaffcb]'
                      )}
                    >
                      <Icon className='h-5 w-5' />
                      {item.name}
                    </Link>
                  );
                })}

                <LinkButton
                  href='/businesses/explore'
                  className='mt-8'
                  size={'xl'}
                >
                  Market place
                  <svg
                    width='19'
                    height='20'
                    viewBox='0 0 19 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M14.7272 10.9339C13.897 10.4595 12.8846 10.4314 12.0293 10.859L11.6181 11.0646C10.1313 11.808 8.38118 11.808 6.89432 11.0646L6.48316 10.859C5.62788 10.4314 4.61546 10.4595 3.78522 10.9339L3.46181 11.1187C2.88191 11.4501 2.23855 11.6171 1.59547 11.6219L2.05229 15.5048C2.29916 17.6032 4.07756 19.1847 6.19042 19.1847L6.39144 19.1847V16.0597C6.39144 14.4776 7.67396 13.1951 9.25602 13.1951C10.8381 13.1951 12.1206 14.4776 12.1206 16.0597V19.1847L12.8425 19.1847C14.9554 19.1847 16.7338 17.6032 16.9806 15.5048L17.4412 11.5898C16.6292 11.6959 15.7885 11.5404 15.0507 11.1187L14.7272 10.9339Z'
                      fill='white'
                    />
                    <path
                      d='M10.5581 19.1847V16.0597C10.5581 15.3406 9.97514 14.7576 9.25602 14.7576C8.5369 14.7576 7.95394 15.3406 7.95394 16.0597V19.1847H10.5581Z'
                      fill='white'
                    />
                    <path
                      d='M11.5428 0.294902L10.2836 0.085038C9.60327 -0.028346 8.90889 -0.028346 8.22858 0.085038L6.9536 0.297534L6.90724 0.76014L5.86453 8.70451L5.86402 8.70851L5.81106 9.12878L6.46099 9.45375C8.22054 10.3335 10.2916 10.3335 12.0512 9.45375L12.7011 9.12878L12.6481 8.70851L12.6476 8.7045L11.6065 0.771996L11.5428 0.294902Z'
                      fill='white'
                    />
                    <path
                      d='M14.2931 9.26533L16.2613 10.39C16.7561 10.6727 17.3681 10.6516 17.8422 10.3355C18.3242 10.0142 18.5789 9.44456 18.497 8.87104L17.7211 3.44007C17.6373 2.85332 17.3075 2.33004 16.8144 2.00126L14.9893 0.784518C14.647 0.556368 14.2449 0.434622 13.8336 0.434622H13.1378L13.1557 0.568662L14.1979 8.50918L14.2931 9.26533Z'
                      fill='white'
                    />
                    <path
                      d='M4.219 9.26533L4.31429 8.50916L4.3148 8.50517L5.35491 0.580521L5.36954 0.434622H4.67853C4.26722 0.434622 3.86512 0.556368 3.5229 0.784518L1.69778 2.00126C1.20461 2.33004 0.874834 2.85332 0.791012 3.44007L0.0151599 8.87104C-0.0667723 9.44456 0.187908 10.0142 0.669954 10.3355C1.14408 10.6516 1.7561 10.6727 2.25085 10.39L4.219 9.26533Z'
                      fill='white'
                    />
                  </svg>
                </LinkButton>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
