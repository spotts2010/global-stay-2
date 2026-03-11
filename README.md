# Global Stay 2.0

Global Stay 2.0 is a modern accommodation booking platform designed for performance, scalability, and modular architecture.

The platform provides powerful property discovery tools, professional listing management, and personalized travel experiences powered by AI and real-time Firebase services.

---

## Core Features

- **Advanced Search**  
  Location-based discovery with map views, filters, and contextual points of interest.

- **Listing Management**  
  Professional property and unit configuration tools for hosts and administrators.

- **Notification Center**  
  Multi-channel alerts for bookings, offers, and account activity.

- **User Accounts**  
  Secure storage for travel documents, preferences, and saved listings.

- **AI-Powered Insights**  
  Personalized stay recommendations and intelligent POI categorization.

---

## Tech Stack

- **Framework** — Next.js 15 (App Router)
- **UI System** — ShadCN UI + Tailwind CSS
- **Backend** — Firebase (Firestore, Authentication, Storage)
- **AI Toolkit** — Genkit
- **Maps** — Google Maps Platform

---

## Repository Overview

The project follows a modular architecture designed for scalability, maintainability, and performance.

Key directories:

**/app**  
Next.js App Router routes and page-level components.

**/components**  
Reusable UI components and feature modules grouped by domain.

**/components/maps**  
Google Maps integrations and location-based UI components.

**/components/photos**  
Image upload, gallery management, and media handling.

**/components/pois**  
Points-of-interest search, autocomplete, and location tools.

**/components/units**  
Property unit configuration and management components.

**/lib**  
Shared utilities, services, helpers, and integrations.

**/docs**  
Full project documentation including architecture, systems, development standards, and performance strategy.

Start with the documentation index:

→ **docs/index.md**

---

## Getting Started

### Local Development

1. Clone the repository

2. Create a `.env.local` file containing your Firebase and Google Maps credentials

3. Install dependencies

```bash
npm install
```

4. Start the development server

```bash
npm run dev
```

5. Open the application

```
http://localhost:3000
```

---

## Documentation

Project documentation is organized in the `/docs` directory and structured by domain.

Start here:

**→ [Documentation Index](./docs/index.md)**

Documentation includes:

- **Architecture** — Platform structure and design decisions
- **Features** — Search, listings, POIs, accounts, and notifications
- **Systems** — Authentication, image management, and data models
- **Development Standards** — Coding rules, component architecture, and data-fetching patterns
- **Performance Strategy** — Bundle optimization and lazy-loading architecture
- **Roadmap & Changelog**

---

## Architecture Principles

Global Stay 2.0 follows a performance-focused architecture designed to support long-term scalability.

Key principles include:

- **Thin route components**
- **Heavy UI isolated into feature modules**
- **Dynamic imports for large client-side features**
- **Lowercase-hyphen file naming**
- **AI-assisted development guardrails**

These principles help maintain fast load times, clean code separation, and sustainable growth as the platform evolves.

---

## Project Status

Global Stay 2.0 is currently in **active development**.

The platform architecture, documentation structure, and core systems are being refined prior to production deployment.

Security reviews, scalability testing, and deployment infrastructure will be completed before any public release.

---

## License

Copyright (c) 2026 Sam Potts

All rights reserved.

This repository contains proprietary software under active development.

The code is provided for internal collaboration between authorized contributors only.  
It may not be copied, redistributed, or used outside this project without permission from the project owner.

This software is not production-ready and may contain incomplete or experimental features.
