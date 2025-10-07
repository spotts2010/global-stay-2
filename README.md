# Global Stay 2.0

This is a Next.js project for "Global Stay 2.0", an accommodation booking platform. This project is being developed in Firebase Studio.

## Core Features

- **Accommodation Search**: Search accommodations by location, dates, and number of guests.
- **Accommodation Listings**: Display accommodation listings with details, photos, pricing, and ratings.
- **Accommodation Details**: View detailed information about an accommodation, including amenities and availability.
- **User Account Management**: A dedicated section for users to manage their profile, settings, bookings, and favorites.
- **Admin Dashboard**: A separate section for administrators to manage listings, users, and system settings.

## Features Implemented

- **Homepage**: Displays curated collections and top-rated stays. Includes a comprehensive search form and an interactive map.
- **Accommodation Listings & Details**: Pages dynamically pull data from Firestore to display property information.
- **Search & Results**: Users can search for properties, and the results are displayed on a dedicated page.
- **Authentication**: Full login and signup flows with email/password and Google authentication are implemented.
- **Favorites System**: Users can save and manage a list of their favorite properties, which is persisted in their browser.
- **Account & Admin Sections**: Both have dedicated layouts with consistent, collapsible sidebar navigation for managing different aspects of the application.
- **Placeholder Pages**: All account and admin sections have placeholder pages to represent the full site structure.
- **User Profile**: A detailed user profile page with editable fields and state management.
- **Travel Documents**: A secure section for users to store and manage their driver's license, passport, and travel insurance details.
- **Notification Center**: A detailed notification system with filtering, searching, and different notification types (e.g., system alerts, offers, booking updates). A dedicated page exists to view the details of a single notification.
- **Bookings Management**: A placeholder page for users to view their upcoming and past stays.
- **Functional "About Property" Form**: The form for editing the core details of a listing (name, type, location, etc.) is now fully functional and saves data directly to the Firestore database.
- **Functional Photo Gallery Management**: The "Photo Gallery" section within "Edit Listing" now allows for uploading, reordering (via drag-and-drop), and deleting images, with changes saved to the Firestore database. This functionality extends to the Site Settings hero image library and individual Unit photo galleries, all using a robust, production-safe API route.
- **Intelligent POI Categorization**: When adding a new Point of Interest (POI) via Google Places search, the system automatically assigns a logical category (e.g., 'Dining', 'Transport') based on the type of place selected. This provides a smarter default than just 'Unassigned', which the host can still override.
- **Centralized Image Data**: Placeholder, hero, and collection images are now managed via a single `placeholder-images.json` file, ensuring consistency and simplifying updates.

## Notification System Logic

### General Behavior

- **Unread State**: Unread notifications have a distinct blue background in the list to make them stand out. Once a notification is viewed (by clicking on its row), it is marked as read, and its background becomes white.
- **Filtering**: Users can filter notifications by "All," "Read," and "Unread" statuses. They can also use a keyword search to find specific notifications.
- **Archiving**: All notifications are automatically archived after 90 days.
- **Important Flag**: Users can flag a notification as "Important." Flagged notifications are exempt from the 90-day archiving rule and will be retained indefinitely until the user un-flags them.

### Default Settings & Unsubscribing

- **Initial Setup**: When a new user creates an account, all notification types are enabled by default for both "In-App" and "Email" delivery. This ensures they receive important updates from the start.
- **User Control**: Users can change their preferences at any time from the "Manage Notifications" page. They can opt-out of any notification (except mandatory system alerts) by unchecking the corresponding boxes.
- **Unsubscribe All**: An "Unsubscribe from All Notifications" button provides a one-click option to opt-out of all non-essential communications.

### Notification Types & Actions

The action buttons displayed on the notification detail page change based on the notification's `type`.

- **System Notifications**:
  - **Purpose**: Critical system-wide announcements (e.g., scheduled maintenance) or informational updates (e.g., new features).
  - **Behavior**: These are always pinned to the top of the notification list if unread. They cannot be sorted by the user. "In-App" and "Email" delivery are mandatory and cannot be disabled.
  - **Actions**: Mark as Read.
  - **Expiry & Deletion**: System notifications with a set expiry date (e.g., maintenance alerts) cannot be deleted by the user and will be removed automatically after that date. System notifications without an expiry (e.g., feature announcements) can be deleted by the user.

- **Payment Method / Account**:
  - **Purpose**: Alerts related to the user's account or payment methods (e.g., expiring credit card).
  - **Actions**: Mark as Read, Delete, Flag as Important, Update Payment Method (links to payment settings).

- **Travel Partner Requests**:
  - **Purpose**: To manage invitations from other users.
  - **Actions**: Approve, Deny, Mark as Read, Flag as Important. (Cannot be deleted until actioned).
  - **Workflow**: When a user approves or denies a request, a corresponding notification is sent back to the original sender.

- **Upcoming Trips**:
  - **Purpose**: Reminders and information about upcoming bookings. May include AI-powered suggestions for local activities.
  - **Actions**: Mark as Read, Delete, Flag as Important, View Booking Details.

- **3rd Party Offers & Marketing**:
  - **Purpose**: Promotional content and special offers.
  - **Actions**: Mark as Read, Delete, Flag as Important, Unsubscribe (links to notification management).

- **My Alerts**:
  - **Purpose**: Notifications triggered by user-created alerts (e.g., price drops, availability for specific criteria).
  - **Logic**: An alert must be "Active" for the AI to perform a daily search for matching deals. This continues until the alert is 'Paused' or 'Deleted'. When a match is found, a notification is created in the "View Notifications" table. The delivery method (Push, Email, In-App) depends on the user's notification settings.
  - **Actions**: Mark as Read, Delete, Flag as Important, View Listing.

## In Progress / Future Features

- **Dynamic Collections via Tagging**:
  - **Purpose**: To automatically associate listings with one or more curated collections based on tags.
  - **Implementation**:
    - Add a `tags` array field (e.g., `['beach', 'luxury', 'villa']`) to the accommodation data model in Firestore.
    - Create a new admin interface to manage these tags on each listing.
    - Update the "Collections" page to dynamically filter and display accommodations that match the tags associated with each collection (e.g., the "Beach Villas" collection would show all listings tagged with `beach` and `villa`).
- **Dynamic Amenity Loading**: Refactor the amenities management in the admin section to dynamically load the list of available amenities from a central Firestore collection, rather than using a hard-coded list in the component. This will make the system more scalable and easier to manage.
- **Secure Document Hosting**: Implement a secure, encrypted hosting solution for travel documents (passports, licenses). This feature would allow users to optionally attach their documents to bookings, speeding up the check-in and booking process. Security and privacy must be the top priorities.
- **Language Translations API**: Integration with a translation service for global language support.
- **Global Currency Conversion Integration**: Real-time currency conversion for pricing.
- **Dynamic Language/Currency Selector**: The Language/Currency indicator in the main header will become an actionable item. When clicked, it will open a modal allowing users to temporarily change their language and currency for the current browsing session. This modal will also provide a choice to make the change permanent by updating their default profile settings.
- **Address-to-Timezone Mapping**: Integration with a service to automatically determine a user's timezone based on their address for accurate default settings.
- **Email & Phone Verification**: A system to verify user contact information.
- **Avatar Image Moderation**: An automated (AI-assisted) or manual process to review and approve user-uploaded avatar images to prevent offensive content.
- **Two-Factor Authentication**: Full implementation of 2FA via SMS and Email.
- **Connected Devices Management**: Allow users to see and log out of devices where they are signed in.
- **Login History**: Provide users with a view of their recent login activity. The "Report" button will allow users to flag suspicious activity, which will create a support ticket for the Global Stay team to review.
- **Bookings Management (Admin)**: A new section in the Admin sidebar for hosts and administrators to manage all aspects of bookings. This will include:
  - **Central Calendar**: A visual calendar to see all upcoming, current, and past bookings for all properties.
  - **Booking Details**: The ability to view and manage individual booking details, including guest information and payment status.
  - **Payments**: A section to track payments, process refunds, and handle payment-related issues.
  - **Customer Communication**: A tool to contact guests directly regarding their bookings.
- **Listings Management Logic**:
  - **Publishing**: The "Publish" action makes an accommodation listing 'LIVE' and available for booking on the front end. Once published, the action changes to "Return to Draft".
  - **Return to Draft**: This action takes a live listing offline, changing its status back to "Draft" and making it unavailable for new bookings.
  - **Deletion vs. Archiving**: A listing can only be permanently "Deleted" if it is in "Draft" status and has no booking history. If a listing is "Published" or has any past or upcoming bookings, it must be "Archived" instead. This ensures that historical data associated with the listing is preserved for records and user booking history.
  - **User Access**: This new section within the "Edit Listing" form will be used to manage which users have permission to view and/or edit a specific listing. This will be integrated with the main user management system.
  - **Bulk Actions**: Implement the ability to select multiple listings on the "Manage Listings" page to perform bulk actions such as "Publish", "Return to Draft", "Archive", or "Delete".
- **My Travel Partners Workflows**:
  - **Add Family Member**: A manual entry process that checks for an existing user account via email. If no account exists, the member is added directly without an invitation.
  - **Invite a Partner**: Checks for an existing user. If the user exists, an email and system notification are sent for approval. If the user does not exist, an invitation email is sent to sign up and then approve the partner request.
  - **Pending Invitations**: This section will show the Name, Email, and Sent Date of pending requests, with options to 'Resend Request', 'Edit Details' (e.g., correct a typo in the email), or 'Remove' the request entirely.
  - **Denied Requests**: A mechanism to notify the requester if a partner invitation is denied, with a potential 'Denied Requests' section to manage and possibly resend these requests.
- **Payment Method Expiry Notifications**: Send notifications regarding a payment method that is expiring soon. Notifications to be sent automatically at 30 days, 7 days, and 1 day before expiry. A final email will be sent the day after expiry if the method has not been updated or removed.
- **Alternative Payment Methods**: Integrate with Crypto (e.g., Bitcoin) and other alternative payment systems. Note: Financial data will not be stored directly; integration will use secure tokens (e.g., from Stripe) or hosted fields.
- **Dynamic "Explore the Area" Map**: The map on the homepage currently displays a random destination from a predefined list of popular global cities to inspire visitors. In the future, once a sufficient volume of booking data is available, this will be updated to dynamically feature popular destinations based on real user bookings within Global Stay 2.0.
- **Date & Time Formatting**: Add an option to the "Currency & Language" page to allow users to override the default date and time formatting, which is initially set based on their profile's country selection. This would allow a user in the US to select a UK date format (DD/MM/YYYY) if they prefer.
- **Contact Host**: Consider a "Contact" button on booking cards. This would initiate an internally managed communication thread between the guest and the property host, possibly integrated within the notification system or a new dedicated messaging page.
- **Dynamic Language/Currency Selector**: The Language/Currency indicator in the main header is an actionable item. When clicked, it opens a modal allowing users to temporarily change their language and currency for the current browsing session. This modal will also provide a choice to make the change permanent by updating their default profile settings.
- **Points of Interest Enhancements**:
  - **Customer-Facing Map View**: On the front-end accommodation detail page, implement an interactive map that displays markers for all saved points of interest. These could be color-coded by category, with a different marker for the property's location. This allows guests to visually understand the proximity of attractions. A "View Map" option could trigger this.
  - **Map Directions**: Clicking on a point of interest marker on the map should generate a Google Maps Directions URL, showing the route from the property to that point of interest.
  - **Bulk Import**: Allow hosts to add multiple points of interest at once by entering a list of addresses or Google Place IDs.
  - **API Quota Management**: Implement strategies (like caching or deferred requests) to manage and minimize calls to the Google Places API to stay within usage limits.
- **Property Type Management**: A dedicated settings page for Super Admins to manage the available "Property Types" (e.g., Hotel, Hostel, Villa). This would allow adding new types, editing existing ones, or removing them from the system. It should also support importing a list of types from a CSV file.
- **Rebuild of Points of Interest page**: The "Places & Points of Interest" feature is being rebuilt to provide a more stable and user-friendly experience for managing listing locations.
- **Unit Setup Enhancements**:
  - **Floor / Building Location**: Add an optional field to the "Basic Info" section of a unit to specify its location within the property (e.g., "Second Floor", "Building B").
  - **Tags**: Add a multi-select tagging system to units for filtering and identification (e.g., “Sea View”, “Pet-Friendly”, “Non-Smoking”).
  - **Internal Notes**: Add a multi-line text area for admin-only notes about a specific unit, not visible to guests.
  - **Layout Details**: Add fields for Floor Level/Building Wing, Room Size (m²/ft²), and Sleeping Arrangement Notes to provide more granular detail about the unit's physical layout.
  - **Automated Occupancy Calculation**: The "Max Occupancy" for a unit will be automatically calculated based on the total capacity of all beds configured (`Sleeps` x `Qty`). The "Min. Occupancy" field remains optional, but if a value is entered, it will be enforced during the booking process to ensure minimum guest requirements are met.
  - **Pricing (Phase 2)**:
    - **Seasonal Rates**: Allow hosts to define date ranges with different base pricing (e.g., higher rates for summer, lower for winter).
    - **Day-of-Week Pricing**: Implement different rates for weekdays versus weekends.
    - **Promotions & Discounts**: Add options for long-stay discounts (e.g., 10% off for 7+ nights) and early-bird offers.
    - **Dynamic Pricing Integration**: Plan for future integration with third-party dynamic pricing APIs like PriceLabs.
    - **Per-Bed Pricing**: For hostel-style units, enable pricing on a per-bed basis rather than per-room.
  - **Inclusions (Phase 2)**:
    - **Chargeable Extras**: Add the ability to mark specific inclusions as having an additional cost (e.g., “Towels $5 hire”, “Parking $10 per night”).
    - **Photos/Icons**: Allow hosts to associate an icon or photo with each inclusion for a richer display on the front-end.
    - **Grouping & Priority**: Implement a system to group inclusions and set a display priority, allowing hosts to emphasize key features like A/C, WiFi, or a TV.
  - **Custom Inclusions Workflow**:
    - **Verification**: Custom inclusions added by hosts must be reviewed by an admin.
    - **Approval**: If approved, the custom inclusion is added to the master list under an appropriate category for future use by all hosts.
    - **Denial**: If denied, the inclusion is hidden from view, and an automated system notification and email are sent to the host, explaining the reason for the denial (e.g., already exists, inappropriate, etc.).

### Resolved Issues

- **Rich Text Editor Overhaul** (08/10/2025): A series of issues with the TipTap rich text editor on the "Legal Pages" admin screen have been resolved.
  - **Runtime Error**: Fixed a `TypeError: Cannot destructure property 'getFieldState' of 'useFormContext(...)'` by ensuring the editor components were correctly wrapped within the `Form` provider.
  - **Toolbar Functionality**: Corrected a focus-stealing issue that prevented list and heading buttons from working. All toolbar toggles now include `onMouseDown={(e) => e.preventDefault()}` to maintain editor focus.
  - **Toolbar UI**: Replaced ambiguous 'H' icons with clear `H1`, `H2`, `H3`, and `P` labels to make formatting options intuitive.
  - **Cursor Visibility/Padding**: Resolved a persistent issue where the editor's focus ring would hide the cursor at the beginning or end of a line. This was fixed by restructuring the component to apply padding to a wrapper `div` instead of the `.ProseMirror` class, which was being overridden by TipTap's internal styles.
  - **Content Styling**: Installed and configured the `@tailwindcss/typography` plugin to properly render saved HTML content (headings, lists, etc.) on the front-end using `prose` classes.
  - **Placeholder**: Added a "Start typing..." placeholder to the editor for a better user experience when it's empty.
- **Image Upload Functionality** (Resolved: 07/10/2024): A persistent series of errors ("Failed to fetch", "req.on is not a function", "bucket does not exist") were preventing image uploads from working correctly across the admin panel (Property Gallery, Unit Gallery, Site Settings). The root cause was a combination of a non-existent Firebase Storage bucket and incorrect initialization of the Firebase Admin SDK. The issue has been fully resolved by:
  1.  The user creating the necessary Storage Bucket in the Firebase Console.
  2.  Updating the Firebase Admin initialization code (`src/lib/firebaseAdmin.ts`) to correctly use the `storageBucket` environment variable.
  3.  Implementing a production-grade `storage.rules` file to secure the new bucket.
  4.  Refactoring the upload API route (`src/app/api/listings/[id]/upload/route.ts`) to use modern `req.formData()` and to correctly handle file buffers, removing the incompatible `formidable` dependency. This route now handles uploads for properties, individual units, and site-wide images.
- **`lint-staged` Pre-commit Hook Conflict** (Resolved: 07/10/2024): A conflict was occurring during commits where `lint-staged` would modify files that also had unstaged changes, causing `git` to abort. This was resolved by adding `"git add"` to the `lint-staged` script in `package.json`, which automatically stages the changes made by the linter and formatter.
- **`use()` Hook in Client Component** (Resolved: 26/09/2024): The `/admin/listings/[id]/edit/pois` page was incorrectly using the React `use()` hook within a `useEffect` block, which is not a valid pattern and was causing data fetching to fail intermittently. The `use()` hook was removed, and the component now relies solely on standard `useEffect` for client-side data fetching, ensuring that the POIs load correctly and consistently.
- **Incorrect POI Category Mapping** (Resolved: 26/09/2024): Natural features like beaches were being incorrectly assigned the 'Default' category. This was because the `natural_feature` place type from Google was missing from the category mapping function. The mapping has been updated to correctly assign these places to the 'Nature & Outdoors' category.
- **Map Interaction Issues** (Resolved: 26/09/2024): The interactive maps on both the accommodation detail page and the "Edit Listing" page were not allowing users to pan or zoom. This was caused by the map components being initialized without a valid `mapId`. The issue was resolved by adding `mapId="DEMO_MAP_ID"` to the `<Map>` components, which is a requirement for using Advanced Markers and enables full interactivity.
- **404 Errors on Hard Refresh** (Resolved: 22/09/2024): The `/account/my-stays/upcoming` and `/account/my-stays/past` pages were consistently producing a 404 error on a hard refresh. This was resolved by fixing an issue in the routing and layout structure.
- **`useSearchParams()` Error** (Resolved: 22/09/2024): The build failed with a `useSearchParams() should be wrapped in a suspense boundary` error on the `/admin/listings` page. This was resolved by wrapping the `ListingsClient` component (which uses the hook) in a `<Suspense>` boundary on the server component page.
- **Linting Error on Commit** (Resolved: 22/09/2024): A pre-commit hook was failing due to an ESLint error (`no-async-client-component`) in the `src/components/SearchParamsClient.tsx` file. This file was a redundant and unused duplicate of the home page. The issue was resolved by deleting the file.
- **Admin Area Layout & Routing Issues** (Resolved: 22/09/2024): A series of issues related to Next.js App Router conventions were resolved. This included:
  - **Clunky UI**: The "Edit Listing" section was refactored to use a single, dedicated sidebar that replaces the main admin sidebar, providing a cleaner, full-screen editing experience.
  - **404 & Runtime Errors**: Multiple 404 and Firebase runtime errors in the `/admin/listings` pages were fixed. The root causes were improper use of client-side hooks in server components, incorrect Firebase SDK initialization, and mixing client/server SDKs within Server Actions. The codebase has been refactored to follow correct Next.js and Firebase best practices.
  - **Incorrect `params` Handling**: Several components were accessing `params` directly instead of using `React.use()` as required by the latest Next.js version, which was causing console errors. This has been fixed across the affected admin pages.
- **`react-beautiful-dnd` Console Warning** (Resolved: 22/09/2024): A development-only warning (`Invariant failed: isDropDisabled must be a boolean`) that appeared in the console on the "Photo Gallery" edit page has been resolved.
- **Admin Map Interaction** (Resolved: 27/09/2024): The map on the `/admin/listings/[id]/edit/about` page now correctly supports drag and zoom functionality. The issue was resolved by implementing the modern `Places API (New)` and correctly managing the map's camera state, preventing conflicts that previously locked user interaction.
