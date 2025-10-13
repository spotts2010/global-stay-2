'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { X, ChevronLeft, ChevronRight } from '@/lib/icons';

interface PhotoGalleryProps {
  images: string[];
  onClose?: () => void; // Make onClose optional for when it's used as a page
  initialIndex?: number; // Allow setting an initial index
}

export default function PhotoGallery({ images, onClose, initialIndex = 0 }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isModalOpen, setIsModalOpen] = useState(!!onClose); // Open if onClose is provided

  const displayImages =
    images.length > 0 ? images : ['https://placehold.co/800x600/f1f5f9/f1f5f9?text=%20'];

  const openModal = (index: number) => {
    setCurrentIndex(index);
    if (onClose) {
      setIsModalOpen(true);
    }
  };

  const closeModal = useCallback(() => {
    if (onClose) {
      setIsModalOpen(false);
      onClose();
    }
  }, [onClose]);

  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
  }, [displayImages.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + displayImages.length) % displayImages.length);
  }, [displayImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, nextImage, prevImage, closeModal]);

  if (!onClose) {
    // Original page-based gallery
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[500px] overflow-hidden rounded-lg">
        <div className="md:col-span-1 h-full cursor-pointer" onClick={() => openModal(0)}>
          <Image
            src={displayImages[0]}
            alt="Main view"
            width={800}
            height={600}
            className="object-cover w-full h-full"
            priority
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {displayImages.slice(1, 5).map((src, index) => (
            <div
              key={index}
              className="relative cursor-pointer"
              onClick={() => openModal(index + 1)}
            >
              <Image
                src={src}
                alt={`View ${index + 2}`}
                width={400}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
        {/* The modal part for the page-based gallery will be handled by its own state */}
      </div>
    );
  }

  if (isModalOpen) {
    return (
      <div
        className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center"
        role="dialog"
        aria-modal="true"
        onClick={closeModal}
      >
        <Button
          onClick={closeModal}
          className="absolute top-4 right-4 text-white rounded-full h-12 w-12 z-[60] bg-black/50 hover:bg-black/70"
          aria-label="Close gallery"
        >
          <X className="h-6 w-6" />
        </Button>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white rounded-full h-12 w-12 z-[60] bg-black/50 hover:bg-black/70"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white rounded-full h-12 w-12 z-[60] bg-black/50 hover:bg-black/70"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <div
          className="relative w-full h-full flex items-center justify-center p-4 md:p-16"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-full">
            <Image
              src={displayImages[currentIndex]}
              alt={`Selected view ${currentIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 z-[60]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center overflow-x-auto space-x-2 p-2">
            {displayImages.map((src, index) => (
              <div
                key={index}
                className="flex-shrink-0 relative w-24 h-16 cursor-pointer"
                onClick={() => setCurrentIndex(index)}
              >
                <Image
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  fill
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
    );
  }
  return null;
}
