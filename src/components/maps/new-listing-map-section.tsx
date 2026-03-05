// src/components/maps/new-listing-map-section.tsx

'use client';

import { Map, AdvancedMarker, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin } from '@/lib/icons';

type Position = { lat: number; lng: number };

export function formatPlaceResult(place: google.maps.places.PlaceResult) {
  if (!place.address_components) {
    return { formatted: place.formatted_address || '' };
  }

  const getComponent = (type: string, prop: 'long_name' | 'short_name' = 'long_name') => {
    const component = place.address_components?.find((c) => c.types.includes(type));
    return component ? component[prop] : '';
  };

  const structured = {
    formatted: place.formatted_address || '',
    streetNumber: getComponent('street_number'),
    street: getComponent('route'),
    suburb: getComponent('sublocality') || getComponent('neighborhood'),
    city: getComponent('locality'),
    county: getComponent('administrative_area_level_2'),
    state: {
      short: getComponent('administrative_area_level_1', 'short_name'),
      long: getComponent('administrative_area_level_1', 'long_name'),
    },
    country: {
      short: getComponent('country', 'short_name'),
      long: getComponent('country', 'long_name'),
    },
    postcode: getComponent('postal_code'),
    lat: place.geometry?.location?.lat(),
    lng: place.geometry?.location?.lng(),
  };

  const searchIndex = [
    structured.streetNumber,
    structured.street,
    structured.suburb,
    structured.city,
    structured.county,
    structured.state?.short,
    structured.state?.long,
    structured.postcode,
    structured.country?.long,
    structured.country?.short,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return { ...structured, searchIndex };
}

export function AddressAutocomplete({
  initialValue,
  onPlaceSelected,
}: {
  initialValue: string;
  onPlaceSelected: (place: google.maps.places.PlaceResult | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types', 'address_components'],
    });

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      onPlaceSelected(place ?? null);
    });

    return () => listener.remove();
  }, [places, onPlaceSelected]);

  return (
    <div className="relative w-full">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Input
        ref={inputRef}
        defaultValue={initialValue}
        className="pl-10 bg-white"
        placeholder="Search for an address"
      />
    </div>
  );
}

export function MapView({
  markerPosition,
  mapKey,
  onMarkerDragEnd,
}: {
  markerPosition: Position | null;
  mapKey: number;
  onMarkerDragEnd: (e: google.maps.MapMouseEvent) => void;
}) {
  return (
    <div style={{ height: '400px', width: '100%' }} className="rounded-lg overflow-hidden border">
      <Map
        key={mapKey}
        mapId="DEMO_MAP_ID"
        style={{ width: '100%', height: '100%' }}
        defaultCenter={markerPosition || { lat: -26.65, lng: 153.09 }}
        defaultZoom={markerPosition ? 15 : 12}
        gestureHandling="auto"
        disableDefaultUI={false}
      >
        {markerPosition && (
          <AdvancedMarker position={markerPosition} draggable onDragEnd={onMarkerDragEnd} />
        )}
      </Map>
    </div>
  );
}
