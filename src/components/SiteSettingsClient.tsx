'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageIcon, PlusCircle, Trash2, UploadCloud, Loader2, Save } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect, useTransition } from 'react';
import { updateHeroImagesAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { HeroImage } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function SiteSettingsClient({ initialImages }: { initialImages: HeroImage[] }) {
  const [images, setImages] = useState<HeroImage[]>(initialImages);
  const [isDirty, setIsDirty] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setIsDirty(JSON.stringify(images) !== JSON.stringify(initialImages));
  }, [images, initialImages]);

  const handleDelete = (urlToDelete: string) => {
    setImages((currentImages) => currentImages.filter((image) => image.url !== urlToDelete));
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
        const newImageUrls: HeroImage[] = result.urls.map((url: string, index: number) => {
          const fileName = filesToUpload[index].name.split('.')[0];
          return {
            url: url,
            alt: `Hero image of ${fileName}`,
            hint: 'hero background',
          };
        });

        setImages((prev) => [...prev, ...newImageUrls]);
        toast({
          title: `${newImageUrls.length} Image(s) Uploaded`,
          description: 'Images added to the library. Click Save to confirm.',
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
      const result = await updateHeroImagesAction(images);
      if (result.success) {
        toast({
          title: 'Library Updated',
          description: 'Your hero image library has been saved.',
        });
        setIsDirty(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: result.error,
        });
      }
    });
  };

  return (
    <div className="flex-1 space-y-6">
      <Card>
        <CardHeader className="flex-row items-start justify-between">
          <div className="flex flex-col space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              Home Page Image Library
            </CardTitle>
            <CardDescription>
              Manage the hero images that are randomly displayed on the home page.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload New Images</DialogTitle>
                  <DialogDescription>
                    Recommended dimensions: 1920x1080px. Max file size: 2MB.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="picture-upload">Pictures</Label>
                    <div className="flex h-10 w-full rounded-md border border-input bg-white text-sm">
                      <Label
                        htmlFor="picture-upload"
                        className={cn(
                          'flex h-full items-center whitespace-nowrap rounded-l-md border-r bg-primary px-3 text-primary-foreground hover:bg-primary/90 cursor-pointer'
                        )}
                      >
                        Choose Files
                      </Label>
                      <Input
                        id="picture-upload"
                        type="file"
                        multiple
                        onChange={handleFileChange}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.url} className="relative group aspect-video">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-lg object-cover"
                  data-ai-hint={image.hint}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(image.url)}>
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
