import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import {
  RiDashboardLine, RiTaskLine, RiCalendarLine, RiBarChartLine,
  RiTeamLine, RiSettings3Line, RiFlashlightLine, RiMenuFoldLine, RiMenuUnfoldLine,
  RiLogoutBoxLine,
} from 'react-icons/ri'
import { useApp } from '../../context/AppContext'

const NAV_ITEMS = [
  { path: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { path: '/tasks', icon: RiTaskLine, label: 'My Tasks' },
  { path: '/calendar', icon: RiCalendarLine, label: 'Calendar' },
  { path: '/analytics', icon: RiBarChartLine, label: 'Analytics' },
  { path: '/team', icon: RiTeamLine, label: 'Team' },
  { path: '/settings', icon: RiSettings3Line, label: 'Settings' },
]

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, currentUser, logout } = useApp()
  const location = useLocation()

  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen z-40 flex flex-col glass-strong border-r border-border"
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-xl bg-accent-purple flex items-center justify-center flex-shrink-0 shadow-glow-sm">
          <RiFlashlightLine className="text-white" size={16} />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              className="font-display font-bold text-white text-lg tracking-tight"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              TaskFlow
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <Link key={path} to={path}>
              <motion.div
                className={`sidebar-item ${active ? 'active' : ''}`}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Icon size={18} className="flex-shrink-0" />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && (
                  <motion.div
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-purple flex-shrink-0"
                    layoutId="nav-dot"
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-border space-y-2">
        {/* User */}
        <div className={`flex items-center gap-3 px-2 py-2 rounded-xl ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
            style={{ background: `${currentUser.avatarColor}22`, border: `1.5px solid ${currentUser.avatarColor}44`, color: currentUser.avatarColor }}
          >
            {currentUser.avatar}
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-medium text-white truncate">{currentUser.name}</p>
                <p className="text-xs text-text-dim truncate">{currentUser.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="sidebar-item w-full"
        >
          {sidebarCollapsed
            ? <RiMenuUnfoldLine size={18} />
            : <>
                <RiMenuFoldLine size={18} />
                <AnimatePresence>
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Collapse
                  </motion.span>
                </AnimatePresence>
              </>
          }
        </button>

        <button onClick={logout} className="sidebar-item w-full hover:text-status-danger">
          <RiLogoutBoxLine size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
