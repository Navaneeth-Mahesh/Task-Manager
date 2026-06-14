import { motion } from 'framer-motion'
import { Sidebar } from '../components/layout/Sidebar'
import { Navbar } from '../components/layout/Navbar'
import { useApp } from '../context/AppContext'

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

export function DashboardLayout({ children, title }) {
  const { sidebarCollapsed } = useApp()

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />

      <motion.main
        className="transition-all duration-300 min-h-screen flex flex-col"
        animate={{ marginLeft: sidebarCollapsed ? 72 : 240 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      >
        <Navbar title={title} />

        <motion.div
          className="flex-1 p-6"
          variants={PAGE_VARIANTS}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </motion.main>
    </div>
  )
}
