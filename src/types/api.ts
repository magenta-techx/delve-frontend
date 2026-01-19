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
  id?: number | string;
  title: string;
  category: string | { name?: string };
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
  image: string | null;
  is_active?: boolean;
  description?: string;
  uploaded_at?: string;
}

export interface ReviewReplyNode {
  id: number;
  user: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    profile_image?: string;
  };
  content: string;
  added_at: string;
  children: ReviewReplyNode[];
}

export interface BusinessReviewThread {
  reviewer: {
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
  };
  service?: BusinessService | null;
  service_text?: string | null;
  rating: number;
  content: string;
  approved_by_business: boolean;
  added_at: string;
  approved_at?: string | null;
  replies: ReviewReplyNode[];
  id: number;
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

export interface BusinessDashboardDetail {
  id: number;
  name: string;
  description: string;
  website: null;
  logo: string;
  status: string;
  created_at: string;
  approved: boolean;
  is_free_trial_active: boolean;
  free_trial_expires_when: string;
  number_of_conversations: number;
  number_of_reviews: number;
  average_review_rating: number;
  number_of_profile_visits: number;
  performances: Performance[];
  conversations: Conversation[];
  last_payment_failed: boolean;
}

interface Conversation {
  id: number;
  customer: Customer;
  is_pinned: boolean;
  last_message_sent_at: null | string;
  last_message: Lastmessage;
}

interface Lastmessage {
  content: string;
  is_image_message: boolean;
  sender: Sender;
  is_read: boolean;
  is_deleted_by_business: boolean;
  is_deleted_by_customer: boolean;
  id?: number;
  image?: string;
  sent_at?: string;
}

interface Sender {
  first_name: string;
  last_name: string;
  id?: number;
  profile_image?: string;
}

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  profile_image: string;
}

interface Performance {
  id: number;
  created_at: string;
  formatted_date: string;
  performance_score: number;
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
  amenities?: Array<{ id: number; name: string }>;
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
  admin_approval_status: "approved" | "unapproved" | "rejected";
  requesting_approval?: boolean;
  status?: string;
  business_hours: Businesshour[];
  // The detail response in api.md shows performance embedded in example; usually separate
  performance?: Array<{ date: string; performance_score: number }>;
}


interface Businesshour {
  day: number;
  day_label: string;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
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
export interface ReviewReply {
  id: number;
  reply: string;
}
export interface Review {
  id: number;
  rating: number;
  comment: string;
  user: { id: number; username: string };
  replies?: ReviewReply[];
}

export interface BusinessChatListItem {
  id: number;
  customer: Customer;
  is_pinned: boolean;
  last_message_sent_at: null | string;
  last_message: Lastmessage;
}

interface Lastmessage {
  content: string;
  is_image_message: boolean;
  sender: Sender;
  is_read: boolean;
  is_deleted_by_business: boolean;
  is_deleted_by_customer: boolean;
  id?: number;
  image?: string;
  sent_at?: string;
}

interface Sender {
  first_name: string;
  last_name: string;
  id?: number;
  profile_image?: string;
}

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  profile_image: string;
}
export interface ChatListItem {
  chat_id: number;
  last_message?: string;
  updated_at: string;
  business?: string;
}

export interface ChatMessage {
  id: number;
  image: string;
  content: string;
  is_image_message: boolean;
  sender: ChatMessageSender;
  is_read: boolean;
  sent_at: string;
}

interface ChatMessageSender {
  id: number;
  first_name: string;
  last_name: string;
  profile_image: string;
}

export interface CollaborationSummary {
  id: number;
  name: string;
  description: string;
  number_of_members: number;
  owner_id: number;
}

// Events
export interface EventItem {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
}


export type NotificationType =
  | 'review_prompt'
  | 'review_received'
  | 'review_replied'
  | 'profile_views'
  | 'free_trial_enabled'
  | 'free_trial_expiring'
  | 'free_trial_disabled'
  | 'payment_received'
  | 'subscription_created'
  | 'business_created'
  | string;

export interface NotificationItem {
  id?: number;
  type: NotificationType;
  attached_object_id: number;
  is_seen: boolean;
  is_read?: boolean;
  message: string;
  title?: string;
  body?: string;
  created_when: string;
  created_at?: string;
  business?: number;
  user?: number;
}
// Payment
export interface PremiumPlan {
  id: number;
  name: string;
  price: number;
  duration: string; // e.g. "1 month"
}
export interface ChangeCardData {
  url: string;
}

// Ads
export interface ActiveAd {
  id: number;
  image: string;
  business: string;
}

// User Response (doesn't follow ApiEnvelope pattern)
export interface UserResponse {
  status: boolean;
  user: UserDetail;
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
  plan_id: string;
}

export interface BusinessPromotionPlan {
  duration_in_days: number;
  price: number;
  plan_id: string;
}

export interface PlansResponse {
  status: boolean;
  message: string;
  data: SubscriptionPlan[] | AdvertisementPlan[] | BusinessPromotionPlan[];
}

// Saved businesses return the same structure as BusinessSummary

export interface SavedBusinessItem {
  businesses: SavedBusiness[];
  category: Category;
}

interface Category {
  id: number;
  name: string;
  icon_name: string;
  subcategories: Subcategory[];
}

export interface SavedBusiness {
  id: number;
  name: string;
  description: string;
  address: null | null | string;
  average_review_rating: number;
  thumbnail: string;
  logo: string;
  is_promotion_active: boolean;
}

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

export interface CollaborationDetail {
  id: number;
  owner: Owner;
  name: string;
  description: string;
  number_of_members: number;
  created_when: string;
  members: CollabMember[];
  businesses: Business[];
}

interface Business {
  id: number;
  name: string;
  description: string;
  address: null | string;
  average_review_rating: number;
  thumbnail: string;
  logo: string;
  is_promotion_active: boolean;
}

export interface CollabMember {
  id: number;
  member: Owner | null;
  unregistered_user_email: null | string;
  priviledge: string;
  status: string;
  accepted_when: null | string;
}

interface Owner {
  id: number;
  first_name: string;
  last_name: string;
  profile_image: string;
}

