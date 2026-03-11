// docs/development/local-development.md

# Local Development Guide

## Prerequisites

- Node.js (Latest LTS recommended)
- npm or pnpm

## Setup Steps

1. **Install Dependencies**: `npm install`
2. **Environment Variables**: Populate `.env.local` with variables from `apphosting.yaml`.
3. **Seed Database**:
   ```bash
   npm run seed
   ```
   _Note: This script initializes the master lists for amenities and accessibility features._

## Commands

- `npm run dev`: Start Next.js development server.
- `npm run lint`: Run ESLint and Prettier.
- `npm run build`: Build the production application.
- `npm run test`: Run Jest unit tests.
