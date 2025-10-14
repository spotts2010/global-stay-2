import { BookableUnit } from '@/components/UnitsPageClient';

export type Amenity = 'wifi' | 'pool' | 'gym' | 'parking' | 'kitchen';
export type Currency = 'USD' | 'AUD' | 'EUR' | 'GBP';

export type PoiCategory =
  | 'Dining'
  | 'Food & Drink'
  | 'Nature & Outdoors'
  | 'Attractions & Entertainment'
  | 'Medical & Emergency'
  | 'Shopping & Retail'
  | 'Transport & Fuel'
  | 'Activities & Tours'
  | 'Business & Services'
  | 'Beauty & Wellbeing'
  | 'Unassigned';

export type PoiSource = 'Host' | 'API';

export type Place = {
  id: string;
  name: string;
  address: string;
  category: PoiCategory;
  source: PoiSource;
  visible: boolean;
  distance?: number;
  lat?: number;
  lng?: number;
  isNew?: boolean;
};

export type PropertyType = {
  id: string;
  name: string;
};

export type LegalPage = {
  id: 'terms-and-conditions' | 'privacy-policy';
  content: string;
  version: number;
  lastModified: Date;
  versionNote?: string;
};

export type AmenityOrInclusion = {
  id: string;
  label: string;
  systemTag: string;
  category: string;
  isShared?: boolean;
  isPrivate?: boolean;
};

export type Address = {
  formatted: string;
  streetNumber?: string;
  street?: string;
  suburb?: string;
  city?: string;
  county?: string;
  state?: {
    short: string;
    long: string;
  };
  country?: {
    short: string;
    long: string;
  };
  postcode?: string;
  lat?: number;
  lng?: number;
  searchIndex?: string;
};

export type Accommodation = {
  id: string;
  slug: string;
  name: string;
  address: Address;
  price: number; // This will be dynamically calculated from units
  currency: Currency;
  rating: number; // User review rating
  starRating?: number; // Official star rating (e.g., 1-5)
  reviewsCount: number;
  image: string; // Legacy cover image, will be first item in images array
  images: string[];
  amenities: string[];
  chargeableAmenities?: string[];
  type: string;
  bookingType: 'room' | 'bed' | 'hybrid';
  imageHint: string;
  lastModified: Date;
  status: 'Published' | 'Draft' | 'Archived';
  description?: string;
  paymentTerms?: string;
  cancellationPolicy?: string;
  houseRules?: string;
  units?: BookableUnit[];
  unitsCount?: number;
  maxGuests?: number;

  // Deprecated fields (will be removed in a future migration)
  city?: string;
  state?: string;
  country?: string;
  lat?: number;
  lng?: number;
  location?: string;
};

export type Booking = {
  id: string;
  accommodationId?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  guests?: number;
  totalPrice?: number;
};

export type EnrichedBooking = Booking & {
  accommodation?: Accommodation;
};

export type Collection = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageHint: string;
};

export type BedType = {
  id: string;
  name: string;
  systemId: string;
  sleeps: number | null;
};

export type HeroImage = {
  url: string;
  alt: string;
  hint: string;
};

// Re-exporting for use in client-side firestore.ts
export type { BookableUnit };
