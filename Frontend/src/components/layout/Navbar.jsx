import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiSearchLine, RiBellLine, RiCheckLine } from 'react-icons/ri'
import { Avatar } from '../ui/Avatar'
import { useApp } from '../../context/AppContext'
import { NOTIFICATIONS } from '../../data'

export function Navbar({ title }) {
  const { currentUser, notifications, setNotifications } = useApp()
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')

  const unread = NOTIFICATIONS.filter(n => !n.read).length

  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-border px-6 py-4 flex items-center justify-between gap-4">
      <h1 className="text-xl font-display font-semibold text-white">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <AnimatePresence>
            {searchOpen ? (
              <motion.input
                autoFocus
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onBlur={() => { setSearchOpen(false); setSearchVal('') }}
                placeholder="Search tasks..."
                className="input-field w-56 h-9 text-sm pr-4"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 224, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            ) : (
              <motion.button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-xl glass text-text-muted hover:text-white transition-colors"
              >
                <RiSearchLine size={18} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-xl glass text-text-muted hover:text-white transition-colors relative"
          >
            <RiBellLine size={18} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-purple rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                {unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                className="absolute right-0 top-12 w-80 glass-strong rounded-2xl shadow-modal border border-border overflow-hidden"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <div className="px-4 py-3 border-b border-border flex justify-between items-center">
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  <button className="text-xs text-accent-purple hover:underline">Mark all read</button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} className={`px-4 py-3 border-b border-border/50 hover:bg-white/3 transition-colors ${!n.read ? 'bg-accent-purple/5' : ''}`}>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="text-xs font-medium text-white">{n.title}</p>
                          <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{n.message}</p>
                        </div>
                        <span className="text-[10px] text-text-dim whitespace-nowrap">{n.time}</span>
                      </div>
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-accent-purple mt-2" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <Avatar initials={currentUser.avatar} color={currentUser.avatarColor} size="sm" />
      </div>
    </header>
  )
}
