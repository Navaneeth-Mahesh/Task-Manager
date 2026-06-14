import { useState, useCallback, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'

// ─── useModal ─────────────────────────────────────────────────────────────────
/**
 * Manage open/close state for any modal.
 * const { isOpen, open, close, toggle } = useModal()
 */
export function useModal(initial = false) {
  const [isOpen, setIsOpen] = useState(initial)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(v => !v), [])
  return { isOpen, open, close, toggle }
}

// ─── useTaskFilter ────────────────────────────────────────────────────────────
/**
 * Filter + sort the tasks array with reactive controls.
 */
export function useTaskFilter() {
  const { tasks } = useApp()
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('createdAt') // createdAt | dueDate | priority | title

  const filtered = tasks
    .filter(t => {
      const matchStatus = statusFilter === 'all' || t.status === statusFilter
      const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter
      const matchSearch = !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchStatus && matchPriority && matchSearch
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const order = { high: 0, medium: 1, low: 2 }
        return order[a.priority] - order[b.priority]
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      // Default: createdAt desc
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    })

  const reset = useCallback(() => {
    setStatusFilter('all')
    setPriorityFilter('all')
    setSearchQuery('')
    setSortBy('createdAt')
  }, [])

  return {
    filtered,
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    reset,
    count: filtered.length,
  }
}

// ─── useSelectedTask ──────────────────────────────────────────────────────────
/**
 * Track which task is selected for view / edit / delete.
 */
export function useSelectedTask() {
  const [viewTask, setViewTask] = useState(null)
  const [editTask, setEditTask] = useState(null)
  const [deleteTask, setDeleteTask] = useState(null)

  return {
    viewTask,
    editTask,
    deleteTask,
    openView: useCallback(task => setViewTask(task), []),
    openEdit: useCallback(task => setEditTask(task), []),
    openDelete: useCallback(task => setDeleteTask(task), []),
    closeView: useCallback(() => setViewTask(null), []),
    closeEdit: useCallback(() => setEditTask(null), []),
    closeDelete: useCallback(() => setDeleteTask(null), []),
  }
}

// ─── useClickOutside ─────────────────────────────────────────────────────────
/**
 * Close a dropdown / popover when the user clicks outside the ref element.
 * const ref = useClickOutside(() => setOpen(false))
 */
export function useClickOutside(handler) {
  const ref = useRef(null)
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return
      handler(e)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [handler])
  return ref
}

// ─── useDebounce ──────────────────────────────────────────────────────────────
/**
 * Debounce a rapidly-changing value (e.g. search input).
 * const debouncedQuery = useDebounce(query, 300)
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

// ─── useLocalStorage ─────────────────────────────────────────────────────────
/**
 * useState that persists to localStorage.
 * const [theme, setTheme] = useLocalStorage('theme', 'dark')
 */
export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })
  const setValue = useCallback((value) => {
    try {
      const v = value instanceof Function ? value(stored) : value
      setStored(v)
      window.localStorage.setItem(key, JSON.stringify(v))
    } catch {
      console.warn(`useLocalStorage: failed to write key "${key}"`)
    }
  }, [key, stored])
  return [stored, setValue]
}

// ─── useKeyboardShortcut ─────────────────────────────────────────────────────
/**
 * Register a keyboard shortcut globally.
 * useKeyboardShortcut('k', { meta: true }, () => setSearchOpen(true))
 */
export function useKeyboardShortcut(key, options = {}, handler) {
  const { meta = false, ctrl = false, shift = false, alt = false } = options
  useEffect(() => {
    const listener = (e) => {
      if (meta && !e.metaKey) return
      if (ctrl && !e.ctrlKey) return
      if (shift && !e.shiftKey) return
      if (alt && !e.altKey) return
      if (e.key.toLowerCase() !== key.toLowerCase()) return
      e.preventDefault()
      handler(e)
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [key, meta, ctrl, shift, alt, handler])
}

// ─── useGSAPScrollReveal ──────────────────────────────────────────────────────
/**
 * Attach a GSAP scroll-triggered fade-up to a container ref's children.
 * const ref = useGSAPScrollReveal({ stagger: 0.08 })
 * <div ref={ref}>...</div>
 */
export function useGSAPScrollReveal(options = {}) {
  const ref = useRef(null)
  const { stagger = 0.08, y = 30, duration = 0.55 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let ctx
    import('gsap').then(({ gsap }) =>
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        ctx = gsap.context(() => {
          gsap.from(el.children, {
            opacity: 0,
            y,
            stagger,
            duration,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          })
        }, el)
      })
    )
    return () => ctx?.revert()
  }, [y, stagger, duration])

  return ref
}

// ─── useCountUp ──────────────────────────────────────────────────────────────
/**
 * Animate a number from 0 to `end` when the element enters view.
 * const { ref, displayValue } = useCountUp(94, { suffix: '%' })
 */
export function useCountUp(end, options = {}) {
  const { duration = 1200, suffix = '', prefix = '', decimals = 0 } = options
  const [displayValue, setDisplayValue] = useState(prefix + '0' + suffix)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3) // ease out cubic
          const value = (eased * end).toFixed(decimals)
          setDisplayValue(prefix + value + suffix)
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration, suffix, prefix, decimals])

  return { ref, displayValue }
}
