import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from '@/lib/icons';
import Image from 'next/image';

const properties = [
  {
    name: 'The Oceanfront Pearl',
    host: 'Sam Potts',
    location: 'Malibu, California',
    revenue: 12500,
    rating: 4.9,
    image: 'https://picsum.photos/seed/tp1/64/64',
    imageHint: 'luxury villa ocean',
  },
  {
    name: 'Grand Budapest Hotel',
    host: 'Julia Nolte',
    location: 'Zubrowka, Republic of',
    revenue: 10200,
    rating: 5.0,
    image: 'https://picsum.photos/seed/tp2/64/64',
    imageHint: 'grand hotel exterior',
  },
  {
    name: 'Downtown Artist Loft',
    host: 'Sam Potts',
    location: 'New York, New York',
    revenue: 8500,
    rating: 4.7,
    image: 'https://picsum.photos/seed/tp3/64/64',
    imageHint: 'modern loft apartment',
  },
  {
    name: 'Sydney Harbour View Suite',
    host: 'Jane Doe',
    location: 'Sydney, Australia',
    revenue: 7800,
    rating: 4.6,
    image: 'https://picsum.photos/seed/tp4/64/64',
    imageHint: 'apartment city view',
  },
];

export default function TopPerformingTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Top Performing Properties
        </CardTitle>
        <CardDescription>Top 5 properties by revenue in the last 30 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Property</TableHead>
              <TableHead className="hidden md:table-cell">Host</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Revenue (30d)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.name}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={property.name}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={property.image}
                    width="64"
                    data-ai-hint={property.imageHint}
                  />
                </TableCell>
                <TableCell>
                  <p className="font-medium">{property.name}</p>
                  <p className="text-xs text-muted-foreground hidden md:block">
                    {property.location}
                  </p>
                </TableCell>
                <TableCell className="hidden md:table-cell">{property.host}</TableCell>
                <TableCell>
                  <Badge variant="outline">{property.rating.toFixed(1)}</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${property.revenue.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
