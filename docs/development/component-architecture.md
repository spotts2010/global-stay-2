// docs/development/component-architecture.md

# Component Architecture

## Design System

- Built on **Tailwind CSS** and **ShadCN**.
- Uses HSL CSS variables in `globals.css` for easy theme switching.

## Composition

- **Thin Pages**: The `page.tsx` file should primarily handle data fetching and pass it to a `ClientLoader` or `Client` component.
- **Extracted Logic**: Complicated dialogs, forms, or tooltips should be extracted into the relevant domain folder (e.g., `src/components/units/`).

## Hydration

- Operations that produce browser-specific values (like `new Date()` or `window.location`) must be deferred to `useEffect` or state updates after mount to prevent hydration mismatches.
