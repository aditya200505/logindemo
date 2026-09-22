# logindemo

Full-stack authentication demo using Express, MongoDB, and React.

## Run locally

Backend:

```powershell
cd backend
node server.js
```

Frontend, in a second terminal:

```powershell
cd frontend
npm run dev
```

Create `backend/.env` with `PORT`, `MONGO_URI`, and `FRONTEND_URL` before starting the backend. Do not commit that file.