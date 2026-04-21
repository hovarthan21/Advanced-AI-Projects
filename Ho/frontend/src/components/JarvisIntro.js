import React, { useEffect, useState } from 'react';

const bootLines = [
  '> INITIALIZING HO NEURAL CORE...',
  '> LOADING VOICE SYNTHESIS ENGINE v4.2...',
  '> ESTABLISHING SECURE CHANNEL...',
  '> CALIBRATING AUDIO MATRIX...',
  '> SCANNING NETWORK TOPOLOGY...',
  '> ALL SYSTEMS OPERATIONAL',
  '> HO ONLINE',
];

export default function JarvisIntro({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('boot'); // boot | logo | done

  useEffect(() => {
    let i = 0;
    const addLine = () => {
      if (i < bootLines.length) {
        setLines(prev => [...prev, bootLines[i]]);
        setProgress(Math.round(((i + 1) / bootLines.length) * 100));
        i++;
        setTimeout(addLine, 280 + Math.random() * 200);
      } else {
        setTimeout(() => setPhase('logo'), 400);
        setTimeout(() => onComplete(), 2200);
      }
    };
    setTimeout(addLine, 300);
  }, [onComplete]);

  return (
    <div style={styles.overlay}>
      <div style={styles.gridBg} />
      <div style={styles.scanline} />

      {phase === 'boot' && (
        <div style={styles.bootContainer}>
          {/* Hexagon rings */}
          <div style={styles.hexRing1} />
          <div style={styles.hexRing2} />
          <div style={styles.hexRing3} />

          {/* Center orb */}
          <div style={styles.orb}>
            <div style={styles.orbInner}>
              <div style={styles.orbCore} />
            </div>
            <div style={styles.orbRing1} />
            <div style={styles.orbRing2} />
          </div>

          {/* Boot text */}
          <div style={styles.terminal}>
            <div style={styles.terminalHeader}>
              <span style={styles.termDot1} />
              <span style={styles.termDot2} />
              <span style={styles.termDot3} />
              <span style={styles.termTitle}>HO_BOOT_SEQUENCE.exe</span>
            </div>
            <div style={styles.termBody}>
              {lines.map((line, idx) => (
                <div key={idx} style={{
                  ...styles.termLine,
                  color: idx === lines.length - 1 ? '#00e5ff' : 'rgba(0,191,255,0.6)',
                  animationDelay: `${idx * 0.05}s`
                }}>
                  {line}
                  {idx === lines.length - 1 && <span style={styles.cursor}>█</span>}
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div style={styles.progressWrap}>
              <div style={styles.progressLabel}>
                <span>SYSTEM LOAD</span>
                <span>{progress}%</span>
              </div>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressFill, width: `${progress}%` }} />
                <div style={{ ...styles.progressGlow, width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === 'logo' && (
        <div style={styles.logoContainer}>
          <div style={styles.logoRing1} />
          <div style={styles.logoRing2} />
          <div style={styles.logoText}>
            <div style={styles.logoH}>H</div>
            <div style={styles.logoO}>O</div>
          </div>
          <div style={styles.logoTagline}>VOICE AGENT SYSTEM · ONLINE</div>
          <div style={styles.logoSub}>DEVELOPED BY HOVARTHAN S</div>
        </div>
      )}
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: '#020409',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999,
    flexDirection: 'column',
  },
  gridBg: {
    position: 'absolute', inset: 0,
    backgroundImage: 'linear-gradient(rgba(0,191,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,255,0.04) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
  },
  scanline: {
    position: 'absolute', width: '100%', height: '2px',
    background: 'linear-gradient(transparent, rgba(0,191,255,0.1), transparent)',
    animation: 'scanline 6s linear infinite',
    pointerEvents: 'none',
  },
  bootContainer: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
    position: 'relative',
  },
  hexRing1: {
    position: 'absolute', width: 200, height: 200,
    border: '1px solid rgba(0,191,255,0.1)',
    borderRadius: '50%', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'radar-spin 8s linear infinite',
  },
  hexRing2: {
    position: 'absolute', width: 280, height: 280,
    border: '1px solid rgba(0,191,255,0.06)',
    borderRadius: '50%', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'radar-spin 12s linear infinite reverse',
  },
  hexRing3: {
    position: 'absolute', width: 360, height: 360,
    border: '1px dashed rgba(0,191,255,0.04)',
    borderRadius: '50%', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'radar-spin 20s linear infinite',
  },
  orb: {
    width: 100, height: 100, position: 'relative',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  orbInner: {
    width: 70, height: 70, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,229,255,0.3) 0%, rgba(0,191,255,0.1) 50%, transparent 70%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 40px rgba(0,191,255,0.4), inset 0 0 20px rgba(0,191,255,0.2)',
    animation: 'float 3s ease-in-out infinite',
  },
  orbCore: {
    width: 20, height: 20, borderRadius: '50%',
    background: '#00e5ff',
    boxShadow: '0 0 20px #00e5ff, 0 0 40px rgba(0,229,255,0.5)',
  },
  orbRing1: {
    position: 'absolute', inset: 0,
    border: '1px solid rgba(0,191,255,0.4)',
    borderRadius: '50%',
    animation: 'pulse-ring 2s ease-out infinite',
  },
  orbRing2: {
    position: 'absolute', inset: -10,
    border: '1px solid rgba(0,191,255,0.2)',
    borderRadius: '50%',
    animation: 'pulse-ring 2s ease-out infinite 0.5s',
  },
  terminal: {
    width: 480, background: 'rgba(5,10,18,0.95)',
    border: '1px solid rgba(0,191,255,0.2)',
    borderRadius: 4, overflow: 'hidden',
    boxShadow: '0 0 60px rgba(0,0,0,0.8), 0 0 30px rgba(0,191,255,0.1)',
  },
  terminalHeader: {
    background: 'rgba(0,191,255,0.05)',
    padding: '8px 14px',
    display: 'flex', alignItems: 'center', gap: 8,
    borderBottom: '1px solid rgba(0,191,255,0.1)',
  },
  termDot1: { width: 8, height: 8, borderRadius: '50%', background: '#ff3355' },
  termDot2: { width: 8, height: 8, borderRadius: '50%', background: '#ffd700' },
  termDot3: { width: 8, height: 8, borderRadius: '50%', background: '#00ff88' },
  termTitle: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10, color: 'rgba(0,191,255,0.5)',
    letterSpacing: 2, marginLeft: 8,
  },
  termBody: { padding: '14px 16px', minHeight: 140 },
  termLine: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 12, letterSpacing: 1, lineHeight: 2,
    animation: 'text-reveal 0.3s ease-out both',
  },
  cursor: { animation: 'blink 0.8s step-end infinite', marginLeft: 4 },
  progressWrap: { padding: '12px 16px', borderTop: '1px solid rgba(0,191,255,0.1)' },
  progressLabel: {
    display: 'flex', justifyContent: 'space-between',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10, color: 'rgba(0,191,255,0.5)',
    letterSpacing: 2, marginBottom: 6,
  },
  progressTrack: {
    height: 3, background: 'rgba(0,191,255,0.1)',
    borderRadius: 2, position: 'relative', overflow: 'hidden',
  },
  progressFill: {
    height: '100%', background: 'linear-gradient(90deg, #00bfff, #00e5ff)',
    borderRadius: 2, transition: 'width 0.3s ease',
    position: 'absolute',
  },
  progressGlow: {
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.6))',
    borderRadius: 2, transition: 'width 0.3s ease',
    position: 'absolute', filter: 'blur(4px)',
  },
  logoContainer: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    position: 'relative',
    animation: 'intro-scale 0.6s cubic-bezier(0.23,1,0.32,1) both',
  },
  logoRing1: {
    position: 'absolute', width: 300, height: 300,
    border: '1px solid rgba(0,191,255,0.15)',
    borderRadius: '50%', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'radar-spin 6s linear infinite',
  },
  logoRing2: {
    position: 'absolute', width: 400, height: 400,
    border: '1px dashed rgba(0,191,255,0.08)',
    borderRadius: '50%', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'radar-spin 10s linear infinite reverse',
  },
  logoText: {
    display: 'flex', alignItems: 'baseline', gap: 4,
  },
  logoH: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 96, fontWeight: 900,
    color: '#00e5ff',
    textShadow: '0 0 40px rgba(0,229,255,0.8), 0 0 80px rgba(0,229,255,0.4)',
    lineHeight: 1,
    animation: 'text-reveal 0.4s ease-out 0.1s both',
  },
  logoO: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 80, fontWeight: 900,
    color: 'rgba(0,229,255,0.7)',
    textShadow: '0 0 30px rgba(0,229,255,0.4)',
    lineHeight: 1,
    animation: 'text-reveal 0.4s ease-out 0.2s both',
  },
  logoTagline: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 12, letterSpacing: 6,
    color: 'rgba(0,191,255,0.6)',
    animation: 'text-reveal 0.4s ease-out 0.5s both',
  },
  logoSub: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10, letterSpacing: 4,
    color: 'rgba(255,215,0,0.5)',
    animation: 'text-reveal 0.4s ease-out 0.7s both',
  },
};
