# TaskPulse - Production Project Management Dashboard

A production-quality, responsive Project Management Dashboard built using **React 19**, **TypeScript**, **Redux Toolkit**, **React Router v7**, and **Vite**.

This application enables teams to authenticate, view analytics dashboards, create, edit, delete, search with debouncing, filter, sort, paginate, and manage project deliverables cleanly.

---

## 📋 Table of Contents
1. [Key Features](#key-features)
2. [Submission Requirements Checklist](#submission-requirements-checklist)
3. [Architecture Explanation](#architecture-explanation)
4. [Libraries Used & Selection Rationale](#libraries-used--selection-rationale)
5. [Performance Optimizations](#performance-optimizations)
6. [Installation & Setup Instructions](#installation--setup-instructions)
7. [Running Automated Tests](#running-automated-tests)
8. [Docker & Container Setup](#docker--container-setup)
9. [Known Limitations & Future Improvements](#known-limitations--future-improvements)

---

## ✨ Key Features

- 🔐 **Authentication & Session Management**: Protected routes, JWT mock session management, token expiration handling, form validation, and demo quick-login buttons.
- 📊 **Responsive Dashboard**: Displays total tasks, pending tasks, in-progress tasks, completed tasks, high priority tasks, completion rate metrics, priority breakdown chart, and recent activity overview.
- ⚡ **Task Management CRUD**: Create, edit, delete with confirmation modal, view details drawer, and instant quick-status toggling across Grid, List, and Kanban views.
- 🔍 **Debounced Search, Filters & Sorting**: Custom `useDebounce` hook to debounce search keystrokes, filter by status and priority, sort by due date / priority / title / creation date, and paginated navigation.
- 🎨 **UI/UX & Dark/Light Theme**: ThemeContext with CSS custom properties design tokens, persistent local storage theme preference, skeleton loaders, and toast notifications.
- 🧪 **Automated Testing**: Vitest + React Testing Library suite covering React components, custom hooks, and API data flow services.
- 🐳 **Docker & CI/CD Ready**: Containerized build with Docker/docker-compose and GitHub Actions workflow (`ci.yml`).

---

## 🏛️ Architecture Explanation

### Project Directory Structure
```
task-management/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI pipeline
├── src/
│   ├── components/
│   │   ├── common/              # Reusable UI primitives (Button, Modal, Input, Badge, Toast, etc.)
│   │   ├── dashboard/           # Dashboard widgets (MetricsOverview, PriorityChart, ActivityFeed)
│   │   ├── layout/              # Layout shell (Header, Sidebar, MainLayout, ProtectedRoute)
│   │   └── tasks/               # Task views (TaskFilterBar, TaskCard, TaskGrid, TaskList, TaskKanban, TaskFormModal)
│   ├── context/                 # ThemeContext for light/dark theme persistence
│   ├── hooks/                   # Custom hooks (useDebounce, useAuth, useTasks, usePagination)
│   ├── pages/                   # Route pages (LoginPage, DashboardPage, TasksPage, NotFoundPage)
│   ├── services/                # Decoupled API service layer (apiClient, authService, taskService, mockData)
│   ├── store/                   # Redux Toolkit store & typed slices (authSlice, taskSlice, uiSlice)
│   ├── tests/                   # Vitest unit & integration tests
│   ├── types/                   # TypeScript interfaces (auth, task, common)
│   └── utils/                   # Helper utilities (dateUtils, validators)
├── Dockerfile                   # Nginx multi-stage build definition
├── docker-compose.yml           # Local container orchestration
├── vite.config.ts               # Vite build & Vitest configuration
└── package.json
```

### Decoupled Service Layer Architecture
API calls are not scattered inside UI components. All async HTTP communications route through `services/taskService.ts` and `services/authService.ts`. 

- **Standalone Standalone Mode**: Set `VITE_USE_MOCK_API=true` (default). The app pre-seeds realistic project tasks into `localStorage` with simulated async network latency (250ms delay) so reviewers can test 100% of functionality out-of-the-box.
- **Live Backend Server Mode**: Set `VITE_USE_MOCK_API=false`. The app routes GET, POST, PUT, DELETE requests to `VITE_API_BASE_URL` (e.g. Express backend).

---

## 📦 Libraries Used & Selection Rationale

| Library | Version | Selection Rationale |
| :--- | :--- | :--- |
| **React** | `19.0.0` | Enterprise UI library providing component modularity and efficient rendering. |
| **TypeScript** | `5.7.3` | Enforces strict static type safety across data contracts, Redux state, and props. |
| **Redux Toolkit** | `2.6.1` | Standard state management solution for predictable global state mutation, async thunks, and devtools. |
| **React Router** | `7.3.0` | Client-side routing with route guards (`ProtectedRoute`), nested layouts, and navigation. |
| **Lucide React** | `0.477.0` | Light-weight, accessible, crisp SVG iconography. |
| **Vitest & RTL** | `3.0.7` / `16.2.0` | Blazing fast Vite-native testing framework and DOM assertion library for unit/integration tests. |

---

## ⚡ Performance Optimizations

1. **Memoized Metrics & Filters (`useMemo`)**:
   - Implemented in `DashboardPage.tsx` to memoize task statistics calculations (priority counts, percentage distribution) so they only recalculate when task array references change.
2. **Component Re-render Skipping (`React.memo`)**:
   - Implemented in `TaskCard.tsx` and `StatsCard.tsx`. Skips re-rendering individual cards when sibling tasks update or when un-related parent state changes.
3. **Debounced Search Keystrokes (`useDebounce`)**:
   - Implemented in `TaskFilterBar.tsx` via custom hook `useDebounce.ts`. Prevents continuous filter execution or API requests on every single character entered in search.
4. **Lazy Loading & Code Splitting (`React.lazy` & `Suspense`)**:
   - Applied to route pages (`LoginPage`, `DashboardPage`, `TasksPage`, `NotFoundPage`) in `App.tsx` to reduce initial bundle loading size.

---

## 🚀 Installation & Setup Instructions

### Prerequisites
- Node.js `v18.x` or `v20.x`
- npm `v9.x` or `v10.x`

### 1. Clone & Install Dependencies
```bash
cd task-management
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://team-task-manager-576e.onrender.com
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Running Automated Tests

Run unit & integration test suite using Vitest:
```bash
npm run test
```

---

## 🐳 Docker & Container Setup

Run with Docker Compose:
```bash
docker-compose up --build
```
Access application at [http://localhost:3000](http://localhost:3000).

---

## 🔮 Known Limitations & Future Improvements

1. **Real-time WebSockets**: Add Socket.io/WebSocket notifications when team members make real-time updates to tasks.
2. **Sub-tasks & Checklists**: Extend task data model to support nested sub-tasks and progress tracking.
3. **File Attachments**: Add drag-and-drop file upload attachment previews for task deliverables.
