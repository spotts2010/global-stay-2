'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';

type PhotoGalleryProps = {
  images: string[];
  imageHints: string[];
};

export default function PhotoGallery({ images, imageHints }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <>
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[500px] overflow-hidden rounded-lg">
          <div className="md:col-span-1 h-full cursor-pointer" onClick={() => openModal(0)}>
            <Image
              src={images[0]}
              alt="Main accommodation view"
              width={800}
              height={600}
              className="object-cover w-full h-full hover:opacity-90 transition-opacity"
              data-ai-hint={imageHints[0]}
              priority
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {images.slice(1, 5).map((src, index) => (
              <div
                key={index}
                className="relative cursor-pointer"
                onClick={() => openModal(index + 1)}
              >
                <Image
                  src={src}
                  alt={`Accommodation view ${index + 2}`}
                  width={400}
                  height={300}
                  className="object-cover w-full h-full hover:opacity-90 transition-opacity"
                  data-ai-hint={imageHints[index + 1] || 'accommodation detail'}
                />
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="secondary"
          className="absolute bottom-4 right-4"
          onClick={() => openModal(0)}
        >
          Show all photos
        </Button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <Button
            onClick={closeModal}
            className="absolute top-4 right-4 z-20 text-white rounded-full h-12 w-12 md:h-auto md:w-auto md:px-4 md:py-2 md:bg-black/50 md:hover:bg-white/10"
            aria-label="Close gallery"
            variant="ghost"
          >
            <X className="h-6 w-6 md:mr-2" />
            <span className="hidden md:inline">Close</span>
          </Button>

          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-16">
            {/* Navigation Controls */}
            <Button
              size="icon"
              variant="secondary"
              onClick={goToPrevious}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full opacity-80 hover:opacity-100 z-10"
              aria-label="Previous image"
            >
              <ArrowLeft />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={goToNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full opacity-80 hover:opacity-100 z-10"
              aria-label="Next image"
            >
              <ArrowRight />
            </Button>

            {/* Main Image Display */}
            <div className="relative w-full h-full">
              <Image
                src={images[currentIndex]}
                alt={`Selected accommodation view ${currentIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-contain"
              />
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50">
            <div className="flex justify-center">
              <div className="flex space-x-2 overflow-x-auto p-2">
                {images.map((src, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 relative w-24 h-16 cursor-pointer"
                    onClick={() => setCurrentIndex(index)}
                  >
                    <Image
                      src={src}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      sizes="96px"
                      className={cn(
                        'object-cover rounded-md transition-opacity',
                        currentIndex === index ? 'opacity-100 ring-2 ring-white' : 'opacity-60'
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
