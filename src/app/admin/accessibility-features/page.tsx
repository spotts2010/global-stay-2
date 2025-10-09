// src/app/admin/accessibility-features/page.tsx
import 'server-only';
import AccessibilityFeaturesManagementClient from '@/components/AccessibilityFeaturesManagementClient';
import { fetchAccessibilityFeatures } from '@/lib/firestore.server';
import { AmenityOrInclusion } from '@/lib/data';

// This page now correctly fetches the single master list of accessibility features.
export default async function AccessibilityFeaturesPage() {
  const initialFeatures = (await fetchAccessibilityFeatures()) as AmenityOrInclusion[];

  return (
    <div className="flex-1 space-y-6">
      <AccessibilityFeaturesManagementClient initialFeatures={initialFeatures} />
    </div>
  );
}
