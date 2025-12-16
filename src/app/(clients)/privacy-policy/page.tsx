import React from 'react';

const privacyHighlights = [
  'Request rectification of your personal information.',
  'Object to the processing of your personal information.',
  'Request that we restrict how we use your personal information.',
  'Request the erasure of your personal information.',
  'Withdraw consent to provision of your personal information to third parties.',
];

export default function PrivacyPolicyPage() {
  return (
    <main className='relative bg-white text-[#111927]'>
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 bg-[url("/bg-pattern.png")] bg-repeat  opacity-60'
        />
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-white/95 to-white'
        />
      <section className='relative overflow-hidden bg-white'>
        <div className='relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 pb-20 pt-24 text-center sm:px-6 lg:px-8'>
          <p className='text-xs font-semibold uppercase tracking-[0.35em] text-[#9AA4B2]'>Privacy</p>
          <h1 className='text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl'>PRIVACY AT DELVE</h1>
          <p className='max-w-2xl text-base leading-relaxed text-[#4B5565] sm:text-lg'>
            Delve is committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how we collect,
            use, store, and protect your information when you use our services.
          </p>
        </div>
      </section>

      <section className='mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-0'>
        <article className='space-y-10 text-sm leading-7 text-[#334155] sm:text-base sm:leading-8'>
          <div className='space-y-3'>
            <h2 className='text-lg font-semibold text-[#111927] sm:text-xl'>About Us</h2>
            <p>
              Here at Delve Search NG, we are committed to protecting the privacy of the personal information provided to us in the course of our business as
              well as information we receive from visitors to our website. Furthermore, we prioritize your privacy rights regarding our collection, use, storage
              and sharing of your personal information.
            </p>
            <p>
              This privacy policy (the “policy”) sets out the basis on which any personal information provided to us will be processed. It also sets out how to
              contact us if you want to amend or remove your data. We may amend this policy at any time by publishing the amended policy on the website. The new
              policy then becomes effective on the day that it is published.
            </p>
          </div>

          <div className='space-y-3'>
            <h2 className='text-lg font-semibold text-[#111927] sm:text-xl'>Personal Information</h2>
            <p>
              In this policy, personal information refers to information relating to an identifiable natural person. It includes name, state, city, company
              registration number, registered address, email, telephone number, description, social media handles and other information that can be used to identify
              an individual or a company.
            </p>
          </div>

          <div className='space-y-3'>
            <h2 className='text-lg font-semibold text-[#111927] sm:text-xl'>How we will use your information</h2>
            <p>
              The information we gather will be part of a project designed to create a business directory in Nigeria that is inclusive of a range of industries. We
              want our clients to be at your fingertips both locally and internationally. Ultimately, we aspire to put Nigerian companies at the global forefront in
              their respective industries.
            </p>
          </div>

          <div className='space-y-3'>
            <h2 className='text-lg font-semibold text-[#111927] sm:text-xl'>Who we share your information with</h2>
            <p>
              We will only share information that is publicly available at Delve Search NG. We will not share with third parties any information that is not publicly
              available on our website or in other media except where you have consented to us doing so (where necessary) or where the law requires us to do so.
            </p>
          </div>

          <div className='space-y-3'>
            <h2 className='text-lg font-semibold text-[#111927] sm:text-xl'>Cookies &amp; tracking</h2>
            <p>
              Cookies are files with small amounts of data, which may include an anonymous unique identifier. Cookies allow for a more personalized browsing
              experience on a particular website by taking your preferences into account. Like many websites, we use cookies to collect information. You can instruct
              your computer to delete, disable or to indicate when a cookie is being sent. However, please note that if you choose to delete or disable cookies,
              you may experience a less interactive time on our website.
            </p>
          </div>

          <div className='space-y-3'>
            <h2 className='text-lg font-semibold text-[#111927] sm:text-xl'>Security</h2>
            <p>
              We protect your information with industry standard measures, encryption, access controls, monitoring, and regular security reviews. No system is
              perfect, so please keep your login details and devices secure.
            </p>
          </div>

          <div className='space-y-4'>
            <h2 className='text-lg font-semibold text-[#111927] sm:text-xl'>Your Rights</h2>
            <p>
              You can exercise certain rights in relation to the personal information that we hold. These rights are to:
            </p>
            <ul className='space-y-2 pl-5 text-[#111927] marker:text-[#551FB9] [&>li]:list-disc'>
              {privacyHighlights.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className='space-y-3'>
            <p>
              If you would like to exercise any of these rights or have any questions regarding this policy, please contact us by emailing
              <span className='font-semibold text-[#551FB9]'> delve.ng@yahoo.com</span> or <span className='font-semibold text-[#551FB9]'>delvesearchng@gmail.com</span>.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}