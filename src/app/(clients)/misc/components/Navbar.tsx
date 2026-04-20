'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Logo } from '@/assets/icons';
import { useIsMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import {
  ChatsIcon,
  ListingsIcon,
  NotificationsIcon,
  SavedBusinessesIcon,
} from '../icons';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  DropdownMenuItem,
  Button,
} from '@/components/ui';
import { LinkButton } from '@/components/ui';
import { CaretDown } from '@/assets/icons';
import { User, ArrowUpRight } from 'lucide-react';
import { useBusinessCategories, useBusinessStates } from '../api/metadata';
import {
  BusinessCategoryIcons,
  BusinessCategoriesIconsType as CategoryIconType,
} from '@/assets/icons/business/BusinessCategoriesIcon';
import { NotificationsDropdownContent } from './NotificationsDropdown';
import { useUserContext } from '@/contexts/UserContext';
import MenuBarIcon from '@/assets/icons/MenuBarIcon';

const LandingPageNavbar = () => {
  const { user, isAuthenticated, isLoading } = useUserContext();
  const userIsloggedIn = !isLoading && isAuthenticated && Boolean(user);

  const { data: categoriesData } = useBusinessCategories();
  const { data: statesData } = useBusinessStates();

  const categories = categoriesData?.data || [];
  const states = statesData?.data || [];

  const popularCities = ['Lagos', 'Abuja', 'Oyo', 'Rivers', 'Edo'];
  const popularStates = states.filter(state =>
    popularCities.includes(state.name)
  );
  const otherStates = states.filter(
    state => !popularCities.includes(state.name)
  );

  const pathname = usePathname();
  const { isMobile, isLoading: calculatingScreenWidth } = useIsMobile();
  const isBusiness =
    pathname == '/businesses' || pathname == '/businesses/get-started';

  const VISITORS_LINKS = [
    { name: 'Home', href: '/', hasBlackBg: true },
    { name: 'Listings', href: '/businesses/explore', hasBlackBg: true },
    { name: 'Cities', href: '/businesses/search', hasBlackBg: false },
    { name: 'Blog', href: '/blog', hasBlackBg: false },
    { name: 'FAQ', href: '/#faqs', hasBlackBg: false },
  ];

  const AUTHENTICATED_USER_LINKS = [
    {
      name: 'Listings',
      href: '/businesses/explore',
      hasBlackBg: true,
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
    // {
    //   name: 'Profile Settings',
    //   href: '/profile',
    //   hasBlackBg: false,
    //   icon: SettingsIcon,
    // },
  ];
  const BUSINESS_LANDING_NAVLINKS = [
    {
      name: 'Business Type',
      href: '/businesses#type',
      hasBlackBg: false,
      icon: ListingsIcon,
    },
    {
      name: 'Pricing',
      href: '/businesses#pricing',
      hasBlackBg: false,
      icon: SavedBusinessesIcon,
    },
  ];

  const OTHER_PAGES_WITH_BLACKBG = ['/businesses/get-started'];
  const OTHER_PAGES_WITH_TRANSPARENTBG = ['/', '/businesses/explore'];

  const pageHasBlackBg = useMemo(() => {
    if (userIsloggedIn) {
      return (
        AUTHENTICATED_USER_LINKS.some(
          link => link.href === pathname && link.hasBlackBg
        ) ||
        OTHER_PAGES_WITH_BLACKBG.includes(pathname) ||
        (!isMobile && pathname == '/')
      );
    }
    return (
      VISITORS_LINKS.some(link => link.href === pathname && link.hasBlackBg) ||
      OTHER_PAGES_WITH_BLACKBG.includes(pathname)
    );
  }, [pathname, userIsloggedIn, isMobile]);

  const pageHasTransparentBg = useMemo(() => {
    return OTHER_PAGES_WITH_TRANSPARENTBG.includes(pathname) && isMobile;
  }, [pathname, isMobile]);

  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const threshold = Math.min(768, vh);
      setIsScrolledPastHero(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const effectiveTransparentBg = pageHasTransparentBg && !isScrolledPastHero;

  const PAGES_WITHOUT_NAVBAR = [
    {
      route: '/signup',
      onlyOnMobile: false,
    },
    {
      route: '/login',
      onlyOnMobile: false,
    },
    {
      route: '/businesses/create-listing',
      onlyOnMobile: false,
    },
    {
      route: '/chats',
      onlyOnMobile: true,
    },
    {
      route: '/chats/[chat_id]',
      onlyOnMobile: true,
    },
  ];

  const isPageWithoutNavbar = PAGES_WITHOUT_NAVBAR.some(
    page => page.route === pathname
  );
  const isMobilePageWithoutNavbar = PAGES_WITHOUT_NAVBAR.some(
    page => page.route === pathname && page.onlyOnMobile
  );

  if (
    isMobile &&
    (isMobilePageWithoutNavbar || pathname.startsWith('/chats/'))
  ) {
    return null;
  }

  if (
    (isMobile && isMobilePageWithoutNavbar) ||
    (!isMobile && isPageWithoutNavbar)
  ) {
    return null;
  }

  return (
    <nav
      className={cn(
        'relative z-[20] flex h-14 w-full items-center justify-between px-4 transition-colors duration-300 md:px-16 md:backdrop-blur-lg lg:h-20 lg:px-24 xl:h-24',
        effectiveTransparentBg
          ? 'rounded-t-none bg-transparent'
          : isMobile
            ? 'bg-white'
            : pageHasBlackBg
              ? 'bg-[#0000008f] backdrop-blur-lg'
              : isBusiness || isMobile
                ? 'bg-white'
                : 'bg-white'
      )}
    >
      <div className='container mx-auto flex flex-row items-center justify-between'>
        <section className='flex items-center gap-16'>
          <Logo
            className='w-20 sm:w-28'
            textColor={
              effectiveTransparentBg
                ? 'white'
                : isMobile
                  ? 'black'
                  : pageHasBlackBg
                    ? 'white'
                    : isBusiness
                      ? 'black'
                      : 'black'
            }
          />
          {isBusiness && !isMobile && (
            <ul>
              {BUSINESS_LANDING_NAVLINKS.map(link => (
                <li key={link.name} className='mr-8 inline-block'>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-md font-medium',
                      pageHasBlackBg ? 'text-white' : 'text-black'
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {isBusiness ? (
          <section>
            {!userIsloggedIn && (
              <>
                {isMobile ? (
                  <LinkButton
                    size='dynamic_xl'
                    variant={'ghost'}
                    href='/signin'
                    className={cn(
                      'mr-2 md:hidden',
                      pageHasBlackBg && 'text-xs text-white'
                    )}
                  >
                    Sign in
                  </LinkButton>
                ) : (
                  <LinkButton
                    size='dynamic_xl'
                    variant={'ghost'}
                    href='/signin'
                    className={cn(
                      'mr-2 max-md:hidden',
                      pageHasBlackBg && 'text-white'
                    )}
                  >
                    Log in / Sign up
                  </LinkButton>
                )}
              </>
            )}
            <LinkButton
              size='dynamic_xl'
              href='/businesses/explore'
              className='max-md:!hidden'
              variant={'black'}
            >
              Market Place
              <svg
                width='21'
                height='21'
                viewBox='0 0 21 21'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M11.1933 0.0956677C10.4279 -0.0318892 9.64676 -0.0318892 8.88142 0.0956677L6.84769 0.434622H5.4598C4.89426 0.434622 4.34137 0.602023 3.87081 0.915729L2.04569 2.13247C1.36759 2.58455 0.91414 3.30405 0.798885 4.11084L0.0230325 9.5418C-0.101448 10.4132 0.285489 11.2786 1.01787 11.7668C1.18431 11.8778 1.36195 11.9648 1.54598 12.0278L2.05769 16.3773C2.35085 18.8692 4.4627 20.7471 6.97172 20.7471H13.6238C16.1328 20.7471 18.2447 18.8692 18.5378 16.3773L19.0823 11.7496C19.7981 11.2584 20.1747 10.403 20.0517 9.5418L19.2758 4.11084C19.1606 3.30405 18.7071 2.58455 18.029 2.13247L16.2039 0.915728C15.7333 0.602023 15.1804 0.434622 14.6149 0.434622H13.227L11.1933 0.0956677ZM4.73753 2.21581C4.95142 2.07321 5.20273 1.99712 5.4598 1.99712H6.02736L5.14391 9.0647L2.64451 10.4929C2.40669 10.6288 2.11249 10.6187 1.88458 10.4668C1.65287 10.3123 1.53044 10.0385 1.56983 9.76277L2.34568 4.33181C2.39807 3.96509 2.60418 3.63804 2.91241 3.43255L4.73753 2.21581ZM3.41973 11.8496L5.89527 10.435L6.89288 10.9338C8.87237 11.9235 11.2023 11.9235 13.1818 10.9338L14.1794 10.435L16.655 11.8496C16.9094 11.995 17.1843 12.0875 17.4645 12.1276L16.986 16.1948C16.7855 17.8997 15.3405 19.1846 13.6238 19.1846H12.9019V16.8409C12.9019 15.2588 11.6194 13.9763 10.0373 13.9763C8.45528 13.9763 7.17276 15.2588 7.17276 16.8409V19.1846H6.97172C5.25502 19.1846 3.81007 17.8997 3.60949 16.1948L3.11539 11.9949C3.21932 11.9544 3.32106 11.9059 3.41973 11.8496ZM17.4302 10.4929L14.9308 9.06469L14.0473 1.99712H14.6149C14.872 1.99712 15.1233 2.07321 15.3372 2.21581L17.1623 3.43255C17.4705 3.63804 17.6766 3.96509 17.729 4.33181L18.5049 9.76277C18.5442 10.0385 18.4218 10.3123 18.1901 10.4668C17.9622 10.6187 17.668 10.6288 17.4302 10.4929ZM10.9364 1.63691L12.4594 1.89074L13.3602 9.09763L12.483 9.53623C10.9434 10.306 9.13125 10.306 7.59165 9.53623L6.71446 9.09763L7.61532 1.89074L9.13829 1.63691C9.73356 1.5377 10.3411 1.5377 10.9364 1.63691ZM10.0373 15.5388C10.7565 15.5388 11.3394 16.1218 11.3394 16.8409V19.1846H8.73526V16.8409C8.73526 16.1218 9.31823 15.5388 10.0373 15.5388Z'
                  fill='white'
                />
              </svg>
            </LinkButton>
          </section>
        ) : (
          <>
            {calculatingScreenWidth ? null : (
              <>
                {!isMobile && (
                  <ul
                    className={cn(
                      'flex items-center gap-4',
                      userIsloggedIn ? 'ml-auto' : 'mx-auto'
                    )}
                  >
                    {userIsloggedIn
                      ? AUTHENTICATED_USER_LINKS.map(link => {
                          const isActive =
                            pathname === link.href ||
                            pathname.startsWith(link.href + '/');

                          // Notifications should be a dropdown
                          if (link.name === 'Notifications') {
                            return (
                              <li key={link.name}>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button
                                      className={cn(
                                        'flex size-[2.75rem] items-center justify-center rounded-full',
                                        isActive
                                          ? 'bg-[#ECE9FE]'
                                          : pageHasBlackBg
                                            ? 'bg-[#FFFFFF4D]'
                                            : 'bg-[#F8FAFC]',
                                        isActive
                                          ? 'text-primary-600'
                                          : pageHasBlackBg
                                            ? 'hover:text-primary-400 text-white'
                                            : 'hover:text-primary-600 text-black'
                                      )}
                                    >
                                      <link.icon className='' />
                                      <span className='sr-only'>
                                        {link.name}
                                      </span>
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    className='max-h-[500px] w-[400px] overflow-y-hidden p-0'
                                    align='start'
                                  >
                                    <NotificationsDropdownContent />
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </li>
                            );
                          }

                          return (
                            <li key={link.name} className=''>
                              <Link
                                href={link.href}
                                className={cn(
                                  'flex size-[2.75rem] items-center justify-center rounded-full',
                                  isActive
                                    ? 'bg-[#ECE9FE]'
                                    : pageHasBlackBg
                                      ? 'bg-[#FFFFFF4D]'
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
                      : VISITORS_LINKS.map(link => {
                          // Listings and Cities get dropdown menus
                          if (link.name === 'Listings') {
                            return (
                              <li key={link.name}>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button
                                      className={cn(
                                        'flex items-center gap-1 px-4',
                                        pageHasBlackBg
                                          ? 'text-white'
                                          : 'text-black'
                                      )}
                                    >
                                      {link.name}
                                      <CaretDown className='h-3 w-3' />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    className='max-h-[600px] w-[880px] overflow-y-auto p-6'
                                    align='start'
                                  >
                                    <div className='mb-3'>
                                      <p className='mb-1 text-xs text-gray-600'>
                                        Discover a world of businesses and
                                        services across lifestyle, wellness,
                                        fashion, food, tech, and more
                                      </p>
                                      <Link
                                        href='/businesses/explore'
                                        className='text-primary-600 flex items-center gap-1 text-sm hover:underline'
                                      >
                                        Explore all category →
                                      </Link>
                                    </div>

                                    <h3 className='mb-6 text-2xl font-bold'>
                                      Browse Category
                                    </h3>

                                    <div className='grid grid-cols-4 gap-4'>
                                      {categories.map(category => {
                                        const iconName = category.name
                                          ?.split(' ')[0]
                                          ?.toLowerCase() as CategoryIconType;

                                        return (
                                          <Link
                                            key={category.id}
                                            href={`/businesses/search?category=${encodeURIComponent(category.name)}`}
                                            className='group flex items-start gap-2.5 hover:!text-primary'
                                          >
                                            <BusinessCategoryIcons
                                              className='text-primary-600 group-hover:!fill-primary-600 group-hover:!stroke-primary-600 size-5 !shrink-0 group-hover:!text-primary'
                                              value={iconName}
                                            />
                                            <div className='group-hover:!fill-primary-600 group-hover:!stroke-primary-600 mb-0.5 group-hover:!text-primary'>
                                              <h4 className='flex items-center gap-2 text-[0.825rem] font-semibold capitalize group-hover:!text-primary'>
                                                {category.name}
                                              </h4>
                                              {category.subcategories &&
                                                category.subcategories.length >
                                                  0 && (
                                                  <p className='text-[0.675rem] text-gray-600 group-hover:!text-primary'>
                                                    {category.subcategories
                                                      .slice(0, 3)
                                                      .map(sub => sub.name)
                                                      .join(', ')}
                                                    {category.subcategories
                                                      .length > 3 && '...'}
                                                  </p>
                                                )}
                                            </div>
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </li>
                            );
                          }

                          if (link.name === 'Cities') {
                            return (
                              <li key={link.name}>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button
                                      className={cn(
                                        'flex items-center gap-1 px-4',
                                        pageHasBlackBg
                                          ? 'text-white'
                                          : 'text-black'
                                      )}
                                    >
                                      {link.name}
                                      <CaretDown className='h-3 w-3' />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    className='w-[880px] p-8'
                                    align='start'
                                  >
                                    <div className='mb-3'>
                                      <p className='mb-1 text-xs text-gray-600'>
                                        Discover a world of businesses and
                                        services across lifestyle, wellness,
                                        fashion, food, tech, and more
                                      </p>
                                      <Link
                                        href='/businesses/search'
                                        className='text-primary-600 flex items-center gap-1 text-sm hover:underline'
                                      >
                                        Explore all Cities →
                                      </Link>
                                    </div>

                                    <h3 className='mb-6 text-2xl font-bold'>
                                      Browse by City
                                    </h3>

                                    <div className='mb-6'>
                                      <h4 className='mb-3 flex items-center gap-2 text-sm font-semibold'>
                                        <span>🔥</span> Popular
                                      </h4>
                                      <div className='flex flex-wrap gap-3'>
                                        {popularStates.map(state => (
                                          <Link
                                            key={state.name}
                                            href={`/businesses/search?location=${encodeURIComponent(state.name)}`}
                                            className='rounded-full bg-black px-6 py-2 text-white transition-colors hover:bg-gray-800'
                                          >
                                            {state.name}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className='mb-4 text-base font-bold'>
                                        Others
                                      </h4>
                                      <div className='flex flex-wrap gap-3'>
                                        {otherStates.map(state => (
                                          <Link
                                            key={state.name}
                                            href={`/businesses/search?location=${encodeURIComponent(state.name)}`}
                                            className='rounded-full bg-gray-100 px-6 py-2 text-black transition-colors hover:bg-gray-200'
                                          >
                                            {state.name}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </li>
                            );
                          }

                          // Regular links (Home, Explore, Blog, FAQs)
                          return (
                            <li
                              key={link.name}
                              className={cn(
                                'px-4',
                                pageHasBlackBg ? 'text-white' : ''
                              )}
                            >
                              <Link href={link.href}>{link.name}</Link>
                            </li>
                          );
                        })}
                  </ul>
                )}

                {userIsloggedIn && (
                  <div
                    className={cn(
                      'mx-2 hidden h-6 w-0.5 md:block',
                      pageHasBlackBg ? 'bg-[#9AA4B2]' : 'bg-gray-300'
                    )}
                  />
                )}
                {userIsloggedIn ? (
                  <>
                    <MobileMenu
                      isMobile={isMobile}
                      pageHasBlackBg={pageHasBlackBg}
                      pageHasTransparentBg={effectiveTransparentBg}
                      VISITORS_LINKS={VISITORS_LINKS}
                      userIsLoggedIn={userIsloggedIn}
                    />
                  </>
                ) : (
                  <section className='flex items-center gap-3'>
                    <LinkButton
                      size='dynamic_lg'
                      variant={'ghost'}
                      href='/signin'
                      className={cn(
                        '',
                        isMobile
                          ? effectiveTransparentBg
                            ? 'text-white max-md:text-base'
                            : 'text-black max-md:text-base'
                          : pageHasBlackBg && 'text-white'
                      )}
                    >
                      <span className='md:hidden'>Sign In</span>
                      <span className='hidden md:block'>Log in / Sign up</span>
                    </LinkButton>
                    <div className='md:hidden'>
                      <MobileMenu
                        isMobile={isMobile}
                        pageHasBlackBg={pageHasBlackBg}
                        pageHasTransparentBg={effectiveTransparentBg}
                        VISITORS_LINKS={VISITORS_LINKS}
                        userIsLoggedIn={false}
                      />
                    </div>
                    <LinkButton
                      size='lg'
                      href='/businesses'
                      className='max-md:!hidden'
                    >
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

const MobileMenu = ({
  pageHasBlackBg,
  pageHasTransparentBg,
  isMobile,
  VISITORS_LINKS,
  userIsLoggedIn,
}: {
  pageHasBlackBg: boolean;
  pageHasTransparentBg: boolean;
  isMobile: boolean;
  userIsLoggedIn: boolean;
  VISITORS_LINKS: {
    name: string;
    href: string;
    hasBlackBg: boolean;
  }[];
}) => {
  const { user } = useUserContext();
  const { isLoading } = useIsMobile();

  if (isLoading) return null;
  return (
    <>
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <button
              className={cn(
                'flex !cursor-pointer items-center gap-1 rounded-full',
                isMobile ? '' : 'p-0',
                isMobile && pageHasTransparentBg
                  ? 'text-white'
                  : !isMobile && pageHasBlackBg
                    ? 'text-white hover:bg-white/20'
                    : 'text-black hover:bg-gray-200'
              )}
            >
              {isMobile ? (
                <>
                  {userIsLoggedIn ? (
                    <div className='flex items-center justify-center gap-4 text-white'>
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z'
                          fill={
                            isMobile && pageHasTransparentBg ? 'white' : 'black'
                          }
                        />
                        <path
                          fill-rule='evenodd'
                          clip-rule='evenodd'
                          d='M15.5309 11.8001C15.2823 11.3697 15.4298 10.8193 15.8603 10.5707L16.6397 10.1207C17.0702 9.8722 17.6206 10.0197 17.8691 10.4502C18.1495 10.9358 18.8505 10.9358 19.1309 10.4502C19.3794 10.0197 19.9298 9.8722 20.3603 10.1207L21.1397 10.5707C21.5702 10.8193 21.7177 11.3697 21.4691 11.8002C21.1888 12.2858 21.5392 12.8928 22.1 12.8928C22.5971 12.8928 23 13.2958 23 13.7928V14.6928C23 15.1899 22.5971 15.5928 22.1 15.5928C21.5392 15.5928 21.1887 16.1999 21.4691 16.6855C21.7177 17.116 21.5702 17.6664 21.1397 17.915L20.3603 18.365C19.9298 18.6135 19.3794 18.466 19.1309 18.0355C18.8505 17.5499 18.1495 17.5499 17.8691 18.0355C17.6206 18.466 17.0702 18.6135 16.6397 18.365L15.8603 17.915C15.4298 17.6664 15.2823 17.116 15.5309 16.6855C15.8113 16.1999 15.4608 15.5928 14.9 15.5928C14.4029 15.5928 14 15.1899 14 14.6928V13.7928C14 13.2958 14.4029 12.8928 14.9 12.8928C15.4608 12.8928 15.8112 12.2858 15.5309 11.8001ZM18.4998 15.9745C19.4557 15.9745 20.2306 15.1996 20.2306 14.2437C20.2306 13.2878 19.4557 12.5129 18.4998 12.5129C17.5439 12.5129 16.769 13.2878 16.769 14.2437C16.769 15.1996 17.5439 15.9745 18.4998 15.9745Z'
                          fill={
                            isMobile && pageHasTransparentBg ? 'white' : 'black'
                          }
                        />
                        <path
                          d='M13.25 13.7928C13.25 13.5337 13.3097 13.2885 13.4162 13.0703C12.9565 13.0241 12.4833 13 12 13C7.58172 13 4 15.0147 4 17.5C4 19.9853 7.58172 22 12 22C15.3724 22 18.2574 20.8262 19.4343 19.1654C19.057 19.0518 18.7194 18.8037 18.5 18.4421C18.036 19.2069 17.0433 19.464 16.2647 19.0145L15.4853 18.5645C14.7067 18.115 14.4331 17.1267 14.8634 16.3424C13.969 16.323 13.25 15.5919 13.25 14.6928V13.7928Z'
                          fill={
                            isMobile && pageHasTransparentBg ? 'white' : 'black'
                          }
                        />
                      </svg>
                      <MenuBarIcon
                        whiteText={pageHasTransparentBg && isMobile}
                      />
                    </div>
                  ) : (
                    <MenuBarIcon whiteText={pageHasTransparentBg && isMobile} />
                  )}
                </>
              ) : (
                <>
                  {!!user?.first_name && (
                    <p className='ml-1 w-max max-w-36 truncate text-left font-semibold capitalize'>
                      {`${user?.first_name} ${user?.last_name}`}
                    </p>
                  )}
                  <CaretDown className='max-md:size-5' />
                </>
              )}
            </button>
          </SheetTrigger>
          <SheetContent
            side='right'
            className='flex w-full flex-col border-none bg-[#FAFAFA] p-0 sm:max-w-full'
          >
            <div className='flex-1 overflow-y-auto px-8 pt-20'>
              {userIsLoggedIn && user ? (
                <div className='flex flex-col gap-8'>
                  <div className='mb-2 flex items-center gap-3 text-lg font-semibold'>
                    <User className='size-6 fill-current text-gray-500' />
                    <span>
                      {user.first_name} {user.last_name}
                    </span>
                  </div>
                  {VISITORS_LINKS.map((link, key) => (
                    <SheetClose key={key} asChild>
                      <Link
                        href={link.href}
                        className='block text-[1.1rem] font-normal text-gray-600 transition-colors hover:text-black'
                      >
                        {link.name}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className='my-1 h-px w-full bg-gray-200/60' />
                  <SheetClose asChild>
                    <Link
                      href='/profile'
                      className='block text-[1.1rem] font-normal text-gray-600 transition-colors hover:text-black'
                    >
                      Profile Settings
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <button
                      className='block text-left text-[1.1rem] font-normal text-gray-600 transition-colors hover:text-black'
                      onClick={() => signOut({ callbackUrl: '/' })}
                    >
                      Logout
                    </button>
                  </SheetClose>
                </div>
              ) : (
                <div className='flex flex-col gap-8'>
                  {VISITORS_LINKS.map((link, key) => (
                    <SheetClose key={key} asChild>
                      <Link
                        href={link.href}
                        className='block text-[1.1rem] font-normal text-gray-600 transition-colors hover:text-black'
                      >
                        {link.name}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className='my-1 h-[1px] w-full bg-gray-200/80' />
                  <SheetClose asChild>
                    <Link
                      href='/signin'
                      className='flex items-center gap-3 text-[1.1rem] font-normal text-gray-600 transition-colors hover:text-black'
                    >
                      <User className='size-[1.125rem] fill-current text-gray-600' />{' '}
                      Sign In
                    </Link>
                  </SheetClose>
                </div>
              )}
              <div className='mt-12'>
                {userIsLoggedIn && user?.is_brand_owner ? (
                  <SheetClose asChild>
                    <LinkButton
                      href='/business'
                      className='flex w-full items-center justify-center gap-2 rounded-xl bg-[#551FB9] py-[1.6rem] text-[1.05rem] font-medium text-white hover:bg-[#551FB9]/90'
                    >
                      Business Dashboard <ArrowUpRight className='size-5' />
                    </LinkButton>
                  </SheetClose>
                ) : (
                  <SheetClose asChild>
                    <LinkButton
                      href='/businesses'
                      className='flex w-full items-center justify-center gap-2 rounded-xl bg-[#551FB9] py-[1.6rem] text-[1.05rem] font-medium text-white hover:bg-[#551FB9]/90'
                    >
                      List business <ArrowUpRight className='size-5' />
                    </LinkButton>
                  </SheetClose>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'flex !cursor-pointer items-center gap-1 rounded-full',
                pageHasBlackBg
                  ? 'text-white hover:bg-white/20'
                  : 'text-black hover:bg-gray-200'
              )}
            >
              {!!user?.first_name && (
                <p className='ml-1 w-max max-w-36 truncate text-left font-semibold capitalize'>
                  {`${user?.first_name} ${user?.last_name}`}
                </p>
              )}
              <CaretDown className='max-md:size-5' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='flex w-full flex-col border-none bg-[#FAFAFA] p-0 sm:max-w-72'
          >
            <div className='flex w-full items-center justify-center bg-[#F8FAFC] px-8 py-5'>
              {user?.is_brand_owner ? (
                <LinkButton
                  href='/business'
                  className='w-full bg-[#551FB9]'
                  size={'dynamic_lg'}
                >
                  Business Dashboard
                </LinkButton>
              ) : (
                <LinkButton
                  href='/businesses'
                  className='w-full bg-[#551FB9]'
                  size={'dynamic_lg'}
                >
                  List your business
                </LinkButton>
              )}
            </div>

            {VISITORS_LINKS.map((link, key) => (
              <DropdownMenuItem key={key} className='!p-0'>
                <Link
                  key={key}
                  href={link.href}
                  className='block h-full w-full px-4 py-4 text-sm hover:bg-gray-100'
                >
                  {link.name}
                </Link>
              </DropdownMenuItem>
            ))}

            {userIsLoggedIn && user && (
              <DropdownMenuItem key={'profile'} className='!p-0'>
                <Link
                  href={'/profile'}
                  className='block h-full w-full px-4 py-4 text-sm hover:bg-gray-100'
                >
                  Profile Settings
                </Link>
              </DropdownMenuItem>
            )}

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
    </>
  );
};
