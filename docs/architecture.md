// docs/architecture.md

# High-Level Architecture

Global Stay 2.0 follows a modern full-stack serverless architecture.

## Frontend

- **Next.js 15**: Utilizing Server Components for initial data fetching and Client Components for heavy interactivity.
- **React 18**: Functional components with hooks-based state management.
- **Context API**: Used for cross-cutting concerns like User Preferences, Notifications, and Favorites.

## Backend (Firebase)

- **Firestore**: A NoSQL document database used for real-time storage.
- **Authentication**: Managed via Firebase Auth (Email/Password and Google OAuth).
- **Storage**: Used for hosting property and unit images.
- **Cloud Functions**: For server-side tasks such as AI responses and data aggregation.

## Integration

- **Google Maps SDK**: For location visualization and autocomplete.
- **Genkit**: Orchestrating AI flows for recommendations and categorization.
