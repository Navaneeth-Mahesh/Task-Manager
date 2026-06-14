import { motion } from 'framer-motion'

export function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div>
          {label && <p className="text-sm font-medium text-white">{label}</p>}
          {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
        </div>
      )}
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-accent-purple/40 ${checked ? 'bg-accent-purple' : 'bg-bg-elevated border border-border'}`}
      >
        <motion.span
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      </button>
    </div>
  )
}
