'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui';
import { TwitterIcon } from '@/assets/icons';
import { Label } from '@/components/ui/label';

interface CombinedContactInfo {
  phone_number: string;
  registration_number: string;
  whatsapp_link?: string;
  facebook_link?: string;
  instagram_link?: string;
  twitter_link?: string;
  tiktok_link?: string;
}

interface BusinessContactAndBusinessProps {
  setContactInfo: (info: CombinedContactInfo) => void;
  initialContactInfo?: CombinedContactInfo | undefined;
}

const SOCIAL_PLATFORMS = [
  {
    id: 'whatsapp',
    name: 'Whatsapp Link',
    icon: (
      <svg
        width='19'
        height='18'
        viewBox='0 0 19 18'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M1.32194 17.7406L1.77832 14.5459L0.938736 12.8667C-0.671287 9.6467 -0.180481 5.77354 2.18184 3.05687C5.50454 -0.764238 11.343 -1.04263 15.0142 2.445L15.2702 2.68819C17.1759 4.49861 18.1772 7.06314 18.0023 9.68588C17.629 15.2851 12.2011 19.1243 6.79729 17.6112L4.77832 17.0459L1.57487 17.9612C1.43555 18.001 1.30145 17.884 1.32194 17.7406ZM5.08978 5.5429L4.71891 6.4116C4.42104 7.10928 4.3228 7.88567 4.6112 8.58755C4.95763 9.43064 5.62155 10.629 6.8505 11.7246C8.07945 12.8202 9.34378 13.3408 10.2191 13.5868C10.9478 13.7917 11.7048 13.6026 12.3605 13.2239L13.2042 12.7365C13.7761 12.4062 13.8657 11.6146 13.3821 11.1637L12.7352 10.5445C12.3784 10.2118 11.8308 10.1963 11.4562 10.5084C11.0361 10.8585 10.1211 11.3239 9.64351 11.0579C9.35851 10.8992 8.68066 10.3768 8.46102 10.181C8.20617 9.95377 7.57479 9.28097 7.36779 8.98203C7.10338 8.60018 7.40485 7.73217 7.58727 7.30492L7.70188 7.04046C7.86802 6.65132 7.76929 6.20093 7.45375 5.91964L6.64239 5.19529C6.14202 4.74923 5.35324 4.92583 5.08978 5.5429Z'
          fill='#66C61C'
        />
      </svg>
    ),
    color: 'bg-green-500',
  },
  {
    id: 'instagram',
    name: 'Instagram Link',
    icon: (
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M10 14C11.933 14 13.5 12.433 13.5 10.5C13.5 8.567 11.933 7 10 7C8.067 7 6.5 8.567 6.5 10.5C6.5 12.433 8.067 14 10 14Z'
          fill='url(#paint0_linear_6777_18531)'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M0 10C0 6.26154 0 4.3923 0.803847 3C1.33046 2.08788 2.08788 1.33046 3 0.803847C4.3923 0 6.26154 0 10 0C13.7385 0 15.6077 0 17 0.803847C17.9121 1.33046 18.6695 2.08788 19.1962 3C20 4.3923 20 6.26154 20 10C20 13.7385 20 15.6077 19.1962 17C18.6695 17.9121 17.9121 18.6695 17 19.1962C15.6077 20 13.7385 20 10 20C6.26154 20 4.3923 20 3 19.1962C2.08788 18.6695 1.33046 17.9121 0.803847 17C0 15.6077 0 13.7385 0 10ZM10 15.5C12.7614 15.5 15 13.2614 15 10.5C15 7.73858 12.7614 5.5 10 5.5C7.23858 5.5 5 7.73858 5 10.5C5 13.2614 7.23858 15.5 10 15.5ZM14.5 6C15.3284 6 16 5.32843 16 4.5C16 3.67157 15.3284 3 14.5 3C13.6716 3 13 3.67157 13 4.5C13 5.32843 13.6716 6 14.5 6Z'
          fill='url(#paint1_linear_6777_18531)'
        />
        <defs>
          <linearGradient
            id='paint0_linear_6777_18531'
            x1='10'
            y1='0'
            x2='10'
            y2='20'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#CB30E0' />
            <stop offset='0.572115' stop-color='#FEC601' />
            <stop offset='1' stop-color='#FF0054' />
          </linearGradient>
          <linearGradient
            id='paint1_linear_6777_18531'
            x1='10'
            y1='0'
            x2='10'
            y2='20'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#CB30E0' />
            <stop offset='0.572115' stop-color='#FEC601' />
            <stop offset='1' stop-color='#FF0054' />
          </linearGradient>
        </defs>
      </svg>
    ),
    color: 'bg-pink-500',
  },
  {
    id: 'facebook',
    name: 'Facebook Link',
    icon: (
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M2.80385 5C2 6.3923 2 8.26154 2 12C2 15.7385 2 17.6077 2.80385 19C3.33046 19.9121 4.08788 20.6695 5 21.1962C6.3923 22 8.26154 22 12 22C15.7385 22 17.6077 22 19 21.1962C19.9121 20.6695 20.6695 19.9121 21.1962 19C22 17.6077 22 15.7385 22 12C22 8.26154 22 6.3923 21.1962 5C20.6695 4.08788 19.9121 3.33046 19 2.80385C17.6077 2 15.7385 2 12 2C8.26154 2 6.3923 2 5 2.80385C4.08788 3.33046 3.33046 4.08788 2.80385 5ZM13.2826 9.98734C13.2826 9.25329 13.8958 8.65823 14.6522 8.65823H17V6H14.6522C12.383 6 10.5435 7.78519 10.5435 9.98734V12.0759H8V14.7342H10.5435V21H13.2826V14.7342H16.2174L16.6087 12.0759H13.2826V9.98734Z'
          fill='#1877F2'
        />
      </svg>
    ),
    color: 'bg-blue-600',
  },
  {
    id: 'twitter',
    name: 'Twitter Link',
    icon: <TwitterIcon />,
    color: 'bg-blue-400',
  },
  {
    id: 'tiktok',
    name: 'TikTok Link',
    icon: (
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M12 15.7512V2.15561C12 2.06812 12.0709 2 12.1584 2H15.1975C15.6663 2 16.0673 2.32786 16.2292 2.76789C16.7431 4.16529 17.9404 6.05929 20.0716 6.60884C20.5833 6.74079 21 7.1662 21 7.69467V9.5C21 10.0523 20.5503 10.5056 20.0014 10.4445C17.5644 10.1733 16 9 16 9V15.75C16 19.2018 13.2018 22 9.75 22C6.29822 22 3.5 19.2018 3.5 15.75V15.5053C3.5 12.1738 6.17352 9.45887 9.50462 9.40762C9.77697 9.40343 10 9.62306 10 9.89544V13.3148C10 13.4171 9.91709 13.5 9.81481 13.5H9.75C8.50736 13.5 7.5 14.5074 7.5 15.75C7.5 16.9926 8.50736 18 9.75 18C10.9926 18 12 16.9939 12 15.7512Z'
          fill='#363538'
        />
      </svg>
    ),
    color: 'bg-black',
  },
];

const BusinessContactAndBusiness: React.FC<BusinessContactAndBusinessProps> = ({
  setContactInfo,
  initialContactInfo,
}) => {
  const [contactInfo, setLocalContactInfo] = useState<CombinedContactInfo>(
    initialContactInfo || {
      phone_number: '',
      registration_number: '',
      whatsapp_link: '',
      facebook_link: '',
      instagram_link: '',
      twitter_link: '',
      tiktok_link: '',
    }
  );

  const [activeSocialPlatforms, setActiveSocialPlatforms] = useState<
    Set<string>
  >(new Set());

  const updateContactInfo = (
    field: keyof CombinedContactInfo,
    value: string
  ) => {
    const newContactInfo = { ...contactInfo, [field]: value };
    setLocalContactInfo(newContactInfo);
    setContactInfo(newContactInfo);
  };

  const toggleSocialPlatform = (platformId: string) => {
    const newActivePlatforms = new Set(activeSocialPlatforms);
    if (newActivePlatforms.has(platformId)) {
      newActivePlatforms.delete(platformId);
      // Clear the link when removing platform
      const linkField = `${platformId}_link` as keyof CombinedContactInfo;
      updateContactInfo(linkField, '');
    } else {
      newActivePlatforms.add(platformId);
    }
    setActiveSocialPlatforms(newActivePlatforms);
  };

  const updateSocialLink = (platformId: string, url: string) => {
    const linkField = `${platformId}_link` as keyof CombinedContactInfo;
    updateContactInfo(linkField, url);
  };

  return (
    <div className='mx-auto max-w-xl space-y-6'>
      {/* Phone Number */}
      <div className='space-y-2'>
        <label htmlFor='phone_number'>Phone number</label>
        <Input
          id='phone_number'
          placeholder='Enter phone number'
          value={contactInfo.phone_number}
          onChange={e => updateContactInfo('phone_number', e.target.value)}
        />
      </div>

      {/* Business Registration Number */}
      <div className='space-y-2'>
        <div className='flex items-center space-x-2'>
          <label htmlFor='registration_number'>
            Business registration number
          </label>
          <div className='flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-xs text-gray-500'>
            i
          </div>
        </div>
        <Input
          id='registration_number'
          placeholder='Enter business registration number'
          value={contactInfo.registration_number}
          onChange={e =>
            updateContactInfo('registration_number', e.target.value)
          }
        />
      </div>

      {/* Social Media Platforms */}
      <div className='space-y-4'>
        <div className='grid grid-cols-3 gap-3 md:grid-cols-5'>
          {SOCIAL_PLATFORMS.map(platform => (
            <button
              key={platform.id}
              type='button'
              onClick={() => toggleSocialPlatform(platform.id)}
              className={`flex flex-col items-center justify-center rounded-lg border-2 p-3 transition-colors ${
                activeSocialPlatforms.has(platform.id)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className='mb-1 text-2xl'>{platform.icon}</span>
              <span className='text-center text-xs font-medium'>
                {activeSocialPlatforms.has(platform.id)
                  ? platform.name.replace(' Link', '')
                  : 'Add'}
              </span>
            </button>
          ))}
        </div>

        {/* Active Social Platform URL Inputs */}
        {Array.from(activeSocialPlatforms).map(platformId => {
          const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
          if (!platform) return null;

          const linkField = `${platformId}_link` as keyof CombinedContactInfo;
          const currentValue = contactInfo[linkField] || '';

          return (
            // <div  className='space-y-2'>
            //   <div className='flex items-center space-x-2'>
            //     <span className='text-lg'>{platform.icon}</span>
            //     <label
            //       htmlFor={linkField}
            //       className='text-sm font-medium text-purple-600'
            //     >
            //       {platform.name}
            //     </label>
            //   </div>
            //   <Input
            //     className='text-sm'
            //   />
            // </div>

            <div key={platformId} className='flex flex-col gap-3 rounded-xl border bg-white p-3 lg:px-5'>
              <Label className='flex items-center gap-2 text-sm font-normal text-[#697586]'>
                <span>{platform.icon}</span>
                {platform.name}
                <button
                  type='button'
                  onClick={() => toggleSocialPlatform(platformId)}
                  className='flex items-center gap-1 hover:text-red-500 text-[0.75rem] ml-auto p-1 text-gray-400'
                >
                  remove
                  <X size={16} />
                </button>
              </Label>
              <div className='flex-1'>
                <div className='mt-1'>
                  <Input
                    id={linkField}
                    placeholder={`Enter your ${platform.name.toLowerCase()}`}
                    value={currentValue}
                    onChange={e => updateSocialLink(platformId, e.target.value)}
                    //
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessContactAndBusiness;
