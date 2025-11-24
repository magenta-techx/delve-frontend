'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui';
import { FacebookIcon, InstagramIcon, TikTokIcon, TwitterIcon, WhatsappIcon } from '@/assets/icons';

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
    icon: <WhatsappIcon />,
    color: 'bg-green-500',
  },
  {
    id: 'instagram',
    name: 'Instagram Link',
    icon: <InstagramIcon />,
    color: 'bg-pink-500',
  },
  {
    id: 'facebook',
    name: 'Facebook Link',
    icon: <FacebookIcon />,
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
    icon: <TikTokIcon />,
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

  const [activeSocialPlatforms, setActiveSocialPlatforms] = useState<Set<string>>(new Set());

  const updateContactInfo = (field: keyof CombinedContactInfo, value: string) => {
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
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Phone Number */}
      <div className="space-y-2">
        <label htmlFor="phone_number">Phone number</label>
        <Input
          id="phone_number"
          placeholder="Enter phone number"
          value={contactInfo.phone_number}
          onChange={(e) => updateContactInfo('phone_number', e.target.value)}
        />
      </div>

      {/* Business Registration Number */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <label htmlFor="registration_number">Business registration number</label>
          <div className="w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center text-xs text-gray-500">
            i
          </div>
        </div>
        <Input
          id="registration_number"
          placeholder="Enter business registration number"
          value={contactInfo.registration_number}
          onChange={(e) => updateContactInfo('registration_number', e.target.value)}
        />
      </div>

      {/* Social Media Platforms */}
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {SOCIAL_PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              type="button"
              onClick={() => toggleSocialPlatform(platform.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors ${
                activeSocialPlatforms.has(platform.id)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl mb-1">{platform.icon}</span>
              <span className="text-xs text-center font-medium">
                {activeSocialPlatforms.has(platform.id) ? platform.name.replace(' Link', '') : 'Add'}
              </span>
            </button>
          ))}
        </div>

        {/* Active Social Platform URL Inputs */}
        {Array.from(activeSocialPlatforms).map((platformId) => {
          const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
          if (!platform) return null;

          const linkField = `${platformId}_link` as keyof CombinedContactInfo;
          const currentValue = contactInfo[linkField] || '';

          return (
            <div key={platformId} className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{platform.icon}</span>
                <label htmlFor={linkField} className="text-sm font-medium text-purple-600">
                  {platform.name}
                </label>
                <button
                  type="button"
                  onClick={() => toggleSocialPlatform(platformId)}
                  className="ml-auto p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
              <Input
                id={linkField}
                placeholder={`Enter your ${platform.name.toLowerCase()}`}
                value={currentValue}
                onChange={(e) => updateSocialLink(platformId, e.target.value)}
                className="text-sm"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessContactAndBusiness;