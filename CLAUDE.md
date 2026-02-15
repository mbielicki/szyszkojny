# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Szyszkojny is a QR code-based point transfer system for Polish scouts. Users scan QR codes to collect/transfer points. Built as a full-stack app with a Next.js frontend and Django backend.

## Commands

### Frontend (run from `frontend/`)
```bash
npm run dev       # Dev server on localhost:3000
npm run build     # Production build
npm run lint      # ESLint (next lint)
```

### Backend (run from `backend/`)
```bash
python manage.py runserver              # Dev server on 127.0.0.1:8000
python manage.py test                   # Run all tests
python manage.py test api.tests.test_models   # Run single test module
python manage.py migrate                # Apply migrations
python manage.py makemigrations         # Generate migrations
```

## Architecture

**Frontend**: Next.js 14 (App Router) + TypeScript + Material-UI v6 + Tailwind CSS
**Backend**: Django 5 + Django REST Framework + SQLite
**Auth**: Firebase Authentication (Google Sign-In) on frontend, Firebase Admin SDK token verification on backend

### Backend (`backend/`)

- **Single Django app** (`api/`) with function-based views and DRF decorators
- **Models**: `User` (Firebase UID as PK, role-based: A/S/U/P, point balance), `Code` (UUID PK, validity window, use limits), `Transaction` (links receiver to code)
- **Auth pattern**: Every POST endpoint receives `id_token` in request body, verified via `authenticate()` in `views.py`. During tests (`TESTING=True`), the token `'test_id_token'` bypasses Firebase
- **Code usage** (`use_code` view) is wrapped in `@transaction.atomic` — updates user balance, issuer balance, code use count, and creates a Transaction record
- **Authorization**: `user_may_make_code()` in `models.py` controls who can create codes. Admins/shops have full access; regular users can only create single-use short-lived codes funded from their balance

### Frontend (`frontend/`)

- **Provider chain** in `layout.tsx`: MuiTheme → UserContextComponent → LoggedIn → Dashboard → page content
- **UserContextComponent** (`components/UserContextComponent.tsx`) manages Firebase auth state and exposes user via React Context
- **LoggedIn** component gates all content behind authentication
- **API base URL** is hardcoded in `config.js` (currently `http://192.168.0.101:8000/api/`)
- **Pages**: `/` (balance), `/my-codes` (list issued codes), `/new-code` (create QR code), `/use-code/[id]` (scan/redeem code)
- Uses `axios` for API calls, `dayjs` for dates (Warsaw timezone), `react-qr-code` for QR rendering, `html-to-image` for code export

### API Endpoints (all under `/api/`)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `log-in/` | Firebase auth + user get_or_create |
| POST | `make-qr/` | Create QR code (role-gated) |
| POST | `my-codes/` | List user's issued codes |
| POST | `use-code/` | Redeem a code (atomic) |
| GET | `get-user/<uid>/` | Get user info |
| GET | `get-code/<code>/` | Get code details |

## Environment Setup

**Backend** requires a `.env` file in `backend/` with:
- `GOOGLE_SERVICE_ACCOUNT_KEY` — path to Firebase service account JSON
- `FIREBASE_CONFIG` — Firebase config JSON string

**Frontend** Firebase config is hardcoded in `app/firebase.ts`. API URL is in `config.js`.
