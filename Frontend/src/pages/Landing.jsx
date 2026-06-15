import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  RiFlashlightLine, RiPlayCircleLine, RiArrowRightLine,
  RiTaskLine, RiTeamLine, RiBarChartLine, RiBellLine,
  RiCheckDoubleLine, RiShieldCheckLine, RiArrowRightUpLine,
  RiStarFill, RiTwitterXLine, RiGithubLine,
} from 'react-icons/ri'
import { useParallax } from '../hooks/useParallax'
import { TESTIMONIALS } from '../data'

const FEATURES = [
  { icon: RiTaskLine, title: 'Smart Task Management', desc: 'Organize, prioritize, and track every task with precision. Drag-and-drop kanban boards that feel native.', color: '#8B5CF6' },
  { icon: RiTeamLine, title: 'Real-time Collaboration', desc: 'Work together seamlessly. Assign tasks, leave comments, and track team progress in one unified view.', color: '#06B6D4' },
  { icon: RiBarChartLine, title: 'Powerful Analytics', desc: 'Deep insights into productivity patterns. Beautiful charts that reveal how your team works best.', color: '#22C55E' },
  { icon: RiBellLine, title: 'Smart Notifications', desc: 'Never miss a deadline. AI-powered reminders that know when to nudge you, not spam you.', color: '#F59E0B' },
  { icon: RiShieldCheckLine, title: 'Enterprise Security', desc: 'SOC 2 compliant, end-to-end encrypted. Your data stays yours — always.', color: '#EF4444' },
  { icon: RiCheckDoubleLine, title: 'Team Workspace', desc: 'One workspace for your entire organization. Roles, permissions, and shared context built in.', color: '#8B5CF6' },
]

const WORKFLOW = [
  { step: '01', label: 'Create Task', desc: 'Define the work with rich details, attachments, and context' },
  { step: '02', label: 'Assign & Plan', desc: 'Set owners, due dates, and priority in seconds' },
  { step: '03', label: 'Track Progress', desc: 'Watch tasks move through your custom workflow' },
  { step: '04', label: 'Ship & Celebrate', desc: 'Mark complete and see your productivity soar' },
]

function FloatingCard({ delay, x, y, rotate, children }) {
  return (
    <motion.div
      className="absolute glass rounded-2xl p-4 text-left pointer-events-none"
      style={{ left: x, top: y, rotate: `${rotate}deg` }}
      animate={{ y: [0, -12, 0], rotate: [`${rotate}deg`, `${rotate + 1}deg`, `${rotate}deg`] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  )
}

function Section({ children, className = '' }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const parallax = useParallax(0.015)
  const [testimonialIdx, setTestimonialIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-bg-primary overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 px-6 py-4 flex items-center justify-between glass border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-accent-purple flex items-center justify-center shadow-glow-sm">
            <RiFlashlightLine className="text-white" size={16} />
          </div>
          <span className="font-display font-bold text-white text-lg">TaskFlow</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-text-muted">
          {['Features', 'How it works', 'Team'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="hover:text-white transition-colors">{item}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="btn-ghost text-sm">Sign in</button>
          <button onClick={() => navigate('/register')} className="btn-primary text-sm">Get Started</button>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(ellipse, #8B5CF6 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(ellipse, #06B6D4 0%, transparent 70%)' }}
            animate={{ scale: [1.05, 1, 1.05] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Grid bg */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating cards */}
        <div className="absolute inset-0 hidden lg:block">
          <motion.div
            style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)` }}
            className="absolute inset-0"
            transition={{ type: 'spring', stiffness: 100, damping: 30 }}
          >
            <FloatingCard x="5%" y="20%" rotate={-6} delay={0}>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge-high">High</span>
                <span className="text-xs text-text-muted">Design Sprint</span>
              </div>
              <div className="text-sm text-white font-medium">Redesign dashboard</div>
              <div className="mt-2 w-full h-1 bg-bg-elevated rounded-full">
                <div className="h-full w-2/3 rounded-full bg-accent-purple" />
              </div>
            </FloatingCard>

            <FloatingCard x="75%" y="15%" rotate={5} delay={1.5}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-accent-cyan/20 flex items-center justify-center text-accent-cyan text-xs font-bold">3</div>
                <div>
                  <p className="text-xs font-medium text-white">Tasks completed</p>
                  <p className="text-[10px] text-status-success">↑ 12% today</p>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard x="80%" y="65%" rotate={3} delay={0.8}>
              <p className="text-[10px] text-text-muted mb-1.5">Sprint velocity</p>
              <p className="text-2xl font-display font-bold text-white">94<span className="text-sm text-text-muted">%</span></p>
            </FloatingCard>

            <FloatingCard x="2%" y="65%" rotate={-3} delay={2}>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                <span className="text-xs text-text-muted">5 members online</span>
              </div>
            </FloatingCard>
          </motion.div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-xs text-text-muted border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
            Now in public beta — 2,400+ teams onboarded
          </motion.div>

          <motion.h1
            className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            Organize Your Life.{' '}
            <span className="gradient-text">Achieve More.</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Manage tasks, track progress, and stay productive with a modern workflow.
            Built for teams that move fast and ship great work.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <button
              onClick={() => navigate('/register')}
              className="btn-primary text-base px-8 py-3.5 flex items-center gap-2"
            >
              Get Started Free <RiArrowRightLine size={18} />
            </button>
            <button className="btn-secondary text-base px-8 py-3.5 flex items-center gap-2">
              <RiPlayCircleLine size={18} /> Watch Demo
            </button>
          </motion.div>

          <motion.p
            className="text-xs text-text-dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            No credit card required · Free forever plan · Ship in 60 seconds
          </motion.p>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <Section className="text-center mb-20">
            <p className="text-xs font-medium text-accent-purple uppercase tracking-widest mb-4">Everything you need</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Built for how modern<br />teams actually work
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              Stop context-switching between tools. TaskFlow brings tasks, collaboration, and insights into one beautiful experience.
            </p>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <Section key={f.title} className="h-full">
                <motion.div
                  className="card-hover h-full group"
                  whileHover={{ y: -4 }}
                  style={{ '--accent': f.color }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}
                  >
                    <f.icon size={20} style={{ color: f.color }} />
                  </div>
                  <h3 className="font-display font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{f.desc}</p>
                </motion.div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow Timeline ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-32 px-6 bg-bg-secondary">
        <div className="max-w-5xl mx-auto">
          <Section className="text-center mb-20">
            <p className="text-xs font-medium text-accent-cyan uppercase tracking-widest mb-4">Simple workflow</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              From idea to shipped<br />in four steps
            </h2>
          </Section>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-px bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-purple opacity-30" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {WORKFLOW.map((w, i) => (
                <Section key={w.step}>
                  <motion.div
                    className="text-center group"
                    whileHover={{ y: -4 }}
                  >
                    <div className="relative inline-flex mb-6">
                      <div className="w-16 h-16 rounded-2xl glass border border-border flex items-center justify-center group-hover:border-accent-purple/30 transition-colors">
                        <span className="font-display text-2xl font-bold gradient-text">{w.step}</span>
                      </div>
                      {i < WORKFLOW.length - 1 && (
                        <RiArrowRightLine className="md:hidden absolute -right-6 top-1/2 -translate-y-1/2 text-text-dim" />
                      )}
                    </div>
                    <h3 className="font-display font-semibold text-white mb-2">{w.label}</h3>
                    <p className="text-sm text-text-muted">{w.desc}</p>
                  </motion.div>
                </Section>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <Section className="text-center mb-16">
            <p className="text-xs font-medium text-accent-purple uppercase tracking-widest mb-4">Loved by teams</p>
            <h2 className="font-display text-4xl font-bold text-white">
              Trusted by builders worldwide
            </h2>
          </Section>

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                className="glass rounded-3xl p-10 text-center max-w-2xl mx-auto"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(TESTIMONIALS[testimonialIdx].rating)].map((_, i) => (
                    <RiStarFill key={i} className="text-status-warning" size={16} />
                  ))}
                </div>
                <p className="text-lg text-text-secondary leading-relaxed mb-8">
                  "{TESTIMONIALS[testimonialIdx].text}"
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{
                      background: `${TESTIMONIALS[testimonialIdx].avatarColor}20`,
                      color: TESTIMONIALS[testimonialIdx].avatarColor,
                      border: `1.5px solid ${TESTIMONIALS[testimonialIdx].avatarColor}30`,
                    }}
                  >
                    {TESTIMONIALS[testimonialIdx].avatar}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">{TESTIMONIALS[testimonialIdx].name}</p>
                    <p className="text-xs text-text-muted">{TESTIMONIALS[testimonialIdx].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`rounded-full transition-all duration-300 ${i === testimonialIdx ? 'w-6 h-2 bg-accent-purple' : 'w-2 h-2 bg-text-dim hover:bg-text-muted'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <Section>
          <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl glass p-16 text-center border border-accent-purple/20">
            {/* Background glow */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, #8B5CF6 0%, transparent 70%)' }} />

            <p className="text-xs font-medium text-accent-purple uppercase tracking-widest mb-4 relative z-10">The time is now</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">
              Ready to boost<br />productivity?
            </h2>
            <p className="text-text-muted mb-10 max-w-md mx-auto relative z-10">
              Join 2,400+ teams already shipping faster, collaborating better, and stressing less.
            </p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <button
                onClick={() => navigate('/register')}
                className="btn-primary text-base px-8 py-3.5 flex items-center gap-2"
              >
                Start for free <RiArrowRightUpLine size={18} />
              </button>
              <button onClick={() => navigate('/login')} className="btn-secondary text-base px-8 py-3.5">
                Sign in
              </button>
            </div>
          </div>
        </Section>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-accent-purple flex items-center justify-center">
              <RiFlashlightLine className="text-white" size={12} />
            </div>
            <span className="font-display font-bold text-white text-sm">TaskFlow</span>
          </div>
          <p className="text-xs text-text-dim">© 2026 TaskFlow. Built with precision.</p>
          <div className="flex items-center gap-4 text-text-dim">
            <a href="#" className="hover:text-white transition-colors"><RiTwitterXLine size={16} /></a>
            <a href="#" className="hover:text-white transition-colors"><RiGithubLine size={16} /></a>
          </div>
        </div>
      </footer>
    </div>
  )
}
