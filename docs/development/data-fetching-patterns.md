<!-- docs/development/data-fetching-patterns.md -->

# Data Fetching Patterns

This document defines the preferred data fetching patterns for Global Stay 2.0.

It exists to keep data access:

- performant
- predictable
- secure
- compatible with Next.js App Router
- aligned with the project’s performance architecture

It should be read alongside:

- `docs/architecture.md`
- `docs/performance-architecture.md`
- `docs/development/coding-standards.md`
- `docs/development/component-architecture.md`

---

## Core Principle

Prefer server-side data fetching by default.

Use client-side data fetching only when the UI genuinely requires:

- live interactivity
- browser-only state
- post-render user-driven updates
- real-time subscriptions

This helps reduce:

- client bundle size
- hydration risk
- duplicated fetch logic
- unnecessary Firestore reads

---

## 1. Preferred Pattern: Server First

Use Server Components or server utilities for initial page data whenever possible.

Preferred flow:

Server utility  
→ route/page server component  
→ client component (if needed)  
→ feature components

Example pattern:

```tsx
// src/app/admin/listings/[id]/edit/units/page.tsx

import 'server-only';
import UnitsPageClient from '@/components/UnitsPageClient';
import { fetchUnitsForAccommodation } from '@/lib/firestore.server';

export default async function UnitsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const units = await fetchUnitsForAccommodation(id);

  return <UnitsPageClient initialUnits={units} />;
}
```

This is the preferred pattern for:

- listing detail pages
- admin edit pages
- settings pages
- pages with stable initial data

---

## 2. Use Client Fetching Only When Needed

Client-side fetching is acceptable when the data depends on:

- mounted browser state
- client context
- user-triggered interactions
- real-time updates
- browser APIs

Examples:

- map interactions
- autocomplete results
- client-managed filters
- post-mount user preference behavior
- temporary UI-only fetches

Do not move server-fetchable data into the client unnecessarily.

---

## 3. Use Dedicated Server Utilities

Firestore reads should be centralized in dedicated server utilities where possible.

Examples:

- `fetchAccommodationById`
- `fetchUnitsForAccommodation`
- `fetchPointsOfInterest`

Benefits:

- consistent data shape
- easier refactoring
- reduced duplication
- clearer server/client boundaries

Do not scatter duplicate Firestore fetch logic across many route files.

---

## 4. Keep Route Files Thin

Route files should not contain large amounts of inline fetch logic.

Route files should primarily:

- resolve params
- call server utilities
- handle not-found/error cases
- pass data into client components

Avoid writing large blocks of Firestore logic directly inside route files when it can be extracted.

---

## 5. Prefer Initial Data via Props

If the page already has the data on the server, pass it down as props instead of re-fetching on the client.

Preferred:

```tsx
return <PointsOfInterest listing={listingData} initialPlaces={initialPlaces} />;
```

Avoid:

- server fetch on initial render
- then immediate duplicate client fetch for the same dataset

This wastes reads and increases complexity.

---

## 6. Avoid Duplicate Fetching

Do not fetch the same dataset in multiple layers unless there is a clear reason.

Avoid patterns like:

- server fetch
- then client fetch of identical data on mount
- then nested child fetch of the same data again

This causes:

- unnecessary Firestore usage
- slower pages
- inconsistent state
- more complicated debugging

If initial data is already available, use it.

---

## 7. Hydration Safety

Do not derive browser-only values during server render.

Examples of browser-only values:

- `window.location`
- `localStorage`
- browser timezone behavior
- dynamic viewport state
- mounted-only map values

These must be deferred to:

- `useEffect`
- user actions
- post-mount state updates

This avoids hydration mismatches.

---

## 8. Server Actions for Sensitive Writes

Use server actions for sensitive or validated write operations.

Examples:

- listing updates
- unit updates
- duplication workflows
- admin mutations
- validated status changes

Benefits:

- keeps sensitive logic off the client
- reduces privilege risk
- centralizes validation
- simplifies UI components

Client components should call server actions rather than embedding sensitive write logic directly.

---

## 9. API Routes Only When Appropriate

Use API routes only when a route handler is actually needed.

Good use cases:

- file uploads
- form-data parsing
- third-party callbacks
- operations requiring request/response semantics
- endpoints consumed outside normal component rendering

Do not default to API routes for standard page data fetching when a server component or server utility is sufficient.

---

## 10. Real-Time and Live Updates

Real-time listeners should be used selectively.

Use them only when the user experience genuinely benefits from live updates.

Examples where they may make sense:

- live notifications
- live booking status
- active dashboards
- collaboration-style interfaces

Do not use real-time listeners for stable admin forms or static detail pages unless necessary.

Real-time reads increase complexity and can inflate usage costs.

---

## 11. Serialization Rule

Data passed from server utilities to client components should be safe, plain, and serializable.

Avoid passing:

- Firestore document snapshots
- non-serializable objects
- class instances
- complex mutable SDK objects

Prefer plain JSON-shaped objects suitable for React props.

This reduces hydration issues and keeps client components simple.

---

## 12. Feature-Specific Data Loading

If a heavy feature is isolated into a domain component, its data strategy should remain aligned with its purpose.

Examples:

- map UI can be dynamically loaded after initial render
- drag-and-drop gallery can receive initial data via props
- autocomplete can fetch only when user interaction requires it

Do not force all data into the initial route bundle if the feature is not immediately needed.

---

## 13. Performance Rule

Data fetching choices must support the performance architecture.

Preferred priorities:

1. fetch on the server if possible
2. pass initial data via props
3. isolate heavy interactive features
4. fetch client-side only when truly necessary
5. avoid duplicate reads
6. avoid large client bundles caused by unnecessary client data logic

---

## 14. Common Anti-Patterns

Avoid these patterns unless explicitly justified.

### Anti-pattern: client fetching data available on the server

If the server already has access to the data, fetch it there.

### Anti-pattern: duplicated server and client fetches

Do not fetch the same dataset twice without reason.

### Anti-pattern: route components full of Firestore logic

Extract logic into server utilities.

### Anti-pattern: browser-only values during server render

Defer them until after mount.

### Anti-pattern: sensitive writes directly in the client

Use server actions.

### Anti-pattern: defaulting to API routes for standard page rendering

Prefer server components and server utilities first.

---

## 15. Practical Summary

For most pages:

- fetch data on the server
- keep route files thin
- pass initial data to client components
- use server actions for mutations
- use API routes only when request/response handling is actually needed
- use client-side fetching only for interactive or browser-dependent behavior

This is the default Global Stay 2.0 data loading strategy.
