// src/components/maps/new-listing-map-boundary.tsx
'use client';

import { Map, AdvancedMarker, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin } from '@/lib/icons';

type Position = { lat: number; lng: number };

export default function NewListingMapBoundary({
  initialValue,
  markerPosition,
  mapKey,
  onPlaceSelected,
  onMarkerDragEnd,
}: {
  initialValue: string;
  markerPosition: Position | null;
  mapKey: number;
  onPlaceSelected: (place: google.maps.places.PlaceResult | null) => void;
  onMarkerDragEnd: (e: google.maps.MapMouseEvent) => void;
}) {
  const places = useMapsLibrary('places');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types', 'address_components'],
    });

    const listener = autocomplete.addListener('place_changed', () => {
      onPlaceSelected(autocomplete.getPlace() ?? null);
    });

    return () => listener.remove();
  }, [places, onPlaceSelected]);

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <Input
          ref={inputRef}
          defaultValue={initialValue}
          className="pl-10 bg-white"
          placeholder="Search for an address"
          onChange={(e) => {
            if (!e.target.value) onPlaceSelected(null);
          }}
        />
      </div>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Map View</div>

        <div
          style={{ height: '400px', width: '100%' }}
          className="rounded-lg overflow-hidden border"
        >
          <Map
            key={mapKey}
            mapId="DEMO_MAP_ID"
            style={{ width: '100%', height: '100%' }}
            defaultCenter={markerPosition || { lat: -25.2744, lng: 133.7751 }}
            defaultZoom={markerPosition ? 15 : 4}
            gestureHandling="auto"
            disableDefaultUI={false}
          >
            {markerPosition && (
              <AdvancedMarker position={markerPosition} draggable onDragEnd={onMarkerDragEnd} />
            )}
          </Map>
        </div>
      </div>
    </div>
  );
}
