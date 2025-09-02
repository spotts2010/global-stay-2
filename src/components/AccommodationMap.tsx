'use client';

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import type { Accommodation } from '@/lib/data';

type AccommodationMapProps = {
  accommodations: Accommodation[];
};

export default function AccommodationMap({ accommodations }: AccommodationMapProps) {
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <p className="text-destructive">Google Maps API key is missing.</p>
      </div>
    );
  }

  // Calculate center of map
  const center =
    accommodations.length > 0
      ? {
          lat: accommodations.reduce((sum, acc) => sum + acc.lat, 0) / accommodations.length,
          lng: accommodations.reduce((sum, acc) => sum + acc.lng, 0) / accommodations.length,
        }
      : { lat: 34.0522, lng: -118.2437 }; // Default to Los Angeles if no accommodations

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_FIREBASE_API_KEY}>
      <Map
        mapId="global_stay_map"
        defaultCenter={center}
        defaultZoom={accommodations.length > 1 ? 4 : 10}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        className="w-full h-full"
      >
        {accommodations.map((acc) => (
          <AdvancedMarker key={acc.id} position={{ lat: acc.lat, lng: acc.lng }} title={acc.name} />
        ))}
      </Map>
    </APIProvider>
  );
}
