# AURA Atelier | Full-Stack Premium Interior Design Studio

Welcome to the structured codebase of AURA Atelier. The repository is partitioned into a frontend client and an Express.js backend API.

## Directory Structure

```
Interior Design Studio/
├── frontend/                     # Static client files
│   ├── assets/                   # Images and avatar graphics
│   ├── index.html                # Main webpage markup
│   ├── style.css                 # Custom luxury styling sheet
│   └── script.js                 # Frontend interactive logic
├── backend/                      # Node.js API services
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── contactController.js  # Project inquiries handler
│   │   │   └── newsletterController.js # Journal subscription handler
│   │   ├── routes/
│   │   │   └── api.js            # Express API routing configuration
│   │   └── app.js                # Express app setup and middleware (CORS, body-parser)
│   ├── server.js                 # API server entrypoint (running on port 5000)
│   └── package.json              # Backend dependencies
├── package.json                  # Root orchestration scripts
└── README.md                     # Setup instructions
```

## Setup & Running the Application

### 1. Installation
To install all required packages for both the root (dev orchestration tools) and the backend directory:

```bash
npm run install:all
```

### 2. Development Mode
To run both the static frontend (served on port `8080` via `http-server`) and the Node.js backend (running on port `5000` via `nodemon`) concurrently:

```bash
npm run dev
```

* **Frontend URL:** [http://localhost:8080](http://localhost:8080)
* **Backend API Base:** [http://localhost:5000](http://localhost:5000)
* **Backend Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

## Features
- **Modern Landing Page:** Premium dark aesthetics with glassmorphic cards and micro-animations.
- **Form Submissions:** Full-stack integration for the project consultation form and newsletter signup connecting directly to backend endpoints.
- **Portfolio Filters:** Categorize studio portfolio pieces instantly.
