# Global Stay 2.0

Global Stay 2.0 is a modern accommodation booking platform built with performance and scalability in mind. It features a robust search engine, comprehensive listing management, and a personalized user experience powered by Generative AI and real-time Firebase integration.

## Core Features

- **Advanced Search**: Location-based search with interactive map views and dynamic filtering.
- **Listing Management**: Professional property and unit configuration for hosts and admins.
- **Notification Center**: A sophisticated, multi-channel alert system for bookings, requests, and offers.
- **User Accounts**: Secure storage for travel documents, favorites, and personal preferences.
- **AI-Powered Insights**: Personalized stay recommendations and intelligent POI categorization.

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/) & [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Firebase](https://firebase.google.com/) (Firestore, Authentication, Storage)
- **AI Toolkit**: [Genkit](https://firebase.google.com/docs/genkit) (Generative AI)
- **Maps**: [Google Maps Platform](https://developers.google.com/maps)

## Getting Started

### Local Development

1.  **Clone the repository**
2.  **Environment Setup**: Create a `.env.local` file with your Firebase and Google Maps credentials.
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```
5.  **Access the app**: Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Documentation

Detailed documentation is organized by domain in the `/docs` folder:

- [**Overview & Architecture**](./docs/overview.md)
- [**Features**](./docs/features/listings.md) (Search, Listings, POIs, etc.)
- [**Core Systems**](./docs/systems/notification-system.md) (Notifications, Images, Auth)
- [**Development Guide**](./docs/development/project-structure.md) (Coding Standards, Structure)
- [**Performance Strategy**](./docs/performance-architecture.md) (Lazy Loading, Bundle Optimization)
- [**Roadmap**](./docs/roadmap/future-features.md)
- [**Changelog**](./docs/changelog/resolved-issues.md)
