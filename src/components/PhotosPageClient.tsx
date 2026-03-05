// src/components/PhotosPageClient.tsx
'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState, useTransition } from 'react';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useToast } from '@/hooks/use-toast';
import { updateAccommodationAction } from '@/app/actions';
import type { Accommodation } from '@/lib/data';
import { Camera, ImageIcon, Loader2, Save, UploadCloud } from '@/lib/icons';

const PhotosDndGrid = dynamic(() => import('@/components/photos/photos-dnd-grid'), {
  ssr: false,
  loading: () => <div className="text-sm text-muted-foreground">Loading gallery…</div>,
});

export default function PhotosPageClient({ listing }: { listing: Accommodation }) {
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>(listing?.images || []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // Compare arrays by value, not by reference. Do NOT sort, as order is important.
    const imagesString = JSON.stringify(images);
    const listingImagesString = JSON.stringify(listing.images || []);
    setIsDirty(imagesString !== listingImagesString);
  }, [images, listing.images]);

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

    try {
      const res = await fetch(`/api/listings/${listing.id}/upload`, {
        method: 'POST',
        body: formData,
      });

      const result: unknown = await res.json();

      const ok =
        res.ok &&
        typeof result === 'object' &&
        result !== null &&
        'success' in result &&
        (result as { success?: unknown }).success === true &&
        'urls' in result &&
        Array.isArray((result as { urls?: unknown }).urls);

      if (ok) {
        const urls = (result as { urls: string[] }).urls;

        setImages((prev) => [...prev, ...urls]);
        toast({
          title: 'Images Ready',
          description: `Added ${urls.length} new image(s). Click Save Changes.`,
        });

        setFilesToUpload([]);
        setIsAddModalOpen(false);
        return;
      }

      const errorMsg =
        typeof result === 'object' && result !== null && 'error' in result
          ? String((result as { error?: unknown }).error || 'Unknown upload error')
          : 'Unknown upload error';

      throw new Error(errorMsg);
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
      const result = await updateAccommodationAction(listing.id, { images });

      if (result.success) {
        toast({ title: 'Changes Saved', description: 'Photo gallery updated.' });

        // After saving, update the original listing data to match the new state
        listing.images = [...images];
        setIsDirty(false);
        return;
      }

      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: result.error || 'Unknown error',
      });
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
            <div className="mb-4 sm:mb-0 space-y-1.5">
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" /> Property Photo Gallery
              </CardTitle>
              <CardDescription>
                Drag and drop to reorder images. First image is the cover photo.
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
          <div className="flex flex-wrap gap-4">
            <PhotosDndGrid
              images={images}
              onReorder={(next) => setImages(next)}
              onDelete={handleDeleteImage}
            />

            <div
              onClick={() => setIsAddModalOpen(true)}
              className="w-40 h-40 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:bg-accent"
            >
              <Camera className="h-8 w-8" />
              <span className="text-xs mt-2 text-center">Add Images</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Images</DialogTitle>
            <DialogDescription>
              Recommended dimensions: 1920x1080px. Max file size: 5MB per image.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="picture">Pictures</Label>

              <div className="flex h-10 w-full rounded-md border border-input bg-white text-sm">
                <Label
                  htmlFor="picture"
                  className="flex h-full items-center whitespace-nowrap rounded-l-md border-r bg-primary px-3 text-primary-foreground hover:bg-primary/90 cursor-pointer"
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
