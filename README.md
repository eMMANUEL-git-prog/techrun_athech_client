# AthleteTrack - Athletics Management Platform

A comprehensive Next.js frontend for managing athletes, whereabouts tracking, and team coordination.

## Features

- **Role-Based Access Control**: Admin, Athlete, Coach, Medical Staff, and Nutritionist roles
- **Authentication**: Secure sign up and login with token-based auth
- **Whereabouts Tracking**: Athletes can submit and update their locations
- **Alert Management**: Create and manage alerts for different user roles
- **Athlete Management**: Admin dashboard to view and manage all athletes
- **Verification System**: Admins can verify athlete whereabouts submissions
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Toast Notifications**: Real-time feedback for user actions

## Tech Stack

- **Frontend**: Next.js 16+ with App Router
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **HTTP Client**: Axios
- **State Management**: React Context API
- **UI Components**: Custom components with shadcn/ui

## Project Structure

\`\`\`
app/
├── page.tsx              # Landing page
├── login/page.tsx        # Login page
├── signup/page.tsx       # Signup page
├── dashboard/
│   ├── page.tsx          # Main dashboard
│   ├── athletes/         # Athlete management (admin)
│   ├── alerts/           # Alerts page
│   ├── whereabouts/      # Whereabouts submission (athlete/coach)
│   └── verifications/    # Verification management (admin)
├── layout.tsx            # Root layout with auth provider
└── globals.css           # Global styles and theme

components/
├── navbar.tsx            # Navigation bar with role-based menu
├── footer.tsx            # Footer component
├── dashboard-card.tsx    # Reusable stat card
├── alert-list.tsx        # Alert display component
├── athlete-list.tsx      # Athlete table component
├── whereabouts-form.tsx  # Location submission form
├── verification-list.tsx # Admin verification component
├── alert-form.tsx        # Alert creation form (admin)
├── modal.tsx             # Reusable modal component
└── toast-container.tsx   # Toast notification system

context/
└── auth-provider.tsx     # Authentication context and hooks

lib/
├── api.ts                # Axios instance with API methods
└── toast.ts              # Toast notification system

utils/
└── helpers.ts            # Utility functions (formatting, roles, etc)
\`\`\`

## Environment Variables

Create a `.env.local` file with:

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

## Getting Started

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables**:
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your API URL
   \`\`\`

3. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in browser**:
   Navigate to `http://localhost:3000`

## API Integration

This frontend integrates with a PERN backend with the following endpoints:

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in user
- `GET /api/auth/me` - Get current user profile

### Athletes
- `GET /api/athletes` - List all athletes
- `POST /api/athletes` - Create new athlete (admin only)

### Whereabouts
- `POST /api/whereabouts/submissions` - Submit location
- `POST /api/whereabouts/updates` - Update submission
- `POST /api/whereabouts/verifications` - Verify submission (admin only)

### Alerts
- `GET /api/alerts` - Get user alerts
- `POST /api/alerts` - Create alert (admin only)

## Features by Role

### Admin
- View all athletes and manage profiles
- Create and manage alerts for all users
- Verify athlete whereabouts submissions
- View system analytics and reports

### Athlete
- Submit and update their whereabouts
- View personal alerts and notifications
- Manage their profile information

### Coach
- View athletes under their program
- Receive team-related alerts
- Monitor team whereabouts submissions

### Medical Staff
- View athlete health/injury alerts
- Manage medical-related information

### Nutritionist
- View athlete nutrition information
- Submit nutrition recommendations

## Authentication Flow

1. User signs up or logs in
2. Backend returns `access_token` and `refresh_token`
3. Tokens are stored in localStorage
4. Auth context automatically refreshes user on page load
5. API requests automatically include auth token in headers
6. Protected routes redirect unauthenticated users to login

## Customization

### Adding New Routes
1. Create new file in `app/` directory
2. Wrap with Navbar component for consistency
3. Use `useAuth()` hook to protect routes

### Adding New API Endpoints
1. Update `lib/api.ts` with new method
2. Create corresponding component or page
3. Handle errors with `showToast()` function

### Styling
- All colors use design tokens from `globals.css`
- Use Tailwind classes for styling
- Responsive prefixes: `md:`, `lg:`, `xl:`

## Deployment

Deploy to Vercel with:
\`\`\`bash
git push origin main
# Vercel will automatically deploy
\`\`\`

## Support

For issues or questions, refer to the backend API documentation or contact the development team.
# techrun_athech_client
