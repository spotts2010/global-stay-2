// src/components/pois/places-autocomplete.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

import { Input } from '@/components/ui/input';
import { MapPin } from '@/lib/icons';

export default function PlacesAutocomplete({
  onPlaceSelected,
}: {
  onPlaceSelected: (place: google.maps.places.PlaceResult | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const ac = new places.Autocomplete(inputRef.current, {
      fields: [
        'place_id',
        'name',
        'formatted_address',
        'geometry.location',
        'types',
        'address_components',
      ],
    });

    const listener = ac.addListener('place_changed', () => {
      onPlaceSelected(ac.getPlace());
    });

    return () => listener.remove();
  }, [places, onPlaceSelected]);

  return (
    <div className="relative w-full">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Input
        ref={inputRef}
        className="pl-10 bg-white"
        placeholder="Search for a place on Google Maps..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault();
        }}
        onChange={(e) => {
          if (!e.target.value) onPlaceSelected(null);
        }}
      />
    </div>
  );
}
