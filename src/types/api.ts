// Typed API envelopes and endpoint-specific types derived from api.md

export type ApiEnvelope<T = unknown> = {
  status: boolean;
  message?: string;
  data: T;
};

export type PaginatedResponse<T = unknown> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiEnvelope<T>;
};

export type ApiMessage = {
  status: boolean;
  message: string;
};

// Blogs
export interface Blog {
  title: string;
  category: string;
  content: string;
  created_at: string; // e.g. "2025-08-24"
  thumbnail: string;
}

// Business
export interface BusinessSummary {
  id: number;
  name: string;
  description?: string;
  address?: string;
  thumbnail?: string;
  logo?: string;
  average_review_rating?: number;
}

export interface BusinessOwnerMini {
  id: number;
  email: string;
}

export interface CategoryMini {
  id: number;
  name: string;
  icon_name?: string;
  subcategories?: Array<{ id: number; name: string }>;
}

export interface BusinessService {
  id?: number;
  title: string;
  image:string  | null;
  is_active?: boolean;
  description?: string;
  uploaded_at?: string;
}

export interface BusinessOwner {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  is_brand_owner?: boolean;
  number_of_owned_businesses?: number;
  is_active?: boolean;
  current_plan?: string;
  is_premium_plan_active?: boolean;
  date_joined?: string;
  profile_image?: string;
}

export interface BusinessDetail {
  id: number;
  name: string;
  description?: string;
  website?: string;
  thumbnail?: string;
  logo?: string;
  video_url?: string;
  address?: string;
  state?: string;
  owner?: BusinessOwner;
  category?: CategoryMini;
  subcategories?: Array<{ id: number; name: string }>;
  amenities?: Array<{ id: number; name: string } | string>;
  images?: Array<{ id: number; image: string } | string>;
  services?: BusinessService[];
  created_at?: string;
  phone_number?: string;
  email?: string;
  registration_number?: string;
  whatsapp_link?: string;
  facebook_link?: string;
  average_review_rating?: number;
  instagram_link?: string;
  twitter_link?: string;
  tiktok_link?: string;
  approved?: boolean;
  requesting_approval?: boolean;
  status?: string;
  // The detail response in api.md shows performance embedded in example; usually separate
  performance?: Array<{ date: string; performance_score: number }>; 
}

// Business performance
export interface PerformanceTotals {
  total_conversations?: number;
  total_reviews?: number;
  total_profile_visits?: number;
  total_saved_by_users?: number;
}
export interface PerformancePoint {
  created_at: string; // e.g. "01 Sep"
  value: number;
}
export interface BusinessPerformanceData {
  totals?: PerformanceTotals;
  graph: PerformancePoint[];
}

// Reviews
export interface ReviewReply { id: number; reply: string }
export interface Review {
  id: number;
  rating: number;
  comment: string;
  user: { id: number; username: string };
  replies?: ReviewReply[];
}

// Chats
export interface ChatListItem {
  chat_id: number;
  last_message?: string;
  updated_at: string;
  business?: string; // present on user chat list
}

export interface ChatMessage {
  sender: string; // "user" | "business"
  message?: string;
  timestamp: string;
  // images messages may have different shape on ws; REST returns normalized list
}

// Collaboration (hooks pending; add minimal types)
export interface CollaborationSummary {
  id: number;
  name: string;
  members?: number;
}

// Events
export interface EventItem {
  id: number;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  location: string;
}

// Notifications
export interface NotificationItem {
  id: number;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

// Payment
export interface PremiumPlan {
  id: number;
  name: string;
  price: number;
  duration: string; // e.g. "1 month"
}
export interface ChangeCardData { url: string }

// Ads
export interface ActiveAd {
  id: number;
  image: string;
  business: string;
}

// User
export interface UserDetail {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_brand_owner: boolean;
  number_of_owned_businesses: number;
  is_active: boolean;
  current_plan: string;
  is_premium_plan_active: boolean;
  date_joined: string;
  profile_image?: string;
  is_verified?: boolean;
}

export interface PaymentHistory {
  plan: {
    name: string;
    billing_cycle: string;
  };
  amount_paid: number;
  status: string;
  payment_card_last_4_digits: string;
  transaction_method: string;
  payment_reference_id: string;
  timestamp: string;
}

export interface PaymentCard {
  payment_card_type: string;
  payment_card_last_4_digits: string;
  payment_card_expiratin_month: string;
  payment_card_expiratin_year: string;
}

export interface CurrentPlan {
  name: string;
  billing_cycle: string;
  price: number;
  days_left: number;
}

export interface BillingData {
  payment_history: PaymentHistory[];
  card: PaymentCard;
  plan: CurrentPlan;
}

// Plans
export interface SubscriptionPlan {
  plan_id: string;
  name: string;
  price: number;
  billing_cycle: string;
}

export interface AdvertisementPlan {
  duration_in_days: number;
  price: number;
}

export interface BusinessPromotionPlan {
  duration_in_days: number;
  price: number;
}

export interface PlansResponse {
  subscription?: {
    status: boolean;
    message: string;
    data: SubscriptionPlan[];
  };
  advertisment?: {
    status: boolean;
    message: string;
    data: AdvertisementPlan[];
  };
  "business promotion"?: {
    status: boolean;
    message: string;
    data: BusinessPromotionPlan[];
  };
}

// Saved businesses return the same structure as BusinessSummary
export type SavedBusinessItem = BusinessSummary;

// Metadata: amenities, categories, subcategories, states
export interface Amenity {
  id: number;
  name: string;
}

export interface Subcategory {
  id: number;
  name: string;
  category?: string; // present in subcategories listing response
}

export interface CategoryFull {
  id: number;
  name: string;
  subcategories?: Subcategory[];
}

export interface StateItem {
  name: string;
}

// Collaboration
export interface CollaborationMember {
  id: number;
  role: string; // admin/editor etc.
}

export interface CollaborationDetail {
  id: number;
  name: string;
  members: CollaborationMember[];
}
