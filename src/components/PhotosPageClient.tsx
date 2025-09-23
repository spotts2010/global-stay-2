'use client';

import React, { useState, useEffect, useTransition } from 'react';
import dynamic from 'next/dynamic';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Loader2, ImageIcon, UploadCloud, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Accommodation } from '@/lib/data';
import { updateAccommodationAction } from '@/app/actions';
import { DragDropContext, type DropResult } from 'react-beautiful-dnd';
import { cn } from '@/lib/utils';

const PhotoGalleryDND = dynamic(() => import('./PhotoGalleryDND'), { ssr: false });

export default function PhotosPageClient({ listing }: { listing: Accommodation }) {
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>(listing?.images || []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [hasMounted, setHasMounted] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Check if the current state is different from the original listing state
  useEffect(() => {
    setIsDirty(JSON.stringify(images) !== JSON.stringify(listing.images));
  }, [images, listing.images]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(images);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setImages(items);
  };

  const handleDeleteImage = (imageToDelete: string) => {
    setImages((prev) => prev.filter((img) => img !== imageToDelete));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const validFiles: File[] = [];
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

      for (const file of Array.from(event.target.files)) {
        if (file.size > MAX_FILE_SIZE) {
          toast({
            variant: 'destructive',
            title: 'File Too Large',
            description: `"${file.name}" is larger than 2MB and was not added.`,
          });
        } else {
          validFiles.push(file);
        }
      }
      setFilesToUpload(validFiles);
    }
  };

  const handleUploadImages = async () => {
    if (filesToUpload.length === 0) return;
    setIsUploading(true);

    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success && result.urls) {
        setImages((prev) => [...prev, ...result.urls!]);
        toast({
          title: 'Images Ready',
          description: `Added ${result.urls.length} new image(s). Click Save Changes to confirm.`,
        });
        setFilesToUpload([]);
        setIsAddModalOpen(false);
      } else {
        throw new Error(result.error || 'An unknown error occurred.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: errorMessage,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = () => {
    startTransition(async () => {
      const dataToSave = {
        images,
        image: images[0] || '', // first image is cover
      };
      const result = await updateAccommodationAction(listing.id, dataToSave);
      if (result.success) {
        toast({
          title: 'Changes Saved',
          description: 'Your photo gallery has been updated.',
        });
        listing.images = images; // Update original state to reset dirty check
        setIsDirty(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: result.error || 'An unknown error occurred.',
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
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Property Photo Gallery
              </CardTitle>
              <CardDescription>
                Drag and drop to reorder images. The first image is the cover photo.
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
          {hasMounted ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <PhotoGalleryDND
                images={images}
                listing={listing}
                handleDeleteImage={handleDeleteImage}
                openAddModal={() => setIsAddModalOpen(true)}
              />
            </DragDropContext>
          ) : (
            <div className="flex h-48 w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Images</DialogTitle>
            <DialogDescription>
              Recommended dimensions: 1920x1080px. Max file size: 2MB.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="picture">Pictures</Label>
              <div className="flex h-10 w-full rounded-md border border-input bg-white text-sm">
                <Label
                  htmlFor="picture"
                  className={cn(
                    'flex h-full items-center whitespace-nowrap rounded-l-md border-r bg-primary px-3 text-primary-foreground hover:bg-primary/90 cursor-pointer'
                  )}
                >
                  Choose Files
                </Label>
                <Input
                  id="picture"
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
