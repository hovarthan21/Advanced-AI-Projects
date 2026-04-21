import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

const providers = [
  { id: 'browser', name: 'BROWSER', tag: 'Local TTS', free: '100% FREE', color: '#00ff88' },
  { id: 'bland', name: 'BLAND.AI', tag: 'Outbound AI', free: 'FREE TIER', color: '#00bfff' },
  { id: 'vapi', name: 'VAPI.AI', tag: 'Voice Calls', free: 'FREE TIER', color: '#7c6cfc' },
  { id: 'twilio', name: 'TWILIO', tag: 'Programmable', free: '$15 TRIAL', color: '#ffd700' },
];

const VAPI_DEFAULT_API_KEY = 'ad12658a-366e-4083-85a3-1a53030793a6';
const VAPI_DEFAULT_PHONE_NUMBER_ID = 'ad12658a-366e-4083-85a3-1a53030793a6';
const voiceWaveCount = 20;

export default function AgentPage() {
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [provider, setProvider] = useState('browser');
  const [apiKey, setApiKey] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [calling, setCalling] = useState(false);
  const [logs, setLogs] = useState([]);
  const [waveHeights, setWaveHeights] = useState(Array(voiceWaveCount).fill(4));
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const synthRef = useRef(null);
  const waveRef = useRef(null);
  const logsRef = useRef(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const loadVoices = () => {
      const v = synthRef.current.getVoices();
      setVoices(v);
      if (v.length > 0) setSelectedVoice('0');
    };
    loadVoices();
    synthRef.current.onvoiceschanged = loadVoices;
    return () => { if (waveRef.current) clearInterval(waveRef.current); };
  }, []);

  useEffect(() => {
    if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight;
  }, [logs]);

  useEffect(() => {
    if (provider === 'vapi' && !apiKey) {
      setApiKey(VAPI_DEFAULT_API_KEY);
    }
    if (provider !== 'vapi' && apiKey === VAPI_DEFAULT_API_KEY) {
      setApiKey('');
    }
  }, [provider]);

  const addLog = (type, msg) => {
    const time = new Date().toLocaleTimeString('en', { hour12: false });
    setLogs(prev => [...prev.slice(-50), { type, msg, time, id: Date.now() }]);
  };

  const startWave = () => {
    waveRef.current = setInterval(() => {
      setWaveHeights(Array(voiceWaveCount).fill(0).map(() => 4 + Math.random() * 24));
    }, 80);
  };

  const stopWave = () => {
    if (waveRef.current) clearInterval(waveRef.current);
    setWaveHeights(Array(voiceWaveCount).fill(4));
  };

  const previewVoice = () => {
    if (!message.trim()) { addLog('err', 'Please enter a message first'); return; }
    if (speaking) { synthRef.current.cancel(); return; }
    const utt = new SpeechSynthesisUtterance(message);
    if (selectedVoice && voices[parseInt(selectedVoice)]) utt.voice = voices[parseInt(selectedVoice)];
    utt.rate = rate;
    utt.onstart = () => { setSpeaking(true); startWave(); addLog('ok', 'Voice preview started'); };
    utt.onend = utt.onerror = () => { setSpeaking(false); stopWave(); addLog('info', 'Voice preview ended'); };
    synthRef.current.speak(utt);
  };

  const stopSpeaking = () => {
    synthRef.current?.cancel();
    setSpeaking(false); stopWave();
  };

  const initiateCall = async () => {
    if (!message.trim()) { addLog('err', 'Message is required'); return; }
    if (!phone.trim()) { addLog('err', 'Phone number is required'); return; }
    if (provider !== 'browser' && !apiKey.trim()) { addLog('err', 'API key required for ' + provider); return; }

    setCalling(true);
    addLog('info', `Initiating call via ${provider.toUpperCase()} to ${phone}...`);

    if (provider === 'browser') {
      previewVoice();
      addLog('ok', 'Browser mode: playing voice locally');
      setCalling(false);
      return;
    }

    try {
      const res = await api.post('/calls/initiate', {
        phone,
        message,
        provider,
        api_key: apiKey,
        rate,
        phoneNumberId: provider === 'vapi' ? VAPI_DEFAULT_PHONE_NUMBER_ID : undefined,
      });
      addLog('ok', `✓ Call dispatched! ID: ${res.data.call_id?.slice(0, 8)}...`);
      addLog('ok', `Status: ${res.data.status}`);
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message;
      addLog('err', `Call failed: ${msg}`);
    } finally {
      setCalling(false);
    }
  };

  const selectedProv = providers.find(p => p.id === provider);

  return (
    <div style={styles.page}>
      {/* Page header */}
      <div style={styles.pageHeader}>
        <div>
          <div style={styles.pageBreadcrumb}>HO / VOICE AGENT</div>
          <h1 style={styles.pageTitle}>VOICE CALL INTERFACE</h1>
        </div>
        <div style={styles.systemStatus}>
          <div style={styles.statusPill}>
            <span style={styles.statusDot} />
            <span>SYSTEM ONLINE</span>
          </div>
          <div style={{ ...styles.statusPill, borderColor: 'rgba(255,215,0,0.2)', color: 'rgba(255,215,0,0.6)' }}>
            <span style={{ ...styles.statusDot, background: '#ffd700', boxShadow: '0 0 6px #ffd700' }} />
            <span>ENGINE READY</span>
          </div>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Left column */}
        <div style={styles.leftCol}>
          {/* Message */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardNum}>01</span>
              <span style={styles.cardTitle}>TRANSMISSION CONTENT</span>
            </div>
            <textarea
              style={styles.textarea}
              placeholder="> Enter the message to be transmitted via voice call...&#10;&#10;Example: Hello! This is an automated reminder from HO Voice Agent. Your appointment is confirmed for tomorrow at 3:00 PM."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={6}
            />
            <div style={styles.charCount}>
              <span style={{ color: message.length > 400 ? '#ff3355' : 'rgba(255,255,255,0.75)' }}>
                {message.length}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}> / 500 CHARS</span>
            </div>

            {/* Voice controls */}
            <div style={styles.voiceControls}>
              <div style={styles.voiceControl}>
                <label style={styles.vcLabel}>VOICE PROFILE</label>
                <select
                  style={styles.select}
                  value={selectedVoice}
                  onChange={e => setSelectedVoice(e.target.value)}
                >
                  {voices.map((v, i) => (
                    <option key={i} value={i} style={{ background: '#0c1623' }}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                  {voices.length === 0 && <option>Loading voices...</option>}
                </select>
              </div>
              <div style={styles.voiceControl}>
                <label style={styles.vcLabel}>SPEED: {rate.toFixed(1)}x</label>
                <input
                  type="range" min="0.5" max="2" step="0.1"
                  value={rate} onChange={e => setRate(parseFloat(e.target.value))}
                  style={styles.slider}
                />
              </div>
            </div>

            {/* Waveform */}
            <div style={styles.waveform}>
              {waveHeights.map((h, i) => (
                <div key={i} style={{
                  ...styles.waveBar,
                  height: h,
                  animationDelay: `${i * 0.05}s`,
                  opacity: speaking ? 1 : 0.2,
                  background: speaking
                    ? `hsl(${185 + i * 3}, 100%, ${50 + Math.sin(i) * 10}%)`
                    : 'rgba(255,255,255,0.25)',
                }} />
              ))}
            </div>
          </div>

          {/* Phone */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardNum}>02</span>
              <span style={styles.cardTitle}>TARGET ENDPOINT</span>
            </div>
            <div style={styles.phoneRow}>
              <div style={styles.phonePre}>+</div>
              <input
                style={styles.phoneInput}
                type="tel"
                placeholder="1 910 294 6175 (include country code)"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <div style={styles.phoneHint}>
              ◈ Format: [country code] [number] — e.g. +1 910 294 6175
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={styles.rightCol}>
          {/* Provider */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardNum}>03</span>
              <span style={styles.cardTitle}>TRANSMISSION PROTOCOL</span>
            </div>
            <div style={styles.providerGrid}>
              {providers.map(p => (
                <button
                  key={p.id}
                  style={{
                    ...styles.provBtn,
                    ...(provider === p.id ? { ...styles.provBtnActive, borderColor: p.color, boxShadow: `0 0 15px ${p.color}22` } : {})
                  }}
                  onClick={() => setProvider(p.id)}
                >
                  <div style={{ ...styles.provDot, background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
                  <div style={styles.provName}>{p.name}</div>
                  <div style={styles.provTag}>{p.tag}</div>
                  <div style={{ ...styles.provFree, color: p.color, borderColor: `${p.color}44` }}>
                    {p.free}
                  </div>
                  {provider === p.id && <div style={styles.provCheck}>✓</div>}
                </button>
              ))}
            </div>

            {/* API key */}
            {provider !== 'browser' && (
              <div style={styles.apiSection}>
                <label style={styles.vcLabel}>API ACCESS KEY — {provider.toUpperCase()}</label>
                <input
                  style={styles.apiInput}
                  type="password"
                  placeholder={provider === 'vapi' ? 'Private key loaded from code' : `Enter your ${provider} API key...`}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  readOnly={provider === 'vapi'}
                />
                <div style={styles.apiHint}>
                  {provider === 'bland' && '→ Sign up at bland.ai for a free API key'}
                  {provider === 'vapi' && '→ Private key is embedded in the app; phoneNumberId is preconfigured.'}
                  {provider === 'twilio' && '→ Trial at twilio.com · requires backend server for TwiML'}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardNum}>04</span>
              <span style={styles.cardTitle}>EXECUTE</span>
            </div>
            <div style={styles.actions}>
              <button
                style={{ ...styles.previewBtn, ...(speaking ? styles.previewBtnActive : {}) }}
                onClick={previewVoice}
              >
                <span>{speaking ? '▮▮' : '▶'}</span>
                {speaking ? 'PLAYING...' : 'PREVIEW VOICE'}
              </button>
              {speaking && (
                <button style={styles.stopBtn} onClick={stopSpeaking}>■ STOP</button>
              )}
              <button
                style={{ ...styles.callBtn, ...(calling ? styles.callBtnActive : {}) }}
                onClick={initiateCall}
                disabled={calling}
              >
                <span style={styles.callIcon}>◎</span>
                <span>{calling ? 'TRANSMITTING...' : 'INITIATE CALL'}</span>
                <div style={styles.callGlow} />
              </button>
            </div>
          </div>

          {/* Log terminal */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardNum}>◈</span>
              <span style={styles.cardTitle}>SYSTEM LOG</span>
              <button
                style={styles.clearBtn}
                onClick={() => setLogs([])}
              >CLEAR</button>
            </div>
            <div style={styles.logBox} ref={logsRef}>
              {logs.length === 0 && (
                <div style={styles.logEmpty}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Share Tech Mono', monospace", fontSize: 11 }}>
                    &gt; AWAITING TRANSMISSION...
                  </span>
                </div>
              )}
              {logs.map(log => (
                <div key={log.id} style={styles.logLine}>
                  <span style={styles.logTime}>{log.time}</span>
                  <span style={{
                    ...styles.logMsg,
                    color: log.type === 'ok' ? '#00ff88' : log.type === 'err' ? '#ff3355' : 'rgba(255,255,255,0.72)',
                  }}>
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '28px 32px 80px' },
  pageHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 28,
  },
  pageBreadcrumb: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.58)',
    marginBottom: 6,
  },
  pageTitle: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 22, fontWeight: 800, letterSpacing: 3,
    color: '#e8f4ff',
    textShadow: '0 0 30px rgba(0,191,255,0.2)',
  },
  systemStatus: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  statusPill: {
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '6px 14px',
    background: 'rgba(0,255,136,0.04)',
    border: '1px solid rgba(0,255,136,0.15)',
    borderRadius: 2,
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, letterSpacing: 2, color: 'rgba(0,255,136,0.6)',
  },
  statusDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: '#00ff88', boxShadow: '0 0 6px #00ff88',
    animation: 'blink 2s ease-in-out infinite', flexShrink: 0,
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  leftCol: { display: 'flex', flexDirection: 'column', gap: 20 },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 20 },
  card: {
    background: '#0c1623',
    border: '1px solid rgba(0,191,255,0.08)',
    borderRadius: 4, padding: '20px',
    position: 'relative',
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '1px solid rgba(0,191,255,0.06)',
  },
  cardNum: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.58)',
  },
  cardTitle: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 10, fontWeight: 700, letterSpacing: 2,
    color: '#d4f5ff', flex: 1,
  },
  textarea: {
    width: '100%', background: 'rgba(0,191,255,0.03)',
    border: '1px solid rgba(0,191,255,0.1)',
    borderRadius: 2, padding: '12px 14px',
    color: '#e8f4ff',
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 14, lineHeight: 1.7,
    resize: 'none', outline: 'none',
    transition: 'border-color 0.2s',
  },
  charCount: {
    textAlign: 'right', marginTop: 6,
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, letterSpacing: 1,
  },
  voiceControls: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 },
  voiceControl: { display: 'flex', flexDirection: 'column', gap: 6 },
  vcLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.68)',
  },
  select: {
    background: 'rgba(0,191,255,0.03)',
    border: '1px solid rgba(0,191,255,0.1)',
    borderRadius: 2, padding: '9px 10px',
    color: '#e8f4ff',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10, outline: 'none', cursor: 'pointer',
    appearance: 'none',
  },
  slider: { width: '100%', accentColor: '#00bfff', cursor: 'pointer' },
  waveform: {
    display: 'flex', alignItems: 'flex-end', gap: 2,
    height: 32, marginTop: 14,
    padding: '0 4px',
  },
  waveBar: {
    flex: 1, borderRadius: 1,
    transition: 'height 0.08s ease, opacity 0.3s',
    minHeight: 4,
  },
  phoneRow: {
    display: 'flex', gap: 8, alignItems: 'stretch',
  },
  phonePre: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 2, padding: '0 14px',
    display: 'flex', alignItems: 'center',
    fontFamily: "'Orbitron', monospace",
    fontSize: 14, fontWeight: 700, color: '#e8f4ff',
  },
  phoneInput: {
    flex: 1, background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 2, padding: '13px 14px',
    color: '#e8f4ff',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 15, letterSpacing: 2,
    outline: 'none',
  },
  phoneHint: {
    marginTop: 8, fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, color: 'rgba(255,255,255,0.55)', letterSpacing: 1,
  },
  providerGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  provBtn: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3, padding: '14px',
    cursor: 'pointer', textAlign: 'left',
    transition: 'all 0.2s', position: 'relative',
  },
  provBtnActive: { background: 'rgba(0,191,255,0.12)' },
  provDot: { width: 6, height: 6, borderRadius: '50%', marginBottom: 8 },
  provName: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 11, fontWeight: 800, color: '#e8f4ff',
    letterSpacing: 1, marginBottom: 2,
  },
  provTag: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, color: 'rgba(255,255,255,0.68)', letterSpacing: 1,
    marginBottom: 6,
  },
  provFree: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 8, letterSpacing: 1,
    border: '1px solid', padding: '2px 6px',
    borderRadius: 1, display: 'inline-block',
  },
  provCheck: {
    position: 'absolute', top: 10, right: 12,
    color: '#d4f5ff', fontSize: 12, fontWeight: 700,
  },
  apiSection: { marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 },
  apiInput: {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 2, padding: '12px 14px',
    color: '#e8f4ff',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 12, outline: 'none',
  },
  apiHint: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, color: 'rgba(255,255,255,0.65)', letterSpacing: 1,
  },
  actions: { display: 'flex', flexDirection: 'column', gap: 10 },
  previewBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: '13px', background: 'transparent',
    border: '1px solid rgba(255,255,255,0.16)',
    borderRadius: 2, cursor: 'pointer',
    fontFamily: "'Orbitron', monospace",
    fontSize: 10, fontWeight: 700, letterSpacing: 2,
    color: 'rgba(255,255,255,0.85)',
    transition: 'all 0.2s',
  },
  previewBtnActive: {
    borderColor: '#00bfff', color: '#00e5ff',
    background: 'rgba(0,191,255,0.08)',
    boxShadow: '0 0 15px rgba(0,191,255,0.15)',
  },
  stopBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '10px', background: 'transparent',
    border: '1px solid rgba(255,51,85,0.2)',
    borderRadius: 2, cursor: 'pointer',
    fontFamily: "'Orbitron', monospace",
    fontSize: 9, letterSpacing: 2, color: '#ff3355',
    transition: 'all 0.2s',
  },
  callBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
    padding: '16px', background: 'transparent',
    border: '1px solid #00bfff',
    borderRadius: 2, cursor: 'pointer',
    fontFamily: "'Orbitron', monospace",
    fontSize: 12, fontWeight: 800, letterSpacing: 3,
    color: '#00e5ff',
    transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
    clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
    boxShadow: '0 0 20px rgba(0,191,255,0.1)',
  },
  callBtnActive: {
    background: 'rgba(0,191,255,0.08)',
    boxShadow: '0 0 30px rgba(0,191,255,0.25)',
  },
  callIcon: { fontSize: 16 },
  callGlow: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(45deg, transparent, rgba(0,191,255,0.06), transparent)',
    pointerEvents: 'none',
  },
  logBox: {
    background: 'rgba(0,0,0,0.3)', borderRadius: 2,
    padding: '12px', minHeight: 100, maxHeight: 180,
    overflowY: 'auto',
  },
  logEmpty: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80 },
  logLine: { display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 4 },
  logTime: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10, color: 'rgba(255,255,255,0.55)',
    flexShrink: 0,
  },
  logMsg: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, letterSpacing: 0.5, lineHeight: 1.5, color: '#e8f4ff',
  },
  clearBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,51,85,0.15)',
    borderRadius: 1, cursor: 'pointer',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 8, letterSpacing: 2, color: 'rgba(255,51,85,0.4)',
    padding: '3px 8px',
  },
};
