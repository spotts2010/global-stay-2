// docs/development/component-architecture.md

# Component Architecture

This document defines the preferred component structure used throughout Global Stay 2.0.

It complements:

- docs/architecture.md
- docs/performance-architecture.md
- docs/development/coding-standards.md

---

# Design System

The UI layer is built on:

- Tailwind CSS
- ShadCN UI components
- HSL-based CSS variables defined in `globals.css`

These variables enable theme consistency and future theme switching.

---

# Thin Route Pattern

Route files in the Next.js App Router should remain lightweight.

The `page.tsx` file should primarily:

- fetch data
- call server actions
- pass props
- compose feature components

Example:

```tsx
// src/app/admin/listings/[id]/edit/units/page.tsx

import UnitsPageClient from '@/components/UnitsPageClient';
import { fetchUnitsForAccommodation } from '@/lib/firestore.server';

export default async function UnitsPage({ params }) {
  const units = await fetchUnitsForAccommodation(params.id);

  return <UnitsPageClient initialUnits={units} />;
}
```

Avoid placing heavy UI or complex logic inside route files.

---

# Client Component Pattern

Interactive UI should live inside client components.

Client components are responsible for:

- UI state
- user interactions
- rendering interactive elements

Example:

```tsx
// src/components/units/unit-actions-cell.tsx
'use client';

export function UnitActionsCell({ unitId }) {
  return <button>Edit</button>;
}
```

Server-only logic should not be placed inside client components.

---

# Feature Domain Structure

Feature-specific components should be grouped into domain folders.

Examples:

```
src/components/maps/
src/components/photos/
src/components/pois/
src/components/units/
```

This keeps the component tree organized and prevents large generic folders.

Domain components should remain close to their related functionality.

---

# Extract Complex UI

If a component contains multiple dialogs, tooltips, or menus, extract them into smaller components.

Example extraction:

```
unit-actions-cell.tsx
delete-unit-dialog.tsx
duplicate-unit-dialog.tsx
```

Each component should ideally have a single responsibility.

---

# Dynamic Loading

Heavy client-side components should be dynamically loaded when appropriate.

Example:

```tsx
const MapComponent = dynamic(() => import('./map-component'), {
  ssr: false,
});
```

Dynamic imports should be used for:

- Google Maps
- drag-and-drop libraries
- rich text editors
- large dashboards
- complex visualizations

This helps reduce initial bundle size.

---

# Hydration Safety

Operations that produce browser-specific values must be deferred until after mount.

Examples:

- `new Date()`
- `window.location`
- `localStorage`
- browser-only APIs

These should be executed inside `useEffect` or after initial render to avoid hydration mismatches.

---

# Component Simplicity Rule

Prefer small, focused components over large monolithic files.

If a component becomes too large, extract:

- dialogs
- table action cells
- form sections
- upload widgets
- map modules

Readable code is preferred over overly complex abstractions.

---

# File Organization Pattern

Component files should generally follow this structure:

Imports  
Types  
Hooks  
Component  
Exports

Example:

```tsx
// src/components/example/example-component.tsx

import React from 'react';

type Props = {
  title: string;
};

export default function ExampleComponent({ title }: Props) {
  return <div>{title}</div>;
}
```

---

# Reusability Rule

Before creating a new component, check whether an existing component can be reused.

Shared components should live in:

```
src/components/ui/
```

Feature-specific components should remain inside their domain folders.

Avoid unnecessary duplication.
