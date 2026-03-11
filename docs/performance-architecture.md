// docs/performance-architecture.md

# Performance Architecture

Global Stay 2.0 employs a "Thin Route, Heavy Feature" architecture to ensure rapid initial page loads and smooth interactions in high-complexity environments like Firebase Studio.

## 1. Bundle Size Optimization

To keep the initial JavaScript payload small, we strictly control what is included in the main route bundle:

- **Icon Tree-Shaking**: All iconography is centralized in `src/lib/icons.ts`. This allows the build system to tree-shake unused icons and prevents redundant library imports across different pages.
- **Dependency Isolation**: Heavy libraries (e.g., `@vis.gl/react-google-maps`, `@dnd-kit/core`) are never imported at the top level of a route file.

## 2. Dynamic Imports & Lazy Loading

We use `next/dynamic` with `ssr: false` for all heavy client-side functionality.

### When to Lazy Load

- **Google Maps**: Any component rendering an interactive map.
- **Drag & Drop (DND)**: Photo reordering grids.
- **Rich Text Editors**: The TipTap legal page editor.
- **Charts**: Recharts dashboard widgets.

### Pattern: The Client Loader

We use a "Loader" pattern to manage skeletons and dynamic imports:

```tsx
// src/components/feature/feature-client-loader.tsx
const FeatureClient = dynamic(() => import('./feature-client'), {
  ssr: false,
  loading: () => <Skeleton className="h-96 w-full" />,
});
```

## 3. Feature-Folder Architecture

Heavy UI logic is physically separated from route components into dedicated domain folders:

- `src/components/maps/`
- `src/components/photos/`
- `src/components/pois/`
- `src/components/units/`

This prevents "Scope Creep" where a simple page component becomes a 1000-line monolithic file containing dialogs, tooltips, and state logic.

## 4. Use of Server Components

We leverage React Server Components (RSC) to perform the "Heavy Lifting" of data fetching:

- **Initial State**: Pages fetch their core data (listing IDs, basic text) on the server.
- **Serialized Passing**: Data is passed to Client Components as plain JSON objects via the `serializeFirestoreData` utility, preventing hydration mismatches between Server and Client date formats.

## 5. Avoiding Large Client Bundles

- **Thin Parent Routes**: Page files (`page.tsx`) should be lightweight. They should primarily handle data fetching and compose feature modules.
- **Dialog & Tooltip Extraction**: Complex Radix-based UI (like "Unit Actions" or "Delete Confirmation") is extracted into separate files within the feature folder. This keeps the main table rendering logic simple and fast.

## 6. Best Practices for New Features

When adding new functionality, follow these rules to maintain performance:

1. **Classify the Feature**: Is it "Heavy" (External libs, high interactivity) or "Light" (Pure React/Tailwind)?
2. **Extract Heavy Logic**: If heavy, place the core logic in a domain folder under `src/components/`.
3. **Use a Loader**: Wrap the heavy component in a dynamic import with a meaningful loading state (Skeleton).
4. **Keep Context Local**: Do not wrap the entire app in a provider if the feature is only used on one page. Use local providers or pass props.
5. **Minimize Inline JSX**: Avoid large chunks of JSX for dialogs or drawers directly inside a `map()` or `TableRow`. Extract these into child components.
