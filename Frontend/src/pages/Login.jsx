import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiFlashlightLine, RiEyeLine, RiEyeOffLine, RiGithubLine } from 'react-icons/ri'
import { useApp } from '../context/AppContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useApp()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden border-r border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }} />
        </div>
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-8 h-8 rounded-xl bg-accent-purple flex items-center justify-center shadow-glow-sm">
            <RiFlashlightLine className="text-white" size={16} />
          </div>
          <span className="font-display font-bold text-white text-lg">TaskFlow</span>
        </div>
        <motion.div className="relative z-10 max-w-sm" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
          <h2 className="font-display text-4xl font-bold text-white mb-6 leading-snug">The workspace<br /><span className="gradient-text">that thinks ahead.</span></h2>
          <p className="text-text-muted text-sm leading-relaxed">Thousands of teams use TaskFlow to ship faster and stay focused.</p>
          <div className="flex gap-8 mt-10">
            {[{ val: '2.4k+', label: 'Teams' }, { val: '98%', label: 'Satisfaction' }, { val: '50ms', label: 'Avg latency' }].map(s => (
              <div key={s.label}><p className="font-display text-xl font-bold gradient-text">{s.val}</p><p className="text-xs text-text-dim">{s.label}</p></div>
            ))}
          </div>
        </motion.div>
        <p className="text-xs text-text-dim relative z-10">© 2025 TaskFlow</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 lg:max-w-lg flex items-center justify-center p-8">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-text-muted text-sm">Sign in to your workspace</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-status-danger/10 border border-status-danger/20 text-status-danger text-sm">
              {error}
            </div>
          )}

          <button className="w-full glass rounded-xl py-3 flex items-center justify-center gap-3 text-sm text-text-secondary hover:border-white/15 transition-colors mb-6">
            <RiGithubLine size={18} /> Continue with GitHub
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-dim">or sign in with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Email</label>
              <input type="email" className="input-field" placeholder="you@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-medium text-text-muted">Password</label>
                <a href="#" className="text-xs text-accent-purple hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input-field pr-12" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-muted transition-colors">
                  {showPw ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                </button>
              </div>
            </div>
            <motion.button type="submit" className="btn-primary w-full py-3 text-base font-semibold" whileTap={{ scale: 0.98 }} disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                  Signing in…
                </span>
              ) : 'Sign in'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Don't have an account? <Link to="/register" className="text-accent-purple hover:underline font-medium">Create one free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
