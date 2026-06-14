import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiFlashlightLine, RiEyeLine, RiEyeOffLine, RiCheckLine, RiCloseLine } from 'react-icons/ri'
import { useApp } from '../context/AppContext'

function PasswordStrength({ password }) {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
    { label: 'Special character', pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.pass).length
  const colors = ['', '#EF4444', '#F59E0B', '#06B6D4', '#22C55E']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300" style={{ background: i <= score ? colors[score] : 'rgba(255,255,255,0.05)' }} />
        ))}
      </div>
      {password && <p className="text-xs" style={{ color: colors[score] }}>{labels[score]}</p>}
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()
  const { register } = useApp()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (form.password.length < 8) e.password = 'Min 8 characters'
    if (!/[A-Z]/.test(form.password)) e.password = 'Must include an uppercase letter'
    if (!/[0-9]/.test(form.password)) e.password = 'Must include a number'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setError('')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(err => ({ ...err, [k]: '' })) }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none opacity-10" style={{ background: 'radial-gradient(ellipse, #8B5CF6, transparent)' }} />
      <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/" className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-9 h-9 rounded-xl bg-accent-purple flex items-center justify-center shadow-glow-sm">
            <RiFlashlightLine className="text-white" size={18} />
          </div>
          <span className="font-display font-bold text-white text-xl">TaskFlow</span>
        </Link>

        <div className="glass-strong rounded-3xl p-8 shadow-modal">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-white mb-1.5">Create your account</h1>
            <p className="text-sm text-text-muted">Free forever · No credit card needed</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-status-danger/10 border border-status-danger/20 text-status-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Full Name</label>
              <input className={`input-field ${errors.name ? 'border-status-danger/50' : ''}`} placeholder="Jane Doe" value={form.name} onChange={e => set('name', e.target.value)} />
              {errors.name && <p className="text-xs text-status-danger mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Email</label>
              <input type="email" className={`input-field ${errors.email ? 'border-status-danger/50' : ''}`} placeholder="you@company.com" value={form.email} onChange={e => set('email', e.target.value)} />
              {errors.email && <p className="text-xs text-status-danger mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className={`input-field pr-12 ${errors.password ? 'border-status-danger/50' : ''}`} placeholder="Create a strong password" value={form.password} onChange={e => set('password', e.target.value)} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-muted">
                  {showPw ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                </button>
              </div>
              {form.password && <PasswordStrength password={form.password} />}
              {errors.password && <p className="text-xs text-status-danger mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Confirm Password</label>
              <input type="password" className={`input-field ${errors.confirm ? 'border-status-danger/50' : ''}`} placeholder="Repeat your password" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
              {errors.confirm && <p className="text-xs text-status-danger mt-1">{errors.confirm}</p>}
            </div>
            <motion.button type="submit" className="btn-primary w-full py-3 text-base font-semibold mt-2" whileTap={{ scale: 0.98 }} disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                  Creating account…
                </span>
              ) : 'Create free account'}
            </motion.button>
          </form>
          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account? <Link to="/login" className="text-accent-purple hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
