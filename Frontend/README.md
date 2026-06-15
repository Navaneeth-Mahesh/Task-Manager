TaskFlow — Premium Task Management Application

> Awwwards-quality frontend built with React + Vite · Framer Motion · GSAP · Tailwind CSS

![TaskFlow Preview](https://placehold.co/1200x630/050505/8B5CF6?text=TaskFlow+Preview)

---

 Overview

TaskFlow is a production-ready, dark-first Task Management frontend inspired by **Linear**, **Notion**, **Raycast**, and **Arc Browser**. It features cinematic animations, a full Kanban board, analytics charts, team management, and a premium landing page — all built as a modular React application ready to wire up to any backend API.

---

Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 |
| Motion | Framer Motion 11 |
| Scroll FX | GSAP 3 + ScrollTrigger |
| Smooth Scroll | Lenis (`@studio-freight/lenis`) |
| Icons | React Icons 5 |
| Charts | Recharts 2 |
| Routing | React Router DOM 6 |
| Drag & Drop | `@dnd-kit/core` (optional) |
| Date Utils | date-fns 3 |

---

Folder Structure

```
taskflow/
├── public/
│   └── favicon.svg
├── src/
│   ├── animations/         # GSAP utilities & Framer Motion variant presets
│   │   ├── gsap.js         # ScrollTrigger, tilt, counter, parallax helpers
│   │   └── variants.js     # Reusable motion variants (page, card, modal…)
│   │
│   ├── assets/             # Static images, illustrations, fonts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx  # Collapsible sidebar with animated nav items
│   │   │   └── Navbar.jsx   # Top bar: search, notifications, user avatar
│   │   ├── modals/
│   │   │   ├── TaskModal.jsx       # Create / edit task form
│   │   │   ├── DeleteModal.jsx     # Delete confirmation
│   │   │   └── TaskDetailModal.jsx # Read-only task detail view
│   │   ├── ui/
│   │   │   ├── Avatar.jsx   # Colored initials avatar
│   │   │   ├── Modal.jsx    # Glassmorphism modal wrapper
│   │   │   ├── Skeleton.jsx # Shimmer skeleton loaders
│   │   │   └── Toggle.jsx   # Animated toggle switch
│   │   └── TaskCard.jsx     # Individual task card with priority stripe
│   │
│   ├── context/
│   │   └── AppContext.jsx   # Global auth state, tasks CRUD, sidebar state
│   │
│   ├── data/
│   │   └── index.js         # Dummy data: tasks, team, stats, chart data
│   │
│   ├── hooks/
│   │   ├── index.js         # useModal, useTaskFilter, useSelectedTask,
│   │   │                    # useClickOutside, useDebounce, useLocalStorage,
│   │   │                    # useKeyboardShortcut, useGSAPScrollReveal, useCountUp
│   │   ├── useLenis.js      # Lenis smooth scroll initialiser
│   │   └── useParallax.js   # Mouse-position parallax offset
│   │
│   ├── layouts/
│   │   └── DashboardLayout.jsx  # Sidebar + Navbar wrapper with page transition
│   │
│   ├── pages/
│   │   ├── Landing.jsx      # Full marketing page (hero, features, CTA)
│   │   ├── Login.jsx        # Split-screen auth with social login UI
│   │   ├── Register.jsx     # Registration with live password strength
│   │   ├── Dashboard.jsx    # Stats, activity chart, recent tasks
│   │   ├── Tasks.jsx        # List + Kanban views with full CRUD
│   │   ├── Calendar.jsx     # Monthly calendar with task dots
│   │   ├── Analytics.jsx    # Area, bar, pie charts via Recharts
│   │   ├── Team.jsx         # Member cards with completion rates
│   │   └── Settings.jsx     # Profile, Notifications, Security, Prefs tabs
│   │
│   ├── routes/              # (extend here for nested / lazy routes)
│   │
│   ├── services/
│   │   └── api.js           # REST API service layer (authService, taskService…)
│   │
│   ├── utils/
│   │   └── index.js         # cn(), formatDate, getDaysLeft, priority/status configs
│   │
│   ├── App.jsx              # HashRouter + route definitions + auth guards
│   ├── main.jsx             # React DOM entry point
│   └── index.css            # Tailwind base + global design-token CSS vars
│
├── index.html
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## ⚙️ Installation

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### 1 — Clone & install

```bash
git clone https://github.com/yourname/taskflow.git
cd taskflow
npm install
```

### 2 — Install optional packages (if not blocked by your registry)

```bash
# Smooth scroll
npm install @studio-freight/lenis

# Drag & drop Kanban
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### 3 — Environment variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:4000/api/v1
```

Leave it blank to use the included dummy data with no backend.

### 4 — Start dev server

```bash
npm run dev
# → http://localhost:5173
```

### 5 — Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

 Authentication Flow

```
/ (Landing)
  ↓ "Get Started"
/register  ──────────────────────┐
/login     → doLogin() → context │
                                 ↓
                          /dashboard (protected)
```

All `/dashboard`, `/tasks`, `/calendar`, `/analytics`, `/team`, `/settings` routes are protected by `<ProtectedRoute>`. Unauthenticated visits redirect to `/login`.

---

 Design System

### Color palette

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#050505` | Page background |
| `--bg-card` | `#0D0D0D` | Card surfaces |
| `--accent` | `#8B5CF6` | Primary purple |
| `--cyan` | `#06B6D4` | Secondary accent |
| `--border` | `rgba(255,255,255,0.08)` | All borders |
| `--success` | `#22C55E` | Completed / online |
| `--warning` | `#F59E0B` | Review / away |
| `--danger` | `#EF4444` | Overdue / delete |

### Typography

| Role | Family | Weight |
|---|---|---|
| Display / headings | Plus Jakarta Sans | 600–800 |
| Body | Inter | 400–600 |
| Code / mono | JetBrains Mono | 400–500 |

### Utility classes (defined in `index.css`)

```css
.glass          /* backdrop-blur card */
.glass-strong   /* heavier blur modal */
.gradient-text  /* purple → cyan text gradient */
.btn-primary    /* purple CTA button */
.btn-secondary  /* ghost glass button */
.card           /* base card surface */
.card-hover     /* card + hover lift */
.input-field    /* form input */
.badge-high/medium/low     /* priority badge */
.status-todo/progress/review/done  /* status pill */
```

---

 Connecting to Your Backend

1. Update `VITE_API_URL` in `.env`
2. Open `src/services/api.js` — every endpoint is documented with expected request/response shape
3. Replace the `useState(TASKS)` in `AppContext.jsx` with `useEffect` calls to `taskService.list()`, `taskService.create()`, etc.

Example migration in `AppContext.jsx`:

```jsx
// Before (dummy data)
const [tasks, setTasks] = useState(TASKS)

// After (real API)
const [tasks, setTasks] = useState([])
useEffect(() => {
  taskService.list().then(setTasks).catch(console.error)
}, [])

const addTask = async (payload) => {
  const created = await taskService.create(payload)
  setTasks(prev => [created, ...prev])
}
```

---
Animation Architecture

| System | Used for |
|---|---|
| **Framer Motion** | Page transitions, modal open/close, card hover, sidebar collapse, stagger lists |
| **GSAP + ScrollTrigger** | Landing hero, feature cards, timeline, parallax, stat counters |
| **CSS keyframes** | Float cards, pulse glow, shimmer skeleton |
| **Lenis** | Butter-smooth native scroll |

Import presets from `src/animations/variants.js`:

```jsx
import { CARD_HOVER, STAGGER_CONTAINER, STAGGER_ITEM } from '@/animations/variants'

<motion.ul variants={STAGGER_CONTAINER} initial="hidden" animate="show">
  {items.map(item => (
    <motion.li key={item.id} variants={STAGGER_ITEM}>
      {item.title}
    </motion.li>
  ))}
</motion.ul>
```

---

Responsive Breakpoints

| Name | Width | Adjustments |
|---|---|---|
| Mobile | < 768px | Sidebar auto-collapses, stat grid 1-col, floating cards hidden |
| Tablet | 768px–1024px | Sidebar icon-only, stat grid 2-col |
| Laptop | 1024px–1280px | Full sidebar, 3-col task grid |
| Desktop | > 1280px | Full layout, 4-col stats |

---

 Roadmap (Backend integration phases)

- [ ] Phase 2 — Auth API (JWT, refresh tokens)  
- [ ] Phase 3 — Task CRUD endpoints  
- [ ] Phase 4 — Real-time via WebSocket / SSE  
- [ ] Phase 5 — File attachments (S3)  
- [ ] Phase 6 — AI task suggestions  
- [ ] Phase 7 — Mobile PWA  

---

 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional commits: `git commit -m "feat: add calendar drag"`
4. Open a Pull Request

---

License

MIT © 2025 Navaneeth — built as a flagship portfolio project.
