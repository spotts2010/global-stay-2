"use client";

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { X } from 'lucide-react';

type PhotoGalleryProps = {
  images: string[];
  imageHints: string[];
};

export default function PhotoGallery({ images, imageHints }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  return (
    <>
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[500px] overflow-hidden rounded-lg">
          <div className="md:col-span-1 h-full">
            <Image
              src={images[0]}
              alt="Main accommodation view"
              width={800}
              height={600}
              className="object-cover w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
              data-ai-hint={imageHints[0]}
              onClick={() => openModal(images[0])}
              priority
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {images.slice(1, 5).map((src, index) => (
              <div key={index} className="relative">
                <Image
                  src={src}
                  alt={`Accommodation view ${index + 2}`}
                  width={400}
                  height={300}
                  className="object-cover w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                  data-ai-hint={imageHints[index + 1] || 'accommodation detail'}
                  onClick={() => openModal(src)}
                />
              </div>
            ))}
          </div>
        </div>
         <Button 
          variant="secondary"
          className="absolute bottom-4 right-4"
          onClick={() => openModal(selectedImage)}
        >
          Show all photos
        </Button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <Button
              size="icon"
              variant="ghost"
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-white"
            >
              <X size={32} />
              <span className="sr-only">Close gallery</span>
            </Button>
            <div className="p-4 flex-shrink-0">
               <Image
                src={selectedImage}
                alt="Selected accommodation view"
                width={1200}
                height={800}
                className="object-contain w-full max-h-[70vh] rounded"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4 border-t">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {images.map((src, index) => (
                   <Image
                      key={index}
                      src={src}
                      alt={`Thumbnail ${index + 1}`}
                      width={150}
                      height={100}
                      className={cn(
                        "object-cover w-full h-full cursor-pointer rounded-md hover:opacity-75",
                        selectedImage === src && "ring-2 ring-primary ring-offset-2"
                      )}
                      onClick={() => setSelectedImage(src)}
                    />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
