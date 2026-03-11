// docs/performance/bundle-optimization.md

# Bundle Optimization

To maintain a fast initial load time, Global Stay 2.0 aggressively optimizes its JavaScript bundles.

## Strategies

- **Code Splitting**: Feature-specific logic is only loaded on the routes that require it.
- **Icon Optimization**: Centralizing icons in `icons.ts` helps tree-shaking and prevents redundant imports.
- **Client SDK**: The Firebase Client SDK is used for frontend interactions, allowing for smaller, focused bundles compared to the Admin SDK.
