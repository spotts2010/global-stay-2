// src/components/maps/about-map-section.tsx

'use client';

import { Map, AdvancedMarker, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react';
import { FormField, FormItem, FormControl, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MapPin } from '@/lib/icons';
import type { UseFormReturn } from 'react-hook-form';

type Position = { lat: number; lng: number };

export default function AboutMapSection({ form }: { form: UseFormReturn<any> }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  const [markerPosition, setMarkerPosition] = useState<Position | null>(null);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'geometry', 'address_components'],
    });

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      const newPosition = { lat, lng };
      setMarkerPosition(newPosition);

      form.setValue('address.lat', lat, { shouldDirty: true });
      form.setValue('address.lng', lng, { shouldDirty: true });
      form.setValue('location', place.formatted_address || '', {
        shouldDirty: true,
      });
    });

    return () => listener.remove();
  }, [places, form]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input ref={inputRef} defaultValue={field.value} className="pl-10 bg-white" />
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <div className="h-[400px] rounded-lg overflow-hidden border">
        <Map
          mapId="DEMO_MAP_ID"
          defaultCenter={markerPosition || { lat: -26.65, lng: 153.09 }}
          defaultZoom={markerPosition ? 15 : 12}
        >
          {markerPosition && <AdvancedMarker position={markerPosition} />}
        </Map>
      </div>
    </div>
  );
}
