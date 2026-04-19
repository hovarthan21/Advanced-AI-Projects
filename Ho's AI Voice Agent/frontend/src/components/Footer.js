import React from 'react';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.line} />
      <div style={styles.inner}>
        <div style={styles.left}>
          <span style={styles.jarvis}>HO</span>
          <span style={styles.separator}> · </span>
          <span style={styles.sub}>HO Voice Agent System v1.0</span>
        </div>
        <div style={styles.credit}>
          Developed by <span style={styles.name}>Hovarthan S</span>
          <span style={styles.pipe}> | </span>
          <span style={styles.title}>An AI Innovator</span>
        </div>
        <div style={styles.right}>
          <span style={styles.status}>● ALL SYSTEMS NOMINAL</span>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    position: 'fixed', bottom: 0, left: 240, right: 0,
    zIndex: 50,
  },
  line: {
    height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(0,191,255,0.15) 20%, rgba(0,191,255,0.15) 80%, transparent)',
  },
  inner: {
    background: 'rgba(2,4,9,0.95)',
    backdropFilter: 'blur(10px)',
    padding: '8px 32px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 16,
  },
  left: { display: 'flex', alignItems: 'center', gap: 4 },
  jarvis: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 10, fontWeight: 800, letterSpacing: 3,
    color: '#d4f5ff',
  },
  separator: { color: 'rgba(255,255,255,0.22)', fontSize: 12 },
  sub: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, color: 'rgba(255,255,255,0.65)', letterSpacing: 1,
  },
  credit: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10, color: 'rgba(255,215,0,0.6)',
    letterSpacing: 1, textAlign: 'center',
  },
  name: { color: '#ffd700', fontWeight: 700 },
  pipe: { color: 'rgba(255,255,255,0.28)', margin: '0 4px' },
  title: { color: 'rgba(255,255,255,0.68)' },
  right: {},
  status: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, color: 'rgba(0,255,136,0.5)', letterSpacing: 2,
  },
};
