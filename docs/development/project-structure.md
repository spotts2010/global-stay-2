// docs/development/project-structure.md

# Project Structure

```
src/
├── ai/             # Genkit flows and AI logic
├── app/            # Next.js App Router (pages and layouts)
├── components/     # UI components
│   ├── ui/         # ShadCN primitives
│   ├── maps/       # Extracted map features
│   ├── photos/     # Photo management features
│   ├── pois/       # POI features
│   └── units/      # Unit management features
├── context/        # React Context Providers
├── firebase/       # Client-side Firebase hooks and provider
├── hooks/          # Reusable custom hooks
├── lib/            # Utilities, data types, and server-side logic
└── services/       # External service integrations
```
