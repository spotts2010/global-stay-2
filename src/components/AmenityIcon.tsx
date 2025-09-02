import { Wifi, Car, Utensils, Award, Waves, Dumbbell } from 'lucide-react';
import type { Amenity } from '@/lib/data';

type AmenityIconProps = {
  amenity: Amenity;
  className?: string;
};

const AmenityIcon = ({ amenity, className = 'h-6 w-6 text-primary' }: AmenityIconProps) => {
  const icons: Record<Amenity, React.ElementType> = {
    wifi: Wifi,
    parking: Car,
    kitchen: Utensils,
    pool: Waves,
    gym: Dumbbell,
  };

  const IconComponent = icons[amenity] || Award; // Default icon

  return <IconComponent className={className} />;
};

export default AmenityIcon;
