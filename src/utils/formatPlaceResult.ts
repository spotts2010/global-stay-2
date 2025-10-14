// src/utils/formatPlaceResult.ts

export interface StructuredAddress {
  formatted: string;
  streetNumber?: string;
  street?: string;
  suburb?: string;
  city?: string;
  county?: string;
  state?: {
    short: string;
    long: string;
  };
  country?: {
    short: string;
    long: string;
  };
  postcode?: string;
  lat?: number;
  lng?: number;
  searchIndex?: string;
}

export function formatPlaceResult(place: google.maps.places.PlaceResult): StructuredAddress {
  if (!place.address_components || !place.geometry) {
    console.warn('Invalid place result');
    return { formatted: place.formatted_address || '' };
  }

  const getComponent = (type: string, prop: 'long_name' | 'short_name' = 'long_name') => {
    const component = place.address_components?.find((c) => c.types.includes(type));
    return component ? component[prop] : '';
  };

  const structured: StructuredAddress = {
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

  // 🔍 Build searchable string (lowercase, spaces only)
  const searchParts = [
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

  structured.searchIndex = searchParts;

  return structured;
}
