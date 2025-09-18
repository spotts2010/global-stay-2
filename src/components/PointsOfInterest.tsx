'use client';

import * as React from 'react';
import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Trash2,
  PlusCircle,
  Search,
  Edit,
  Filter,
  Repeat,
  ArrowUp,
  ArrowDown,
  Loader2,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

export type Place = {
  id: string;
  name: string;
  address: string;
  category: string[];
  distance?: number;
  geometry?: google.maps.places.Place['location'];
  lat?: number;
  lng?: number;
};

type SortKey = 'name' | 'distance';
type SortDirection = 'asc' | 'desc';

const AutocompleteInput = ({ onPlaceChange }: { onPlaceChange: (place: Place | null) => void }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const placeAutocompleteRef = React.useRef<HTMLElement & { place: google.maps.places.Place }>(
    null
  );

  React.useEffect(() => {
    const autocompleteEl = placeAutocompleteRef.current;
    if (!autocompleteEl) return;

    const handlePlaceChange = () => {
      const placeResult = autocompleteEl.place;
      if (
        !placeResult ||
        !placeResult.id ||
        !placeResult.displayName ||
        !placeResult.formattedAddress
      ) {
        onPlaceChange(null);
        return;
      }

      const location = placeResult.location;

      const newPlace: Place = {
        id: placeResult.id,
        name: placeResult.displayName,
        address: placeResult.formattedAddress,
        category: placeResult.types || [],
        geometry: location,
        lat: location?.latitude,
        lng: location?.longitude,
      };
      onPlaceChange(newPlace);
    };

    autocompleteEl.addEventListener('gmp-placechange', handlePlaceChange);

    return () => {
      autocompleteEl.removeEventListener('gmp-placechange', handlePlaceChange);
    };
  }, [onPlaceChange]);

  return (
    <div className="relative">
      <gmp-place-autocomplete
        ref={placeAutocompleteRef}
        for-input-id="poi-input"
        class="w-full"
        placeholder="Add a new place..."
        country-codes={['AU', 'US', 'GB', 'NZ']}
      >
        <Input
          id="poi-input"
          ref={inputRef}
          placeholder="Add a new place..."
          className="pl-8 sm:w-[340px]"
        />
      </gmp-place-autocomplete>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    </div>
  );
};

const PointsOfInterestContent = ({
  propertyLocation,
  places,
  setPlaces,
}: {
  propertyLocation: string;
  places: Place[];
  setPlaces: React.Dispatch<React.SetStateAction<Place[]>>;
}) => {
  const { preferences } = useUserPreferences();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [propertyLatLng, setPropertyLatLng] = useState<google.maps.LatLng | null>(null);
  const [displayUnit, setDisplayUnit] = useState<'km' | 'miles'>(preferences.distanceUnit);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'distance',
    direction: 'asc',
  });
  const [selectedPlaceToAdd, setSelectedPlaceToAdd] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  const geocoding = useMapsLibrary('geocoding');
  const geometry = useMapsLibrary('geometry');

  useEffect(() => {
    setDisplayUnit(preferences.distanceUnit);
  }, [preferences.distanceUnit]);

  const calculateDistance = useCallback(
    (place: Place, pLatLng: google.maps.LatLng): Place => {
      if (!geometry || !place.lat || !place.lng) return place;
      const placeLatLng = new google.maps.LatLng(place.lat, place.lng);
      const distanceInMeters = geometry.spherical.computeDistanceBetween(pLatLng, placeLatLng);
      return { ...place, distance: distanceInMeters / 1000 };
    },
    [geometry]
  );

  useEffect(() => {
    if (!geocoding || !propertyLocation) return;
    const geocoder = new geocoding.Geocoder();
    geocoder.geocode({ address: propertyLocation }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        setPropertyLatLng(results[0].geometry.location);
      } else {
        console.error(`Geocode for property was not successful: ${status}`);
        setPropertyLatLng(null);
        setLoading(false);
      }
    });
  }, [geocoding, propertyLocation]);

  useEffect(() => {
    if (!propertyLatLng || !geocoding) return;
    setLoading(true);

    const geocodeAndCalculateDistances = async () => {
      const geocoder = new geocoding.Geocoder();
      const needsGeocoding = places.some((p) => !p.lat || !p.lng);

      if (!needsGeocoding) {
        const needsDistance = places.some((p) => p.distance === undefined);
        if (needsDistance) {
          setPlaces((currentPlaces) =>
            currentPlaces.map((p) => calculateDistance(p, propertyLatLng))
          );
        }
        setLoading(false);
        return;
      }

      const updatedPlaces = await Promise.all(
        places.map(async (place) => {
          if (place.lat && place.lng) return place;
          try {
            const response = await geocoder.geocode({ address: place.address });
            if (response.results[0]?.geometry.location) {
              return {
                ...place,
                lat: response.results[0].geometry.location.lat(),
                lng: response.results[0].geometry.location.lng(),
              };
            }
          } catch (error) {
            console.error(`Geocoding failed for ${place.address}:`, error);
          }
          return place;
        })
      );

      setPlaces(updatedPlaces.map((p) => calculateDistance(p, propertyLatLng)));
      setLoading(false);
    };

    geocodeAndCalculateDistances();
  }, [propertyLatLng, geocoding, places, calculateDistance, setPlaces]);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    places.forEach((place) => place.category.forEach((cat) => categories.add(cat)));
    return Array.from(categories).sort();
  }, [places]);

  const sortedAndFilteredPlaces = useMemo(() => {
    const filtered = places.filter((place) => {
      const matchesSearch =
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((cat) => place.category.includes(cat));
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      const aValue = sortConfig.key === 'distance' ? a.distance || Infinity : a.name;
      const bValue = sortConfig.key === 'distance' ? b.distance || Infinity : b.name;

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [places, searchTerm, selectedCategories, sortConfig]);

  const handleAddPlace = () => {
    if (selectedPlaceToAdd && !places.find((p) => p.id === selectedPlaceToAdd.id)) {
      const newPlace = propertyLatLng
        ? calculateDistance(selectedPlaceToAdd, propertyLatLng)
        : selectedPlaceToAdd;
      setPlaces((prev) => [...prev, newPlace]);
    }
    setSelectedPlaceToAdd(null);
    const inputElement = document.querySelector(
      "[placeholder='Add a new place...']"
    ) as HTMLInputElement;
    if (inputElement) inputElement.value = '';
  };

  const handleDelete = (id: string) => {
    setPlaces(places.filter((p) => p.id !== id));
  };

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleUnit = () => {
    setDisplayUnit((prev) => (prev === 'km' ? 'miles' : 'km'));
  };

  const convertDistance = (km: number) => {
    if (displayUnit === 'miles') {
      return km * 0.621371;
    }
    return km;
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="h-3 w-3 ml-1" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex w-full flex-col sm:flex-row sm:w-auto items-center gap-2">
          <AutocompleteInput onPlaceChange={setSelectedPlaceToAdd} />
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={handleAddPlace}
            disabled={!selectedPlaceToAdd}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>

        <div className="flex w-full sm:w-auto items-center justify-end gap-2">
          <TooltipProvider delayDuration={0}>
            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="relative">
                      <Filter className="h-4 w-4" />
                      <span className="ml-2 hidden sm:inline">Category</span>
                      {selectedCategories.length > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0">
                          {selectedCategories.length}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter by Category</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="w-[220px] p-0" align="end">
                <Command>
                  <CommandInput
                    placeholder="Search categories..."
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  <CommandEmpty>No categories found.</CommandEmpty>
                  <CommandGroup>
                    {allCategories.map((category) => (
                      <CommandItem
                        key={category}
                        onSelect={() => {
                          const newSelection = selectedCategories.includes(category)
                            ? selectedCategories.filter((c) => c !== category)
                            : [...selectedCategories, category];
                          setSelectedCategories(newSelection);
                        }}
                      >
                        <Checkbox
                          className="mr-2"
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => {
                            const newSelection = selectedCategories.includes(category)
                              ? selectedCategories.filter((c) => c !== category)
                              : [...selectedCategories, category];
                            setSelectedCategories(newSelection);
                          }}
                        />
                        <span className="capitalize">{category.replace(/_/g, ' ')}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
                {selectedCategories.length > 0 && (
                  <>
                    <Separator />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center"
                      onClick={() => setSelectedCategories([])}
                    >
                      Clear filters
                    </Button>
                  </>
                )}
              </PopoverContent>
            </Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="outline" size="sm" onClick={toggleUnit}>
                  <Repeat className="h-4 w-4 mr-0 sm:mr-2" />
                  <span className="hidden sm:inline">{displayUnit}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle unit (km/miles)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  type="button"
                  className="flex items-center gap-1 font-bold"
                  onClick={() => requestSort('name')}
                >
                  Place {getSortIcon('name')}
                </button>
              </TableHead>
              <TableHead className="hidden sm:table-cell w-[200px]">Category</TableHead>
              <TableHead className="w-[140px] text-center">
                <button
                  type="button"
                  className="flex items-center justify-center w-full gap-1 font-bold"
                  onClick={() => requestSort('distance')}
                >
                  Distance ({displayUnit}) {getSortIcon('distance')}
                </button>
              </TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Calculating distances...
                </TableCell>
              </TableRow>
            ) : sortedAndFilteredPlaces.length > 0 ? (
              sortedAndFilteredPlaces.map((place) => (
                <TableRow key={place.id}>
                  <TableCell>
                    <p className="font-medium">{place.name}</p>
                    <p className="text-sm text-muted-foreground">{place.address}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {place.category.slice(0, 2).map((cat) => (
                        <Badge key={cat} variant="secondary" className="capitalize">
                          {cat.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {place.distance !== undefined
                      ? `${convertDistance(place.distance).toFixed(2)}`
                      : '...'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(place.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No points of interest match your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default function PointsOfInterest({
  propertyLocation,
  places,
  setPlaces,
}: {
  propertyLocation: string;
  places: Place[];
  setPlaces: React.Dispatch<React.SetStateAction<Place[]>>;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  // Hooks must be called at the top level
  const placesApiLoaded = useMapsLibrary('places');
  const geocodingApiLoaded = useMapsLibrary('geocoding');
  const geometryApiLoaded = useMapsLibrary('geometry');
  const isApiLoaded = placesApiLoaded && geocodingApiLoaded && geometryApiLoaded;

  useEffect(() => {
    document.body.classList.add('map-api-activated');
    return () => {
      document.body.classList.remove('map-api-activated');
    };
  }, []);

  if (!apiKey) {
    return (
      <div className="text-destructive p-4 border border-destructive/50 rounded-md">
        API Key is not configured. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
      </div>
    );
  }

  if (!isApiLoaded) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <style>{`.pac-container { z-index: 9999 !important; }`}</style>
      <PointsOfInterestContent
        propertyLocation={propertyLocation}
        places={places}
        setPlaces={setPlaces}
      />
    </>
  );
}
