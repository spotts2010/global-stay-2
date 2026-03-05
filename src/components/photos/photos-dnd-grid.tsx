// src/components/photos/photos-dnd-grid.tsx
'use client';

import React from 'react';
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
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { GripVertical, Trash2 } from '@/lib/icons';

function SortablePhoto({
  id,
  index,
  onDelete,
}: {
  id: string;
  index: number;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative w-40 h-40 rounded-lg group touch-none">
      <Image
        src={id}
        alt={`Property image ${index + 1}`}
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
}

export default function PhotosDndGrid({
  images,
  onReorder,
  onDelete,
}: {
  images: string[];
  onReorder: (next: string[]) => void;
  onDelete: (id: string) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = images.indexOf(active.id as string);
      const newIndex = images.indexOf(over.id as string);
      onReorder(arrayMove(images, oldIndex, newIndex));
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images} strategy={rectSortingStrategy}>
        <div className="flex flex-wrap gap-4">
          {images.map((img, index) => (
            <SortablePhoto key={img} id={img} index={index} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
