export type Amenity = 'wifi' | 'pool' | 'gym' | 'parking' | 'kitchen';
export type Currency = 'USD' | 'AUD' | 'EUR' | 'GBP';

export type Accommodation = {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: number;
  currency: Currency;
  rating: number;
  reviewsCount: number;
  image: string; // Legacy cover image, will be first item in images array
  images: string[];
  amenities: Amenity[];
  chargeableAmenities?: string[]; // Array of amenity IDs that have fees
  type: 'Apartment' | 'Villa' | 'Hotel' | 'Loft' | 'House' | 'Hostel';
  bookingType: 'room' | 'bed' | 'hybrid';
  imageHint: string;
  lat: number;
  lng: number;
  lastModified: Date;
  status: 'Published' | 'Draft' | 'Archived';
  description?: string;
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
};

export type HeroImage = {
  url: string;
  alt: string;
  hint: string;
};

// --- Example collections for seeding ---
export const collections: Collection[] = [
  {
    id: 'beach_villas',
    title: 'Beach Villas',
    description: 'Luxury villas by the beach',
    image:
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageHint: 'beach chairs ocean',
  },
  {
    id: 'city_apartments',
    title: 'City Apartments',
    description: 'Modern apartments in the city center',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    imageHint: 'modern apartment living room',
  },
  {
    id: 'mountain_retreats',
    title: 'Mountain Retreats',
    description: 'Secluded cabins with stunning views',
    image: 'https://images.unsplash.com/photo-1743794260086-74cf1d82c324',
    imageHint: 'winter cabin night',
  },
  {
    id: 'country_houses',
    title: 'Country Houses',
    description: 'Charming houses in the countryside',
    image: 'https://images.unsplash.com/photo-1560325037-b85138d77884',
    imageHint: 'modern country house',
  },
  {
    id: 'ski_chalets',
    title: 'Ski Chalets',
    description: 'Hit the slopes from these cozy cabins',
    image: 'https://images.unsplash.com/photo-1709508496457-e2f9c42493c6',
    imageHint: 'snowy cabin night',
  },
  {
    id: 'luxury_lofts',
    title: 'Luxury Lofts',
    description: 'Open-plan living in the heart of the city',
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6',
    imageHint: 'loft apartment city',
  },
  {
    id: 'historic_homes',
    title: 'Historic Homes',
    description: 'Properties with classic charm and history',
    image: 'https://images.unsplash.com/photo-1757593596664-282bb7af9bd8',
    imageHint: 'historic manor house',
  },
  {
    id: 'unique_stays',
    title: 'Unique Stays',
    description: 'Unconventional stays, from boats to treehouses',
    image: 'https://images.unsplash.com/photo-1615354310157-c78b1be66eed',
    imageHint: 'glass tiny house',
  },
];
