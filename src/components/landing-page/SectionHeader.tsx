import { BaseIcons, IconsType } from '@/assets/icons/base/Icons';

interface SectionHeaderProps{
    
    header: string;
    paragraph:string
    iconValue:IconsType
}
const SectionHeader = ({ header, paragraph, iconValue }: SectionHeaderProps):JSX.Element => {
  return (
      <div className='flex flex-col items-center gap-3'>
          <BaseIcons value={iconValue} />
          <p className='text-[20px] font-inter font-medium'>{paragraph}</p>
          <h1 className='text-[44px] font-karma'>{header}</h1>
    </div>
  )
}

export default SectionHeader