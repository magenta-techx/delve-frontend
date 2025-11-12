'use client';

import { Logo } from '@/assets/icons/logo';
import { useIsMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import {
  ChatsIcon,
  ListingsIcon,
  NotificationsIcon,
  SavedBusinessesIcon,
} from '../icons';
import Link from 'next/link';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { LinkButton } from '@/components/ui';
import { CaretDown } from '@/assets/icons';


const LandingPageNavbar = () => {
  const { data: session, status } = useSession();
  const isLoadingSession = status === 'loading';
  const userIsloggedIn = status === 'authenticated' && Boolean(session?.user);

  const pathname = usePathname();
  const isMobile = useIsMobile();
  const isBusiness = pathname == "/businesses"

  const VISITORS_LINKS = [
    { name: 'Home', href: '/', hasBlackBg: true },
    { name: 'Listings', href: '/businesses/explore', hasBlackBg: true },
    { name: 'Cities', href: '/businesses/explore', hasBlackBg: true },
    { name: 'Explore', href: '/businesses/explore', hasBlackBg: true },
    { name: 'Blog', href: '/blog', hasBlackBg: false },
    { name: 'FAQs', href: '/faqs', hasBlackBg: false },
  ];

  const AUTHENTICATED_USER_LINKS = [
    {
      name: 'Listings',
      href: '/businesses/explore',
      hasBlackBg: false,
      icon: ListingsIcon,
    },
    {
      name: 'Saved Businesses',
      href: '/businesses/saved',
      hasBlackBg: false,
      icon: SavedBusinessesIcon,
    },
    {
      name: 'Chats',
      href: '/chats',
      hasBlackBg: false,
      icon: ChatsIcon,
    },
    {
      name: 'Notifications',
      href: '/notifications',
      hasBlackBg: false,
      icon: NotificationsIcon,
    },
  ];

  const pageHasBlackBg = useMemo(() => {
    if (userIsloggedIn) {
      return AUTHENTICATED_USER_LINKS.some(
        link => link.href === pathname && link.hasBlackBg
      );
    }
    return VISITORS_LINKS.some(
      link => link.href === pathname && link.hasBlackBg
    );
  }, [pathname, userIsloggedIn]);

  const PAGES_WITHOUT_NAVBAR = [
    '/signup',
    '/login',
    '/businesses/create-listing',
  ];

  if (PAGES_WITHOUT_NAVBAR.includes(pathname)) {
    return null;
  }

  return (
    <nav
      className={cn(
        'relative z-[20] flex h-20 lg:h-24 w-full items-center justify-between p-4 md:backdrop-blur-lg md:px-16 lg:px-24',
        (isBusiness || isMobile) ? 'bg-white' : pageHasBlackBg ? 'bg-[#0D121C2E]' : 'bg-white'
      )}
    >
      <div className='container mx-auto flex flex-row items-center justify-between'>
        <section>
          <Logo
            textColor={
              (isBusiness || isMobile) ? 'black' : pageHasBlackBg ? 'white' : 'black'
            }
          />
        </section>

        {!isBusiness && (
          <>
            {isMobile ? (
              <></>
            ) : (
              <>
                <section className={cn('flex items-center gap-5')}>
                  <ul className='flex items-center gap-4'>
                    {userIsloggedIn
                      ? AUTHENTICATED_USER_LINKS.map(link => {
                          const isActive =
                            pathname === link.href ||
                            pathname.startsWith(link.href + '/');

                          return (
                            <li key={link.name} className=''>
                              <Link
                                href={link.href}
                                className={cn(
                                  'flex size-[2.75rem] items-center justify-center rounded-full',
                                  isActive
                                    ? 'bg-[#ECE9FE]'
                                    : pageHasBlackBg
                                      ? 'bg-[#FFFFFF4D] '
                                      : 'bg-[#F8FAFC]',
                                  isActive
                                    ? 'text-primary-600'
                                    : pageHasBlackBg
                                    ? 'hover:text-primary-400 text-white'
                                    : 'hover:text-primary-600 text-black'
                                )}
                              >
                                <link.icon className='' />
                                <span className='sr-only'>{link.name}</span>
                              </Link>
                            </li>
                          );
                        })
                      : VISITORS_LINKS.map(link => (
                          <li
                            key={link.name}
                            className={cn(
                              'px-4',
                              pageHasBlackBg ?  'text-white' : ''
                            )}
                          >
                            <Link href={link.href}>{link.name}</Link>
                          </li>
                        ))}
                  </ul>

                  {userIsloggedIn && (
                    <div
                      className={cn(
                        'h-6 w-0.5',
                        pageHasBlackBg ? 'bg-[#9AA4B2]' : 'bg-gray-300'
                      )}
                    />
                  )}
                  {userIsloggedIn && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={cn(
                            'flex !cursor-pointer items-center gap-1 rounded-full px-2 py-1',
                            pageHasBlackBg
                            ? 'text-white hover:bg-white/20'
                            : 'text-black hover:bg-gray-200'
                          )}
                        >
                          {/* <BaseIcons value='user-logged-in-white' /> */}
                          {session?.user.name && (
                            <p className='ml-1 w-max max-w-36 truncate text-left font-semibold capitalize'>
                              {session?.user.name}
                            </p>
                          )}
                          <CaretDown />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-72'>
                        <div className='flex w-full items-center justify-center bg-[#F8FAFC] px-8 py-5'>
                          {session.user.is_brand_owner ? (
                            <LinkButton
                              href='/business/dashboard'
                              className='w-full'
                              size={'lg'}
                            >
                              Business Dashboard
                            </LinkButton>
                          ) : (
                            <LinkButton
                              href='/businesses/create-listing'
                              className='w-full'
                              size={'lg'}
                            >
                              List Business
                            </LinkButton>
                          )}
                        </div>

                        {VISITORS_LINKS.map((link, key) => (
                          <DropdownMenuItem key={key} className="!p-0">
                            <Link
                              key={key}
                              href={link.href}
                              className='block px-4 py-4 text-sm hover:bg-gray-100 w-full h-full'
                            >
                              {link.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}

                        <div className='mt-2 p-6'>
                          <Button
                            variant='light'
                            size='lg'
                            className='w-full'
                            onClick={() => signOut({ callbackUrl: '/' })}
                          >
                            Logout
                          </Button>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </section>

                {!userIsloggedIn && (
                  <section>
                    <LinkButton
                      size='md'
                      variant='ghost'
                      href='/signup'
                      className={cn('mr-2', pageHasBlackBg && 'text-white')}
                    >
                      Log in / Sign up
                    </LinkButton>
                    <LinkButton size='md' href='/signup'>
                      List your business
                    </LinkButton>
                  </section>
                )}
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );

};

export default LandingPageNavbar;
