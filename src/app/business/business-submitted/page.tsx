import BusinessSubmittedIcon from '@/assets/icons/business/BusinessSubmittedIcon';
import Navbar from '@/components/Navbar';

export default function Page(): JSX.Element {
  return (
    <div className='h-full w-full'>
      <Navbar authFormButtons={false} />
      <div className='flex h-full w-full flex-col items-center justify-center gap-10 pt-10 sm:gap-16'>
        <BusinessSubmittedIcon />
        <div className='flex w-full flex-col items-center justify-center gap-3'>
          <h1 className='font-karma text-2xl font-semibold sm:text-3xl'>
            You business profile has been submitted!
          </h1>
          <p className='w-full text-left text-sm sm:w-[60%] sm:text-center'>
            Thang you for completing your onboarding. Our team will review your
            details and verification typically takes 24-48 hours. You will
            receive an update as soon as your business is approved.
          </p>
        </div>
      </div>
    </div>
  );
}
