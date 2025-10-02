'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Button } from './ui/button';
import { Loader2, Trash2, GripVertical, Camera, Save, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd';
import Image from 'next/image';
import { Badge } from './ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import type { Accommodation } from '@/lib/data';
import { updateAccommodationAction } from '@/app/actions';
import { Breadcrumbs } from './Breadcrumbs';

interface PhotosPageProps {
  listing: Accommodation;
}

export default function PhotoGalleryDND({ listing }: PhotosPageProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>(listing.images || []);
  const [isPending, startTransition] = useTransition();
  const [hasMounted, setHasMounted] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => setHasMounted(true), []);
  useEffect(
    () => setIsDirty(JSON.stringify(images) !== JSON.stringify(listing.images)),
    [images, listing.images]
  );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newImages = Array.from(images);
    const [moved] = newImages.splice(result.source.index, 1);
    newImages.splice(result.destination.index, 0, moved);
    setImages(newImages);
  };

  const handleDeleteImage = (imageToDelete: string) =>
    setImages((prev) => prev.filter((img) => img !== imageToDelete));

  const handleSaveChanges = () => {
    startTransition(async () => {
      const dataToSave = { images, image: images[0] || '' };
      const result = await updateAccommodationAction(listing.id, dataToSave);
      if (result.success) {
        toast({ title: 'Changes Saved', description: 'Photo gallery updated.' });
        listing.images = images;
        setIsDirty(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: result.error || 'Unknown error',
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Listings', href: '/admin/listings' },
          { label: listing.name, href: `/admin/listings/${listing.id}/edit/about` },
          { label: 'Photos' },
        ]}
      />

      <div className="flex justify-between items-center">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <ImageIcon className="w-5 h-5 text-primary" /> Property Photo Gallery
        </h2>
        <Button onClick={handleSaveChanges} disabled={!isDirty || isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}{' '}
          Save Changes
        </Button>
      </div>

      {hasMounted ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="gallery" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-4"
              >
                {images.map((img, index) => (
                  <Draggable key={img} draggableId={img} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="relative w-40 h-40 rounded-lg group"
                      >
                        <Image
                          src={img}
                          alt={`Property image ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <div
                          {...provided.dragHandleProps}
                          className="absolute top-2 right-2 cursor-grab p-1 text-white opacity-70 hover:opacity-100 rounded-md bg-black/30"
                        >
                          <GripVertical className="h-5 w-5" />
                        </div>
                        {index === 0 && (
                          <Badge
                            variant="secondary"
                            className="absolute top-2 left-2 bg-black/60 text-white"
                          >
                            Cover
                          </Badge>
                        )}

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="icon">
                                <Trash2 className="h-5 w-5" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will mark the image for deletion. Click "Save Changes" to
                                  confirm.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteImage(img)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}

                <div
                  onClick={() => {
                    /* Logic to add image, maybe open modal */
                  }}
                  className="w-40 h-40 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:bg-accent"
                >
                  <Camera className="h-8 w-8" />
                  <span className="text-xs mt-2 text-center">Add Images</span>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="flex h-48 w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
