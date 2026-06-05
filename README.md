# Teamable_App

Teamable is a full-stack employee profile management application built with Vue.js, Node.js, Express, and MongoDB.

The application allows users to view and update employee profile information, manage profile pictures, and persist data through a MongoDB database. It was developed as part of software development Life Cycle training to demonstrate frontend development, backend API implementation, database integration, testing, packaging, and cloud deployment.

## Project Highlights

- Full-stack web application
- Vue.js frontend
- Node.js & Express backend
- MongoDB database integration
- Profile image upload functionality
- REST API architecture
- Jest & Supertest testing
- Git version control
- Deployed to a Linux server hosted on DigitalOcean
- Environment-based configuration management

## Architecture

| Layer | Technology | Default port |
|-------|------------|--------------|
| Frontend (dev) | Vue CLI dev server | **8080** |
| Frontend (prod) | Static files in `dist/` served by Express | **3000** |
| Backend API | Node.js + Express (`server.js`) | **3000** |
| Database | MongoDB `company_db.employees` | **27017** |


## Cloud Deployment

The application was successfully deployed to a Linux Ubuntu Droplet hosted on DigitalOcean and made accessible through a public IP address.

### Deployment Activities

- Provisioned a Linux server on DigitalOcean
- Configured SSH access for remote administration
- Installed Node.js application dependencies
- Connected the application to MongoDB
- Configured environment variables
- Deployed and tested the application in a cloud environment
- Verified public accessibility through the server's public IP address
  
### Infrastructure Lifecycle

The deployment environment was intentionally decommissioned after successful testing and validation to avoid accumulating unwanted cloud costs.

This reflects a common DevOps practice of managing infrastructure responsibly and optimizing resource usage.

## 
## Project layout

```text
teamable/
├── public/
├── scripts/
├── src/
├── dist/
├── server.js
├── validator.js
├── vue.config.js
└── package.json
```
To Run the Application:
## 1. Install dependencies
```bash
npm install
```

## 2. Start MongoDB

Ensure the MongoDB service is running before setup or starting the server.

**Windows:**

```powershell
# If installed as a service, start it from Services or:
net start MongoDB
```

**macOS / Linux :**

```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

## 3. Initialize the database

### Local development (no MongoDB auth)

Set `DEV=true`

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
## 4. Package (build) the frontend

```bash
npm run build
```

## 5. Start the backend

### Local development

**PowerShell:**

```powershell
$env:DEV = "true"
npm start
```
**macOS / Linux :**

**bash:**

```bash
export DEV=true
npm start
```

### Production

```powershell
$env:DB_USER = "your_db_user"
$env:DB_PASS = "your_db_password"
npm start
```

### Production / authenticated MongoDB

**PowerShell:**

```powershell
$env:DB_USER = "your_db_user"
$env:DB_PASS = "your_db_password"
npm run setup-db
```

**macOS / Linux :**
**bash:**

```bash
export DB_USER=your_db_user
export DB_PASS=your_db_password
npm run setup-db
```

6.Run Application

Development:

```bash
npm start
npm run serve
```

Production:

```bash
npm run build
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|----------|----------|----------|
| GET | /get-profile | Retrieve employee profile |
| POST | /update-profile | Update employee profile |
| POST | /upload-profile-pic | Upload profile image |



## Environment variables

| Variable | When to set | Purpose |
|----------|-------------|---------|
| `DEV` | Local development | `true` → MongoDB at `mongodb://127.0.0.1:27017` without auth |
| `DB_USER` | Production | MongoDB username |
| `DB_PASS` | Production | MongoDB password |

Production connection string (from `server.js`):  
`mongodb://DB_USER:DB_PASS@127.0.0.1:27017/company_db?authSource=company_db`

## Quick start checklist

1. `npm install`
2. Start MongoDB
3. `$env:DEV = "true"` (or `export DEV=true`) → `npm run setup-db`
4. **Dev:** `npm start` + `npm run serve` → http://localhost:8080  
   **Prod local:** `npm run build` → `npm start` → http://localhost:3000
   
   **Prod remote server:**  `npm start` → 144.126.198.94:3000


## Technologies Used

### Frontend
- Vue.js 3
- JavaScript
- HTML5
- CSS3

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Testing
- Jest
- Supertest

### DevOps & Infrastructure
- Linux
- DigitalOcean
- SSH
- Environment Variables
- Git
- GitHub

## Lessons Learned

Through this project, I gained practical experience in:

- Building a full-stack application and understanding how the entire SDLC works. 
- Connecting frontend and backend services
- Working with MongoDB databases
- Managing application configuration
- Testing APIs and application functionality
- Deploying applications to cloud-hosted Linux servers
- Managing infrastructure resources responsibly
- Applying software engineering and DevOps fundamentals

