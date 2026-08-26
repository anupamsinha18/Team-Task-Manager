# TaskPulse — Production Project Management Dashboard

[![React](https://img.shields.io/badge/React-19.0.0-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.5.1-764abc?logo=redux)](https://redux-toolkit.js.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4.3-646cff?logo=vite)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker)](https://www.docker.com/)

TaskPulse is a modern, responsive, production-quality **Project Management Dashboard** built with **React 19, TypeScript, Redux Toolkit, and Vanilla CSS**. It delivers an intuitive, full-featured workspace for task management, metrics analytics, debounced search, filtering, and session management.

---

## 🌐 Live Application & Repositories

- **Deployed Frontend URL**: [https://helpful-puffpuff-07ac2c.netlify.app](https://helpful-puffpuff-07ac2c.netlify.app)
- **Deployed Backend API (Render)**: [https://team-task-manager-576e.onrender.com](https://team-task-manager-576e.onrender.com)
- **GitHub Repository**: [https://github.com/anupamsinha18/Team-Task-Manager](https://github.com/anupamsinha18/Team-Task-Manager)

---

## 🔑 Demo Login Credentials

You can click any demo account button on the login screen or manually enter:

| Name | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Alex Morgan** | `alex.morgan@company.com` | `password123` | Admin |
| **Sarah Chen** | `sarah.chen@company.com` | `password123` | Project Manager |
| **David Miller** | `david.miller@company.com` | `password123` | Developer |
| **Emily Taylor** | `emily.taylor@company.com` | `password123` | Developer |

---

## 🚀 Installation & Local Setup

### Option 1: Run with Docker Compose (Recommended)
Runs Frontend (Nginx), Backend (Express), and MongoDB in containers:

```bash
# Clone the repository
git clone https://github.com/anupamsinha18/Team-Task-Manager.git
cd Team-Task-Manager

# Start all containers in background
docker compose up -d --build
```
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080`

---

### Option 2: Run Frontend Locally (Vite Dev Server)

```bash
cd task-management
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

### Option 3: Run Full Stack Locally (Frontend + Backend)

**1. Start Backend:**
```bash
cd task-managemnet-BE
npm install
npm start
```
*(Backend runs on `http://localhost:8080`)*

**2. Start Frontend:**
```bash
cd task-management
npm install
npm run dev
```

---

## 🧪 Running Automated Tests

```bash
cd task-management
npm run test
```

Includes test suites with 100% pass rate:
- `TaskCard.test.tsx`: Component rendering, status badges, priority styling, and click handler triggers.
- `useDebounce.test.ts`: Hook timing precision and keystroke cancellation.
- `taskService.test.ts`: CRUD operations, filtering, pagination, and stats calculations.

---

## 🏗️ Architecture & Folder Structure

```text
Team-Task-Manager/
├── docker-compose.yml           # Unified orchestration (UI + API + MongoDB)
├── task-management/             # React 19 Frontend Web Application
│   ├── src/
│   │   ├── components/          # Reusable UI component library
│   │   │   ├── common/          # Button, Input, Modal, Badge, ThemeToggle, etc.
│   │   │   ├── dashboard/       # MetricsOverview, PriorityChart, RecentActivity
│   │   │   ├── layout/          # AppLayout, Navbar, Sidebar
│   │   │   └── tasks/           # TaskCard, TaskGrid, TaskList, TaskKanban, Modals
│   │   ├── context/             # ThemeContext (Dark/Light mode provider)
│   │   ├── hooks/               # Custom hooks (useDebounce, useTheme)
│   │   ├── pages/               # Routed views (LoginPage, DashboardPage, TasksPage)
│   │   ├── routes/              # ProtectedRoute & AppRouter
│   │   ├── services/            # API Clients, AuthService, TaskService, MockData
│   │   ├── store/               # Redux Toolkit store and slices (auth, tasks, ui)
│   │   ├── types/               # Strict TypeScript definitions (Auth, Task, Common)
│   │   ├── App.css              # Custom CSS Design System & Theme Tokens
│   │   └── index.css            # Responsive layout & utility classes
│   ├── Dockerfile               # Multi-stage production Nginx container
│   ├── nginx.conf               # SPA routing rewrite configuration
│   └── package.json
└── task-managemnet-BE/          # Express.js REST API Backend
    ├── src/
    │   ├── configs/             # Database connection & MongoDB Atlas auto-seeder
    │   ├── controllers/         # Auth & Task business logic
    │   ├── middlewares/         # JWT verification middleware
    │   ├── models/              # Mongoose schemas (User, Task, Project)
    │   └── routes/              # Express route definitions
    ├── Dockerfile               # Node.js API container
    └── server.js                # Server entry point with CORS & Health check
```

### Key Technical Decisions:
1. **Hybrid Service Layer (Mock / Live API)**: Configurable via `VITE_USE_MOCK_API`. Works standalone with `LocalStorage` and simulated network latency, or connects seamlessly to the live Render backend.
2. **Redux Toolkit State Management**: Predictable centralized state with asynchronous thunks (`fetchTasks`, `fetchTaskStats`, `createNewTask`, `updateExistingTask`, `deleteTaskById`).
3. **Optimized Performance**:
   - `useDebounce` (300ms) hook prevents unnecessary API calls during live search.
   - `useMemo` & `useCallback` prevent unwanted component re-renders.
   - Dynamic client-side and server-side pagination to handle large datasets efficiently.
4. **Vanilla CSS Design System**: Uses CSS variables for themes without heavy CSS frameworks, ensuring zero runtime overhead, complete styling control, and seamless Light/Dark mode transitions.

---

## 📦 Major Libraries & Justification

| Library | Version | Purpose & Justification |
| :--- | :--- | :--- |
| **React** | `19.0.0` | Core UI library providing declarative component rendering and modern React hooks. |
| **TypeScript** | `5.7.2` | Provides static type safety, autocomplete, and eliminates runtime bugs across entities. |
| **Redux Toolkit** | `2.5.1` | Efficient state management with built-in immutability (Immer) and async thunks. |
| **React Router** | `7.1.5` | Handles declarative client-side routing, protected routes, and URL navigation. |
| **Lucide React** | `0.475.0` | Modern, lightweight, customizable SVG icon set. |
| **Vitest & RTL** | `3.0.5` | Fast, modern testing framework with React Testing Library and jsdom. |

---

## 🔮 Known Limitations & Future Improvements

1. **Drag-and-Drop in Kanban**: Add `@hello-pangea/dnd` for drag-and-drop task status updates across Kanban columns.
2. **Real-time Collaboration**: Integrate WebSockets (`socket.io`) for multi-user task updates in real time.
3. **File Attachments**: Add AWS S3 / Cloudinary upload support for project task attachments and screenshots.
4. **Activity Audit Log**: Store and display historical change logs with diffs for every task modification.
5. **Team Workspaces & RBAC**: Add multi-tenant workspace management with granular permission roles.
