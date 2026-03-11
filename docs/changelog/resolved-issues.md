// docs/changelog/resolved-issues.md

# Resolved Issues

- **`<tbody>` Nesting & Hydration Errors** (13/10/2024): Refactored `UnitRow` to use a valid HTML structure, eliminating table-in-table hydration crashes.
- **Booking Card Z-Index & Transparency** (13/10/2024): Fixed visual stacking order and added `bg-card` to ensure readability during scrolling.
- **Cross-Origin Request Errors** (13/10/2024): Updated `next.config.ts` to support the Firebase Studio workstation environment.
- **Next.js 15 Async API Compliance** (13/10/2024): Awaited `params` and `searchParams` in all dynamic routes to prevent runtime errors.
- **Accessibility Feature Separation** (12/10/2024): Split features into "Shared (Property)" and "Private (Unit)" contexts.
- **Rich Text Editor Cursor Visibility** (08/10/2025): Adjusted padding and focus rings in the TipTap implementation to prevent cursor hiding.
- **Firebase Storage Upload Pathing** (07/10/2024): Standardized upload paths for Site, Property, and Unit images.
- **Map Interaction Lock** (27/09/2024): Implemented the new Places API and camera state management to prevent panning/zooming locks.
- **Context Provider Hydration Fix** (08/10/2024): Moved context-dependent data fetching into `useEffect` to prevent server-side access errors.
