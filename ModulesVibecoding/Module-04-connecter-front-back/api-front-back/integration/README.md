# API Front/Back Integration

## Purpose

This project connects a small backend API to a React frontend. The backend exposes REST endpoints for projects, and the frontend fetches and creates projects through those endpoints.

The original exercise mentions Rails routes, but it also allows using another framework. This implementation uses Node.js with Express to keep the project lightweight and focused on API integration.

## Structure

```text
api-front-back/
├── backend/
│   ├── src/config/cors.js
│   ├── src/controllers/projectsController.js
│   ├── src/data/projectsStore.js
│   ├── src/routes/projectsRoutes.js
│   └── src/server.js
├── frontend/
│   ├── src/api/projectsApi.js
│   ├── src/components/ProjectsList.jsx
│   ├── src/App.jsx
│   └── src/main.jsx
└── integration/
    └── README.md
```

## Backend

The backend runs on `http://localhost:3000`.

Available endpoints:

```text
GET  /api/projects
POST /api/projects
GET  /health
```

Projects are stored in memory in `backend/src/data/projectsStore.js`. Restarting the backend resets the list to the seed projects.

CORS is configured in `backend/src/config/cors.js` for:

```text
http://localhost:5173
http://127.0.0.1:5173
```

## Frontend

The frontend runs on `http://127.0.0.1:5173` by default.

The `ProjectsList` component:

- fetches projects from `GET http://localhost:3000/api/projects` when it mounts;
- displays the projects in a list;
- submits new projects with `POST http://localhost:3000/api/projects`;
- appends the created project to the displayed list.

The API base URL defaults to `http://localhost:3000` and can be overridden with:

```text
VITE_API_URL=http://localhost:3000
```

## Run Locally

Install backend dependencies:

```bash
cd backend
npm install
```

Start the backend:

```bash
npm start
```

Install frontend dependencies in another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:5173/
```

## Verification

Verified locally:

- `GET /health` returns `{"status":"ok"}`;
- `GET /api/projects` returns JSON projects;
- `POST /api/projects` creates a project and returns `201`;
- CORS returns `Access-Control-Allow-Origin` for the Vite frontend origins;
- `npm run build` succeeds in the frontend;
- the browser flow loads projects, submits the form, receives a `201` response, and displays the new project;
- the mobile layout has no horizontal overflow at `390px` width.

## AI Assistance

AI helped generate the initial file structure and baseline code for the Express API and React component. I then adjusted the implementation to match the exercise:

- split the backend into controller, route, data store, and CORS config files;
- added validation for missing title or description;
- added explicit CORS origins for both `localhost` and `127.0.0.1`;
- added frontend loading, error, and submitting states;
- removed React `StrictMode` to avoid duplicate development GET requests while observing the Network tab;
- verified the integration with `curl`, Vite build, and a browser automation flow.
