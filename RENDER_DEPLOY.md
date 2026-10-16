# Render Deployment Guide

## Why the old service failed

Render created a **Node.js web service** and tried to run `node server.js` — but this is a **Java/Spring Boot backend**. Render cannot auto-detect Java when a service is created manually.

## Fix: Delete the old service, redeploy via Blueprint

### Step 1 — Delete the broken service

1. Go to https://dashboard.render.com
2. Click the broken **linkshort-backend** service
3. Settings → scroll to bottom → **Delete Service**
4. Confirm deletion

### Step 2 — Set up a free MySQL database

Render does not offer free MySQL. Use one of these free options:

**Option A — PlanetScale (recommended, free)**
1. Go to https://planetscale.com → Sign up
2. Create database → choose closest region
3. Get connection string → looks like:
   `jdbc:mysql://aws.connect.psdb.cloud/linkshort?sslMode=VERIFY_IDENTITY&...`

**Option B — FreeSQLDatabase.com**
1. Go to https://www.freesqldatabase.com
2. Register → get host/user/password/dbname

### Step 3 — Deploy via Blueprint (uses render.yaml)

1. Go to https://dashboard.render.com
2. Click **New** → **Blueprint**
3. Connect your GitHub repo: `er-prahlad/Url-Sortner`
4. Render will find `render.yaml` at the root automatically
5. Click **Apply**

### Step 4 — Set environment variables

After Blueprint creates both services, set these secret values in the dashboard:

**For linkshort-backend:**

| Variable | Value |
|----------|-------|
| `DB_URL` | Your MySQL JDBC URL |
| `DB_USERNAME` | Your DB username |
| `DB_PASSWORD` | Your DB password |
| `JWT_SECRET` | Run `openssl rand -base64 32` and paste result |
| `APP_BASE_URL` | `https://linkshort-backend.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | `https://linkshort-frontend.onrender.com` |

**For linkshort-frontend:**

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `https://linkshort-backend.onrender.com/api/v1` |
| `VITE_APP_BASE_URL` | `https://linkshort-frontend.onrender.com` |
| `VITE_SHORT_DOMAIN` | `linkshort-backend.onrender.com` |

### Step 5 — Trigger redeploy

After setting all env vars:
1. Go to **linkshort-backend** → **Manual Deploy** → **Deploy latest commit**
2. Wait ~5 minutes for Docker build (first build is slow)
3. Check logs — you should see `Started LinkShortApplication`

### Step 6 — Verify

```bash
curl https://linkshort-backend.onrender.com/actuator/health
# Should return: {"status":"UP"}
```

Then open https://linkshort-frontend.onrender.com — login and URL shortening will work.

---

## What render.yaml does

```
repo root/
├── render.yaml              ← tells Render how to deploy both services
├── backend/
│   ├── Dockerfile           ← builds Spring Boot as Docker image
│   └── src/...
└── frontend/
    └── src/...              ← built as static site (npm run build → dist/)
```

The backend uses **Docker** (works on Render free tier for any language).
The frontend is a **Static Site** (fastest, free, global CDN).

---

## Troubleshooting

**Build fails with "permission denied"**
→ The Docker build runs as non-root — this is correct and safe.

**"Cannot connect to database"**
→ Check `DB_URL` format. For PlanetScale add `?sslMode=VERIFY_IDENTITY`

**CORS error in browser**
→ Make sure `CORS_ALLOWED_ORIGINS` exactly matches your frontend URL with no trailing slash.

**Frontend loads but API calls fail**
→ Check `VITE_API_BASE_URL` in frontend env vars — must end with `/api/v1`.

**Render free tier sleeps after 15 minutes**
→ First request after sleep takes ~30 seconds. This is normal on free tier.
→ Use https://uptimerobot.com (free) to ping `/actuator/health` every 5 minutes.
