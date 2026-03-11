// docs/development/coding-standards.md

# Coding Standards

These standards ensure consistency, maintainability, and compatibility with AI-assisted development.

---

## Core Standards

### TypeScript

Use strict typing. Avoid `any` where possible.

### Server Components

Prefer Server Components for data fetching to reduce client-side JavaScript.

### File Naming

Use **lowercase-hyphen naming** for all files and folders.

Correct:

- `share-button.tsx`
- `places-autocomplete.tsx`
- `unit-actions-cell.tsx`

Incorrect:

- `ShareButton.tsx`
- `PlacesAutocomplete.tsx`

---

### Filepath Comments

Always include a filepath comment at the top of every new or updated file.

Example:

```ts
// src/components/units/unit-actions-cell.tsx
```

---

### Error Handling

Use the central `errorEmitter` for Firestore permission errors to provide contextual feedback during development.

---

### Icons

Use `src/lib/icons.ts` as the central barrel for shared iconography.

---

## Component Guidelines

### Component Size

Components should remain focused and reasonably small.

If a component exceeds **~400–500 lines**, extract parts such as:

- dialogs
- table action cells
- toolbars
- map modules
- upload components
- autocomplete sections

Avoid creating monolithic components.

---

## Route File Guidelines

Route components inside the **Next.js App Router** should remain thin.

Route files should primarily:

- fetch data
- call server actions
- pass props
- compose feature components

Heavy UI logic should be extracted into dedicated components.

---

## Feature Folder Structure

Domain-specific features should live inside feature folders.

Examples:

- `src/components/maps/`
- `src/components/photos/`
- `src/components/pois/`
- `src/components/units/`

Avoid placing domain-specific components directly in `src/components` unless they are shared across multiple features.

---

## Dynamic Import Rule

Heavy client-side features should use dynamic imports when appropriate.

Examples include:

- Google Maps
- drag-and-drop libraries
- rich text editors
- large dashboards
- complex visualizations

This helps keep the initial bundle size small.

---

## Documentation Awareness

Before changing architecture, review:

- `docs/architecture.md`
- `docs/performance-architecture.md`
- `docs/ai-development-rules.md`
- `docs/development/coding-standards.md`

These documents define the intended project structure.
