'use client';

import React, { useState, useTransition, useEffect } from 'react';
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
import { Save, Loader2, ImageIcon, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Accommodation } from '@/lib/data';
import { updateAccommodationAction, uploadImageAction } from '@/app/actions';
import { DragDropContext, type DropResult } from 'react-beautiful-dnd';

const PhotoGalleryDND = dynamic(() => import('./PhotoGalleryDND'), { ssr: false });

export default function PhotosPageClient({ listing }: { listing: Accommodation }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>(listing?.images || []);
  const [isDirty, setIsDirty] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    toast({
      title: 'Image Marked for Deletion',
      description: 'The image has been removed. Save changes to confirm.',
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFileToUpload(file);
  };

  const handleUploadImage = async () => {
    if (!fileToUpload) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', fileToUpload);

    const result = await uploadImageAction(formData);
    if (result.success && result.url) {
      setImages((prev) => [...prev, result.url]);
      toast({
        title: 'Image Uploaded',
        description: 'Image added to the gallery. Save changes to confirm.',
      });
      setFileToUpload(null);
      setIsAddModalOpen(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: result.error || 'An unknown error occurred.',
      });
    }
    setIsUploading(false);
  };

  const handleSave = () => {
    startTransition(async () => {
      const dataToSave = {
        images,
        image: images[0] || '', // first image is cover
      };
      const result = await updateAccommodationAction(listing.id, dataToSave);
      if (result.success) {
        toast({
          title: 'Changes Saved',
          description: 'The photo gallery has been updated.',
        });
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
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Property Photo Gallery
          </CardTitle>
          <CardDescription>
            Manage your listing&apos;s photos. The first image is the cover. Drag & drop to reorder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={onDragEnd}>
            <PhotoGalleryDND
              images={images}
              listing={listing}
              handleDeleteImage={handleDeleteImage}
              openAddModal={() => setIsAddModalOpen(true)}
            />
          </DragDropContext>
        </CardContent>
      </Card>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Image</DialogTitle>
            <DialogDescription>Choose an image file to upload to the gallery.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Picture</Label>
              <Input id="picture" type="file" onChange={handleFileChange} />
            </div>
            {fileToUpload && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ImageIcon className="h-4 w-4" />
                <span>{fileToUpload.name}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleUploadImage} disabled={isUploading || !fileToUpload}>
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4" />
              )}
              Upload Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="sticky bottom-0 py-4 flex justify-start bg-transparent">
        <Button onClick={handleSave} disabled={isPending || !isDirty}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
