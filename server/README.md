# Kandara College Voting System (Backend)

## Prerequisites
- Node.js 18+
- MongoDB Atlas connection string

## Environment (.env)
Create `server/.env` with:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/kandara?retryWrites=true&w=majority
JWT_SECRET=change-this-secret
CLIENT_ORIGIN=http://localhost:5173
# Optional admin bootstrap
ADMIN_SYSTEM_ID=admin
ADMIN_PASSWORD=changeme
```

## Install & Run
```
cd server
npm install
npm run dev
```

## API Overview
- POST /api/auth/student/register
- POST /api/auth/student/login
- POST /api/auth/admin/login
- GET  /api/contestants
- POST /api/contestants (admin, multipart form: image)
- POST /api/votes (student)
- GET  /api/votes/live
- GET  /api/admin/settings (admin)
- POST /api/admin/open|close|end|schedule (admin)

WebSocket events (client subscribes):
- `voting_status`, `voting_schedule`, `vote_cast`

# Frontend (client)
```
cd client
npm install
npm run dev
```

Create `client/.env` (optional):
```
VITE_API_URL=http://localhost:5000/api
VITE_API_BASE_ORIGIN=http://localhost:5000
```

## Notes
- Images are resized/compressed (Sharp) and served from `/uploads`.
- Per-position voting is enforced in DB and UI.
- Scheduling auto-opens/ends voting at configured times.
