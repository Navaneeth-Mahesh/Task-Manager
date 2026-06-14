# ⚡ TaskFlow — Production Backend API

Node.js · Express · MongoDB · Socket.IO · JWT

---

## Architecture

```
taskflow-backend/
├── server.js                  ← Entry point: HTTP + Socket.IO server
└── src/
    ├── app.js                 ← Express app, middleware, routes
    ├── config/
    │   └── swagger.js         ← OpenAPI 3.0 documentation config
    ├── constants/
    │   └── index.js           ← HTTP codes, roles, task status/priority, socket events
    ├── controllers/
    │   ├── authController.js  ← register, login, logout, me, forgot/reset password
    │   ├── taskController.js  ← Full CRUD + status patch + real-time emit
    │   └── dashboardController.js ← Stats, analytics (aggregations), team
    ├── database/
    │   └── connect.js         ← Mongoose connection with reconnection handling
    ├── middleware/
    │   ├── auth.js            ← protect, adminOnly, optionalAuth
    │   └── errorHandler.js    ← Global error handler + 404 handler
    ├── models/
    │   ├── User.js            ← Schema + bcrypt pre-save + comparePassword + resetToken
    │   └── Task.js            ← Schema + indexes + isOverdue virtual + auto-completedAt
    ├── routes/
    │   ├── authRoutes.js
    │   ├── taskRoutes.js
    │   └── dashboardRoutes.js
    ├── services/
    │   └── emailService.js    ← Nodemailer: welcome email + password reset email
    ├── sockets/
    │   └── index.js           ← Socket.IO init, auth middleware, user rooms
    ├── utils/
    │   ├── ApiError.js        ← ApiError class, asyncHandler, sendSuccess, sendPaginated
    │   ├── jwt.js             ← signToken, verifyToken, sendTokenCookie, clearTokenCookie
    │   └── queryBuilder.js    ← buildTaskQuery: filter, sort, paginate from query params
    └── validators/
        └── index.js           ← express-validator chains for all endpoints
```

---

## API Endpoints

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT cookie |
| POST | `/api/auth/logout` | ✓ | Clear auth cookie |
| GET | `/api/auth/me` | ✓ | Get current user |
| PATCH | `/api/auth/me` | ✓ | Update profile |
| POST | `/api/auth/forgot-password` | — | Send reset email |
| POST | `/api/auth/reset-password/:token` | — | Reset password |

### Tasks
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks` | Get tasks (filter, sort, paginate) |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get single task |
| PUT | `/api/tasks/:id` | Full update |
| PATCH | `/api/tasks/:id/status` | Quick status change (Kanban) |
| DELETE | `/api/tasks/:id` | Delete task |

### Dashboard
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard/stats` | Counts by status |
| GET | `/api/dashboard/analytics` | Weekly activity, priority distribution, monthly trend |
| GET | `/api/dashboard/team` | All team members with task counts |

### Query params for GET /api/tasks
```
?search=keyword
?status=todo|in-progress|review|completed
?priority=low|medium|high
?assignedTo=userId
?dueDate=2025-02-15
?overdue=true
?sortBy=createdAt|dueDate|priority|title
?order=asc|desc
?page=1
?limit=10
```

---

## Socket.IO Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `task:created` | Server → Client | `{ task }` |
| `task:updated` | Server → Client | `{ task }` |
| `task:deleted` | Server → Client | `{ taskId }` |
| `notification` | Server → Client | `{ title, message, type }` |
| `user:online` | Server → Client | `{ userId, fullname }` |
| `user:offline` | Server → Client | `{ userId }` |
| `join:room` | Client → Server | `roomId` |

---

## Setup Instructions

### 1. Install dependencies
```bash
cd taskflow-backend
npm install
```

### 2. Create `.env` file
```bash
cp .env.example .env
```
Fill in:
- `MONGO_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — any random 32+ character string
- `CLIENT_URL` — your frontend URL (default: http://localhost:5173)
- `SMTP_*` — Gmail SMTP credentials (optional)

### 3. Start development server
```bash
npm run dev
# → http://localhost:4000
# → Docs: http://localhost:4000/api/docs
```

---

## Deployment to Render + MongoDB Atlas

### MongoDB Atlas
1. Go to https://cloud.mongodb.com → Create free cluster
2. Database Access → Add user with password
3. Network Access → Allow from anywhere (`0.0.0.0/0`)
4. Connect → Copy the connection string → paste in `.env` as `MONGO_URI`

### Render
1. Go to https://render.com → New Web Service
2. Connect your GitHub repo
3. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Node version:** 18+
4. Environment Variables → Add all from your `.env`
5. Set `CLIENT_URL` to your deployed frontend URL (e.g. from Vercel)

### Frontend (Vercel)
1. Go to https://vercel.com → New Project
2. Import the `taskflow` (frontend) folder
3. Environment Variables → Add:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
4. Deploy

---

## Security Features
- Helmet security headers
- CORS with credential support
- Rate limiting (200 req/15min global, 10 req/15min auth)
- HTTP-only JWT cookies
- bcryptjs password hashing (salt rounds: 12)
- MongoDB query injection sanitization
- Input validation on all endpoints
- Secure password reset tokens (SHA-256 hashed)

---

## Swagger API Docs
Available at: `http://localhost:4000/api/docs`
