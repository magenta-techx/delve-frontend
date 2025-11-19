'use client';
import React from 'react';
import { NavProfileSection } from '../../misc/components';
// icons inlined as SVGs — no external icon imports needed here
import { BusinessLandingFAQs } from '@/app/(clients)/misc/components';

const page = () => {
  return (
    <div
      className='h-full overflow-y-scroll'
      style={{
        background:
          'linear-gradient(180deg, #FCFCFDE5 0%, #FFFFFF00 50%, #FCFCFDE5 100%)',
      }}
    >
      <header className='flex items-end justify-end'>
        <NavProfileSection />
      </header>

      <main className='mt-8 px-4 pb-12'>
        <section className='mx-auto max-w-5xl'>
          <h2 className='mb-8 text-center font-karma text-2xl font-semibold sm:text-3xl'>
            Need Help? We&apos;re Here for You
          </h2>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
            <a
              href='https://www.facebook.com/Delve_ng'
              target="_blank"
              className='flex flex-col justify-between gap-4 lg:gap-6 rounded-xl border border-[#E3E8EF] bg-white p-6 hover:shadow'
            >
              <div className='flex h-12 w-12 items-center justify-center rounded-xl border border-[#CDD5DF] text-primary'>
                <svg
                  width='22'
                  height='22'
                  viewBox='0 0 22 22'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M0.870835 3.25C0 4.75833 0 6.78333 0 10.8333C0 14.8833 0 16.9083 0.870835 18.4167C1.44133 19.4048 2.26188 20.2253 3.25 20.7958C4.75833 21.6667 6.78333 21.6667 10.8333 21.6667C14.8833 21.6667 16.9083 21.6667 18.4167 20.7958C19.4048 20.2253 20.2253 19.4048 20.7958 18.4167C21.6667 16.9083 21.6667 14.8833 21.6667 10.8333C21.6667 6.78333 21.6667 4.75833 20.7958 3.25C20.2253 2.26188 19.4048 1.44133 18.4167 0.870835C16.9083 0 14.8833 0 10.8333 0C6.78333 0 4.75833 0 3.25 0.870835C2.26188 1.44133 1.44133 2.26188 0.870835 3.25ZM12.2228 8.65295C12.2228 7.85773 12.8871 7.21308 13.7065 7.21308H16.25V4.33333H13.7065C11.2483 4.33333 9.25543 6.26729 9.25543 8.65295V10.9156H6.5V13.7954H9.25543V20.5833H12.2228V13.7954H15.4022L15.8261 10.9156H12.2228V8.65295Z'
                    fill='#131316'
                  />
                </svg>
              </div>

              <div className='mt-8'>
                <h3 className='font-sm font-inter font-bold'>
                  Connect us on facebook
                </h3>
                <p className='text-xs font-normal text-[#0D121C]'>
                  Send us a message with your question
                </p>
              </div>

              <p className='mt-auto text-sm text-gray-600'>@Delve_ng</p>
            </a>

            <a
              href='https://www.instagram.com/delve_ng/'
              target="_blank"
              className='flex flex-col justify-between gap-4 lg:gap-6 rounded-xl border border-[#E3E8EF] bg-white p-6 hover:shadow'
            >
              <div className='flex h-12 w-12 items-center justify-center rounded-xl border border-[#CDD5DF]'>
                <svg
                  width='19'
                  height='19'
                  viewBox='0 0 19 19'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M9.16667 12.8333C10.9386 12.8333 12.375 11.3969 12.375 9.625C12.375 7.85309 10.9386 6.41667 9.16667 6.41667C7.39475 6.41667 5.95833 7.85309 5.95833 9.625C5.95833 11.3969 7.39475 12.8333 9.16667 12.8333Z'
                    fill='#131316'
                  />
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M0 9.16667C0 5.73974 0 4.02628 0.73686 2.75C1.21959 1.91389 1.91389 1.21959 2.75 0.73686C4.02628 0 5.73974 0 9.16667 0C12.5936 0 14.3071 0 15.5833 0.73686C16.4194 1.21959 17.1137 1.91389 17.5965 2.75C18.3333 4.02628 18.3333 5.73974 18.3333 9.16667C18.3333 12.5936 18.3333 14.3071 17.5965 15.5833C17.1137 16.4194 16.4194 17.1137 15.5833 17.5965C14.3071 18.3333 12.5936 18.3333 9.16667 18.3333C5.73974 18.3333 4.02628 18.3333 2.75 17.5965C1.91389 17.1137 1.21959 16.4194 0.73686 15.5833C0 14.3071 0 12.5936 0 9.16667ZM9.16667 14.2083C11.698 14.2083 13.75 12.1563 13.75 9.625C13.75 7.09369 11.698 5.04167 9.16667 5.04167C6.63536 5.04167 4.58333 7.09369 4.58333 9.625C4.58333 12.1563 6.63536 14.2083 9.16667 14.2083ZM13.2917 5.5C14.0511 5.5 14.6667 4.88439 14.6667 4.125C14.6667 3.36561 14.0511 2.75 13.2917 2.75C12.5323 2.75 11.9167 3.36561 11.9167 4.125C11.9167 4.88439 12.5323 5.5 13.2917 5.5Z'
                    fill='#131316'
                  />
                </svg>
              </div>

              <div className='mt-8'>
                <h3 className='font-sm font-inter font-bold'>
                  Connect us on instagram
                </h3>
                <p className='text-xs font-normal text-[#0D121C]'>
                  Send us a message with your question
                </p>
              </div>
              <p className='mt-auto text-sm text-gray-600'>@Delve_ng</p>
            </a>

            <a
              href='tel:2348123456789'
              target="_blank"
              className='flex flex-col justify-between gap-4 lg:gap-6 rounded-xl border border-[#E3E8EF] bg-white p-6 hover:shadow'
            >
              <div className='flex h-12 w-12 items-center justify-center rounded-xl border border-[#CDD5DF]'>
                <svg
                  width='19'
                  height='19'
                  viewBox='0 0 19 19'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M1.5926 1.1059L0.733164 2.82477C0.0429205 4.20526 -0.250312 5.7694 0.252677 7.22858C0.856857 8.9813 2.06484 11.4932 4.43566 13.864C6.80647 16.2348 9.31835 17.4428 11.0711 18.047C12.5303 18.55 14.0944 18.2567 15.4749 17.5665L17.2512 16.6783C18.4555 16.0762 18.7328 14.4802 17.8022 13.5071L15.8427 11.4583C15.1561 10.7403 14.0433 10.6436 13.2431 11.2324C12.3457 11.8926 11.1458 12.0052 10.2053 11.4081C9.64403 11.0519 9.04675 10.6267 8.62303 10.2029C8.13138 9.7113 7.63772 8.986 7.25212 8.35445C6.75958 7.54773 6.76661 6.54736 7.18931 5.70195L7.45204 5.17649C7.83703 4.40652 7.68612 3.47657 7.0774 2.86785L4.79567 0.586115C3.83038 -0.379167 2.2031 -0.115093 1.5926 1.1059ZM2.93424 1.77672L2.07481 3.4956C1.4991 4.64701 1.3404 5.78127 1.67079 6.73974C2.21922 8.33076 3.32227 10.6293 5.49632 12.8033C7.67036 14.9774 9.9689 16.0804 11.5599 16.6289C12.5184 16.9593 13.6526 16.8006 14.8041 16.2249L16.5804 15.3367C16.8815 15.1862 16.9508 14.7872 16.7181 14.5439L14.7587 12.495C14.5932 12.322 14.3249 12.2987 14.132 12.4406C12.8035 13.4181 10.9312 13.6456 9.40141 12.6746C8.81223 12.3006 8.10404 11.8053 7.56237 11.2636C6.93951 10.6407 6.37059 9.78913 5.97188 9.1361C5.17859 7.8368 5.22203 6.28242 5.84767 5.03113L6.1104 4.50567C6.20665 4.31318 6.16892 4.08069 6.01674 3.92851L3.73501 1.64678C3.49369 1.40546 3.08687 1.47147 2.93424 1.77672Z'
                    fill='#363538'
                  />
                  <path
                    d='M13.2112 4.74532C12.5577 4.09182 11.7637 3.73992 11.1606 3.82606C10.8873 3.86511 10.634 3.67516 10.5949 3.40179C10.5559 3.12843 10.7458 2.87516 11.0192 2.83611C12.0661 2.68658 13.1576 3.2775 13.9183 4.03822C14.679 4.79893 15.27 5.89051 15.1204 6.93736C15.0813 7.21073 14.8281 7.40068 14.5547 7.36162C14.2813 7.32257 14.0914 7.0693 14.1305 6.79594C14.2166 6.19287 13.8647 5.39882 13.2112 4.74532Z'
                    fill='#363538'
                  />
                  <path 
                    d='M10.5601 5.91991C11.5241 5.55426 12.4023 6.43238 12.0366 7.39643C11.9387 7.65462 12.0686 7.94332 12.3268 8.04125C12.585 8.13919 12.8737 8.00928 12.9716 7.75108C13.643 5.98097 11.9756 4.31351 10.2055 4.98491C9.94729 5.08284 9.81738 5.37154 9.91531 5.62973C10.0132 5.88793 10.3019 6.01784 10.5601 5.91991Z'
                    fill='#363538'
                  />
                </svg>
              </div>
              <div className='mt-8'>
                <h3 className='font-sm font-inter font-bold'>
                  Call us
                </h3>
                <p className='text-xs font-normal text-[#0D121C]'>
                  Available Mon - Fri from 8am to 5pm
                </p>
              </div>
              <p className='mt-auto text-sm text-gray-600 underline'>+234 8123456789</p>
            </a>
          </div>
        </section>

        <section className='mx-auto mt-12 max-w-6xl'>
          <BusinessLandingFAQs />
        </section>
      </main>
    </div>
  );
};

export default page;
