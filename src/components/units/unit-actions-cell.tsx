// src/components/units/unit-actions-cell.tsx
'use client';

import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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

import { Check, Copy, FaArchive, FilePen, Loader2, RotateCcw, Trash2 } from '@/lib/icons';

export default function UnitActionsCell({
  editHref,
  unitName,
  unitId,
  canPublish,
  status,
  isDuplicating,
  isDuplicatingThis,
  onDuplicate,
  onStatusChange,
  onDelete,
}: {
  editHref: string;
  unitName: string;
  unitId: string;
  canPublish: boolean;
  status: 'Published' | 'Draft' | 'Archived';
  isDuplicating: boolean;
  isDuplicatingThis: boolean;
  onDuplicate: (id: string) => void;
  onStatusChange: (id: string, next: 'Published' | 'Draft' | 'Archived') => void;
  onDelete: (id: string) => void;
}) {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-end gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <Link href={editHref}>
                <FilePen className="h-4 w-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit Unit</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDuplicate(unitId)}
              disabled={isDuplicating}
            >
              {isDuplicatingThis ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Duplicate Unit</TooltipContent>
        </Tooltip>

        {status === 'Draft' ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-green-600"
                onClick={() => onStatusChange(unitId, 'Published')}
                disabled={!canPublish}
              >
                <Check className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {canPublish ? 'Publish Unit' : 'A unique Unit Ref is required to publish.'}
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-amber-600"
                onClick={() => onStatusChange(unitId, 'Draft')}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Return to Draft</TooltipContent>
          </Tooltip>
        )}

        {status === 'Draft' ? (
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Delete Unit</TooltipContent>
            </Tooltip>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the &quot;{unitName}
                  &quot; unit.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(unitId)}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onStatusChange(unitId, 'Archived')}
              >
                <FaArchive className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive Unit</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
