# Fraud Intelligence

Hackathon project scaffold for PS-14 Fraudulent Behaviour Detection.

## Structure

- frontend: Next.js app (App Router, TypeScript, Tailwind)
- backend: FastAPI service with PostgreSQL-ready SQLAlchemy setup
- ml: Reserved for ML team integration
- docs: Documentation

## Quick Start

### Frontend

1. Copy `frontend/.env.example` to `frontend/.env.local`.
2. Run:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

### Backend

1. Copy `backend/.env.example` to `backend/.env`.
2. Create and activate a Python 3.11+ virtual environment.
3. Run:
   - `cd backend`
   - `pip install -r requirements.txt`
   - `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`

## Health Check

- Backend: `GET http://localhost:8000/health`
- Frontend: Home page calls backend health endpoint and displays result.
