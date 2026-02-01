# LocalLink – AI-Powered Travel Planner

FastAPI backend + React frontend for generating personalized travel itineraries using Google Gemini AI.

## Tech Stack

- **Backend:** FastAPI, PostgreSQL, Redis (optional), Google Gemini AI
- **Frontend:** React, TypeScript, Vite, Clerk Auth
- **Deployment:** Railway (backend), Docker optional

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL (Railway or local)
- Google Gemini API key

### Local Setup (No Docker)

```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Docker Setup (Optional)

```bash
cd backend
docker compose up
```

### Environment Variables

Create `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@host:port/database
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
REDIS_HOST=localhost  # optional
REDIS_PORT=6379       # optional
```

## API Documentation

- Backend: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`
- Frontend: `http://localhost:5173`

## Deployment

**Railway:**
1. Push to GitHub
2. Connect repo to Railway
3. Set environment variables in Railway dashboard
4. Auto-deploys on push to `main`

## Project Structure

```
LocalLink/
├── backend/           # FastAPI app
│   ├── main.py       # Entry point
│   ├── database.py   # PostgreSQL config
│   ├── cache.py      # Redis caching
│   ├── routers/      # API routes
│   ├── models/       # Database models
│   ├── schemas/      # Pydantic schemas
│   ├── ai/           # Gemini integration
│   └── venv/         # Virtual environment
└── frontend/         # React app
    └── src/
```

## Features

- ✅ AI-powered itinerary generation
- ✅ User authentication (Clerk)
- ✅ PostgreSQL database
- ✅ Redis caching & rate limiting (optional)
- ✅ Shareable itinerary links
- ✅ Docker support (optional)
- ✅ Railway deployment ready

## Troubleshooting

**Backend won't start?**
```bash
source backend/venv/bin/activate
cd backend && uvicorn main:app --reload
```

**Database connection errors?**
- Verify `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running

**Redis not connecting?**
- App works without Redis (graceful fallback)
- To enable: `brew install redis && brew services start redis`
