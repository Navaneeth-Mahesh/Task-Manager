// ─── Tasks ────────────────────────────────────────────────────────────────────
export const TASKS = [
  {
    id: 't1',
    title: 'Redesign onboarding flow',
    description: 'Revamp the user onboarding experience with new micro-animations and cleaner copy.',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2025-02-15',
    assignee: 'u1',
    tags: ['design', 'ux'],
    progress: 65,
    createdAt: '2025-01-20',
  },
  {
    id: 't2',
    title: 'API rate limiting middleware',
    description: 'Implement sliding window rate limiting for all public endpoints.',
    priority: 'high',
    status: 'todo',
    dueDate: '2025-02-10',
    assignee: 'u2',
    tags: ['backend', 'security'],
    progress: 0,
    createdAt: '2025-01-22',
  },
  {
    id: 't3',
    title: 'Write Q1 product brief',
    description: 'Outline product strategy and milestones for Q1 2025.',
    priority: 'medium',
    status: 'review',
    dueDate: '2025-02-05',
    assignee: 'u3',
    tags: ['product', 'docs'],
    progress: 90,
    createdAt: '2025-01-18',
  },
  {
    id: 't4',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment.',
    priority: 'medium',
    status: 'completed',
    dueDate: '2025-01-30',
    assignee: 'u1',
    tags: ['devops'],
    progress: 100,
    createdAt: '2025-01-15',
  },
  {
    id: 't5',
    title: 'Analytics dashboard v2',
    description: 'Add cohort analysis and funnel visualization to the analytics module.',
    priority: 'medium',
    status: 'todo',
    dueDate: '2025-02-20',
    assignee: 'u4',
    tags: ['frontend', 'analytics'],
    progress: 0,
    createdAt: '2025-01-23',
  },
  {
    id: 't6',
    title: 'Fix mobile nav overflow',
    description: 'Navigation breaks on viewports below 380px. Needs urgent fix.',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2025-02-03',
    assignee: 'u2',
    tags: ['frontend', 'bugfix'],
    progress: 40,
    createdAt: '2025-01-24',
  },
  {
    id: 't7',
    title: 'Database index optimization',
    description: 'Profile slow queries and add composite indexes where needed.',
    priority: 'low',
    status: 'todo',
    dueDate: '2025-02-25',
    assignee: 'u5',
    tags: ['backend', 'performance'],
    progress: 0,
    createdAt: '2025-01-25',
  },
  {
    id: 't8',
    title: 'Update privacy policy',
    description: 'GDPR compliance updates and new data retention clauses.',
    priority: 'low',
    status: 'completed',
    dueDate: '2025-01-28',
    assignee: 'u3',
    tags: ['legal', 'compliance'],
    progress: 100,
    createdAt: '2025-01-14',
  },
  {
    id: 't9',
    title: 'Email notification system',
    description: 'Build transactional email system using React Email and Resend.',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2025-02-12',
    assignee: 'u4',
    tags: ['backend', 'email'],
    progress: 55,
    createdAt: '2025-01-21',
  },
  {
    id: 't10',
    title: 'Implement dark/light theme',
    description: 'Add system-aware theme switching with CSS variables.',
    priority: 'low',
    status: 'review',
    dueDate: '2025-02-08',
    assignee: 'u1',
    tags: ['frontend', 'design'],
    progress: 80,
    createdAt: '2025-01-19',
  },
]

// ─── Users / Team ────────────────────────────────────────────────────────────// 


export const TEAM = []



// ─── Stats ────────────────────────────────────────────────────────────────────
export const STATS = {
  totalTasks: 10,
  completed: 2,
  inProgress: 3,
  pending: 3,
  review: 2,
  completionRate: 72,
  streak: 7,
}

// ─── Chart Data ───────────────────────────────────────────────────────────────
export const WEEKLY_ACTIVITY = [
  { day: 'Mon', completed: 0, created: 0 },
  { day: 'Tue', completed: 0, created: 0 },
  { day: 'Wed', completed: 0, created: 0 },
  { day: 'Thu', completed: 0, created: 0 },
  { day: 'Fri', completed: 0, created: 0 },
  { day: 'Sat', completed: 0, created: 0 },
  { day: 'Sun', completed: 0, created: 0 },
]

export const MONTHLY_TREND = [
  { month: 'Aug', productivity: 0, tasks: 0 },
  { month: 'Sep', productivity: 0, tasks: 0 },
  { month: 'Oct', productivity: 0, tasks: 0 },
  { month: 'Nov', productivity: 0, tasks: 0 },
  { month: 'Dec', productivity: 0, tasks: 0 },
  { month: 'Jan', productivity: 0, tasks: 0 },
]

export const STATUS_DISTRIBUTION = [
  { name: 'Completed', value: 0, color: '#22C55E' },
  { name: 'In Progress', value: 0, color: '#06B6D4' },
  { name: 'Review', value: 0, color: '#F59E0B' },
  { name: 'Todo', value: 0, color: '#6B7280' },
]

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Engineering Manager, Vercel',
    text: 'TaskFlow completely transformed how our team ships features. The kanban view is unbelievably smooth.',
    avatar: 'SC',
    avatarColor: '#8B5CF6',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marcus Webb',
    role: 'Founder, Linear-inspired startup',
    text: 'I\'ve tried every task manager out there. Nothing comes close to this level of polish and speed.',
    avatar: 'MW',
    avatarColor: '#06B6D4',
    rating: 5,
  },
  {
    id: 3,
    name: 'Aisha Patel',
    role: 'Product Designer, Figma',
    text: 'The animations are *chef\'s kiss*. This is what productivity software should feel like in 2025.',
    avatar: 'AP',
    avatarColor: '#22C55E',
    rating: 5,
  },
]

// ─── Notifications ────────────────────────────────────────────────────────────
export const NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'task',
    title: 'Task overdue',
    message: '"API rate limiting" was due yesterday.',
    time: '2m ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'mention',
    title: 'Priya mentioned you',
    message: 'In "Fix mobile nav overflow" — needs your input.',
    time: '1h ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'complete',
    title: 'Task completed',
    message: 'Rahul marked "Update privacy policy" as done.',
    time: '3h ago',
    read: true,
  },
]
