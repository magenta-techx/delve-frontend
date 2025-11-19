'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import { BaseIcons } from '@/assets/icons/base/Icons';
import { useSavedBusinessesContext } from '@/contexts/SavedBusinessesContext';
import type { BusinessDetail } from '@/types/api';
import { useBusinessDetails } from '@/app/(business)/misc/api';

interface BusinessDetailsClientProps {
  business: BusinessDetail;
}

const BusinessDetailsClient = ({ business }: BusinessDetailsClientProps) => {
  const router = useRouter();
  const { isSaved, toggleSave } = useSavedBusinessesContext();
  const [_selectedImage, setSelectedImage] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const params = useSearchParams()
  const ref = params.get('ref');
  const {} = useBusinessDetails(business.id, ref as string | undefined, '');

  
  const isBusinessSaved = isSaved(business.id);

  const galleryImages = [
    business.thumbnail,
    business.logo,
    ...(business.images || []).map((img) =>
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

  return (
    <main className='relative mx-auto max-w-[1540px] px-4 py-8 pt-24 lg:pt-28'>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className='mb-6 flex items-center gap-2 text-[#475467] transition-colors hover:text-black'
      >
        <BaseIcons value='arrows-left-primary' />
        <span className='text-[16px] font-medium'>Back</span>
      </button>

      {/* Hero Section with Image and Business Info */}
      <div className='relative mb-8 overflow-hidden rounded-3xl bg-gray-100'>
        {/* Hero Image */}
        <div className='relative h-[400px] w-full'>
          {business.thumbnail || business.logo ? (
            <Image
              src={business.thumbnail || business.logo || ''}
              alt={business.name}
              fill
              className='object-cover'
              priority
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-purple-200'>
              <span className='text-6xl font-bold text-primary/30'>
                {business.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Overlay with Business Name and Actions */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent'>
            <div className='absolute bottom-0 left-0 right-0 p-8'>
              <div className='flex items-end justify-between'>
                <div className='flex items-center gap-4'>
                  {/* Business Logo */}
                  {business.logo && (
                    <div className='relative h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg'>
                      <Image
                        src={business.logo}
                        alt={`${business.name} logo`}
                        fill
                        className='object-cover'
                      />
                    </div>
                  )}

                  {/* Business Name and Info */}
                  <div className='text-white'>
                    <h1 className='mb-2 text-3xl font-bold'>{business.name}</h1>
                    <div className='flex items-center gap-4 text-sm'>
                      {business.category && (
                        <span className='flex items-center gap-1'>
                          <BaseIcons value='category-yellow' />
                          {business.category.name}
                        </span>
                      )}
                      {business.address && (
                        <span className='flex items-center gap-1'>
                          <BaseIcons value='location-primary' />
                          {business.address}
                        </span>
                      )}
                      {business.state && (
                        <span className='flex items-center gap-1'>
                          <BaseIcons value='location-primary' />
                          {business.state}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex items-center gap-3'>
                  <button
                    onClick={handleBookmarkClick}
                    className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition hover:bg-white/30'
                  >
                    <BaseIcons
                      value={
                        isBusinessSaved
                          ? 'bookmark-white'
                          : 'bookmark-outline-black'
                      }
                    />
                  </button>
                  {business.status === 'active' && (
                    <span className='rounded-full bg-green-500/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm'>
                      ● Opened
                    </span>
                  )}
                  {business.approved && (
                    <span className='rounded-full bg-primary/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm'>
                      ✓ Verified Business
                    </span>
                  )}
                </div>
              </div>
            </div>
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
              {openingHours.map((schedule) => (
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
