/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#050505',
          secondary: '#0A0A0A',
          card: '#0D0D0D',
          elevated: '#111111',
          hover: '#161616',
        },
        accent: {
          purple: '#8B5CF6',
          'purple-dim': '#6D28D9',
          'purple-glow': 'rgba(139,92,246,0.15)',
          cyan: '#06B6D4',
          'cyan-dim': '#0891B2',
          'cyan-glow': 'rgba(6,182,212,0.15)',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          subtle: 'rgba(255,255,255,0.04)',
          focus: 'rgba(139,92,246,0.5)',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#E2E8F0',
          muted: '#9CA3AF',
          dim: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Cal Sans"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glow-purple': 'radial-gradient(circle at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
        'glow-cyan': 'radial-gradient(circle at center, rgba(6,182,212,0.15) 0%, transparent 70%)',
        'mesh': 'radial-gradient(at 40% 20%, hsla(261,100%,70%,0.05) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.05) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(139,92,246,0.03) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-purple': '0 0 40px rgba(139,92,246,0.15)',
        'glow-cyan': '0 0 40px rgba(6,182,212,0.15)',
        'glow-sm': '0 0 20px rgba(139,92,246,0.1)',
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card': '0 4px 24px rgba(0,0,0,0.3)',
        'modal': '0 25px 80px rgba(0,0,0,0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 3s',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-up': 'fadeUp 0.5s ease forwards',
        'spin-slow': 'spin 8s linear infinite',
        'border-flow': 'borderFlow 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        borderFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
