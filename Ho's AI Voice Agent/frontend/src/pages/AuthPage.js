import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate('/agent');
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.gridBg} />
      <div style={styles.scanline} />

      {/* Background rings */}
      <div style={styles.ring1} />
      <div style={styles.ring2} />
      <div style={styles.ring3} />

      {/* Glowing dots */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          ...styles.dot,
          top: `${10 + Math.sin(i * 45 * Math.PI / 180) * 35 + 40}%`,
          left: `${10 + Math.cos(i * 45 * Math.PI / 180) * 35 + 45}%`,
          animationDelay: `${i * 0.3}s`,
          width: i % 2 === 0 ? 4 : 2,
          height: i % 2 === 0 ? 4 : 2,
        }} />
      ))}

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.orbWrap}>
            <div style={styles.orb} />
            <div style={styles.orbRing} />
            <div style={styles.orbRing2} />
          </div>
          <h1 style={styles.title}>HO Voice Agent</h1>
          <p style={styles.subtitle}>VOICE AGENT SYSTEM</p>
          <div style={styles.tagline}>SECURE ACCESS TERMINAL</div>
        </div>

        {/* Toggle */}
        <div style={styles.toggle}>
          <button
            style={{ ...styles.toggleBtn, ...(mode === 'login' ? styles.toggleActive : {}) }}
            onClick={() => { setMode('login'); setError(''); }}
          >LOGIN</button>
          <button
            style={{ ...styles.toggleBtn, ...(mode === 'register' ? styles.toggleActive : {}) }}
            onClick={() => { setMode('register'); setError(''); }}
          >REGISTER</button>
          <div style={{
            ...styles.toggleSlider,
            transform: `translateX(${mode === 'login' ? 0 : '100%'})`,
          }} />
        </div>

        {/* Form */}
        <form onSubmit={handle} style={styles.form}>
          {mode === 'register' && (
            <div style={styles.field}>
              <label style={styles.label}>OPERATOR NAME</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>◈</span>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Enter your name..."
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>EMAIL ADDRESS</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>◉</span>
              <input
                style={styles.input}
                type="email"
                placeholder="operator@domain.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>ACCESS CODE</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>◫</span>
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>

          {error && (
            <div style={styles.error}>
              <span>⚠</span> {error}
            </div>
          )}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? (
              <span style={styles.loadingDots}>
                <span>·</span><span>·</span><span>·</span>
              </span>
            ) : (
              <>
                <span style={styles.submitIcon}>▶</span>
                {mode === 'login' ? 'AUTHENTICATE' : 'CREATE ACCOUNT'}
              </>
            )}
            <div style={styles.submitGlow} />
          </button>
        </form>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerLine} />
          <p style={styles.footerText}>
            Developed by <span style={styles.footerName}>Hovarthan S</span>
            <span style={styles.footerPipe}> | </span>
            <span style={styles.footerTitle}>An AI Innovator</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#020409', position: 'relative', overflow: 'hidden',
    padding: 20,
  },
  gridBg: {
    position: 'absolute', inset: 0,
    backgroundImage: 'linear-gradient(rgba(0,191,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,255,0.03) 1px, transparent 1px)',
    backgroundSize: '50px 50px',
  },
  scanline: {
    position: 'absolute', width: '100%', height: '2px',
    background: 'linear-gradient(transparent, rgba(0,191,255,0.08), transparent)',
    animation: 'scanline 8s linear infinite',
    pointerEvents: 'none',
  },
  ring1: {
    position: 'absolute', width: 600, height: 600,
    border: '1px solid rgba(0,191,255,0.04)',
    borderRadius: '50%', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'radar-spin 20s linear infinite',
  },
  ring2: {
    position: 'absolute', width: 900, height: 900,
    border: '1px dashed rgba(0,191,255,0.02)',
    borderRadius: '50%', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'radar-spin 30s linear infinite reverse',
  },
  ring3: {
    position: 'absolute', width: 1200, height: 1200,
    border: '1px solid rgba(0,191,255,0.015)',
    borderRadius: '50%', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'radar-spin 40s linear infinite',
  },
  dot: {
    position: 'absolute', borderRadius: '50%',
    background: '#00bfff',
    boxShadow: '0 0 8px rgba(0,191,255,0.6)',
    animation: 'blink 3s ease-in-out infinite',
  },
  container: {
    width: '100%', maxWidth: 420, position: 'relative', zIndex: 10,
    animation: 'text-reveal 0.5s ease-out both',
  },
  header: {
    textAlign: 'center', marginBottom: 32,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
  },
  orbWrap: {
    width: 60, height: 60, position: 'relative',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  orb: {
    width: 30, height: 30, borderRadius: '50%',
    background: 'radial-gradient(circle, #00e5ff, #00bfff)',
    boxShadow: '0 0 25px rgba(0,229,255,0.6), 0 0 50px rgba(0,191,255,0.3)',
    animation: 'float 3s ease-in-out infinite',
  },
  orbRing: {
    position: 'absolute', inset: 0,
    border: '1px solid rgba(0,191,255,0.4)', borderRadius: '50%',
    animation: 'radar-spin 3s linear infinite',
  },
  orbRing2: {
    position: 'absolute', inset: -8,
    border: '1px dashed rgba(0,191,255,0.2)', borderRadius: '50%',
    animation: 'radar-spin 5s linear infinite reverse',
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: 42, fontWeight: 800, letterSpacing: 1.5,
    color: '#d4f5ff',
    textShadow: '0 0 20px rgba(0,229,255,0.35)',
    lineHeight: 1.1,
  },
  subtitle: {
    fontFamily: "var(--font-body)",
    fontSize: 13, letterSpacing: 2.5,
    color: 'rgba(160, 235, 255, 0.75)',
    marginTop: 2,
  },
  tagline: {
    fontFamily: "var(--font-body)",
    fontSize: 11, letterSpacing: 2.5,
    color: 'rgba(255,215,0,0.85)',
    background: 'rgba(255,215,0,0.08)',
    border: '1px solid rgba(255,215,0,0.16)',
    padding: '6px 16px', borderRadius: 6,
  },
  toggle: {
    display: 'flex', position: 'relative',
    background: 'rgba(0,0,0,0.45)',
    border: '1px solid rgba(0,191,255,0.15)',
    borderRadius: 6, overflow: 'hidden', marginBottom: 24,
  },
  toggleBtn: {
    flex: 1, padding: '14px 12px',
    background: 'transparent', border: 'none', cursor: 'pointer',
    fontFamily: "var(--font-body)",
    fontSize: 13, fontWeight: 600, letterSpacing: 1.8,
    color: 'rgba(0,191,255,0.75)',
    transition: 'color 0.25s ease', position: 'relative', zIndex: 1,
  },
  toggleActive: { color: '#a8f2ff' },
  toggleSlider: {
    position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%',
    background: 'rgba(0,191,255,0.08)',
    borderRight: '1px solid rgba(0,191,255,0.2)',
    transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1)',
    pointerEvents: 'none',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: {
    fontFamily: "var(--font-body)",
    fontSize: 12, letterSpacing: 1.5, color: 'rgba(224, 245, 255, 0.95)',
    textTransform: 'uppercase',
  },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: {
    position: 'absolute', left: 14,
    color: 'rgba(0,191,255,0.45)', fontSize: 15, zIndex: 1,
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(0,191,255,0.22)',
    borderRadius: 8,
    padding: '14px 14px 14px 44px',
    color: '#f6fbff',
    fontFamily: "var(--font-body)",
    fontSize: 15,
    outline: 'none',
    transition: 'all 0.25s ease',
  },
  error: {
    background: 'rgba(255,51,85,0.08)',
    border: '1px solid rgba(255,51,85,0.2)',
    borderRadius: 6,
    padding: '12px 16px',
    fontFamily: "var(--font-body)",
    fontSize: 13, color: '#ff5869',
    display: 'flex', alignItems: 'center', gap: 10,
  },
  submitBtn: {
    width: '100%',
    padding: '16px 24px', marginTop: 10,
    background: 'rgba(0,191,255,0.1)',
    border: '1px solid rgba(0,191,255,0.45)',
    borderRadius: 8,
    cursor: 'pointer',
    fontFamily: "var(--font-body)",
    fontSize: 13, fontWeight: 700, letterSpacing: 1.8,
    color: '#e8fbff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    position: 'relative', overflow: 'hidden',
    transition: 'all 0.25s ease',
    clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
  },
  submitIcon: { fontSize: 10 },
  submitGlow: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(45deg, transparent, rgba(0,191,255,0.08), transparent)',
    transition: 'opacity 0.3s',
  },
  loadingDots: {
    display: 'flex', gap: 4,
    '& span': { animation: 'blink 1s ease-in-out infinite' }
  },
  footer: { marginTop: 32, textAlign: 'center' },
  footerLine: {
    height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(0,191,255,0.1), transparent)',
    marginBottom: 16,
  },
  footerText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10, color: 'rgba(255,215,0,0.4)', letterSpacing: 1,
  },
  footerName: { color: 'rgba(255,215,0,0.7)', fontWeight: 700 },
  footerPipe: { color: 'rgba(0,191,255,0.2)', margin: '0 4px' },
  footerTitle: { color: 'rgba(0,191,255,0.35)' },
};
