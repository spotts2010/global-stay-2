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

export type Accommodation = {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: number;
  currency: Currency;
  rating: number; // User review rating
  starRating?: number; // Official star rating (e.g., 1-5)
  reviewsCount: number;
  image: string; // Legacy cover image, will be first item in images array
  images: string[];
  amenities: Amenity[];
  chargeableAmenities?: string[]; // Array of amenity IDs that have fees
  type: string; // Now a string to be dynamic
  bookingType: 'room' | 'bed' | 'hybrid';
  imageHint: string;
  lat: number;
  lng: number;
  lastModified: Date;
  status: 'Published' | 'Draft' | 'Archived';
  description?: string;
  paymentTerms?: string;
  cancellationPolicy?: string;
  houseRules?: string;
  units?: BookableUnit[];
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
