# Hackathons North America

The Official Website Of Hackathons North America (HNA)

## Authentication

This site uses [Clerk](https://clerk.com) for sign up, sign in, and Google OAuth.

Linked Clerk application: `app_3G6tNyzJnfnqeoxyBt4VwOwIr6Z`

### Setup with Clerk CLI

```bash
# Install the CLI (if needed)
npm install -g clerk

# Sign in and link this project
clerk auth login
clerk init --app app_3G6tNyzJnfnqeoxyBt4VwOwIr6Z

# Verify and start
clerk doctor
npm run dev
```

In the Clerk dashboard, enable **Google** under **User & Authentication → Social connections**.

### Routes

- `/sign-in` — sign in (Google + email)
- `/sign-up` — create an account
- `/account` — protected profile page (requires sign in)
