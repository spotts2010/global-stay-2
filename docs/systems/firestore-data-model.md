// docs/systems/firestore-data-model.md

# Firestore Data Model

## Collections

### `accommodations`

- `name`: string
- `address`: map (structured components + lat/lng)
- `status`: enum (Published, Draft, Archived)
- `bookingType`: enum (room, bed, hybrid)
- `images`: array of strings (URLs)
- **Subcollection: `units`**
  - `price`: number
  - `bedConfigs`: array of objects
- **Subcollection: `pointsOfInterest`**
  - `name`: string
  - `category`: string

### `bedTypes`

- `name`: string
- `systemId`: string
- `sleeps`: number

### `legal_pages`

- `content`: string (HTML)
- `version`: number
- `lastModified`: timestamp
