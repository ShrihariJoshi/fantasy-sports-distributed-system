# Fantasy Cricket Frontend

A modern, dark-themed React UI for the Fantasy Cricket distributed system.

## Features

- 🏏 **User Authentication** - Register and login with JWT
- 👥 **Team Management** - Create and manage fantasy cricket teams
- 🎯 **Player Selection** - Select players with role assignments (Captain, Vice-Captain, Normal)
- 📊 **Real-time Scoring** - Track team scores and points in real-time
- 🏆 **Leaderboard** - Compete with players worldwide
- 🌙 **Dark Modern UI** - Beautiful dark theme with Tailwind CSS
- ⚡ **Fast Performance** - Built with Vite and React

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Environment Setup

Make sure your backend Flask server is running on `http://localhost:5000`.

The API proxy is configured in `vite.config.ts` to forward requests to the backend.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── UI.tsx           # Button, Input, Card, Badge components
│   └── Navbar.tsx       # Navigation bar
├── pages/               # Page components
│   ├── Home.tsx         # Landing page
│   ├── Login.tsx        # Login page
│   ├── Register.tsx     # Registration page
│   ├── Dashboard.tsx    # User dashboard
│   ├── Teams.tsx        # Team creation/management
│   └── Leaderboard.tsx  # Leaderboard page
├── api.ts               # API endpoints
├── store.ts             # Zustand store for auth
├── ProtectedRoute.tsx   # Protected route wrapper
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## Pages

### Home
Landing page with features overview and call-to-action buttons.

### Authentication
- **Register**: Create a new account
- **Login**: Sign in to existing account

### Dashboard
- Overview of team statistics
- View total teams and best scores
- Quick access to team management

### Teams
- Select players for your fantasy cricket team
- Assign roles (Captain, Vice-Captain, Normal) with multipliers
- Real-time team summary

### Leaderboard
- View global rankings
- Track scores and team counts
- Filter by time period (Overall, Weekly, Monthly)

## Styling

The project uses Tailwind CSS with a custom dark color scheme:
- Base: `slate-900` to `slate-950`
- Accents: Blue, Purple, Pink, Green

All components are fully responsive and work on mobile, tablet, and desktop screens.

## API Integration

The frontend communicates with the backend via these endpoints:

- `POST /register` - User registration
- `POST /login` - User authentication
- `POST /add_team` - Create a new team
- `GET /get_team` - Retrieve team scores

## Future Enhancements

- [ ] Live match updates using WebSockets
- [ ] Player performance analytics
- [ ] Team sharing and invitations
- [ ] Payment integration for tournaments
- [ ] Mobile app version
- [ ] Notifications system
- [ ] Advanced filtering and search

## License

This project is part of the Fantasy Cricket Distributed System.
