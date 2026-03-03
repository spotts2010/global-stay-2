// src/app/admin/listings/actions.ts
'use server';

import {
  updateAccommodationStatusAction as _updateAccommodationStatusAction,
  duplicateListingAction as _duplicateListingAction,
  deleteListingAction as _deleteListingAction,
} from '@/app/actions';

export async function updateAccommodationStatusAction(
  ...args: Parameters<typeof _updateAccommodationStatusAction>
) {
  return _updateAccommodationStatusAction(...args);
}

export async function duplicateListingAction(...args: Parameters<typeof _duplicateListingAction>) {
  return _duplicateListingAction(...args);
}

export async function deleteListingAction(...args: Parameters<typeof _deleteListingAction>) {
  return _deleteListingAction(...args);
}
