// docs/features/poi-system.md

# Points of Interest (POI) System

The POI system helps guests understand what is near a property.

## Intelligent Categorization

- When a host adds a POI via Google Places search, the system automatically assigns a category based on the place type.
- **Mapping Logic**:
  - `restaurant`, `cafe`, `bar` → **Dining**
  - `park`, `natural_feature` → **Nature & Outdoors**
  - `museum`, `zoo`, `casino` → **Attractions & Entertainment**
  - `hospital`, `pharmacy` → **Medical & Emergency**
- Hosts can override the default category if needed.

## Distance Calculation

- Distances are automatically calculated using the Haversine formula based on the property coordinates and the POI location.
- Respects user preferences for `km` or `miles`.
