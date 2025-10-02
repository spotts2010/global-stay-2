'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageIcon, Save, Camera, GripVertical, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function PhotosPage() {
  // Start with an empty array for a clean slate
  const images: string[] = [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5 mb-4 sm:mb-0">
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Unit Photo Gallery
              </CardTitle>
              <CardDescription>
                Drag and drop to reorder images. The first image is the cover photo for this unit.
              </CardDescription>
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.length > 0 ? (
              images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg group">
                  <Image
                    src={img}
                    alt={`Unit image ${index + 1}`}
                    fill
                    sizes="150px"
                    className="object-cover rounded-lg"
                  />
                  {index === 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute top-2 left-2 bg-black/60 text-white"
                    >
                      Cover
                    </Badge>
                  )}
                  <div className="absolute top-2 right-2 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-grab bg-black/50 rounded-md">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div
                onClick={() => {
                  /* Logic to add image goes here */
                }}
                className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-accent cursor-pointer"
              >
                <Camera className="h-8 w-8" />
                <span className="text-xs mt-2 text-center">Add Images</span>
              </div>
            )}
            {images.length > 0 && (
              <div
                onClick={() => {
                  /* Logic to add image goes here */
                }}
                className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-accent cursor-pointer"
              >
                <Camera className="h-8 w-8" />
                <span className="text-xs mt-2 text-center">Add Images</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
