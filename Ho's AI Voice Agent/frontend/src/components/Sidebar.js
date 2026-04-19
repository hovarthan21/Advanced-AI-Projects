import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { id: 'agent', label: 'VOICE AGENT', icon: '◈', path: '/agent' },
  { id: 'monitor', label: 'MONITORING', icon: '◉', path: '/monitor' },
  { id: 'history', label: 'CALL HISTORY', icon: '◫', path: '/history' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside style={{ ...styles.sidebar, width: collapsed ? 64 : 240 }}>
      {/* Logo */}
      <div style={styles.logo} onClick={() => setCollapsed(!collapsed)}>
        <div style={styles.logoIcon}>
          <div style={styles.logoOrb} />
          <div style={styles.logoRing} />
        </div>
        {!collapsed && (
          <div style={styles.logoText}>
            <div style={styles.logoName}>HO</div>
            <div style={styles.logoVersion}>v1.0 · ONLINE</div>
          </div>
        )}
      </div>

      <div style={styles.divider} />

      {/* System status */}
      {!collapsed && (
        <div style={styles.statusBox}>
          <div style={styles.statusRow}>
            <span style={styles.statusDot} />
            <span style={styles.statusText}>NEURAL CORE ACTIVE</span>
          </div>
          <div style={styles.statusRow}>
            <span style={{ ...styles.statusDot, background: '#ffd700', boxShadow: '0 0 6px #ffd700' }} />
            <span style={styles.statusText}>VOICE ENGINE READY</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={styles.nav}>
        {navItems.map(item => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path);
          return (
            <button
              key={item.id}
              style={{
                ...styles.navItem,
                ...(active ? styles.navItemActive : {}),
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
              onClick={() => navigate(item.path)}
            >
              <span style={{ ...styles.navIcon, ...(active ? styles.navIconActive : {}) }}>
                {item.icon}
              </span>
              {!collapsed && (
                <span style={styles.navLabel}>{item.label}</span>
              )}
              {active && <div style={styles.navActiveBar} />}
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* User */}
      <div style={styles.divider} />
      <div style={styles.userSection}>
        <div style={styles.userAvatar}>
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        {!collapsed && (
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user?.name || 'OPERATOR'}</div>
            <div style={styles.userEmail}>{user?.email}</div>
          </div>
        )}
      </div>

      <button style={styles.logoutBtn} onClick={logout}>
        <span>⏻</span>
        {!collapsed && <span>LOGOUT</span>}
      </button>

      {/* Footer */}
      {!collapsed && (
        <div style={styles.footer}>
          Developed by Hovarthan S<br />
          <span style={styles.footerSub}>An AI Innovator</span>
        </div>
      )}
    </aside>
  );
}

const styles = {
  sidebar: {
    height: '100vh', position: 'fixed', left: 0, top: 0,
    background: 'linear-gradient(180deg, #050a12 0%, #020409 100%)',
    borderRight: '1px solid rgba(0,191,255,0.1)',
    display: 'flex', flexDirection: 'column',
    padding: '20px 0',
    transition: 'width 0.3s cubic-bezier(0.23,1,0.32,1)',
    zIndex: 100,
    overflow: 'hidden',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '0 16px 20px',
    cursor: 'pointer',
  },
  logoIcon: {
    width: 32, height: 32, position: 'relative',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  logoOrb: {
    width: 16, height: 16, borderRadius: '50%',
    background: 'radial-gradient(circle, #00e5ff, #00bfff)',
    boxShadow: '0 0 15px rgba(0,229,255,0.6)',
  },
  logoRing: {
    position: 'absolute', inset: 0,
    border: '1px solid rgba(0,191,255,0.4)',
    borderRadius: '50%',
    animation: 'radar-spin 4s linear infinite',
  },
  logoText: { display: 'flex', flexDirection: 'column' },
  logoName: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 16, fontWeight: 800,
    color: '#e8f4ff',
    textShadow: '0 0 15px rgba(0,229,255,0.3)',
    letterSpacing: 2,
  },
  logoVersion: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, color: 'rgba(255,255,255,0.65)',
    letterSpacing: 2,
  },
  divider: {
    height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(0,191,255,0.15), transparent)',
    margin: '8px 16px 16px',
  },
  statusBox: {
    padding: '8px 16px 16px',
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  statusRow: { display: 'flex', alignItems: 'center', gap: 8 },
  statusDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: '#00ff88',
    boxShadow: '0 0 6px #00ff88',
    animation: 'blink 2s ease-in-out infinite',
    flexShrink: 0,
  },
  statusText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1.5,
  },
  nav: { display: 'flex', flexDirection: 'column', padding: '0 8px', gap: 4 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 12px',
    background: 'transparent',
    border: 'none', borderRadius: 2,
    cursor: 'pointer', width: '100%',
    fontFamily: "'Orbitron', monospace",
    fontSize: 10, fontWeight: 600, letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.78)',
    transition: 'all 0.2s',
    position: 'relative',
    whiteSpace: 'nowrap',
  },
  navItemActive: {
    background: 'rgba(0,191,255,0.08)',
    color: '#00e5ff',
    boxShadow: 'inset 0 0 20px rgba(0,191,255,0.05)',
  },
  navIcon: { fontSize: 16, transition: 'all 0.2s', lineHeight: 1 },
  navIconActive: { textShadow: '0 0 10px rgba(0,229,255,0.8)', color: '#00e5ff' },
  navLabel: { transition: 'opacity 0.2s' },
  navActiveBar: {
    position: 'absolute', right: 0, top: '20%', bottom: '20%',
    width: 2,
    background: 'linear-gradient(180deg, transparent, #00e5ff, transparent)',
    borderRadius: 1,
  },
  userSection: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 16px',
  },
  userAvatar: {
    width: 32, height: 32, borderRadius: 2,
    background: 'rgba(0,191,255,0.1)',
    border: '1px solid rgba(0,191,255,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Orbitron', monospace",
    fontSize: 12, fontWeight: 700, color: '#00bfff',
    flexShrink: 0,
  },
  userInfo: { overflow: 'hidden' },
  userName: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 11, fontWeight: 700, color: '#e8f4ff',
    letterSpacing: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  userEmail: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, color: 'rgba(255,255,255,0.65)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    margin: '8px',
    padding: '10px 12px',
    background: 'transparent',
    border: '1px solid rgba(255,51,85,0.15)',
    borderRadius: 2, cursor: 'pointer',
    fontFamily: "'Orbitron', monospace",
    fontSize: 10, letterSpacing: 2,
    color: 'rgba(255,51,85,0.5)',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
    justifyContent: 'center',
  },
  footer: {
    padding: '12px 16px',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, color: 'rgba(255,215,0,0.35)',
    letterSpacing: 1, lineHeight: 1.6,
    textAlign: 'center',
  },
  footerSub: { color: 'rgba(255,255,255,0.55)' },
};
