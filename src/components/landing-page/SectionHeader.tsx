import { BaseIcons, IconsType } from '@/assets/icons/base/Icons';

interface SectionHeaderProps{
    
    header: string;
    paragraph:string
    iconValue:IconsType
}
const SectionHeader = ({ header, paragraph, iconValue }: SectionHeaderProps):JSX.Element => {
  return (
    <div className='flex flex-col items-center justify-center gap-3 px-10'>

      <div className='sm:w-full w-[19.8px] flex items-center justify-center'>
        <BaseIcons value={iconValue} />
      </div>
      <p className='sm:text-[20px] text-[12px] font-inter font-medium'>{paragraph}</p>
      <h1 className='sm:text-[44px] text-[24px] text-center font-karma'>{header}</h1>
    </div>
  )
}

export default SectionHeader