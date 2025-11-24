'use client';
import React, { useState } from 'react';
import { Phone, Mail, Globe, Clock, Plus, X } from 'lucide-react';
// import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui';
import {
  Button, 
  Input,
  Card, 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';

interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

interface ContactInfo {
  email: string;
  phone_number: string;
  website: string;
  whatsapp_link?: string;
  facebook_link?: string;
  instagram_link?: string;
  twitter_link?: string;
  tiktok_link?: string;
  business_hours?: BusinessHours[];
  special_instructions?: string;
}

interface BusinessContactAndBusinessProps {
  setContactInfo: (info: ContactInfo) => void;
}

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const SOCIAL_PLATFORMS = [
  'Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube', 'Other'
];

const BusinessContactAndBusiness: React.FC<BusinessContactAndBusinessProps> = ({
  setContactInfo,
}) => {
  const [contactInfo, setLocalContactInfo] = useState<ContactInfo>({
    email: '',
    phone_number: '',
    website: '',
    business_hours: DAYS_OF_WEEK.map(day => ({
      day,
      open: '09:00',
      close: '17:00',
      isClosed: day === 'Sunday'
    })),
    special_instructions: ''
  });

  // State for managing social media separately since API expects individual links
  const [socialMedia, setSocialMedia] = useState<{ platform: string; url: string }[]>([]);

  const updateContactInfo = (field: keyof ContactInfo, value: any) => {
    const newContactInfo = { ...contactInfo, [field]: value };
    setLocalContactInfo(newContactInfo);
    setContactInfo(newContactInfo);
  };

  const updateBusinessHours = (index: number, field: keyof BusinessHours, value: any) => {
    const newHours = contactInfo.business_hours?.map((hours, i) => 
      i === index ? { ...hours, [field]: value } : hours
    ) || [];
    updateContactInfo('business_hours', newHours);
  };

  const addSocialMedia = () => {
    const newSocialMedia = [...socialMedia, { platform: '', url: '' }];
    setSocialMedia(newSocialMedia);
    // Update the contact info with specific social media links
    updateSocialMediaLinks(newSocialMedia);
  };

  const updateSocialMedia = (index: number, field: 'platform' | 'url', value: string) => {
    const newSocialMedia = socialMedia.map((social, i) => 
      i === index ? { ...social, [field]: value } : social
    );
    setSocialMedia(newSocialMedia);
    updateSocialMediaLinks(newSocialMedia);
  };

  const removeSocialMedia = (index: number) => {
    const newSocialMedia = socialMedia.filter((_, i) => i !== index);
    setSocialMedia(newSocialMedia);
    updateSocialMediaLinks(newSocialMedia);
  };

  // Helper function to map social media array to individual link fields
  const updateSocialMediaLinks = (socialArray: { platform: string; url: string }[]) => {
    const links: Partial<ContactInfo> = {};
    
    socialArray.forEach(social => {
      switch (social.platform.toLowerCase()) {
        case 'facebook':
          links.facebook_link = social.url;
          break;
        case 'instagram':
          links.instagram_link = social.url;
          break;
        case 'twitter':
          links.twitter_link = social.url;
          break;
        case 'tiktok':
          links.tiktok_link = social.url;
          break;
        case 'whatsapp':
          links.whatsapp_link = social.url;
          break;
      }
    });

    const newContactInfo = { ...contactInfo, ...links };
    setLocalContactInfo(newContactInfo);
    setContactInfo(newContactInfo);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Contact & Business Hours</h2>
        <p className="mt-2 text-sm text-gray-600">
          Help customers reach you and know when you're available
        </p>
      </div>

      {/* Contact Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="email">Business Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="business@example.com"
                value={contactInfo.email}
                onChange={(e) => updateContactInfo('email', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone">Phone Number</label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                value={contactInfo.phone_number}
                onChange={(e) => updateContactInfo('phone_number', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="website">Website (Optional)</label>
            <div className="relative">
              <Globe size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="website"
                placeholder="https://www.yourbusiness.com"
                value={contactInfo.website}
                onChange={(e) => updateContactInfo('website', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Social Media */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Social Media (Optional)</h3>
          <Button type="button" variant="outline" size="sm" onClick={addSocialMedia}>
            <Plus size={16} className="mr-2" />
            Add Social Media
          </Button>
        </div>

        <div className="space-y-3">
          {socialMedia.map((social, index) => (
            <div key={index} className="flex space-x-2">
              <Select value={social.platform} onValueChange={(value) => updateSocialMedia(index, 'platform', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Profile URL"
                value={social.url}
                onChange={(e) => updateSocialMedia(index, 'url', e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSocialMedia(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X size={16} />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Business Hours */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Clock size={20} className="mr-2 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
        </div>

        <div className="space-y-3">
          {contactInfo.business_hours?.map((hours, index) => (
            <div key={hours.day} className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium text-gray-700">
                {hours.day}
              </div>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={!hours.isClosed}
                  onChange={(e) => updateBusinessHours(index, 'isClosed', !e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Open</span>
              </label>

              {!hours.isClosed ? (
                <div className="flex items-center space-x-2">
                  <Input
                    type="time"
                    value={hours.open}
                    onChange={(e) => updateBusinessHours(index, 'open', e.target.value)}
                    className="w-28"
                  />
                  <span className="text-sm text-gray-500">to</span>
                  <Input
                    type="time"
                    value={hours.close}
                    onChange={(e) => updateBusinessHours(index, 'close', e.target.value)}
                    className="w-28"
                  />
                </div>
              ) : (
                <span className="text-sm text-gray-500 italic">Closed</span>
              )}
            </div>
          )) || []}
        </div>
      </Card>

      {/* Special Instructions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Instructions</h3>
        <Textarea
          placeholder="Any special instructions for customers? (e.g., parking information, how to find your location, booking requirements, etc.)"
          value={contactInfo.special_instructions || ''}
          onChange={(e) => updateContactInfo('special_instructions', e.target.value)}
          rows={4}
        />
      </Card>
    </div>
  );
};

export default BusinessContactAndBusiness;