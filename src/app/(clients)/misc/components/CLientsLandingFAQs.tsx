'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { BaseIcons, IconsType } from '@/assets/icons/base/Icons';

type FaqItem = {
  id: number;
  icon: IconsType;
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    icon: 'listing-black',
    question: 'Who can list their business on Delve?',
    answer:
      'Any registered business that serves customers can create a profile on Delve. Service providers, retailers, freelancers, and local shops all have a place here as long as they uphold our community standards.',
  },
  {
    id: 2,
    icon: 'group-people-black',
    question: 'Do I need a physical store to list my business?',
    answer:
      'You can list your business whether you are fully online, work-from-home, or operate a storefront. Just share accurate contact details so customers know how best to reach you.',
  },
  {
    id: 3,
    icon: 'search-black',
    question: 'How do customers find my business on Delve?',
    answer:
      'Customers discover you through category filters, location searches, and curated recommendations. Premium listings receive priority placement to boost visibility.',
  },
  {
    id: 4,
    icon: 'person-circle-black',
    question: 'How does Delve verify businesses?',
    answer:
      'We review business registrations, contact details, and customer feedback. Verified businesses earn a badge that reassures shoppers they are engaging with a trusted vendor.',
  },
  {
    id: 5,
    icon: 'naira-circle-black',
    question: 'What types of media can I add to my profile?',
    answer:
      'Upload images, videos, and testimonials that showcase your products or completed work. Clear visuals help customers decide faster and build confidence in your brand.',
  },
];

const CLientsLandingFAQs = (): JSX.Element => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setActiveId(prev => (prev === id ? null : id));
  };

  return (
    <section className='mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 py-12 text-[#0F172B] sm:py-16'>
      <h2 className='text-balance text-center font-karma text-xl sm:text-3xl lg:text-5xl font-medium'>
        We are here to help with your questions
      </h2>
      <div className='flex w-full flex-col items-center justify-center space-y-4'>
        {FAQ_ITEMS.map(item => {
          const isActive = activeId === item.id;

          return (
            <div
              key={item.id}
              className='w-full max-w-5xl rounded-[32px] border border-[#ECE9FE] bg-[#F8FAFC] px-4 py-4 shadow-sm sm:px-6 sm:py-5'
            >
              <button
                type='button'
                onClick={() => toggleFaq(item.id)}
                aria-expanded={isActive}
                className='grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 text-left text-sm font-medium sm:text-base'
              >
                <span className='flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12'>
                  <BaseIcons value={item.icon} />
                </span>

                <span className='border-l-[3px] border-[#E3E8EF] pl-4 sm:pl-6'>
                  {item.question}
                </span>

                <motion.span
                  animate={{ rotate: isActive ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#6E44FF] sm:h-12 sm:w-12'
                >
                  <BaseIcons value='arrow-down-primary' />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    key='answer'
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className='grid grid-cols-[auto_1fr_auto] items-start gap-4 overflow-hidden'
                  >
                    <span
                      className='invisible h-10 w-10 sm:h-12 sm:w-12'
                      aria-hidden
                    />
                    <p className='border-l-[3px] border-[#E3E8EF] pb-2 pl-4 pt-4 text-sm text-[#475569] sm:pl-6 sm:text-base'>
                      {item.answer}
                    </p>
                    <span
                      className='invisible h-10 w-10 sm:h-12 sm:w-12'
                      aria-hidden
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CLientsLandingFAQs;
