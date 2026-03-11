// docs/development/coding-standards.md

# Coding Standards

- **TypeScript**: Use strict typing. Avoid `any` where possible.
- **Server Components**: Prefer Server Components for data fetching to reduce client-side JS.
- **File Naming**: Use lowercase-hyphen naming for all files and folders.
- **Filepath Comments**: Always include a filepath comment at the top of every new or updated file.
- **Error Handling**: Use the central `errorEmitter` for Firestore permission errors to provide contextual feedback in development.
- **Icons**: Use `src/lib/icons.ts` as the central barrel for all iconography.
