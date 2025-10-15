import { CollaborationIcons } from '@/assets/icons/business/collaboration/Icons'
import React from 'react'

interface CollaborationContactProps{
    name?: string;
    date?: string;
    role?: string;
    status?: number;
    styleProps: string;
    neutral?: boolean
}
const CollaborationContact = ({ name, date, role, status, styleProps, neutral=false }: CollaborationContactProps): JSX.Element => {
    
    const itemBgStyle = neutral ? "bg-[#F8FAFC]" : "bg-[#FFFFFF]"
    const roleBgStyle = neutral ? "bg-[#FFFFFF] border-[1px] border-[#EEF2F6]" : "bg-[#FEFDF0] text-[#FEC601]"
  return (
      <div className={`${styleProps} ${itemBgStyle} flex items-center px-5  border-[1px] border-[#F5F3FF] rounded-2xl`}>
          <div className='flex w-[35%] items-center gap-2'>
              <div className="shrink-0"> <CollaborationIcons value='person-female-graphics' /></div>
              <p className='sm:text-[14px]'>{name}</p>
          </div>
          <div className='w-[30%] flex justify-start'>
              <p className={`text-[12px] ${roleBgStyle} rounded-lg px-4 py-2 flex items-center gap-2 capitalize`}>{role} {role?.toLocaleLowerCase() !== 'owner' || !neutral && <CollaborationIcons value='direction-down-black' />}</p>
          </div>
          <div className='flex w-[30%] items-center justify-start gap-2'>
              <CollaborationIcons value='calendar-solid-gray' />
              <p className='text-[#697586] text-[14px]'>{date}</p>
          </div>

          <div className={`flex  items-center justify-end ${role?.toLocaleLowerCase() === 'owner' ? 'w-[10.5%]' : 'w-[10%]'} gap-2`}>
              <p className={`${status === 1 ? 'text-primary' : 'text-[#9AA4B2]'} text-[14px]`}>{status === 1 ? 'Active' : 'Pending'}</p>
              {role?.toLocaleLowerCase() !== 'owner' && <button className='mt-[2px]'><CollaborationIcons value='more-actions-gray' /></button>}
          </div>
      </div>
  )
}

export default CollaborationContact