// src/lib/serialize.ts
import { Timestamp } from 'firebase-admin/firestore';

/**
 * Recursively serializes Firestore data, converting Timestamps to ISO strings.
 * This ensures that data passed from Server Components to Client Components
 * is plain and serializable.
 * @param data - The data to serialize (can be of any type).
 * @returns The serialized data.
 */
export function serializeFirestoreData(data: unknown): unknown {
  if (!data) {
    return data;
  }

  // Convert Firestore Timestamps to ISO strings
  if (data instanceof Timestamp) {
    return data.toDate().toISOString();
  }

  // Recursively serialize arrays
  if (Array.isArray(data)) {
    return data.map(serializeFirestoreData);
  }

  // Recursively serialize objects
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    // This handles nested objects by creating a new object with serialized values.
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, serializeFirestoreData(value)])
    );
  }

  // Return primitive values as is
  return data;
}
