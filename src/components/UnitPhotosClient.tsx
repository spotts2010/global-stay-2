'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useParams } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, ImageIcon, UploadCloud, Save, Trash2, GripVertical, Camera } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { updateUnitAction } from '@/app/actions';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
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
import type { Accommodation } from '@/lib/data';
import type { BookableUnit } from './UnitsPageClient';

const SortablePhoto = ({
  id,
  index,
  onDelete,
}: {
  id: string;
  index: number;
  onDelete: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative w-40 h-40 rounded-lg group touch-none">
      <Image
        src={id}
        alt={`Unit image ${index + 1}`}
        fill
        sizes="160px"
        className="object-cover rounded-lg"
      />
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 cursor-grab p-1 text-white opacity-60 hover:opacity-100 rounded-md bg-black/30 z-10"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      {index === 0 && (
        <Badge variant="secondary" className="absolute top-2 left-2 bg-black/60 text-white z-10">
          Cover
        </Badge>
      )}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2 rounded-lg">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon" className="h-8 w-8">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will mark the image for deletion. Click "Save Changes" to make it permanent.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default function UnitPhotosClient({
  listing: _listing,
  unit,
}: {
  listing: Accommodation;
  unit?: BookableUnit;
}) {
  const { toast } = useToast();
  const params = useParams();
  const listingId = params.id as string;
  const unitId = params.unitId as string;

  const initialImages = useMemo(() => unit?.images || [], [unit]);
  const [images, setImages] = useState<string[]>(initialImages);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDirty, setIsDirty] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Correctly check for changes in order by comparing stringified arrays without sorting.
    setIsDirty(JSON.stringify(images) !== JSON.stringify(initialImages));
  }, [images, initialImages]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setImages((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over!.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleDeleteImage = (imageToDelete: string) => {
    setImages((prev) => prev.filter((img) => img !== imageToDelete));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const validFiles: File[] = [];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    Array.from(event.target.files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: 'destructive',
          title: 'File Too Large',
          description: `"${file.name}" is larger than 5MB.`,
        });
      } else {
        validFiles.push(file);
      }
    });
    setFilesToUpload(validFiles);
  };

  const handleUploadImages = async () => {
    if (filesToUpload.length === 0) return;
    setIsUploading(true);
    const formData = new FormData();
    filesToUpload.forEach((file) => formData.append('files', file));
    // Append unitId to be used by the API route for the path
    formData.append('unitId', unitId);

    try {
      const res = await fetch(`/api/listings/${listingId}/upload`, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();

      if (res.ok && result.success && Array.isArray(result.urls)) {
        setImages((prev) => [...prev, ...result.urls]);
        toast({
          title: 'Images Ready',
          description: `Added ${result.urls.length} new image(s). Click Save Changes to confirm.`,
        });
        setFilesToUpload([]);
        setIsAddModalOpen(false);
      } else {
        throw new Error(result.error || 'Unknown upload error');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = () => {
    startTransition(async () => {
      // The updateUnitAction now saves the images array to the unit document
      const result = await updateUnitAction(listingId, unitId, { images });
      if (result.success) {
        toast({
          title: 'Changes Saved',
          description: "The unit's photo gallery has been updated.",
        });
        if (unit) {
          unit.images = [...images];
        }
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

  if (!unit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unit Not Found</CardTitle>
          <CardDescription>
            This unit doesn't exist. Please create it before adding photos.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

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
            <Button onClick={handleSaveChanges} disabled={isPending || !isDirty}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={images} strategy={rectSortingStrategy}>
              <div className="flex flex-wrap gap-4">
                {images.map((img, index) => (
                  <SortablePhoto key={img} id={img} index={index} onDelete={handleDeleteImage} />
                ))}

                <div
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-40 h-40 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:bg-accent"
                >
                  <Camera className="h-8 w-8" />
                  <span className="text-xs mt-2 text-center">Add Images</span>
                </div>
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Images for Unit</DialogTitle>
            <DialogDescription>
              Recommended dimensions: 1920x1080px. Max file size: 5MB per image.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="unit-pictures">Pictures</Label>
              <div className="flex h-10 w-full rounded-md border border-input bg-white text-sm">
                <Label
                  htmlFor="unit-pictures"
                  className="flex h-full items-center whitespace-nowrap rounded-l-md border-r bg-primary px-3 text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Choose Files
                </Label>
                <Input
                  id="unit-pictures"
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                />
                <div className="flex flex-1 items-center px-3 text-muted-foreground">
                  {filesToUpload.length > 0
                    ? `${filesToUpload.length} file(s) selected`
                    : 'No file chosen'}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleUploadImages}
              disabled={isUploading || filesToUpload.length === 0}
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4" />
              )}
              Upload {filesToUpload.length > 0 ? filesToUpload.length : ''} Image(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
