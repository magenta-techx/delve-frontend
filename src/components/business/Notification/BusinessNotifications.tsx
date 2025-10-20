import { IconsType, NotifcationIcons } from '@/assets/icons/business/notification/Icons'
import React from 'react'


interface BusinessNotificationsProps {
    setOpen: (value: boolean) => void
}
const BusinessNotifications = ({ setOpen }: BusinessNotificationsProps): JSX.Element => {
 
    const NOTIFICATIONS = [
        {
            date: "Fri, 23 Aug",
            time: "04:32 pm",
            message: "New message from John Mark",
            type:1
        },
        {
            date: "Fri, 23 Aug",
            time: "04:32 pm",
            message: "New message from John Mark",
            type:2
        },
        {
            date: "Fri, 23 Aug",
            time: "04:32 pm",
            message: "New collaboration request ",
            type:3
        },
        {
            date: "Fri, 23 Aug",
            time: "04:32 pm",
            message: "Rate your experience with The Glam Studio",
            type:4
        },
        {
            date: "Fri, 23 Aug",
            time: "04:32 pm",
            message: "Your delve account has been created successfully. 🎉",
            type:5
        },
    ]
    return (
        <div className='bg-white rounded-lg py-6 px-5 border-[1px] border-[#F8FAFC] w-full'>
            <div className='flex items-center justify-between mb-8'>

                <div className='flex items-center gap-2'>
                    <h1 className='font-medium text-[24px] font-inter'>Notifcations</h1>
                    <div className='bg-[#F5F3FF] h-[25px] text-[12px] font-medium w-[25px] flex rounded-full items-center justify-center text-primary'>1</div>
                </div>
                <div className="pr-2"><NotifcationIcons value='more-actions-dark' /></div>
            </div>
            
            {/* notifications  */}
            <div className='flex flex-col gap-4'>
                {NOTIFICATIONS.map((notification, key) => {
                    const iconType = notification.type === 1 ? "chat-primary" : notification.type === 2 ? "chat-gray" : notification.type === 3 ? "collaboration-alert-gray" : notification.type === 4 ? "rating-alert-primary" : '' as IconsType

                    // const messageColor = notification.type === 1 ? "chat-primary" : notification.type === 2 ? "chat-gray" : notification.type === 3 ? "collaboration-alert-gray" : notification.type === 4 ? "rating-alert-primary" : '' as IconsType
                    return <button key={key} className='flex text-left items-center gap-8 border-b-[1px] border-[#EEF2F6] pb-5' onClick={() => {
                        console.log("Button clicked");
                        setOpen(true)
                    }}>
                        <div className='shrink-0'>
                            <p className='text-[14px] text-[#9AA4B2] mb-2'>{notification.date}</p>
                            <p className='text-[14px]'>{notification.time}</p>
                        </div>
                        <div className={`flex items-center gap-2 text-[16px]`}>{iconType && <NotifcationIcons value={iconType} />} <span className={`${key === 1 || key === 2 ? 'text-[#4B5565]' : 'text-[#0D121C]'}`}>{notification.message}</span></div>
                    </button>
                })}
            </div>
        </div>
    )
}

export default BusinessNotifications