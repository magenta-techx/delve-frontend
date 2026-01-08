export interface BusinessIntroductionProps {
  business_name?: string;
  about_business?: string;
  website?: string;
}
export interface BusinessShowCaseProps {
  business_id?: number | undefined;
  images?: File[];
}

export interface BusinessAmenitiesTypeProp {
  id: number | null;
  icon_name: string;
  name: string;
}

export interface BusinessAmenity {
  id: number;
  name: string;
  icon_name?: string;
}

// Onboarding Types
export type OnboardingPhase =
  | 'introduction'
  | 'media'
  | 'categories'
  | 'amenities'
  | 'services'
  | 'location'
  | 'contact_and_socials';

export interface BusinessOwner {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_brand_owner: boolean;
  number_of_owned_businesses: number;
  is_active: boolean;
  date_joined: string;
  profile_image: string;
}

export interface BusinessCategory {
  id: number;
  name: string;
  icon_name: string;
  subcategories: BusinessSubcategory[];
}

export interface BusinessSubcategory {
  id: number;
  name: string;
}

export interface BusinessService {
  id: number;
  title: string;
  description: string;
  image: string;
  is_active: boolean;
  uploaded_at: string;
}

export interface SocialLinks {
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
}

export interface PerformanceData {
  id: number;
  date: string;
  formatted_date: string;
  performance_score: number;
}

export interface BusinessHours {
  day: number;
  day_label: string;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
}

export interface BusinessImage {
  id: number;
  image: string; // URL of the image
  uploaded_at: string;
}


export interface OngoingBusinessOnboarding {
  id: number;
  owner: BusinessOwner;
  name: string;
  description: string;
  website?: string;
  address: string;
  state: string;
  thumbnail?: string;
  logo?: string;
  status: string;
  average_review_rating: number;
  category: BusinessCategory;
  subcategories: BusinessSubcategory[];
  amenities: BusinessAmenity[];
  images: BusinessImage[];
  services: BusinessService[];
  phone_number: string;
  email: string;
  registration_number: string;
  social_links: SocialLinks;
  admin_approval_status: string;
  is_active: boolean;
  is_free_trial_active: boolean;
  requesting_approval: boolean;
  free_trial_expires_when: string;
  performance: PerformanceData[];
  last_payment_failed: boolean;
  business_hours: BusinessHours[];
  onboarding_phase: OnboardingPhase;
}

export interface OngoingBusinessOnboardingResponse {
  status: boolean;
  message: string;
  data?: OngoingBusinessOnboarding;
}
