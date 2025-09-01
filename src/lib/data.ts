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
    image: 'https://placehold.co/400x533.png',
    imageHint: 'beach villa front view',
  },
  {
    id: 'city_apartments',
    title: 'City Apartments',
    description: 'Modern apartments in the city center',
    image: 'https://placehold.co/400x533.png',
    imageHint: 'city apartment interior',
  },
  {
    id: 'mountain_retreats',
    title: 'Mountain Retreats',
    description: 'Secluded cabins with stunning views',
    image: 'https://placehold.co/400x533.png',
    imageHint: 'mountain cabin exterior',
  },
  {
    id: 'country_houses',
    title: 'Country Houses',
    description: 'Charming houses in the countryside',
    image: 'https://placehold.co/400x533.png',
    imageHint: 'countryside house garden',
  },
];
