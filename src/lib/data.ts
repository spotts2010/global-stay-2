import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

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
  lat: number;
  lng: number;
  imageHint: string;
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
    image: '/images/beach-villa.jpg',
    imageHint: 'beach villa front view',
  },
  {
    id: 'city_apartments',
    title: 'City Apartments',
    description: 'Modern apartments in the city center',
    image: '/images/city-apartment.jpg',
    imageHint: 'city apartment interior',
  },
];
