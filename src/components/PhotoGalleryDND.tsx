'use client';

import React from 'react';
import Image from 'next/image';
import { Droppable, Draggable } from 'react-beautiful-dnd';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Trash2, GripVertical } from 'lucide-react';
import type { Accommodation } from '@/lib/data';

interface PhotoGalleryDNDProps {
  images: string[];
  listing: Accommodation;
  handleDeleteImage: (imageToDelete: string) => void;
  openAddModal: () => void;
}

const PhotoGalleryDND: React.FC<PhotoGalleryDNDProps> = ({
  images,
  listing,
  handleDeleteImage,
  openAddModal,
}) => {
  return (
    <Droppable droppableId="gallery" direction="horizontal">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {images.map((img, index) => (
            <Draggable key={img} draggableId={img} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="relative aspect-square rounded-lg group focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                >
                  <Image
                    src={img}
                    alt={`Property image ${index + 1}`}
                    fill
                    sizes="150px"
                    className="object-cover rounded-lg"
                    data-ai-hint={index === 0 ? listing?.imageHint || 'property exterior' : 'room'}
                  />

                  {/* Overlay for delete */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
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
                            This will mark the image for deletion. Click &quot;Save Changes&quot; to
                            make it permanent.
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

                  {/* Cover badge */}
                  {index === 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute top-2 left-2 bg-black/60 text-white"
                    >
                      Cover
                    </Badge>
                  )}

                  {/* Drag handle */}
                  <div className="absolute top-2 right-2 p-1 text-white opacity-60 hover:opacity-100 transition-opacity cursor-grab focus:outline-none group-hover:bg-black/50 rounded-md">
                    <GripVertical className="h-5 w-5" aria-label="Drag handle" />
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}

          {/* Add image button */}
          <div
            onClick={openAddModal}
            className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-accent cursor-pointer"
          >
            <Camera className="h-8 w-8" />
            <span className="text-xs mt-2 text-center">Add Images</span>
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default PhotoGalleryDND;
