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

export const accommodations: Accommodation[] = [
  {
    id: '1',
    name: 'The Oceanfront Pearl',
    location: 'Malibu, California',
    price: 850,
    rating: 4.9,
    reviewsCount: 120,
    image: 'https://placehold.co/600x400.png',
    amenities: ['wifi', 'pool', 'kitchen', 'parking'],
    type: 'Villa',
    lat: 34.0259,
    lng: -118.7798,
    imageHint: 'beachfront villa',
  },
  {
    id: '2',
    name: 'Metropolitan Loft',
    location: 'SoHo, New York',
    price: 450,
    rating: 4.8,
    reviewsCount: 250,
    image: 'https://placehold.co/600x400.png',
    amenities: ['wifi', 'gym', 'kitchen'],
    type: 'Loft',
    lat: 40.7222,
    lng: -74.0002,
    imageHint: 'city loft',
  },
  {
    id: '3',
    name: 'The Grand Royal Hotel',
    location: 'Paris, France',
    price: 600,
    rating: 4.9,
    reviewsCount: 890,
    image: 'https://placehold.co/600x400.png',
    amenities: ['wifi', 'pool', 'gym', 'parking'],
    type: 'Hotel',
    lat: 48.8566,
    lng: 2.3522,
    imageHint: 'luxury hotel',
  },
  {
    id: '4',
    name: 'Cozy City Center Apartment',
    location: 'Kyoto, Japan',
    price: 220,
    rating: 4.7,
    reviewsCount: 310,
    image: 'https://placehold.co/600x400.png',
    amenities: ['wifi', 'kitchen'],
    type: 'Apartment',
    lat: 35.0116,
    lng: 135.7681,
    imageHint: 'modern apartment',
  },
  {
    id: '5',
    name: 'The Mountain Hideaway',
    location: 'Aspen, Colorado',
    price: 1200,
    rating: 5.0,
    reviewsCount: 85,
    image: 'https://placehold.co/600x400.png',
    amenities: ['wifi', 'pool', 'gym', 'parking', 'kitchen'],
    type: 'Villa',
    lat: 39.1911,
    lng: -106.8175,
    imageHint: 'mountain cabin',
  },
  {
    id: '6',
    name: 'Rooftop Garden Oasis',
    location: 'Singapore',
    price: 380,
    rating: 4.8,
    reviewsCount: 420,
    image: 'https://placehold.co/600x400.png',
    amenities: ['wifi', 'pool', 'gym'],
    type: 'Apartment',
    lat: 1.3521,
    lng: 103.8198,
    imageHint: 'rooftop garden',
  },
  {
    id: '7',
    name: 'Historic Townhouse',
    location: 'Rome, Italy',
    price: 320,
    rating: 4.6,
    reviewsCount: 180,
    image: 'https://placehold.co/600x400.png',
    amenities: ['wifi', 'kitchen'],
    type: 'House',
    lat: 41.9028,
    lng: 12.4964,
    imageHint: 'historic building',
  },
  {
    id: '8',
    name: 'Lakeside Serenity',
    location: 'Lake Como, Italy',
    price: 950,
    rating: 4.9,
    reviewsCount: 95,
    image: 'https://placehold.co/600x400.png',
    amenities: ['wifi', 'pool', 'kitchen', 'parking'],
    type: 'Villa',
    lat: 45.9754,
    lng: 9.2497,
    imageHint: 'lake house',
  },
];

export const collections: Collection[] = [
  {
    id: 'col-1',
    title: 'Beachfront Escapes',
    description: 'Sun, sand, and sea at your doorstep.',
    image: 'https://placehold.co/600x800.png',
    imageHint: 'tropical beach',
  },
  {
    id: 'col-2',
    title: 'Urban Lofts',
    description: 'Stay in the heart of the city.',
    image: 'https://placehold.co/600x800.png',
    imageHint: 'city skyline',
  },
  {
    id: 'col-3',
    title: 'Mountain Retreats',
    description: 'Find peace and quiet in the mountains.',
    image: 'https://placehold.co/600x800.png',
    imageHint: 'snowy mountains',
  },
  {
    id: 'col-4',
    title: 'Luxury Villas',
    description: 'Indulge in the finest accommodations.',
    image: 'https://placehold.co/600x800.png',
    imageHint: 'luxury pool',
  },
];
