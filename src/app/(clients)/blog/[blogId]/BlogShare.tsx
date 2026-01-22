'use client';

import React from 'react';
import { toast } from 'sonner';
import { BaseIcons, type IconsType } from '@/assets/icons/base/Icons';

interface BlogShareProps {
  blogTitle: string;
  blogExcerpt?: string;
  blogUrl: string;
  blogImage?: string;
}

interface ShareLink {
  icon: IconsType;
  label: string;
  onClick: () => void;
}

export const BlogShare: React.FC<BlogShareProps> = ({
  blogTitle,
  blogExcerpt,
  blogUrl,
}) => {
  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(blogUrl);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  // Share to Facebook
  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  // Share to Twitter/X
  const shareToTwitter = () => {
    const text = encodeURIComponent(`${blogTitle}\n\n${blogExcerpt || ''}`);
    const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(blogUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  // Share to WhatsApp
  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${blogTitle}\n\n${blogExcerpt || ''}\n\n${blogUrl}`);
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  // Share to Telegram
  const shareToTelegram = () => {
    const text = encodeURIComponent(`${blogTitle}\n\n${blogExcerpt || ''}`);
    const url = `https://t.me/share/url?url=${encodeURIComponent(blogUrl)}&text=${text}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  // Share to LinkedIn
  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareLinks: ShareLink[] = [
    { 
      icon: 'facebook-outlined-black', 
      label: 'Share on Facebook',
      onClick: shareToFacebook 
    },
    { 
      icon: 'linkedin-outlined-black', 
      label: 'Share on LinkedIn',
      onClick: shareToLinkedIn 
    },
    { 
      icon: 'whatsapp-outlined-black', 
      label: 'Share on WhatsApp',
      onClick: shareToWhatsApp 
    },
    { 
      icon: 'telegram-outlined-black', 
      label: 'Share on Telegram',
      onClick: shareToTelegram 
    },
    { 
      icon: 'x-outlined-black', 
      label: 'Share on X',
      onClick: shareToTwitter 
    },
  ];

  return (
    <div className='flex flex-col gap-3'>
      <p className='text-xs font-semibold uppercase tracking-[0.08em] text-[#101828]'>
        Share
      </p>
      <div className='flex items-center gap-3'>
        {shareLinks.map(item => (
          <button
            key={item.icon}
            onClick={item.onClick}
            aria-label={item.label}
            className='flex h-9 w-9 items-center justify-center rounded-full border border-[#E4E7EC] transition hover:border-[#101828] hover:bg-gray-50 hover:text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#101828] focus:ring-offset-2'
            type='button'
          >
            <BaseIcons value={item.icon} />
          </button>
        ))}
      </div>
      
      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className='mt-2 flex items-center justify-center gap-2 rounded-lg border border-[#E4E7EC] bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#101828] focus:ring-offset-2'
        type='button'
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path
            d="M8.33333 10.8333C8.69167 11.3118 9.14718 11.7076 9.67116 11.9939C10.1951 12.2801 10.7764 12.4499 11.3717 12.4916C11.967 12.5333 12.5641 12.4459 13.1232 12.2353C13.6822 12.0246 14.1904 11.6955 14.6167 11.2692L17.1167 8.76917C17.8758 7.98755 18.2958 6.94071 18.2863 5.85318C18.2768 4.76565 17.8386 3.72616 17.0661 2.9578C16.2935 2.18944 15.2508 1.75788 14.1633 1.75503C13.0757 1.75219 12.0309 2.17826 11.2542 2.94251L9.79167 4.39751"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.6667 9.16667C11.3083 8.68818 10.8528 8.29236 10.3288 8.00614C9.80489 7.71991 9.22361 7.55007 8.62831 7.50835C8.03301 7.46663 7.43592 7.55407 6.87686 7.76471C6.31781 7.97535 5.80963 8.30448 5.38333 8.73084L2.88333 11.2308C2.12419 12.0125 1.70423 13.0593 1.71369 14.1468C1.72315 15.2344 2.16136 16.2739 2.93391 17.0422C3.70647 17.8106 4.74916 18.2421 5.83669 18.245C6.92423 18.2478 7.96906 17.8218 8.74583 17.0575L10.2 15.6025"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Copy Link
      </button>
    </div>
  );
};