// docs/systems/authentication.md

# Authentication System

## Providers

- **Email & Password**: Standard credential-based login and signup.
- **Google OAuth**: Fast social login integration.

## Persistence

- Auth state is managed by the Firebase Client SDK.
- Redirects are handled at the route level to protect `/account` and `/admin` sections.

## Future Plans

- Implementation of Two-Factor Authentication (2FA).
- Management of "Connected Devices" and login history.
