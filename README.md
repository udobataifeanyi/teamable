# Teamable_App

Teamable is a full-stack employee profile application: a **Vue 3** frontend, an **Express** API, and **MongoDB** for storage. This guide explains how to install dependencies, initialize the database, build the frontend, and run the app locally or in production.

## Architecture

| Layer | Technology | Default port |
|-------|------------|--------------|
| Frontend (dev) | Vue CLI dev server | **8080** |
| Frontend (prod) | Static files in `dist/` served by Express | **3000** |
| Backend API | Node.js + Express (`server.js`) | **3000** |
| Database | MongoDB `company_db.employees` | **27017** |

In **development**, the Vue dev server proxies API calls to the backend (`vue.config.js`). In **production**, you build the frontend into `dist/` and a single `npm start` process serves both the UI and the API on port 3000.

## Prerequisites

- **Node.js** (LTS recommended) and **npm**
- **MongoDB** running locally on `127.0.0.1:27017`, or a remote instance you can reach with the credentials below

## Project layout

```
teamable/
├── public/              # Static assets (e.g. Profile_Pix.jpg)
├── scripts/
│   └── setup-database.js   # Seeds default profile (id: 1)
├── src/
│   ├── App.vue          # Profile UI and API calls
│   └── main.js
├── dist/                # Created by `npm run build` (gitignored)
├── server.js            # Express API + serves dist in production
├── validator.js         # Request validation
├── vue.config.js        # Dev-server proxy to port 3000
└── package.json
```

## 1. Install dependencies

From the project root:

```bash
npm install
```

## 2. Start MongoDB

Ensure the MongoDB service is running before setup or starting the server.

**Windows (service):**

```powershell
# If installed as a service, start it from Services or:
net start MongoDB
```

**macOS / Linux (examples):**

```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

Confirm connectivity (optional):

```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

## 3. Initialize the database (setup script)

The app reads and writes a single employee document with **`id: 1`** in database **`company_db`**, collection **`employees`**.

### Local development (no MongoDB auth)

Set `DEV=true` so the server and setup script connect without username/password (see `server.js`).

**PowerShell:**

```powershell
$env:DEV = "true"
npm run setup-db
```

**bash / macOS / Linux:**

```bash
export DEV=true
npm run setup-db
```

Expected output:

```text
Database "company_db" ready. Collection "employees" seeded with profile id=1.
```

The script upserts this default record (safe to run again):

| Field | Default value |
|-------|----------------|
| `id` | `1` |
| `name` | `Jane Doe` |
| `email` | `jane.doe@example.com` |
| `interests` | `Reading, hiking` |

Edit `scripts/setup-database.js` if you want different seed data.

### Production / authenticated MongoDB

Do **not** set `DEV`. Provide credentials (same as deployment):

**PowerShell:**

```powershell
$env:DB_USER = "your_db_user"
$env:DB_PASS = "your_db_password"
npm run setup-db
```

**bash:**

```bash
export DB_USER=your_db_user
export DB_PASS=your_db_password
npm run setup-db
```

## 4. Package (build) the frontend

Production and the Express server expect compiled assets in **`dist/`**:

```bash
npm run build
```

This runs Vue CLI and writes output to `dist/` (HTML, JS, CSS, and hashed assets). Re-run **`npm run build`** after any frontend change before deploying or using production mode.

## 5. Start the backend

The API listens on **port 3000** and connects to MongoDB on startup.

### Local development

**Terminal A — backend** (keep running):

**PowerShell:**

```powershell
$env:DEV = "true"
npm start
```

**bash:**

```bash
export DEV=true
npm start
```

Expected logs:

```text
Connected to MongoDB
app listening on port 3000
```

### Production (single server serves UI + API)

After **`npm run build`**:

```powershell
$env:DB_USER = "your_db_user"
$env:DB_PASS = "your_db_password"
npm start
```

Open **http://localhost:3000** — Express serves `dist/index.html` and handles `/get-profile`, `/update-profile`, and `/upload-profile-pic`.

## 6. Run the application

Choose **one** workflow below.

### Option A — Development (hot reload, port 8080)

Use two terminals: backend on **3000**, frontend dev server on **8080** with API proxy.

1. Complete steps **2–3** (MongoDB + `npm run setup-db` with `DEV=true`).
2. **Terminal 1 — backend:**

   ```powershell
   $env:DEV = "true"
   npm start
   ```

3. **Terminal 2 — frontend:**

   ```bash
   npm run serve
   ```

4. Open **http://localhost:8080**.

`vue.config.js` forwards these paths to `http://localhost:3000`:

- `GET /get-profile`
- `POST /update-profile`

**Important:** If you add or change `vue.config.js`, **stop and restart** `npm run serve` so the proxy loads.

### Option B — Production-like local (single port 3000)

1. MongoDB running and database seeded (steps **2–3**).
2. Build the frontend: `npm run build`.
3. Start the server: `npm start` (with `DEV=true` locally, or `DB_USER` / `DB_PASS` in production).
4. Open **http://localhost:3000**.

## Environment variables

| Variable | When to set | Purpose |
|----------|-------------|---------|
| `DEV` | Local development | `true` → MongoDB at `mongodb://127.0.0.1:27017` without auth |
| `DB_USER` | Production | MongoDB username |
| `DB_PASS` | Production | MongoDB password |

Production connection string (from `server.js`):  
`mongodb://DB_USER:DB_PASS@127.0.0.1:27017/company_db?authSource=company_db`

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/get-profile` | Returns profile for `id: 1` (empty object if not seeded) |
| `POST` | `/update-profile` | Updates name, email, interests (validated) |
| `POST` | `/upload-profile-pic` | Stores base64 image in `profileImage` |

## npm scripts reference

| Script | Command | Description |
|--------|---------|-------------|
| `setup-db` | `node scripts/setup-database.js` | Seed / refresh default employee profile |
| `build` | `vue-cli-service build` | Compile frontend to `dist/` |
| `serve` | `vue-cli-service serve` | Dev server on port 8080 (with proxy) |
| `start` | `node server.js` | API + static `dist/` on port 3000 |
| `test` | `jest` | Run unit / integration tests |

## Create an npm package (optional)

`package.json` publishes `dist/`, `server.js`, and `validator.js`. After building:

```bash
npm run build
npm pack
```

This creates `teamable-app-<version>.tgz` for deployment.

## Tests

With MongoDB available (and `DEV=true` for local):

```powershell
$env:DEV = "true"
npm test
```

Tests use Supertest against the Express app defined in `server.js`.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `404` on `http://localhost:8080/get-profile` | Backend not running or dev proxy not loaded | Run `npm start` on 3000; restart `npm run serve` after changing `vue.config.js` |
| `Unexpected token '<'` in browser console | API returned HTML (404 page) instead of JSON | Same as above |
| `Unable to connect` / MongoDB errors on `npm start` | MongoDB not running | Start MongoDB, then run `npm run setup-db` |
| Page loads but name/email/interests are empty | No document with `id: 1` | Run `npm run setup-db` |
| Profile image missing in dev | `App.vue` imports `./Profile_Pix.jpg` from `src/` but file is in `public/` | Copy image to `src/Profile_Pix.jpg` or set `image: '/Profile_Pix.jpg'` in `App.vue` |

## Quick start checklist

1. `npm install`
2. Start MongoDB
3. `$env:DEV = "true"` (or `export DEV=true`) → `npm run setup-db`
4. **Dev:** `npm start` + `npm run serve` → http://localhost:8080  
   **Prod local:** `npm run build` → `npm start` → http://localhost:3000

## Technologies

- **Frontend:** Vue 3, Vue CLI  
- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Testing:** Jest, Supertest

