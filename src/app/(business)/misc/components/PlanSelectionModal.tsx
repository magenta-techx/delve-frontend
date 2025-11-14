import { useState } from 'react';
import { Button } from '@/components/ui';
import { FullScreenModal } from '@/components/ui/FullScreenModal';

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlanSelectionModal({ isOpen, onClose }: PlanSelectionModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>(
    'annually'
  );

  const planFeatures = [
    { label: 'Business Profile Visibility', free: 'Limited visibility in search results', premium: 'Priority Placement in search' },
    { label: 'Listing Duration', free: 'Indefinite', premium: 'Indefinite' },
    { label: 'Listing Features', free: 'Limited', premium: 'Available' },
    { label: 'Photo Uploads', free: 'Limited to 1-6 images', premium: 'Up to 20 uploads' },
    { label: 'Verification Badge', free: 'No badge', premium: 'Verification Badge' },
    { label: 'Analytics Dashboard', free: 'Not available', premium: 'Access all insights on visits, clicks etc' },
    { label: 'Customer Save to Fav Access', free: 'Can be saved by up to 50 users', premium: 'No save limit' },
    { label: 'Customer Review', free: 'View only', premium: 'Actively collect and respond to reviews' },
    { label: 'Support and Business Cons.', free: 'Email only', premium: '24/7 Priority Chat Support' },
  ];

  return (
    <FullScreenModal isOpen={isOpen} onClose={onClose} closeButtonPosition="top-right">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-600" />
              <div className="w-3 h-3 rounded-full bg-purple-400" />
              <div className="w-3 h-3 rounded-full bg-purple-300" />
              <div className="w-3 h-3 rounded-full bg-orange-400" />
            </div>
            <span className="font-bold text-xl">delve</span>
          </div>

          <h1 className="text-3xl font-bold text-center mb-6">
            Select business plan to continue
          </h1>

          {/* Billing cycle toggle */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annually')}
              className={`px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
                billingCycle === 'annually'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Annually
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                10% off
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold bg-gray-50">Feature/Benefit</th>
                <th className="text-center p-4 font-semibold bg-gray-50">Freemium Listing</th>
                <th className="text-center p-4 font-semibold bg-purple-600 text-white">
                  Premium Listing (₦{billingCycle === 'monthly' ? '5,000/monthly' : '54,000/yearly'})
                </th>
              </tr>
            </thead>
            <tbody>
              {planFeatures.map((feature, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-4 font-medium text-sm">{feature.label}</td>
                  <td className="p-4 text-center text-sm text-gray-600">{feature.free}</td>
                  <td className="p-4 text-center text-sm bg-purple-50">{feature.premium}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t">
                <td className="p-4"></td>
                <td className="p-4 text-center">
                  <Button 
                    variant="outline" 
                    className="w-full max-w-xs"
                    disabled
                  >
                    Current Plan
                  </Button>
                </td>
                <td className="p-4 text-center bg-purple-50">
                  <Button 
                    className="w-full max-w-xs bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => {
                      // Handle subscription logic here
                      onClose();
                    }}
                  >
                    Subscribe to Premium
                  </Button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </FullScreenModal>
  );
}
