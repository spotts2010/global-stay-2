import Image from 'next/image';
import Link from 'next/link';
import type { Collection } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

type CuratedCollectionCardProps = {
  collection: Collection;
};

const CuratedCollectionCard = ({ collection }: CuratedCollectionCardProps) => {
  return (
    <Link href="#" className="group relative block overflow-hidden rounded-lg">
      <div className="aspect-[3/4]">
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint={collection.imageHint}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h3 className="font-headline text-2xl font-bold">{collection.title}</h3>
        <p className="mt-1 text-sm text-white/90">{collection.description}</p>
        <div className="mt-4 flex items-center text-sm font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Explore
          <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      </div>
    </Link>
  );
};

export default CuratedCollectionCard;
