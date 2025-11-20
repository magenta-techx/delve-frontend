'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { BaseIcons } from '@/assets/icons/base/Icons';
import { useSavedBusinessesContext } from '@/contexts/SavedBusinessesContext';
import { useCurrentUser } from '@/app/(clients)/misc/api/user';
import { useSession } from 'next-auth/react';
import { useChatSocket } from '@/hooks/chat/useChatSocket';
import type { BusinessDetail } from '@/types/api';
import { useBusinessDetails } from '@/app/(business)/misc/api';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { DelveIcon, VerifiedIcon } from '../../misc/icons';

interface BusinessDetailsClientProps {
  business: BusinessDetail;
}

const BusinessDetailsClient = ({ business }: BusinessDetailsClientProps) => {
  const router = useRouter();
  const { isSaved, toggleSave } = useSavedBusinessesContext();
  const [_selectedImage, setSelectedImage] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const params = useSearchParams();
  const ref = params.get('ref');
  const { data: businessDetails } = useBusinessDetails(
    business.id,
    ref as string | undefined,
    ''
  );

  const { data: currentUserResp } = useCurrentUser();
  const { data: session } = useSession();
  const token = session?.user?.accessToken ?? '';

  const { send } = useChatSocket({
    businessId: String(business.id ?? ''),
    token: token ?? '',
    onMessage: (data: unknown) => {
      console.log('chat socket onMessage', data);
    },
    onImages: (data: unknown) => {
      console.log('chat socket onImages', data);
    },
  });

  const isOwner = useMemo(() => {
    const currentUserId = currentUserResp?.user?.id;
    const ownerId = business?.owner?.id;
    return Boolean(ownerId && currentUserId && ownerId === currentUserId);
  }, [currentUserResp?.user?.id, business?.owner?.id]);

  const isBusinessSaved = isSaved(business.id);

  const galleryImages = [
    business.thumbnail,
    business.logo,
    ...(business.images || []).map(img =>
      typeof img === 'string' ? img : img.image || img
    ),
  ].filter(Boolean);

  const handleBookmarkClick = async () => {
    await toggleSave(business.id);
  };

  const openingHours = [
    { day: 'Monday', hours: '9:00 AM - 6:00 PM', open: true },
    { day: 'Tuesday', hours: '9:00 AM - 6:00 PM', open: true },
    { day: 'Wednesday', hours: '9:00 AM - 6:00 PM', open: true },
    { day: 'Thursday', hours: '9:00 AM - 6:00 PM', open: true },
    { day: 'Friday', hours: '9:00 AM - 6:00 PM', open: true },
    { day: 'Saturday', hours: '9:00 AM - 6:00 PM', open: true },
    { day: 'Sunday', hours: 'Closed', open: false },
  ];

  const navLink = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'More', href: '#more' },
  ];

  console.log(businessDetails);

  const handleStartChat = async () => {
    // If user not logged in, show auth modal
    if (!currentUserResp?.user) {
      setShowAuthModal(true);
      return;
    }

    try {
      // Attempt to initiate/start a chat over websocket.
      // The backend expects JSON messages; send a simple text "init" message
      // which will create or return the chat associated with this business.
      const payload = {
        message_type: 'text',
        sender_id: currentUserResp?.user?.id,
        message: 'Hi, I would like to chat about your services.',
      };

      let result = false;
      try {
        if (typeof send === 'function') {
          // send expects either raw string or object (hook stringifies), so try object first
          result = send(payload as unknown);
        }
      } catch (err) {
        console.error('Failed to send chat init over socket', err);
      }

      console.log('startChat socket send result', result);
      // server responses (chat created / messages) will be logged via onMessage/onImages
    } catch (err) {
      console.error('Failed to start/get chat for business', err);
    }
  };
  return (
    <main className='relative mx-auto max-w-[1540px] py-8 pt-24 lg:pt-28'>
      {/* Back Button */}

      {/* Hero Section with Image and Business Info */}
      <div
        className={cn(`relative mb-8 overflow-hidden`)}
        style={{
          backgroundImage: `url(${business.thumbnail!})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        {/* Hero Image */}
        <div className='relative min-h-[50vh] w-full bg-[#00000075] px-5 pb-28 pt-14 md:px-16 xl:px-32 text-white'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Image src={business?.logo || '/default-logo.png'} alt={`${business.name} logo`} width={50} height={70} className='rounded-full' />
              <p>{business.name}</p>
            </div>
            <div className='flex gap-14'>
              {navLink.map((links, index) => (
                <div key={index}>
                  <Link href={links.href}>{links.name}</Link>
                </div>
              ))}
            </div>
            <div className=''>
              <Button className='bg-[#F5F3FF] border border-[#D9D6FE] text-[#551FB9] rounded-2xl py-3'><VerifiedIcon/> Verified By Delve <DelveIcon/></Button>
            </div>
          </div>
          <div className='mt-96'>
          <h2 className='text-5xl font-bold font-karma max-w-[681px]'>Turn your dreams into unforgettable experiences</h2>
              {isOwner ? (
                <Button className='bg-[#0000006B] border border-[#FCFCFD] !py-5 px-20 mt-10'>
                  Send us a message
                </Button>
              ) : (
                <Button onClick={handleStartChat} className='bg-[#0000006B] border border-[#FCFCFD] !py-5 px-20 mt-10'>
                  Chat with business
                </Button>
              )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Left Column - Main Content */}
        <div className='lg:col-span-2'>
          {/* Get to know us */}
          <section className='mb-8 rounded-2xl bg-white p-8 shadow-sm'>
            <h2 className='mb-4 text-2xl font-bold text-[#0F172A]'>
              Get to know us
            </h2>
            <p className='text-[#475467]'>
              {business.description ||
                'No description available for this business.'}
            </p>
          </section>

          {/* Services */}
          {business.services && business.services.length > 0 && (
            <section className='mb-8 rounded-2xl bg-white p-8 shadow-sm'>
              <h2 className='mb-6 text-2xl font-bold text-[#0F172A]'>
                Our services
              </h2>
              <div className='space-y-4'>
                {business.services.map((service, index) => (
                  <div
                    key={service.id || index}
                    className='flex items-center justify-between border-b border-gray-100 pb-4 last:border-0'
                  >
                    <div className='flex-1'>
                      <h3 className='mb-1 text-lg font-semibold text-[#0F172A]'>
                        {service.title}
                      </h3>
                      {service.description && (
                        <p className='text-sm text-[#64748B]'>
                          {service.description}
                        </p>
                      )}
                    </div>
                    <div className='flex items-center gap-4'>
                      <button className='rounded-lg bg-primary/10 px-6 py-2 text-sm font-medium text-primary transition hover:bg-primary/20'>
                        Book service
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <section className='mb-8 rounded-2xl bg-white p-8 shadow-sm'>
              <h2 className='mb-6 text-2xl font-bold text-[#0F172A]'>
                Gallery
              </h2>
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
                {galleryImages.slice(0, 8).map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className='relative aspect-square cursor-pointer overflow-hidden rounded-lg transition hover:opacity-90'
                  >
                    <Image
                      src={image as string}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      className='object-cover'
                    />
                  </div>
                ))}
              </div>
              {galleryImages.length > 8 && (
                <button className='mt-4 text-primary hover:underline'>
                  View all {galleryImages.length} photos
                </button>
              )}
            </section>
          )}

          {/* Amenities */}
          {business.amenities && business.amenities.length > 0 && (
            <section className='mb-8 rounded-2xl bg-white p-8 shadow-sm'>
              <h2 className='mb-6 text-2xl font-bold text-[#0F172A]'>
                Amenities
              </h2>
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
                {business.amenities.map((amenity, index) => (
                  <div
                    key={
                      typeof amenity === 'object' && 'id' in amenity
                        ? amenity.id
                        : index
                    }
                    className='flex flex-col items-center gap-2 rounded-lg bg-gray-50 p-4 text-center'
                  >
                    <BaseIcons value='star-yellow' />
                    <span className='text-sm text-[#475467]'>
                      {typeof amenity === 'string'
                        ? amenity
                        : 'name' in amenity
                          ? amenity.name
                          : amenity}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Contact & Hours */}
        <div className='lg:col-span-1'>
          {/* Contact Details */}
          <section className='mb-8 rounded-2xl bg-white p-6 shadow-sm'>
            <h3 className='mb-4 text-xl font-bold text-[#0F172A]'>
              Contact details
            </h3>
            <div className='space-y-4'>
              {business.address && (
                <div className='flex items-start gap-3'>
                  <BaseIcons value='location-primary' />
                  <div>
                    <p className='text-sm font-medium text-[#0F172A]'>
                      Address
                    </p>
                    <p className='text-sm text-[#64748B]'>{business.address}</p>
                  </div>
                </div>
              )}

              {business.phone_number && (
                <div className='flex items-start gap-3'>
                  <BaseIcons value='chat-black' />
                  <div>
                    <p className='text-sm font-medium text-[#0F172A]'>Phone</p>
                    <a
                      href={`tel:${business.phone_number}`}
                      className='text-sm text-primary hover:underline'
                    >
                      {business.phone_number}
                    </a>
                  </div>
                </div>
              )}

              {business.email && (
                <div className='flex items-start gap-3'>
                  <BaseIcons value='listing-black' />
                  <div>
                    <p className='text-sm font-medium text-[#0F172A]'>Email</p>
                    <a
                      href={`mailto:${business.email}`}
                      className='text-sm text-primary hover:underline'
                    >
                      {business.email}
                    </a>
                  </div>
                </div>
              )}

              {business.website && (
                <div className='flex items-start gap-3'>
                  <BaseIcons value='arrow-diagonal-white' />
                  <div>
                    <p className='text-sm font-medium text-[#0F172A]'>
                      Website
                    </p>
                    <a
                      href={business.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-primary hover:underline'
                    >
                      {business.website}
                    </a>
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className='flex items-center gap-3 pt-4'>
                {business.instagram_link && (
                  <a
                    href={business.instagram_link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition hover:bg-primary/10'
                  >
                    <BaseIcons value='telegram-outlined-black' />
                  </a>
                )}
                {business.facebook_link && (
                  <a
                    href={business.facebook_link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition hover:bg-primary/10'
                  >
                    <BaseIcons value='facebook-outlined-black' />
                  </a>
                )}
                {business.twitter_link && (
                  <a
                    href={business.twitter_link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition hover:bg-primary/10'
                  >
                    <BaseIcons value='x-outlined-black' />
                  </a>
                )}
                {business.whatsapp_link && (
                  <a
                    href={business.whatsapp_link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition hover:bg-primary/10'
                  >
                    <BaseIcons value='whatsapp-outlined-black' />
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* Opening Hours */}
          <section className='rounded-2xl bg-white p-6 shadow-sm'>
            <h3 className='mb-4 text-xl font-bold text-[#0F172A]'>
              Opening hours
            </h3>
            <div className='space-y-3'>
              {openingHours.map(schedule => (
                <div
                  key={schedule.day}
                  className='flex items-center justify-between text-sm'
                >
                  <div className='flex items-center gap-2'>
                    <BaseIcons value='calendar-white' />
                    <span className='text-[#0F172A]'>{schedule.day}</span>
                  </div>
                  <span
                    className={
                      schedule.open ? 'text-green-600' : 'text-red-500'
                    }
                  >
                    {schedule.hours}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Auth Modal (if needed) */}
      {showAuthModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='relative w-full max-w-md rounded-2xl bg-white p-8'>
            <button
              onClick={() => setShowAuthModal(false)}
              className='absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-600'
            >
              ×
            </button>
            <div className='mb-6 text-center'>
              <h3 className='mb-2 text-xl font-bold'>ACCESS DENIED</h3>
              <p className='text-[#64748B]'>
                To send a message, save or rate a business, please login or
                create an account!
              </p>
            </div>
            <div className='flex flex-col gap-3'>
              <button
                onClick={() => router.push('/signin')}
                className='rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary/90'
              >
                LOGIN / SIGN UP →
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className='text-sm text-gray-600 hover:text-gray-800'
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default BusinessDetailsClient;
