# Global Stay 2.0

This is a Next.js project for "Global Stay 2.0", an accommodation booking platform. This project is being developed in Firebase Studio.

## Core Features

- **Accommodation Search**: Search accommodations by location, dates, and number of guests.
- **Accommodation Listings**: Display accommodation listings with details, photos, pricing, and ratings.
- **Accommodation Details**: View detailed information about an accommodation, including amenities and availability.
- **User Account Management**: A dedicated section for users to manage their profile, settings, bookings, and favorites.
- **Admin Dashboard**: A separate section for administrators to manage listings, users, and system settings.

## Features Implemented

- **Homepage**: Displays curated collections and top-rated stays. Includes a comprehensive search form.
- **Accommodation Listings & Details**: Pages dynamically pull data from Firestore to display property information.
- **Search & Results**: Users can search for properties, and the results are displayed on a dedicated page.
- **Authentication**: Full login and signup flows with email/password and Google authentication are implemented.
- **Favorites System**: Users can save and manage a list of their favorite properties, which is persisted in their browser.
- **Account & Admin Sections**: Both have dedicated layouts with consistent, collapsible sidebar navigation for managing different aspects of the application.
- **Placeholder Pages**: All account and admin sections have placeholder pages to represent the full site structure.
- **User Profile**: A detailed user profile page with editable fields and state management.

## In Progress / Future Features

- Connecting the AI-powered recommendations feature.
- Implementing the full booking and payment flow.
- Populating all placeholder pages with dynamic content and functionality.
- **Language Translations API**: Integration with a translation service for global language support.
- **Global Currency Conversion Integration**: Real-time currency conversion for pricing.
- **Email & Phone Verification**: A system to verify user contact information.
- **Avatar Image Moderation**: An automated (AI-assisted) or manual process to review and approve user-uploaded avatar images to prevent offensive content.
- **Two-Factor Authentication**: Full implementation of 2FA via SMS and Email.
- **Connected Devices Management**: Allow users to see and log out of devices where they are signed in.
- **Login History**: Provide users with a view of their recent login activity.
- **My Travel Partners Workflows**:
  - **Add Family Member**: A manual entry process that checks for an existing user account via email. If no account exists, the member is added directly without an invitation.
  - **Invite a Partner**: Checks for an existing user. If the user exists, an email and system notification are sent for approval. If the user does not exist, an invitation email is sent to sign up and then approve the partner request.
  - **Pending Invitations**: This section will show the Name, Email, and Sent Date of pending requests, with options to 'Resend Request', 'Edit Details' (e.g., correct a typo in the email), or 'Remove' the request entirely.
  - **Denied Requests**: A mechanism to notify the requester if a partner invitation is denied, with a potential 'Denied Requests' section to manage and possibly resend these requests.
