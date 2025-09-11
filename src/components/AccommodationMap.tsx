'use client';

import { Map, AdvancedMarker, APIProvider } from '@vis.gl/react-google-maps';
import type { Accommodation } from '@/lib/data';
import { useEffect, useState } from 'react';

type AccommodationMapProps = {
  accommodations: Accommodation[];
  apiKey: string;
};

const popularDestinations = [
  { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
  { name: 'Dubai, UAE', lat: 25.276987, lng: 55.296249 },
  { name: 'Madrid, Spain', lat: 40.416775, lng: -3.70379 },
  { name: 'Tokyo, Japan', lat: 35.689487, lng: 139.691711 },
  { name: 'Amsterdam, Netherlands', lat: 52.377956, lng: 4.89707 },
  { name: 'Berlin, Germany', lat: 52.520008, lng: 13.404954 },
  { name: 'Rome, Italy', lat: 41.902782, lng: 12.496366 },
  { name: 'New York, USA', lat: 40.7128, lng: -74.006 },
  { name: 'Barcelona, Spain', lat: 41.3851, lng: 2.1734 },
  { name: 'London, UK', lat: 51.5072, lng: -0.1276 },
];

export default function AccommodationMap({ accommodations, apiKey }: AccommodationMapProps) {
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.006 }); // Default to New York

  useEffect(() => {
    // Select a random popular destination on component mount
    const randomDestination =
      popularDestinations[Math.floor(Math.random() * popularDestinations.length)];
    setCenter({ lat: randomDestination.lat, lng: randomDestination.lng });
  }, []);

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <p className="text-destructive">Google Maps API Key is missing.</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full h-full">
        <Map
          mapId="global_stay_map"
          center={center}
          defaultZoom={10}
          gestureHandling={'greedy'}
          className="w-full h-full"
        >
          {accommodations.map((acc) => (
            <AdvancedMarker
              key={acc.id}
              position={{ lat: acc.lat, lng: acc.lng }}
              title={acc.name}
            />
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}
