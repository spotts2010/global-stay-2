'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from './ui/button';
import { Star } from 'lucide-react';

type FilterPanelProps = {
  onFilterChange: (filters: { priceRange: number[]; propertyType: string; rating: number }) => void;
};

const FilterPanel = ({ onFilterChange }: FilterPanelProps) => {
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [propertyType, setPropertyType] = useState('all');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    // Using a timeout to debounce the filter change event
    const handler = setTimeout(() => {
      onFilterChange({ priceRange, propertyType, rating });
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [priceRange, propertyType, rating, onFilterChange]);

  const handleReset = () => {
    setPriceRange([0, 1500]);
    setPropertyType('all');
    setRating(0);
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Filter Results</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div>
          <Label htmlFor="price-range" className="mb-2 block font-medium">
            Price Range
          </Label>
          <Slider
            id="price-range"
            min={0}
            max={1500}
            step={50}
            value={priceRange}
            onValueChange={setPriceRange}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        <div>
          <Label htmlFor="property-type" className="mb-2 block font-medium">
            Property Type
          </Label>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger id="property-type">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Hotel">Hotel</SelectItem>
              <SelectItem value="Loft">Loft</SelectItem>
              <SelectItem value="House">House</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block font-medium">Rating</Label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant={rating >= star ? 'default' : 'outline'}
                size="icon"
                onClick={() => setRating(star === rating ? 0 : star)}
                className="h-9 w-9"
              >
                <Star className="h-4 w-4" />
                <span className="sr-only">{star} star</span>
              </Button>
            ))}
          </div>
        </div>

        <Button variant="ghost" onClick={handleReset} className="w-full mt-4">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
