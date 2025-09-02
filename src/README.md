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

- **Secure Document Hosting**: Implement a secure, encrypted hosting solution for travel documents (passports, licenses). This feature would allow users to optionally attach their documents to bookings, speeding up the check-in and booking process. Security and privacy must be the top priorities.
- **Language Translations API**: Integration with a translation service for global language support.
- **Global Currency Conversion Integration**: Real-time currency conversion for pricing.
- **Email & Phone Verification**: A system to verify user contact information.
- **Avatar Image Moderation**: An automated (AI-assisted) or manual process to review and approve user-uploaded avatar images to prevent offensive content.
- **Two-Factor Authentication**: Full implementation of 2FA via SMS and Email.
- **Connected Devices Management**: Allow users to see and log out of devices where they are signed in.
- **Login History**: Provide users with a view of their recent login activity. The "Report" button will allow users to flag suspicious activity, which will create a support ticket for the Global Stay team to review.
- **My Travel Partners Workflows**:
  - **Add Family Member**: A manual entry process that checks for an existing user account via email. If no account exists, the member is added directly without an invitation.
  - **Invite a Partner**: Checks for an existing user. If the user exists, an email and system notification are sent for approval. If the user does not exist, an invitation email is sent to sign up and then approve the partner request.
  - **Pending Invitations**: This section will show the Name, Email, and Sent Date of pending requests, with options to 'Resend Request', 'Edit Details' (e.g., correct a typo in the email), or 'Remove' the request entirely.
  - **Denied Requests**: A mechanism to notify the requester if a partner invitation is denied, with a potential 'Denied Requests' section to manage and possibly resend these requests.
- **Payment Method Expiry Notifications**: Send notifications regarding a payment method that is expiring soon. Notifications to be sent automatically at 30 days, 7 days, and 1 day before expiry. A final email will be sent the day after expiry if the method has not been updated or removed.
- **Alternative Payment Methods**: Integrate with Crypto (e.g., Bitcoin) and other alternative payment systems. Note: Financial data will not be stored directly; integration will use secure tokens (e.g., from Stripe) or hosted fields.
- **Date & Time Formatting**: Add an option to the "Currency & Language" page to allow users to override the default date and time formatting, which is initially set based on their profile's country selection. This would allow a user in the US to select a UK date format (DD/MM/YYYY) if they prefer.
- **Contact Host**: Consider a "Contact" button on booking cards. This would initiate an internally managed communication thread between the guest and the property host, possibly integrated within the notification system or a new dedicated messaging page.

### Known Issues

- **404 Errors on Hard Refresh**: The `/account/my-stays/upcoming` and `/account/my-stays/past` pages consistently produce a 404 error when the page is hard refreshed in the browser. The page loads correctly with client-side navigation or after a full "Restart App" in the development environment. This suggests a server-side rendering or routing issue specific to this nested route that needs further investigation.
- **Calendar Date Highlighting**: The calendar component on the `/account/my-stays/upcoming` page incorrectly highlights booked days that fall outside of the currently displayed month. For example, a booking on October 3rd will appear highlighted in both the September and October views. This needs to be adjusted so that "outside" days are visually distinct and not styled as part of the booking.
- **Map Drag Issue**: The interactive map on the home page cannot be dragged or panned. Only the zoom controls are functional. This prevents users from exploring the map area. This issue persists even when the map is in full-screen mode.
