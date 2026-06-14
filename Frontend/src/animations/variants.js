// ─── Page-level transitions ───────────────────────────────────────────────────

export const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
}

export const PAGE_SLIDE = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export const CARD_HOVER = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.01,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
  tap: { scale: 0.98 },
}

export const CARD_ENTER = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: 'easeOut' },
})

// ─── List stagger ────────────────────────────────────────────────────────────

export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
}

export const STAGGER_ITEM = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 28 },
  },
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export const MODAL_BACKDROP = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

export const MODAL_CONTENT = {
  initial: { opacity: 0, scale: 0.92, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.92, y: 16 },
  transition: { type: 'spring', stiffness: 420, damping: 30 },
}

// ─── Dropdown / popover ───────────────────────────────────────────────────────

export const DROPDOWN = {
  initial: { opacity: 0, scale: 0.94, y: -8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.94, y: -8 },
  transition: { type: 'spring', stiffness: 400, damping: 30 },
}

// ─── Sidebar collapse ─────────────────────────────────────────────────────────

export const SIDEBAR_LABEL = {
  initial: { opacity: 0, x: -8, width: 0 },
  animate: { opacity: 1, x: 0, width: 'auto' },
  exit: { opacity: 0, x: -8, width: 0 },
  transition: { duration: 0.2 },
}

// ─── Stat counter ─────────────────────────────────────────────────────────────

export const STAT_CARD = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.88, y: 16 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: {
    delay,
    type: 'spring',
    stiffness: 350,
    damping: 24,
  },
})

// ─── Notification badge ──────────────────────────────────────────────────────

export const BADGE_POP = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: { type: 'spring', stiffness: 600, damping: 20 },
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

export const PROGRESS_FILL = (width, delay = 0.2) => ({
  initial: { width: 0 },
  animate: { width: `${width}%` },
  transition: { duration: 0.9, delay, ease: [0.4, 0, 0.2, 1] },
})

// ─── Floating hero card ───────────────────────────────────────────────────────

export const FLOAT = (delay = 0) => ({
  animate: {
    y: [0, -16, 0],
    rotate: [`0deg`, `1deg`, `0deg`],
    transition: {
      duration: 5 + delay,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    },
  },
})

// ─── Tab switch ───────────────────────────────────────────────────────────────

export const TAB_CONTENT = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.22, ease: 'easeOut' },
}

// ─── Fade in ─────────────────────────────────────────────────────────────────

export const FADE_IN = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay, duration: 0.4 },
})

// ─── Hero text ───────────────────────────────────────────────────────────────

export const HERO_TEXT = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
})

// ─── Spring button ───────────────────────────────────────────────────────────

export const SPRING_BTN = {
  whileHover: { scale: 1.03, y: -1 },
  whileTap: { scale: 0.97 },
  transition: { type: 'spring', stiffness: 500, damping: 30 },
}
