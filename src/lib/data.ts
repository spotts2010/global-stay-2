export type Amenity = 'wifi' | 'pool' | 'gym' | 'parking' | 'kitchen';

export type Accommodation = {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  amenities: Amenity[];
  type: 'Apartment' | 'Villa' | 'Hotel' | 'Loft' | 'House';
  imageHint: string;
  lat: number;
  lng: number;
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
];
