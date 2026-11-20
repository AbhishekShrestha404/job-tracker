# Job Application Tracker

A full-stack Kanban board for tracking job applications: statuses, deadlines, and notes in one place. I built it to manage my own job search.

**Live demo:** https://YOUR-APP.vercel.app
**Demo login:** demo@example.com / YOUR-DEMO-PASSWORD
> The API runs on a free tier and sleeps when idle, so the first load can take up to a minute.

![Board screenshot](docs/board.png)
![Drag and drop demo](docs/demo.gif)

## Features
- Register/login with JWT authentication and hashed passwords
- Kanban board (Wishlist, Applied, Interview, Offer, Rejected) with drag-and-drop that persists
- Add, edit, and delete applications with company, role, link, deadline, salary, location, and notes
- Deadline highlighting for overdue and due-soon applications
- Live search across company, role, location, and notes
- Responsive layout with touch drag support (press and hold)

## Tech stack
**Frontend:** React (Vite), React Router, dnd-kit, Axios
**Backend:** Node.js, Express, Mongoose
**Database:** MongoDB Atlas
**Deployment:** Vercel (client), Render (API)

## Technical decisions
- Every query is scoped to the logged-in user, so users can only access their own data
- Request bodies are whitelisted to prevent mass assignment
- Drag-and-drop updates the UI instantly, then saves the full layout in one bulk write
- Rate limiting on auth routes, helmet security headers, and a restricted CORS origin

## Run locally
```bash
git clone https://github.com/YOUR-USERNAME/job-tracker.git
cd job-tracker

# API
cd server && npm install
cp .env.example .env   # fill in MONGODB_URI and JWT_SECRET
npm run dev

# Client (new terminal)
cd client && npm install
cp .env.example .env
npm run dev
```

## Known limitations and next steps
- JWT is stored in localStorage; httpOnly cookies would be more secure
- No automated tests yet (planning API tests with Jest and Supertest)
- Planned: paste-a-URL autofill, stats dashboard, email-based tracking