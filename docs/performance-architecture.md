// docs/performance-architecture.md

# Performance Architecture

Global Stay 2.0 has a deliberate performance-oriented structure designed to minimize bundle sizes and prevent hydration instability.

## Core Rules

1. **No Inlining Heavy UI**: Heavy client-side code (Maps, Drag & Drop, complex Dialogs) must not be inlined into large page components.
2. **Feature Folders**: Isolated heavy UI is kept in dedicated folders:
   - `src/components/maps/`
   - `src/components/photos/`
   - `src/components/pois/`
   - `src/components/units/`
3. **Lazy Loading**: Use `next/dynamic` with `ssr: false` for all heavy modules.
4. **Thin Page Components**: Route components should be thin wrappers that compose lazy-loaded feature modules.

## Implemented Examples

- **Photos**: Drag/drop grid moved to `src/components/photos/photos-dnd-grid.tsx`.
- **POI**: Autocomplete logic extracted to `src/components/pois/places-autocomplete.tsx`.
- **Units**: Actions and dialogs moved to `src/components/units/unit-actions-cell.tsx`.
- **Maps**: All map-heavy logic moved to specialized map components under `src/components/maps/`.

## Bundle Optimization

- Browser-only dependencies are strictly kept out of main route components.
- Provider setup is centralized to avoid redundant nesting.
