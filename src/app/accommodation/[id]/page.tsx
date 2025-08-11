import Image from 'next/image';
import { Star, MapPin, Wifi, Car, Utensils, Award, Users } from 'lucide-react';

import { accommodations } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PhotoGallery from '@/components/PhotoGallery';
import AmenityIcon from '@/components/AmenityIcon';
import ReviewCard from '@/components/ReviewCard';
import { Separator } from '@/components/ui/separator';

export default function AccommodationDetailPage({ params }: { params: { id: string } }) {
  // TODO: Replace with a dynamic fetch from Firestore using the provided ID
  const accommodation = accommodations.find(acc => acc.id === params.id);

  if (!accommodation) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 text-center">
        <h1 className="font-headline text-2xl font-bold">Accommodation not found</h1>
        <p className="text-muted-foreground mt-2">The listing you are looking for does not exist or has been moved.</p>
      </div>
    );
  }

  // TODO: Replace with dynamic reviews from Firestore
  const reviews = [
    { id: 'r1', author: 'Jane Doe', rating: 5, comment: "Absolutely stunning villa with breathtaking views. The pool was amazing and the host was very accommodating. Can't wait to come back!" },
    { id: 'r2', author: 'John Smith', rating: 4, comment: "Great location and very clean. The apartment had everything we needed for a comfortable stay in the city." },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <PhotoGallery
        images={[
          accommodation.image,
          'https://placehold.co/600x400.png',
          'https://placehold.co/600x400.png',
          'https://placehold.co/600x400.png',
          'https://placehold.co/600x400.png',
        ]}
        imageHints={[accommodation.imageHint, 'living room', 'bedroom', 'bathroom', 'exterior']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mt-8">
        <div className="lg:col-span-2">
          {/* Header Section */}
          <div className="pb-4 border-b">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">{accommodation.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{accommodation.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>{accommodation.rating} ({accommodation.reviewsCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>{accommodation.type}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Amenities Section */}
          <div>
            <h2 className="font-headline text-2xl font-bold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {accommodation.amenities.map(amenity => (
                <div key={amenity} className="flex items-center gap-3">
                  <AmenityIcon amenity={amenity} />
                  <span className="capitalize">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Reviews Section */}
          <div>
            <h2 className="font-headline text-2xl font-bold mb-4">Reviews</h2>
            <div className="space-y-6">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>

        {/* Booking Card Section */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-primary">${accommodation.price}</span>
                <span className="text-muted-foreground">/ night</span>
              </div>
              <Button className="w-full text-lg" size="lg">Book Now</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
