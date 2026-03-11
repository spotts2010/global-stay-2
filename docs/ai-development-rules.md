<!-- docs/ai-development-rules.md -->

# AI Development Rules

This document defines mandatory rules for AI-assisted development in Global Stay 2.0.

## Purpose

These rules exist to protect:

- performance architecture
- component structure
- file naming consistency
- bundle size discipline
- maintainability

AI tools must follow these rules unless explicitly instructed otherwise.

---

## 1. Preserve Existing Architecture

Do not undo or collapse the current architecture.

### Must preserve

- `src/components/maps/`
- `src/components/photos/`
- `src/components/pois/`
- `src/components/units/`
- `docs/architecture.md`
- `docs/performance-architecture.md`

### Do not

- merge extracted feature components back into large parent files
- replace dynamic imports with direct imports for heavy modules
- move feature-specific components into unrelated generic locations
- restructure folders for style preference alone

---

## 2. Keep Route Components Thin

Page-level and route-level components should stay lightweight.

### Route/page components should mainly:

- fetch data
- pass props
- compose feature modules

### Route/page components should not become:

- large interactive UI containers
- map-heavy components
- drag-and-drop implementations
- dialog-heavy action managers
- massive table row renderers

If a page grows too large, extract feature logic into a domain component.

---

## 3. Heavy UI Must Be Isolated

Any heavy client-side UI must be extracted into a dedicated component.

### Heavy UI includes

- Google Maps
- Places Autocomplete
- drag and drop
- large Radix dialog systems
- tooltip-heavy action cells
- rich text editors
- charts
- large interactive tables
- browser-only APIs

### Required pattern

- place heavy UI in an appropriate feature folder
- use `next/dynamic` where appropriate
- use `ssr: false` for browser-only modules when needed
- keep parent components clean

---

## 4. Feature Folder Rule

When a feature is domain-specific, place it in a domain folder.

### Existing domain folders

- `src/components/maps/`
- `src/components/photos/`
- `src/components/pois/`
- `src/components/units/`
- `src/components/share/` if reusable share features continue

### Rule

Do not place new feature-specific files loosely in `src/components/` unless they are genuinely shared across many domains.

---

## 5. File Naming Standard

All files must use lowercase hyphen naming.

### Correct

- `share-button.tsx`
- `places-autocomplete.tsx`
- `unit-actions-cell.tsx`

### Incorrect

- `ShareButton.tsx`
- `PlacesAutocomplete.tsx`
- `UnitActionsCell.tsx`

---

## 6. File Header Rule

All newly created code files should include a filepath comment at the top.

### Example

```tsx
// src/components/share/share-button.tsx
```

For documentation files, use:

```md
<!-- docs/ai-development-rules.md -->
```

---

## 7. Do Not Change Global Design Tokens for Local Features

Do not modify global theme variables in `globals.css` for a single button, section, or feature.

### Do instead

- use local utility classes
- use a local variant
- use scoped styling

### Do not

- repurpose `--accent`
- alter shared theme tokens for one component
- change app-wide colors unless explicitly asked

---

## 8. Google Maps Provider Rule

Do not create redundant nested `APIProvider` wrappers.

### Rule

If `APIProvider` already exists at the appropriate higher level, child map components must assume it is already available.

### Do not

- wrap every map component in its own `APIProvider`
- duplicate Google Maps provider setup across the tree

---

## 9. Central Icon Rule

Do not automatically add new icons to `src/lib/icons.ts`.

### Use this decision process

- if an icon is only used by one feature, keep it local to that feature
- only promote icons to `src/lib/icons.ts` when they are genuinely reused

This keeps features self-contained and avoids unnecessary growth of the shared icon barrel.

---

## 10. Minimize Unrelated Refactors

When implementing a feature:

- change only the files required
- do not refactor unrelated components
- do not rename files unless needed
- do not move code for style reasons alone

Small, safe, targeted changes are preferred.

---

## 11. Component Size Guideline

Avoid oversized components.

### Guideline

If a component becomes too large or mixes multiple concerns, extract:

- dialogs
- action toolbars
- row controls
- maps
- upload widgets
- autocomplete sections
- drag-and-drop blocks

Prefer focused components over mega-components.

---

## 12. Documentation-Aware Development

Before making structural changes, AI should respect:

- `docs/architecture.md`
- `docs/performance-architecture.md`
- `docs/development/coding-standards.md` if present
- this file: `docs/ai-development-rules.md`

If a requested change conflicts with documented architecture, preserve the documented structure unless explicitly instructed otherwise.

---

## 13. Safe Patterns for New Features

When adding a feature:

1. classify it as light or heavy
2. if heavy, isolate it into a feature component
3. place it in the right domain folder
4. keep the page component thin
5. avoid global styling changes unless explicitly requested
6. avoid shared-provider duplication
7. preserve current architecture

---

## 14. Forbidden Patterns

Do not do the following unless explicitly instructed:

- re-inline extracted heavy feature modules into parent components
- create PascalCase filenames
- add local feature styling by changing global theme tokens
- duplicate `APIProvider`
- move domain-specific files into random top-level component locations
- expand shared barrels prematurely
- introduce large direct imports of heavy libraries into route components

---

## 15. Recovery / Safety Rule

If a proposed AI change would significantly alter architecture, stop and preserve the current structure.

Safe recovery reference:

- branch: `main`
- performance/documentation baseline commit: `e60e07c`

---

## 16. Practical Summary

AI must:

- preserve the performance architecture
- keep route components thin
- isolate heavy UI
- use lowercase-hyphen filenames
- avoid unnecessary global styling changes
- avoid redundant providers
- prefer focused feature modules
- make the smallest safe change necessary
