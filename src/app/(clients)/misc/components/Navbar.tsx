'use client';

import React, { useMemo, useState } from 'react';
import { Logo } from '@/assets/icons';
import { useIsMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
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
import { getInitials } from '@/utils/strings';
import { useBusinessCategories, useBusinessStates } from '../api/metadata';
import {
  BusinessCategoryIcons,
  BusinessCategoriesIconsType as CategoryIconType,
} from '@/assets/icons/business/BusinessCategoriesIcon';

const LandingPageNavbar = () => {
  const { data: session, status } = useSession();
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const { data: categoriesData } = useBusinessCategories();
  const { data: statesData } = useBusinessStates();

  const categories = categoriesData?.data || [];
  const states = statesData?.data || [];

  // Popular cities from the screenshot
  const popularCities = ['Lagos', 'Abuja', 'Oyo', 'Rivers', 'Edo'];
  const popularStates = states.filter(state =>
    popularCities.includes(state.name)
  );
  const otherStates = states.filter(
    state => !popularCities.includes(state.name)
  );

  const hasValidAccessToken = Boolean(
    session?.user?.accessToken && String(session.user.accessToken).length > 0
  );
  const userIsloggedIn =
    status === 'authenticated' && Boolean(session?.user) && hasValidAccessToken;

  const pathname = usePathname();
  const { isMobile, isLoading: calculatingScreenWidth } = useIsMobile();
  const isBusiness = pathname == '/businesses';

  const VISITORS_LINKS = [
    { name: 'Home', href: '/', hasBlackBg: true },
    { name: 'Listings', href: '/businesses/search', hasBlackBg: true },
    { name: 'FAQs', href: '/#faqs', hasBlackBg: false },
    { name: 'Cities', href: '/businesses/search', hasBlackBg: true },
    { name: 'Blog', href: '/blog', hasBlackBg: false },
  ];

  const AUTHENTICATED_USER_LINKS = [
    {
      name: 'Listings',
      href: '/businesses/search',
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
        'relative z-[20] flex h-16 w-full items-center justify-between px-4 md:px-16 md:backdrop-blur-lg lg:h-20 lg:px-24',
        isBusiness || isMobile
          ? 'bg-white'
          : pageHasBlackBg
            ? 'bg-[#0D121C2E]'
            : 'bg-white'
      )}
    >
      <div className='container mx-auto flex flex-row items-center justify-between'>
        <section>
          <Logo
            className='w-24 max-sm:w-20'
            textColor={
              isBusiness || isMobile
                ? 'black'
                : pageHasBlackBg
                  ? 'white'
                  : 'black'
            }
          />
        </section>

        {!isBusiness && (
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
                                <DropdownMenu
                                  open={hoveredMenu === 'listings'}
                                  onOpenChange={open =>
                                    setHoveredMenu(open ? 'listings' : null)
                                  }
                                >
                                  <DropdownMenuTrigger
                                    asChild
                                    onMouseEnter={() =>
                                      setHoveredMenu('listings')
                                    }
                                    onMouseLeave={() => setHoveredMenu(null)}
                                  >
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
                                    className='max-h-[500px] w-[880px] overflow-y-auto p-8'
                                    align='start'
                                    onMouseEnter={() =>
                                      setHoveredMenu('categories')
                                    }
                                    onMouseLeave={() => setHoveredMenu(null)}
                                  >
                                    <div className='mb-4'>
                                      <p className='mb-2 text-sm text-gray-600'>
                                        Discover a world of businesses and
                                        services across lifestyle, wellness,
                                        fashion, food, tech, and more
                                      </p>
                                      <Link
                                        href='/businesses/search'
                                        className='text-primary-600 flex items-center gap-1 text-sm hover:underline'
                                      >
                                        Explore all category →
                                      </Link>
                                    </div>

                                    <h3 className='mb-6 text-2xl font-bold'>
                                      Browse Category
                                    </h3>

                                    <div className='grid grid-cols-4 gap-6'>
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
                                              className='!shrink-0 text-primary-600 group-hover:!fill-primary-600 group-hover:!stroke-primary-600 size-5 group-hover:!text-primary'
                                              value={iconName}
                                            />
                                            <div className='group-hover:!fill-primary-600 group-hover:!stroke-primary-600 mb-2 group-hover:!text-primary'>
                                              <h4 className='mb-1 flex items-center gap-2 text-sm font-semibold group-hover:!text-primary capitalize '>
                                                {category.name}
                                              </h4>
                                              {category.subcategories &&
                                                category.subcategories.length >
                                                  0 && (
                                                  <p className='text-[0.7rem] text-gray-600 group-hover:!text-primary'>
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
                                <DropdownMenu
                                  open={hoveredMenu === 'cities'}
                                  onOpenChange={open =>
                                    setHoveredMenu(open ? 'cities' : null)
                                  }
                                >
                                  <DropdownMenuTrigger
                                    asChild
                                    onMouseEnter={() =>
                                      setHoveredMenu('cities')
                                    }
                                    onMouseLeave={() => setHoveredMenu(null)}
                                  >
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
                                    onMouseEnter={() =>
                                      setHoveredMenu('cities')
                                    }
                                    onMouseLeave={() => setHoveredMenu(null)}
                                  >
                                    <div className='mb-4'>
                                      <p className='mb-2 text-sm text-gray-600'>
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
                                            href={`/businesses/search?state=${encodeURIComponent(state.name)}`}
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
                                            href={`/businesses/search?state=${encodeURIComponent(state.name)}`}
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
                      'hidden h-6 w-0.5 md:block',
                      pageHasBlackBg ? 'bg-[#9AA4B2]' : 'bg-gray-300'
                    )}
                  />
                )}
                {userIsloggedIn ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          'flex !cursor-pointer items-center gap-1 rounded-full',
                          isMobile ? '' : 'px-2 py-1',
                          !isMobile && pageHasBlackBg
                            ? 'text-white hover:bg-white/20'
                            : 'text-black hover:bg-gray-200'
                        )}
                      >
                        {isMobile ? (
                          <span className='flex size-8 items-center justify-center rounded-full bg-purple-800 text-base font-semibold text-white'>
                            {getInitials(session?.user.name || 'US')}
                          </span>
                        ) : (
                          <>
                            {session?.user.name && (
                              <p className='ml-1 w-max max-w-36 truncate text-left font-semibold capitalize'>
                                {session?.user.name}
                              </p>
                            )}
                          </>
                        )}
                        {/* <BaseIcons value='user-logged-in-white' /> */}
                        <CaretDown className='max-md:size-5' />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-72'>
                      <div className='flex w-full items-center justify-center bg-[#F8FAFC] px-8 py-5'>
                        {session.user.is_brand_owner ? (
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
                ) : (
                  <section>
                    <LinkButton
                      size='lg'
                      variant={isMobile ? 'default' : 'ghost'}
                      href='/signin'
                      className={cn('mr-2', pageHasBlackBg && 'text-white')}
                    >
                      Log in / Sign up
                    </LinkButton>
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
