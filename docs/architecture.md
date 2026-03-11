// docs/architecture.md

# High-Level Architecture

Global Stay 2.0 is built as a hybrid serverless application using **Next.js 15 (App Router)** and **Firebase**. The architecture is designed to balance developer productivity with production-grade security and performance.

## 1. Next.js App Router Structure

The application follows the Next.js App Router paradigm, leveraging Server Components by default to reduce client-side JavaScript.

- **Server Components**: Used for initial data fetching (e.g., property details, listing counts) to minimize the "waterfall" effect and improve SEO.
- **Client Components**: Isolated to interactive parts of the UI (forms, maps, real-time listeners) using the `'use client'` directive.
- **Layouts**: Nested layouts are used to maintain state across navigation (e.g., the Admin Sidebar remains active while switching between listing tabs).

## 2. Firebase Integration

Firebase data access follows a hybrid approach:

- **Server-side:**: Firestore is accessed through server utilities (e.g. `fetchAccommodationById`, `fetchUnitsForAccommodation`) using the Firebase Admin SDK.
- **Client-side:**: Interactive features may subscribe to Firestore or perform reads using the Firebase Client SDK when real-time updates are required.
- This separation ensures sensitive operations remain server-side while interactive UI remains responsive.

## 3. Firestore Database Usage

The database is structured to support a hierarchical relationship between properties and their components:

- **Top-Level Collections**:
  - `accommodations`: Main property data (names, locations, metadata).
  - `bedTypes`: Master list of configurable sleeping arrangements.
  - `siteSettings`: Global configurations like hero images.
- **Subcollections**:
  - `/accommodations/{id}/units`: Specific rooms or beds belonging to a property.
  - `/accommodations/{id}/pointsOfInterest`: Places of interest near the property.

## 4. Admin vs. Public Structure

The app is logically split into two domains:

- **Public Site (`/accommodation/[id]`, `/results`)**: Optimized for read speed and SEO. It uses a combination of Server Components for metadata and Client Components for guest interaction (searching, selection).
- **Admin & Host Portal (`/admin`)**: A heavy CRUD environment. It features a sophisticated nested layout with dedicated sidebars for managing listings, units, and system-wide settings.

## 5. Component Structure

We follow an **atomic feature-based structure**:

- **Primitive UI**: Shared ShadCN components in `src/components/ui/`.
- **Feature Modules**: Isolated domain logic found in `src/components/{maps,photos,pois,units}/`.
- **Client Loaders**: Thin wrappers (`*-client-loader.tsx`) used to handle dynamic imports and skeletons for heavy client-side features.

## 6. API Routes

API routes (`src/app/api/`) are used for operations that require server-side execution or secret key management:

- **AI Recommendations**: Interfacing with Genkit flows.
- **Image Uploads**: Orchestrating secure multi-file transfers to Firebase Storage.
- **Legal Data**: Fetching serialized content for the administrative editor.

## 7. Image Upload System

The image management system is designed for robustness:

1. **Selection**: Handled by client-side forms with size validation.
2. **Transfer**: Sent via `FormData` to `/api/listings/[id]/upload`.
3. **Storage**: The API route uses `firebase-admin/storage` to save files to organized paths (e.g., `listings/{id}/units/{unitId}/...`).
4. **Public Access**: Public URLs are generated and returned to the client to update the Firestore document state.

## 8. Authentication Flow

- **Providers**: Email/Password and Google OAuth.
- **State Management**: The `useUser` hook and `useAuth` hook provide reactive access to the user object throughout the client tree.
- **Protection**: Authentication uses Firebase Authentication with Email/Password and Google OAuth. User state is accessed through React context providers and client hooks. Sensitive operations (writes, admin updates) are executed through server actions using the Firebase Admin SDK to prevent client-side privilege escalation.

## 9. Feature Domain Separation

To improve performance and maintainability, large UI features are isolated into domain folders.

Examples:

- `src/components/maps/`
- `src/components/photos/`
- `src/components/pois/`
- `src/components/units/`

Each domain folder contains feature-specific components, dialogs, and utilities.
Route files remain thin and primarily compose these domain modules.
