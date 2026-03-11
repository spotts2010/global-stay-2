// docs/performance/lazy-loading-strategy.md

# Lazy Loading Strategy

We use `next/dynamic` to deferred the loading of heavy interactive modules.

## When to Lazy Load

- **Maps**: All Google Maps instances.
- **Drag & Drop**: Photo reordering grids.
- **Rich Text Editors**: TipTap editor components.
- **Charts**: Recharts dashboard components.

## Implementation Pattern

```tsx
const HeavyComponent = dynamic(() => import('@/components/feature/heavy-ui'), {
  ssr: false,
  loading: () => <Skeleton className="h-96 w-full" />,
});
```

This ensures the main page layout renders immediately without waiting for heavy external libraries.
