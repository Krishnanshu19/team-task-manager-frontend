# 🚀 Team Task Manager

A full-stack web application where teams can create projects, assign tasks, and track progress with **role-based access control** (Admin/Member).

**Live Demo:** `https://your-app.railway.app` ← replace after deployment

---

## 📸 Features

- 🔐 **Authentication** — Signup/Login with JWT tokens
- 📁 **Project Management** — Create and manage multiple projects
- ✅ **Task Tracking** — Assign tasks with priority, due dates, and status
- 📊 **Dashboard** — Overview of all tasks, progress, and overdue items
- 🗂 **Kanban Board** — Drag-style board with Todo / In Progress / Done columns
- 👥 **Team Members** — Manage team with role-based access
- 🔒 **Role-Based Access** — Admin has full control, Members have restricted access

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | JWT + bcryptjs |
| Deployment | Railway |

---

## 📁 Project Structure

```
taskos/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        # Database models
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT auth + role check
│   │   ├── routes/
│   │   │   ├── auth.js          # POST /signup, /login, /me
│   │   │   ├── projects.js      # CRUD projects
│   │   │   ├── tasks.js         # CRUD tasks
│   │   │   ├── members.js       # Manage team roles
│   │   │   └── users.js         # User profile
│   │   ├── index.js             # Express app entry
│   │   └── seed.js              # Demo data seeder
│   ├── .env.example
│   ├── package.json
│   └── railway.toml
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx        # Sidebar + topbar
    │   │   └── ui.jsx            # Reusable UI components
    │   ├── contexts/
    │   │   └── AuthContext.jsx   # Auth state + login/logout
    │   ├── lib/
    │   │   └── api.js            # Axios instance
    │   ├── pages/
    │   │   ├── AuthPage.jsx      # Login / Signup
    │   │   ├── Dashboard.jsx     # Stats + recent tasks
    │   │   ├── Projects.jsx      # Project cards
    │   │   ├── Tasks.jsx         # Task list + filters
    │   │   ├── Board.jsx         # Kanban board
    │   │   └── Members.jsx       # Team management
    │   ├── App.jsx               # Router
    │   └── main.jsx
    ├── .env.example
    ├── package.json
    └── railway.toml
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- PostgreSQL database (or free [Neon](https://neon.tech) cloud DB)
- Git

---

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/taskos.git
cd taskos
```

---

### 2. Backend Setup

```bash
cd backend
```

Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
JWT_SECRET="your-secret-key-here"
PORT=4000
FRONTEND_URL="http://localhost:5173"
```

Install and run:
```bash
npm install
npx prisma db push       # create tables
node src/seed.js         # load demo data
npm run dev              # start on port 4000
```

---

### 3. Frontend Setup

```bash
cd frontend
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:4000/api
```

Install and run:
```bash
npm install
npm run dev              # start on port 5173
```

Open **http://localhost:5173**

---

### 4. Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@taskos.io | admin123 |
| Member | jordan@taskos.io | member123 |
| Member | sam@taskos.io | member123 |
| Member | casey@taskos.io | member123 |

---

## 🔒 Role Permissions

| Feature | Admin | Member |
|---------|:-----:|:------:|
| Create / delete projects | ✅ | ❌ |
| Create / delete any task | ✅ | ❌ |
| Update own tasks | ✅ | ✅ |
| View Kanban board | ✅ | ✅ |
| Manage members & roles | ✅ | ❌ |
| Promote / demote roles | ✅ | ❌ |
| View all team tasks | ✅ | ❌ |

> First user to sign up automatically becomes **Admin**.

---

## 🌐 REST API Endpoints

### Auth
```
POST   /api/auth/signup     Register new user
POST   /api/auth/login      Login
GET    /api/auth/me         Get current user
```

### Projects
```
GET    /api/projects        List all projects
POST   /api/projects        Create project (Admin)
PUT    /api/projects/:id    Update project (Admin)
DELETE /api/projects/:id    Delete project (Admin)
POST   /api/projects/:id/members       Add member
DELETE /api/projects/:id/members/:uid  Remove member
```

### Tasks
```
GET    /api/tasks           List tasks (filtered by role)
POST   /api/tasks           Create task
PATCH  /api/tasks/:id       Update task
DELETE /api/tasks/:id       Delete task
```

### Members
```
GET    /api/members         List all users (Admin)
PATCH  /api/members/:id/role  Change role (Admin)
DELETE /api/members/:id     Remove user (Admin)
```

---
# team-task-manager
# team-task-manager-frontend
