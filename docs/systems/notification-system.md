// docs/systems/notification-system.md

# Notification System Logic

## General Behavior

- **Unread State**: Unread notifications have a distinct blue background. Viewing a notification marks it as read.
- **Archiving**: Notifications are automatically archived after 90 days unless flagged as **Important**.
- **Delivery Preferences**: Users can toggle delivery methods (In-App, Email, Push, SMS) per notification type.

## Mandatory Alerts

- **System Notifications**: Critical announcements (e.g., maintenance) are mandatory and pinned to the top if unread. They cannot be disabled.

## Workflows

- **Travel Partner Requests**: Actionable buttons (Approve/Deny) are available. A notification is sent back to the requester once actioned.
- **My Alerts**: Daily AI-powered searches trigger notifications when matches are found for user-defined criteria.
- **Payment Method**: Alerts sent for expiring cards or failed transactions.
