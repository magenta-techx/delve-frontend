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
import { Notifications } from '../notifications';

interface TopNavProps {
  onNotificationsClick?: () => void;
}

export function NavbarTop({}: TopNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className='border-b border-border bg-background'>
      <div className='flex h-14 items-center justify-between px-6'>
        <div className='flex items-center gap-4'>
          <BusinessSwitcher />
        </div>

        {/* Right side - Menu button */}
        <div className='flex items-center gap-2.5'>
          <Sheet
            open={isNotificationsOpen}
            onOpenChange={setIsNotificationsOpen}
          >
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon'>
                <svg
                  width='28'
                  height='28'
                  className='!size-6'
                  viewBox='0 0 28 28'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M15.617 3.41234C15.6441 3.47773 15.6672 3.54456 15.6861 3.61246C15.9471 3.6558 16.2041 3.71118 16.4565 3.778C15.6575 4.61552 15.1669 5.74982 15.1669 6.9987C15.1669 9.57603 17.2562 11.6654 19.8336 11.6654C20.8786 11.6654 21.8435 11.3218 22.6213 10.7416C22.6734 11.12 22.7004 11.5064 22.7004 11.8991V13.4154C22.7004 15.5342 23.222 18.2455 23.7036 20.2975C24.061 21.82 22.9253 23.332 21.3614 23.332H16.3336C16.3336 23.6384 16.2732 23.9419 16.156 24.225C16.0387 24.5081 15.8668 24.7653 15.6502 24.9819C15.4335 25.1986 15.1763 25.3705 14.8932 25.4877C14.6101 25.605 14.3067 25.6654 14.0002 25.6654C13.6938 25.6654 13.3904 25.605 13.1073 25.4877C12.8242 25.3705 12.567 25.1986 12.3503 24.9819C12.1337 24.7653 11.9618 24.5081 11.8445 24.225C11.7273 23.9419 11.6669 23.6384 11.6669 23.332H6.96143C5.30676 23.332 4.15284 21.6478 4.63976 20.0664C5.25927 18.0543 5.90038 15.4747 5.90038 13.4154V11.8991C5.90039 7.95515 8.61843 4.64576 12.2835 3.74242C12.3058 3.62964 12.3392 3.51906 12.3835 3.41234C12.4714 3.20002 12.6003 3.0071 12.7628 2.84459C12.9253 2.68209 13.1182 2.55319 13.3305 2.46524C13.5429 2.3773 13.7704 2.33203 14.0002 2.33203C14.2301 2.33203 14.4576 2.3773 14.6699 2.46524C14.8823 2.55319 15.0752 2.68209 15.2377 2.84459C15.4002 3.0071 15.5291 3.20002 15.617 3.41234Z'
                    fill='#131316'
                  />
                  <path
                    d='M19.8336 10.4987C21.7666 10.4987 23.3336 8.93169 23.3336 6.9987C23.3336 5.0657 21.7666 3.4987 19.8336 3.4987C17.9006 3.4987 16.3336 5.0657 16.3336 6.9987C16.3336 8.93169 17.9006 10.4987 19.8336 10.4987Z'
                    fill='#131316'
                  />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-full p-0 sm:max-w-md'>
              <SheetHeader className='sr-only'>
                <SheetTitle>Notifications</SheetTitle>
              </SheetHeader>
              <div className='h-full overflow-y-auto'>
                <Notifications />
              </div>
            </SheetContent>
          </Sheet>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Menu className='!size-6' />
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-80'>
              <SheetHeader>
                <SheetTitle className='sr-only'>Menu</SheetTitle>
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
                        'relative flex items-center gap-3 rounded-lg py-4 font-inter text-sm transition-colors',
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
