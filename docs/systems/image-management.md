// docs/systems/image-management.md

# Image Management System

A robust system for handling media across the platform.

## Photo Galleries

- **Property Gallery**: High-resolution images for the main listing.
- **Unit Gallery**: Specific images for rooms or beds.
- **Site Settings**: Library of hero images for the homepage background.

## Functionality

- **Drag & Drop Reordering**: Uses `@dnd-kit` for a smooth, production-safe reordering experience.
- **Storage Integration**: Images are uploaded directly to Firebase Storage via a specialized API route.
- **Path Logic**:
  - Properties: `listings/{listingId}/...`
  - Units: `listings/{listingId}/units/{unitId}/...`
  - Site: `site/...`

## Placeholders

- Centrally managed via `src/app/lib/placeholder-images.json` to ensure consistency during development.
