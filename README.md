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
- **Login History**: Provide users with a view of their recent login activity. The "Report" button will allow users to flag suspicious activity, which will create a support ticket for the Global Stay team to review.
- **My Travel Partners Workflows**:
  - **Add Family Member**: A manual entry process that checks for an existing user account via email. If no account exists, the member is added directly without an invitation.
  - **Invite a Partner**: Checks for an existing user. If the user exists, an email and system notification are sent for approval. If the user does not exist, an invitation email is sent to sign up and then approve the partner request.
  - **Pending Invitations**: This section will show the Name, Email, and Sent Date of pending requests, with options to 'Resend Request', 'Edit Details' (e.g., correct a typo in the email), or 'Remove' the request entirely.
  - **Denied Requests**: A mechanism to notify the requester if a partner invitation is denied, with a potential 'Denied Requests' section to manage and possibly resend these requests.
- **Payment Method Expiry Notifications**: Send notifications regarding a payment method that is expiring soon. Notifications to be sent automatically at 30 days, 7 days, and 1 day before expiry. A final email will be sent the day after expiry if the method has not been updated or removed.
- **Alternative Payment Methods**: Integrate with Crypto (e.g., Bitcoin) and other alternative payment systems. Note: Financial data will not be stored directly; integration will use secure tokens (e.g., from Stripe) or hosted fields.

### Known Issues

- **404 Errors on Hard Refresh**: The `/account/my-stays/upcoming` and `/account/my-stays/past` pages consistently produce a 404 error when the page is hard refreshed in the browser. The page loads correctly with client-side navigation or after a full "Restart App" in the development environment. This suggests a server-side rendering or routing issue specific to this nested route that needs further investigation.
- **Calendar Date Highlighting**: The calendar component on the `/account/my-stays/upcoming` page incorrectly highlights booked days that fall outside of the currently displayed month. For example, a booking on October 3rd will appear highlighted in both the September and October views. This needs to be adjusted so that "outside" days are visually distinct and not styled as part of the booking.
