import { LogoIcon } from '@/assets/icons';

interface SectionHeaderProps {
  header: string;
  paragraph: string;
}
const SectionHeader = ({
  header,
  paragraph,
}: SectionHeaderProps): JSX.Element => {
  return (
    <div className='flex flex-col items-center justify-center gap-3 px-10'>
      <div className='flex w-[19.8px] items-center justify-center sm:w-full'>
        <LogoIcon/>
      </div>
      <p className='font-inter text-[12px] font-medium sm:text-[20px]'>
        {paragraph}
      </p>
      <h1 className='text-center font-karma text-2xl max-sm:font-medium sm:text-[44px] text-balance'>
        {header}
      </h1>
    </div>
  );
};

export default SectionHeader;
