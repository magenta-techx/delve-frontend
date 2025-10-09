import { BaseIcons, IconsType } from '@/assets/icons/base/Icons';

interface SectionHeaderProps {
  header: string;
  paragraph: string;
  iconValue: IconsType;
}
const SectionHeader = ({
  header,
  paragraph,
  iconValue,
}: SectionHeaderProps): JSX.Element => {
  return (
    <div className='flex flex-col items-center justify-center gap-3 px-10'>
      <div className='flex w-[19.8px] items-center justify-center sm:w-full'>
        <BaseIcons value={iconValue} />
      </div>
      <p className='font-inter text-[12px] font-medium sm:text-[20px]'>
        {paragraph}
      </p>
      <h1 className='text-center font-karma text-[24px] sm:text-[44px]'>
        {header}
      </h1>
    </div>
  );
};

export default SectionHeader;
