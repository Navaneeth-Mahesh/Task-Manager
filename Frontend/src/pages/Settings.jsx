import { useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { Toggle } from '../components/ui/Toggle'
import { Avatar } from '../components/ui/Avatar'
import { useApp } from '../context/AppContext'
import {
  RiUserLine, RiBellLine, RiShieldLine, RiSettings3Line,
  RiSaveLine, RiPaletteLine, RiGlobalLine, RiKeyLine,
  RiSmartphoneLine, RiLogoutBoxLine,
} from 'react-icons/ri'

const TABS = [
  { id: 'profile', label: 'Profile', icon: RiUserLine },
  { id: 'notifications', label: 'Notifications', icon: RiBellLine },
  { id: 'security', label: 'Security', icon: RiShieldLine },
  { id: 'preferences', label: 'Preferences', icon: RiSettings3Line },
]

function SectionHeader({ title, description }) {
  return (
    <div className="mb-6">
      <h3 className="font-display font-semibold text-white text-base">{title}</h3>
      {description && <p className="text-xs text-text-muted mt-1">{description}</p>}
    </div>
  )
}

function Divider() {
  return <div className="border-t border-border my-6" />
}

/* ── Profile Tab ─────────────────────────────────────────── */
function ProfileTab({ user }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, bio: '', role: user.role })
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Profile Information" description="Update your personal details and public profile." />

      {/* Avatar section */}
      <div className="flex items-center gap-5 p-5 bg-bg-elevated rounded-2xl border border-border">
        <Avatar initials={user.avatar} color={user.avatarColor} size="xl" />
        <div>
          <p className="text-sm font-medium text-white mb-1">{user.name}</p>
          <p className="text-xs text-text-muted mb-3">{user.role}</p>
          <button className="btn-secondary text-xs py-2 px-4">Change photo</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Full Name</label>
          <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Email Address</label>
          <input type="email" className="input-field" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Role</label>
          <input className="input-field" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Bio</label>
          <input className="input-field" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="A short bio..." />
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          className="btn-primary flex items-center gap-2 text-sm"
          onClick={save}
          whileTap={{ scale: 0.97 }}
        >
          {saved ? '✓ Saved!' : <><RiSaveLine size={15} /> Save Changes</>}
        </motion.button>
      </div>
    </div>
  )
}

/* ── Notifications Tab ───────────────────────────────────── */
function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    taskAssigned: true,
    taskDue: true,
    taskCompleted: false,
    mentions: true,
    teamUpdates: false,
    emailDigest: true,
    pushNotifications: true,
    slackIntegration: false,
  })
  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }))

  const groups = [
    {
      title: 'Task Notifications',
      items: [
        { key: 'taskAssigned', label: 'Task assigned to you', desc: 'When a task is assigned to your name' },
        { key: 'taskDue', label: 'Due date reminders', desc: '24h and 1h before a task is due' },
        { key: 'taskCompleted', label: 'Task completions', desc: 'When tasks you created are completed' },
        { key: 'mentions', label: 'Mentions', desc: 'When someone @mentions you in a task' },
      ],
    },
    {
      title: 'Team & Updates',
      items: [
        { key: 'teamUpdates', label: 'Team activity', desc: 'Digest of what your team has been up to' },
        { key: 'emailDigest', label: 'Weekly email digest', desc: 'Summary of your productivity every Monday' },
      ],
    },
    {
      title: 'Delivery Channels',
      items: [
        { key: 'pushNotifications', label: 'Push notifications', desc: 'Browser and mobile push alerts' },
        { key: 'slackIntegration', label: 'Slack integration', desc: 'Route notifications to your Slack workspace' },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      {groups.map(g => (
        <div key={g.title}>
          <SectionHeader title={g.title} />
          <div className="space-y-4">
            {g.items.map(item => (
              <div key={item.key} className="p-4 bg-bg-elevated rounded-xl border border-border">
                <Toggle
                  checked={prefs[item.key]}
                  onChange={() => toggle(item.key)}
                  label={item.label}
                  description={item.desc}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Security Tab ────────────────────────────────────────── */
function SecurityTab() {
  const [twoFA, setTwoFA] = useState(false)
  const [sessions] = useState([
    { device: 'MacBook Pro — Chrome', location: 'Mumbai, IN', time: 'Active now', current: true },
    { device: 'iPhone 15 — Safari', location: 'Mumbai, IN', time: '2h ago', current: false },
  ])

  return (
    <div className="space-y-8">
      {/* Password */}
      <div>
        <SectionHeader title="Change Password" description="Choose a strong, unique password." />
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Current Password</label>
            <input type="password" className="input-field" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">New Password</label>
            <input type="password" className="input-field" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Confirm New Password</label>
            <input type="password" className="input-field" placeholder="••••••••" />
          </div>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <RiKeyLine size={15} /> Update Password
          </button>
        </div>
      </div>

      <Divider />

      {/* 2FA */}
      <div>
        <SectionHeader title="Two-Factor Authentication" description="Add an extra layer of security to your account." />
        <div className="p-5 bg-bg-elevated rounded-2xl border border-border">
          <Toggle
            checked={twoFA}
            onChange={setTwoFA}
            label="Enable Two-Factor Authentication"
            description="Use an authenticator app to generate one-time codes"
          />
          {twoFA && (
            <motion.div
              className="mt-4 p-4 rounded-xl bg-accent-purple/5 border border-accent-purple/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <p className="text-xs text-text-muted flex items-center gap-2">
                <RiSmartphoneLine size={14} className="text-accent-purple" />
                Scan the QR code in your authenticator app (e.g. Authy, Google Authenticator).
              </p>
              <div className="mt-3 w-28 h-28 bg-white rounded-xl flex items-center justify-center">
                <span className="text-black text-xs font-mono">QR CODE</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Divider />

      {/* Active sessions */}
      <div>
        <SectionHeader title="Active Sessions" description="Manage all devices signed into your account." />
        <div className="space-y-3">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-bg-elevated rounded-xl border border-border">
              <div>
                <p className="text-sm font-medium text-white">{s.device}</p>
                <p className="text-xs text-text-muted mt-0.5">{s.location} · {s.time}</p>
              </div>
              {s.current ? (
                <span className="text-xs px-2.5 py-1 rounded-full bg-status-success/10 text-status-success border border-status-success/20">Current</span>
              ) : (
                <button className="text-xs text-status-danger hover:underline flex items-center gap-1">
                  <RiLogoutBoxLine size={12} /> Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Preferences Tab ─────────────────────────────────────── */
function PreferencesTab() {
  const [prefs, setPrefs] = useState({
    compactMode: false,
    animations: true,
    soundEffects: false,
    autoSave: true,
    defaultView: 'list',
    language: 'en',
    timezone: 'Asia/Kolkata',
    dateFormat: 'MMM d, yyyy',
  })
  const set = (k, v) => setPrefs(p => ({ ...p, [k]: v }))

  return (
    <div className="space-y-8">
      {/* Appearance */}
      <div>
        <SectionHeader title="Appearance" description="Customize how TaskFlow looks and feels." />
        <div className="space-y-4">
          {[
            { key: 'compactMode', label: 'Compact mode', desc: 'Reduce spacing for a denser layout' },
            { key: 'animations', label: 'Enable animations', desc: 'Motion effects and transitions (disable for accessibility)' },
            { key: 'soundEffects', label: 'Sound effects', desc: 'Subtle sounds for task completions and alerts' },
          ].map(item => (
            <div key={item.key} className="p-4 bg-bg-elevated rounded-xl border border-border">
              <Toggle checked={prefs[item.key]} onChange={v => set(item.key, v)} label={item.label} description={item.desc} />
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* Regional */}
      <div>
        <SectionHeader title="Regional Settings" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
          {[
            { label: 'Language', key: 'language', options: [{ value: 'en', label: 'English' }, { value: 'hi', label: 'Hindi' }] },
            { label: 'Timezone', key: 'timezone', options: [{ value: 'Asia/Kolkata', label: 'IST (UTC+5:30)' }, { value: 'America/New_York', label: 'EST (UTC-5)' }, { value: 'UTC', label: 'UTC' }] },
            { label: 'Date Format', key: 'dateFormat', options: [{ value: 'MMM d, yyyy', label: 'Jan 15, 2025' }, { value: 'dd/MM/yyyy', label: '15/01/2025' }, { value: 'MM-dd-yyyy', label: '01-15-2025' }] },
            { label: 'Default View', key: 'defaultView', options: [{ value: 'list', label: 'List' }, { value: 'kanban', label: 'Kanban' }] },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-text-muted mb-1.5">{field.label}</label>
              <select className="input-field" value={prefs[field.key]} onChange={e => set(field.key, e.target.value)}>
                {field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* Auto-save */}
      <div className="p-4 bg-bg-elevated rounded-xl border border-border">
        <Toggle checked={prefs.autoSave} onChange={v => set('autoSave', v)} label="Auto-save" description="Automatically save task edits as you type" />
      </div>

      <div className="flex justify-end">
        <button className="btn-primary flex items-center gap-2 text-sm">
          <RiSaveLine size={15} /> Save Preferences
        </button>
      </div>
    </div>
  )
}

/* ── Main Settings Page ──────────────────────────────────── */
export default function Settings() {
  const { currentUser } = useApp()
  const [activeTab, setActiveTab] = useState('profile')

  const TAB_CONTENT = {
    profile: <ProfileTab user={currentUser} />,
    notifications: <NotificationsTab />,
    security: <SecurityTab />,
    preferences: <PreferencesTab />,
  }

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar tabs */}
          <motion.nav
            className="md:col-span-1 space-y-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`sidebar-item w-full ${activeTab === tab.id ? 'active' : ''}`}
              >
                <tab.icon size={17} className="flex-shrink-0" />
                {tab.label}
              </button>
            ))}
          </motion.nav>

          {/* Content panel */}
          <motion.div
            className="md:col-span-3 card min-h-[500px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            key={activeTab}
          >
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {TAB_CONTENT[activeTab]}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
