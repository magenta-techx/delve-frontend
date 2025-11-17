// Example usage of the revamped plans API hooks

import React from 'react';
import { 
  useAvailablePlans, 
  useSubscriptionPlans, 
  useAdvertisementPlans, 
  useBusinessPromotionPlans 
} from '@/app/(clients)/misc/api/user';

const PlansExampleComponent = () => {
  // Method 1: Generic hook with plan type parameter
  const { data: subscriptionPlansGeneric, isLoading: loadingGeneric } = useAvailablePlans('subscription');
  const { data: advertisementPlansGeneric } = useAvailablePlans('advertisment');
  const { data: businessPromotionPlansGeneric } = useAvailablePlans('business promotion');

  // Method 2: Typed specific hooks (recommended for type safety)
  const { data: subscriptionPlans, isLoading: loadingSubscription, error: subscriptionError } = useSubscriptionPlans();
  const { data: advertisementPlans, isLoading: loadingAds } = useAdvertisementPlans();
  const { data: businessPromotionPlans, isLoading: loadingPromotion } = useBusinessPromotionPlans();

  if (loadingSubscription || loadingAds || loadingPromotion) {
    return <div>Loading plans...</div>;
  }

  if (subscriptionError) {
    return <div>Error loading plans: {subscriptionError.message}</div>;
  }

  return (
    <div className="space-y-8 p-6">
      {/* Subscription Plans */}
      <section>
        <h2 className="text-xl font-bold mb-4">Subscription Plans</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {subscriptionPlans?.data?.map((plan) => (
            <div key={plan.plan_id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{plan.name}</h3>
              <p className="text-2xl font-bold">₦{plan.price.toLocaleString()}</p>
              <p className="text-sm text-gray-600">{plan.billing_cycle}</p>
              <p className="text-xs text-gray-500">Plan ID: {plan.plan_id}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Advertisement Plans */}
      <section>
        <h2 className="text-xl font-bold mb-4">Advertisement Plans</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {advertisementPlans?.data?.map((plan, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-semibold">{plan.duration_in_days} Days</h3>
              <p className="text-2xl font-bold">₦{plan.price.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Advertisement duration</p>
            </div>
          ))}
        </div>
      </section>

      {/* Business Promotion Plans */}
      <section>
        <h2 className="text-xl font-bold mb-4">Business Promotion Plans</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {businessPromotionPlans?.data?.map((plan, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-semibold">{plan.duration_in_days} Day{plan.duration_in_days !== 1 ? 's' : ''}</h3>
              <p className="text-2xl font-bold">₦{plan.price.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Promotion duration</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PlansExampleComponent;

/* 
API Response Examples:

Subscription Plans Response:
{
  "status": true,
  "message": "Premium plans retrieved successfully", 
  "data": [
    {
      "plan_id": "PLN_xrwnfqi11xr77he",
      "name": "Premium",
      "price": 54000,
      "billing_cycle": "yearly"
    },
    {
      "plan_id": "PLN_it4lrvfb8zr8bsa", 
      "name": "Premium",
      "price": 5000,
      "billing_cycle": "monthly"
    }
  ]
}

Advertisement Plans Response:
{
  "status": true,
  "message": "Premium plans retrieved successfully",
  "data": [
    { "duration_in_days": 7, "price": 50000 },
    { "duration_in_days": 14, "price": 100000 },
    { "duration_in_days": 30, "price": 250000 }
  ]
}

Business Promotion Plans Response:
{
  "status": true, 
  "message": "Premium plans retrieved successfully",
  "data": [
    { "duration_in_days": 1, "price": 800 },
    { "duration_in_days": 7, "price": 5600 },
    { "duration_in_days": 14, "price": 10500 },
    { "duration_in_days": 30, "price": 30000 }
  ]
}
*/