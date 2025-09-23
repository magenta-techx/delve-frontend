import BusinessSubmittedIcon from '@/assets/icons/business/BusinessSubmittedIcon';
import Navbar from '@/components/Navbar';

export default function Page(): JSX.Element {
  return (
    <div className='h-full w-full'>
      <Navbar authFormButtons={false} />
      <div className='flex h-full w-full flex-col items-center justify-center gap-10 pt-10 sm:gap-16'>
        <BusinessSubmittedIcon />
        <div className='sm:w-[580px]'>
          <h1 className='font-karma text-2xl font-semibold sm:text-3xl'>
            You business profile has been submitted!
          </h1>
          <p className='w-full text-left text-sm'>
            Thank you for completing your onboarding. Our team will review your
            details, and verification typically takes 24–48 hours. You’ll
            receive an update as soon as your business is approved and live on
            Delve.
          </p>
        </div>
      </div>
    </div>
  );
}
