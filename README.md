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
- **Functional Photo Gallery Management**: The "Photo Gallery" section within "Edit Listing" now allows for uploading, reordering (via drag-and-drop), and deleting images, with changes saved to the Firestore database.

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

- **Chargeable Amenities**: A new option in the Admin section to mark specific amenities or inclusions (e.g., Mini Bar, Airport Transfer, Spa Treatments) as having an additional cost. On the front-end accommodation details page, these items will be displayed with a currency icon to clearly indicate to guests that charges apply.
- **Secure Document Hosting**: Implement a secure, encrypted hosting solution for travel documents (passports, licenses). This feature would allow users to optionally attach their documents to bookings, speeding up the check-in and booking process. Security and privacy must be the top priorities.
- **Image File Storage Backend**: Implement a file storage solution (e.g., Firebase Storage) to allow for actual file uploads in the "Photo Gallery" management section, replacing the current URL-based system.
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
  - **Customer-Facing Map View**: On the front-end accommodation detail page, implement an interactive map that displays markers for all saved points of interest. These could be color-coded by category, with a different marker for the property's location. This allows guests to visually understand the proximity of attractions.
  - **Map Directions**: Clicking on a point of interest marker on the map should generate a Google Maps Directions URL, showing the route from the property to that point of interest.
  - **Bulk Import**: Allow hosts to add multiple points of interest at once by entering a list of addresses or Google Place IDs.
  - **API Quota Management**: Implement strategies (like caching or deferred requests) to manage and minimize calls to the Google Places API to stay within usage limits.
- **Property Type Management**: A dedicated settings page for Super Admins to manage the available "Property Types" (e.g., Hotel, Hostel, Villa). This would allow adding new types, editing existing ones, or removing them from the system. It should also support importing a list of types from a CSV file.

### Known Issues

- **Map Interaction Issues**: The interactive map on the home page cannot be dragged or panned, and the accommodation markers are not clickable. Only the zoom controls are functional. This prevents users from properly exploring the map area.
- **(Resolved) 404 Errors on Hard Refresh**: The `/account/my-stays/upcoming` and `/account/my-stays/past` pages were consistently producing a 404 error on a hard refresh. This was resolved by fixing an issue in the routing and layout structure.
- **(Resolved) Linting Error on Commit**: A pre-commit hook was failing due to an ESLint error (`no-async-client-component`) in the `src/components/SearchParamsClient.tsx` file. This file was a redundant and unused duplicate of the home page. The issue was resolved by deleting the file.
- **(Resolved) Admin Area Layout & Routing Issues**: A series of issues related to Next.js App Router conventions were resolved. This included:
  - **Clunky UI**: The "Edit Listing" section was refactored to use a single, dedicated sidebar that replaces the main admin sidebar, providing a cleaner, full-screen editing experience.
  - **404 & Runtime Errors**: Multiple 404 and Firebase runtime errors in the `/admin/listings` pages were fixed. The root causes were improper use of client-side hooks in server components, incorrect Firebase SDK initialization, and mixing client/server SDKs within Server Actions. The codebase has been refactored to follow correct Next.js and Firebase best practices.
  - **Incorrect `params` Handling**: Several components were accessing `params` directly instead of using `React.use()` as required by the latest Next.js version, which was causing console errors. This has been fixed across the affected admin pages.
- **(Resolved) `react-beautiful-dnd` Console Warning**: A development-only warning (`Invariant failed: isDropDisabled must be a boolean`) that appeared in the console on the "Photo Gallery" edit page has been resolved.
