'use client';

import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import type { Accommodation } from '@/lib/data';
import { useEffect, useState } from 'react';

type AccommodationMapProps = {
  accommodations: Accommodation[];
};

export default function AccommodationMap({ accommodations }: AccommodationMapProps) {
  const [center, setCenter] = useState({ lat: 34.0522, lng: -118.2437 }); // Default to Los Angeles

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Error or permission denied, use the default or averaged center
          if (accommodations.length > 0) {
            const avgLat =
              accommodations.reduce((sum, acc) => sum + acc.lat, 0) / accommodations.length;
            const avgLng =
              accommodations.reduce((sum, acc) => sum + acc.lng, 0) / accommodations.length;
            setCenter({ lat: avgLat, lng: avgLng });
          }
        }
      );
    }
  }, [accommodations]);

  return (
    <div className="w-full h-full">
      <Map
        mapId="global_stay_map"
        center={center}
        defaultZoom={10}
        gestureHandling={'greedy'}
        className="w-full h-full"
      >
        {accommodations.map((acc) => (
          <AdvancedMarker key={acc.id} position={{ lat: acc.lat, lng: acc.lng }} title={acc.name} />
        ))}
      </Map>
    </div>
  );
}
