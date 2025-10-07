'use client';

import React, { useState, useEffect, useRef, useTransition, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Loader2,
  Info,
  Save,
  Trash2,
  ArrowUp,
  ArrowDown,
  FilePen,
  Check,
  X,
  MapPin,
} from '@/lib/icons';
import type { Accommodation, Place, PoiCategory } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { updatePointsOfInterestAction } from '@/app/actions';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

// Helper for distance calculation
function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: 'km' | 'miles' = 'km'
) {
  const R = unit === 'km' ? 6371 : 3959; // Radius of the earth in km or miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance
}

const POI_CATEGORIES: PoiCategory[] = [
  'Dining',
  'Food & Drink',
  'Nature & Outdoors',
  'Attractions & Entertainment',
  'Medical & Emergency',
  'Shopping & Retail',
  'Transport & Fuel',
  'Activities & Tours',
  'Business & Services',
  'Beauty & Wellbeing',
  'Unassigned',
];

const sortedPoiCategories = [
  ...POI_CATEGORIES.filter((c) => c !== 'Unassigned').sort(),
  'Unassigned',
];

// Function to map Google Place Types to our PoiCategory
function getCategoryFromPlaceTypes(types: string[] = []): PoiCategory {
  const typeMapping: Record<string, PoiCategory> = {
    restaurant: 'Dining',
    cafe: 'Dining',
    bar: 'Dining',
    bakery: 'Dining',
    meal_takeaway: 'Dining',
    supermarket: 'Food & Drink',
    grocery_or_supermarket: 'Food & Drink',
    liquor_store: 'Food & Drink',
    park: 'Nature & Outdoors',
    natural_feature: 'Nature & Outdoors',
    tourist_attraction: 'Attractions & Entertainment',
    museum: 'Attractions & Entertainment',
    amusement_park: 'Attractions & Entertainment',
    aquarium: 'Attractions & Entertainment',
    zoo: 'Attractions & Entertainment',
    movie_theater: 'Attractions & Entertainment',
    stadium: 'Attractions & Entertainment',
    night_club: 'Attractions & Entertainment',
    art_gallery: 'Attractions & Entertainment',
    bowling_alley: 'Attractions & Entertainment',
    casino: 'Attractions & Entertainment',
    hospital: 'Medical & Emergency',
    doctor: 'Medical & Emergency',
    pharmacy: 'Medical & Emergency',
    drugstore: 'Medical & Emergency',
    dentist: 'Medical & Emergency',
    physiotherapist: 'Medical & Emergency',
    police: 'Medical & Emergency',
    shopping_mall: 'Shopping & Retail',
    department_store: 'Shopping & Retail',
    clothing_store: 'Shopping & Retail',
    shoe_store: 'Shopping & Retail',
    book_store: 'Shopping & Retail',
    electronics_store: 'Shopping & Retail',
    hardware_store: 'Shopping & Retail',
    furniture_store: 'Shopping & Retail',
    home_goods_store: 'Shopping & Retail',
    store: 'Shopping & Retail',
    train_station: 'Transport & Fuel',
    subway_station: 'Transport & Fuel',
    light_rail_station: 'Transport & Fuel',
    bus_station: 'Transport & Fuel',
    airport: 'Transport & Fuel',
    taxi_stand: 'Transport & Fuel',
    car_rental: 'Transport & Fuel',
    gas_station: 'Transport & Fuel',
    travel_agency: 'Activities & Tours',
    bank: 'Business & Services',
    atm: 'Business & Services',
    post_office: 'Business & Services',
    library: 'Business & Services',
    car_wash: 'Business & Services',
    car_repair: 'Business & Services',
    laundry: 'Business & Services',
    beauty_salon: 'Beauty & Wellbeing',
    hair_care: 'Beauty & Wellbeing',
    nail_salon: 'Beauty & Wellbeing',
    spa: 'Beauty & Wellbeing',
    gym: 'Beauty & Wellbeing',
  };

  for (const type of types) {
    if (typeMapping[type]) {
      return typeMapping[type];
    }
  }

  return 'Unassigned';
}

type SortKey = 'name' | 'category' | 'distance' | 'visible';
type SortDirection = 'asc' | 'desc';

type PoiRowProps = {
  place: Place;
  preferences: { distanceUnit: 'km' | 'miles' };
  editingRowId: string | null;
  tempCategory: PoiCategory | null;
  onEditClick: (place: Place) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
  onCategoryChange: (category: PoiCategory) => void;
  onVisibilityChange: (id: string, isVisible: boolean) => void;
  onDelete: (id: string) => void;
};

const PoiRow = ({
  place,
  preferences,
  editingRowId,
  tempCategory,
  onEditClick,
  onSaveEdit,
  onCancelEdit,
  onCategoryChange,
  onVisibilityChange,
  onDelete,
}: PoiRowProps) => {
  const isEditing = editingRowId === place.id;

  return (
    <TableRow className={cn(place.isNew && 'bg-accent/50')}>
      <TableCell>
        <p className="font-medium">{place.name}</p>
        <p className="text-xs text-muted-foreground hidden sm:block">{place.address}</p>
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select
            value={tempCategory ?? place.category}
            onValueChange={(val) => onCategoryChange(val as PoiCategory)}
          >
            <SelectTrigger className="justify-start text-left w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortedPoiCategories.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-left">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-sm">{place.category}</span>
        )}
      </TableCell>
      <TableCell className="hidden sm:table-cell text-muted-foreground">
        {place.distance !== undefined
          ? `${place.distance.toFixed(1)} ${preferences.distanceUnit}`
          : 'N/A'}
      </TableCell>
      <TableCell className="text-center">
        <Switch
          checked={place.visible}
          onCheckedChange={(checked) => onVisibilityChange(place.id, checked)}
        />
      </TableCell>
      <TableCell className="text-right">
        {isEditing ? (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-600"
              onClick={() => onSaveEdit(place.id)}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={onCancelEdit}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEditClick(place)}
            >
              <FilePen className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => onDelete(place.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

function PlacesAutocomplete({
  onPlaceSelected,
  inputRef,
}: {
  onPlaceSelected: (place: google.maps.places.PlaceResult | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types'],
    });

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      onPlaceSelected(place);
    });

    return () => listener.remove();
  }, [places, onPlaceSelected, inputRef]);

  return (
    <div className="relative w-full">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Input
        ref={inputRef}
        className="pl-10 bg-white"
        placeholder="Search for a place on Google Maps..."
        onChange={() => onPlaceSelected(null)} // Clear selection if user types
      />
    </div>
  );
}

export default function PointsOfInterest({
  listing,
  initialPlaces,
}: {
  listing: Accommodation;
  initialPlaces: Place[];
}) {
  const { toast } = useToast();
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [isPending, startTransition] = useTransition();
  const { preferences } = useUserPreferences();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'distance',
    direction: 'asc',
  });
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [tempCategory, setTempCategory] = useState<PoiCategory | null>(null);

  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const placesInputRef = useRef<HTMLInputElement>(null);

  const handleAddPlace = () => {
    if (!selectedPlace || !selectedPlace.place_id) {
      toast({
        variant: 'destructive',
        title: 'Select a Place',
        description: 'Please pick a valid place from the dropdown before adding.',
      });
      return;
    }

    if (places.some((p) => p.id === selectedPlace.place_id)) {
      toast({
        variant: 'destructive',
        title: 'Place Already Added',
        description: `"${selectedPlace.name}" is already in your list.`,
      });
      return;
    }

    const lat = selectedPlace.geometry?.location?.lat();
    const lng = selectedPlace.geometry?.location?.lng();
    if (lat === undefined || lng === undefined) return;

    const newPlace: Place = {
      id: selectedPlace.place_id!,
      name: selectedPlace.name!,
      address: selectedPlace.formatted_address!,
      category: getCategoryFromPlaceTypes(selectedPlace.types),
      source: 'Host',
      visible: true,
      lat,
      lng,
      distance: getDistance(listing.lat, listing.lng, lat, lng, preferences.distanceUnit),
      isNew: true,
    };

    setPlaces((prev) => [newPlace, ...prev]);
    setSelectedPlace(null);
    if (placesInputRef.current) {
      placesInputRef.current.value = '';
    }
  };

  const handleEditClick = (place: Place) => {
    setEditingRowId(place.id);
    setTempCategory(place.category);
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setTempCategory(null);
  };

  const handleSaveEdit = (id: string) => {
    if (tempCategory) {
      setPlaces((prev) => prev.map((p) => (p.id === id ? { ...p, category: tempCategory } : p)));
    }
    setEditingRowId(null);
    setTempCategory(null);
  };

  const handleVisibilityChange = (id: string, isVisible: boolean) => {
    setPlaces((prev) =>
      prev.map((place) => (place.id === id ? { ...place, visible: isVisible } : place))
    );
  };

  const handleDelete = (id: string) => {
    setPlaces((prev) => prev.filter((place) => place.id !== id));
  };

  const handleSaveChanges = () => {
    const placesToSave = places.map(({ isNew: _, ...rest }) => rest);
    startTransition(async () => {
      const result = await updatePointsOfInterestAction(listing.id, placesToSave);
      if (result.success) {
        toast({ title: 'Changes Saved', description: 'Points of interest have been updated.' });
        setPlaces((prev) => prev.map((p) => ({ ...p, isNew: false })));
      } else {
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: result.error || 'An unknown error occurred.',
        });
      }
    });
  };

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  };

  const sortedAndFilteredPlaces = useMemo(() => {
    let sortableItems = [...places];

    if (categoryFilter !== 'All') {
      sortableItems = sortableItems.filter((place) => place.category === categoryFilter);
    }

    sortableItems.sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;

      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      let comparison = 0;

      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (valA > valB) {
        comparison = 1;
      } else if (valA < valB) {
        comparison = -1;
      }
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return sortableItems;
  }, [places, sortConfig, categoryFilter]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: places.length };
    POI_CATEGORIES.forEach((cat) => {
      counts[cat] = places.filter((p) => p.category === cat).length;
    });
    return counts;
  }, [places]);

  const SortableHeader = ({
    sortKey,
    children,
    className,
  }: {
    sortKey: SortKey;
    children: React.ReactNode;
    className?: string;
  }) => (
    <TableHead className={className}>
      <Button variant="ghost" onClick={() => requestSort(sortKey)} className="px-0 h-auto">
        {children}
        {getSortIcon(sortKey)}
      </Button>
    </TableHead>
  );

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''} libraries={['places']}>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="mb-4 sm:mb-0 space-y-1.5">
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Places & Points of Interest
              </CardTitle>
              <CardDescription>
                Add and manage nearby attractions, restaurants, and transport links.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleSaveChanges} disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-8 flex w-full flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex w-full md:w-1/2 items-center gap-2">
              <PlacesAutocomplete onPlaceSelected={setSelectedPlace} inputRef={placesInputRef} />
              <Button onClick={handleAddPlace} disabled={!selectedPlace}>
                Add Place
              </Button>
            </div>
            <div className="w-full md:w-auto flex justify-end">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[280px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">
                    <div className="flex items-center justify-between w-full">
                      <span>All Categories</span>
                      <Badge variant="secondary" className="ml-4 px-1.5 py-0">
                        {categoryCounts['All']}
                      </Badge>
                    </div>
                  </SelectItem>
                  {sortedPoiCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      <div className="flex items-center justify-between w-full">
                        <span>{cat}</span>
                        <Badge variant="secondary" className="ml-4 px-1.5 py-0">
                          {categoryCounts[cat] || 0}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-lg bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader sortKey="name">Place</SortableHeader>
                  <SortableHeader sortKey="category" className="w-72">
                    Category
                  </SortableHeader>
                  <SortableHeader sortKey="distance" className="w-32 hidden sm:table-cell">
                    Distance
                  </SortableHeader>
                  <SortableHeader sortKey="visible" className="w-24 text-center">
                    Visible
                  </SortableHeader>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredPlaces.length > 0 ? (
                  sortedAndFilteredPlaces.map((place) => (
                    <PoiRow
                      key={place.id}
                      place={place}
                      preferences={preferences}
                      editingRowId={editingRowId}
                      tempCategory={tempCategory}
                      onEditClick={handleEditClick}
                      onSaveEdit={handleSaveEdit}
                      onCancelEdit={handleCancelEdit}
                      onCategoryChange={setTempCategory}
                      onVisibilityChange={handleVisibilityChange}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No points of interest found for the selected category.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </APIProvider>
  );
}
