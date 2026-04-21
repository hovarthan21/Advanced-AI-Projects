import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function HistoryPage() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/calls/history')
      .then(({ data }) => setCalls(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? calls : calls.filter(c => c.status === filter);

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <div>
          <div style={styles.breadcrumb}>HO / CALL HISTORY</div>
          <h1 style={styles.pageTitle}>TRANSMISSION LOG</h1>
        </div>
        <div style={styles.filters}>
          {['all', 'delivered', 'rejected', 'pending'].map(f => (
            <button
              key={f}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterBtnActive : {}) }}
              onClick={() => setFilter(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}>
          <div style={styles.loadingOrb} />
          <span style={styles.loadingText}>LOADING RECORDS...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>◫</div>
          <div style={styles.emptyText}>NO RECORDS FOUND</div>
          <div style={styles.emptySubtext}>Transmission history will appear here</div>
        </div>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span style={{ ...styles.thCell, flex: 1.5 }}>CALL ID</span>
            <span style={{ ...styles.thCell, flex: 2 }}>PHONE NUMBER</span>
            <span style={{ ...styles.thCell, flex: 1 }}>PROVIDER</span>
            <span style={{ ...styles.thCell, flex: 1 }}>STATUS</span>
            <span style={{ ...styles.thCell, flex: 2 }}>TIMESTAMP</span>
            <span style={{ ...styles.thCell, flex: 2 }}>MESSAGE PREVIEW</span>
          </div>
          {filtered.map((call, i) => (
            <div key={call.id} style={{ ...styles.tableRow, animationDelay: `${i * 0.04}s` }}>
              <span style={{ ...styles.tdCell, flex: 1.5 }}>
                <span style={styles.callId}>{call.id.slice(0, 8).toUpperCase()}...</span>
              </span>
              <span style={{ ...styles.tdCell, flex: 2 }}>
                <span style={styles.phone}>{call.phone}</span>
              </span>
              <span style={{ ...styles.tdCell, flex: 1 }}>
                <span style={styles.provider}>{call.provider?.toUpperCase()}</span>
              </span>
              <span style={{ ...styles.tdCell, flex: 1 }}>
                <span style={{
                  ...styles.statusBadge,
                  color: call.status === 'delivered' ? '#00ff88' : call.status === 'rejected' ? '#ff3355' : '#ffd700',
                  borderColor: call.status === 'delivered' ? 'rgba(0,255,136,0.2)' : call.status === 'rejected' ? 'rgba(255,51,85,0.2)' : 'rgba(255,215,0,0.2)',
                  background: call.status === 'delivered' ? 'rgba(0,255,136,0.05)' : call.status === 'rejected' ? 'rgba(255,51,85,0.05)' : 'rgba(255,215,0,0.05)',
                }}>
                  {call.status === 'delivered' ? '✓' : call.status === 'rejected' ? '✗' : '◎'} {call.status?.toUpperCase()}
                </span>
              </span>
              <span style={{ ...styles.tdCell, flex: 2 }}>
                <span style={styles.timestamp}>
                  {new Date(call.created_at).toLocaleString('en', { dateStyle: 'short', timeStyle: 'medium' })}
                </span>
              </span>
              <span style={{ ...styles.tdCell, flex: 2 }}>
                <span style={styles.msgPreview}>
                  {call.message?.slice(0, 45)}{call.message?.length > 45 ? '...' : ''}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '28px 32px 80px' },
  pageHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 28, flexWrap: 'wrap', gap: 16,
  },
  breadcrumb: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.58)', marginBottom: 6,
  },
  pageTitle: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 22, fontWeight: 800, letterSpacing: 3, color: '#e8f4ff',
  },
  filters: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  filterBtn: {
    padding: '8px 16px', background: 'transparent',
    border: '1px solid rgba(255,255,255,0.14)', borderRadius: 2,
    cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.74)',
    transition: 'all 0.2s',
  },
  filterBtnActive: {
    borderColor: 'rgba(255,255,255,0.3)', color: '#d4f5ff',
    background: 'rgba(255,255,255,0.08)',
  },
  loading: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: 200, gap: 16,
  },
  loadingOrb: {
    width: 24, height: 24, borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.12)',
    borderTopColor: '#e8f4ff',
    animation: 'radar-spin 1s linear infinite',
  },
  loadingText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.75)',
  },
  empty: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: 300, gap: 12,
  },
  emptyIcon: { fontSize: 40, color: 'rgba(255,255,255,0.24)' },
  emptyText: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 14, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.7)',
  },
  emptySubtext: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.5)',
  },
  table: {
    background: '#0c1623',
    border: '1px solid rgba(0,191,255,0.06)',
    borderRadius: 4, overflow: 'hidden',
  },
  tableHeader: {
    display: 'flex', padding: '12px 20px',
    borderBottom: '1px solid rgba(0,191,255,0.06)',
    background: 'rgba(0,191,255,0.03)',
  },
  thCell: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.62)',
  },
  tableRow: {
    display: 'flex', padding: '14px 20px',
    borderBottom: '1px solid rgba(0,191,255,0.04)',
    transition: 'background 0.2s',
    animation: 'text-reveal 0.3s ease-out both',
  },
  tdCell: { display: 'flex', alignItems: 'center' },
  callId: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, color: 'rgba(255,255,255,0.72)', letterSpacing: 1,
  },
  phone: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 12, color: '#e8f4ff', letterSpacing: 1,
  },
  provider: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 9, fontWeight: 700, color: '#e8f4ff', letterSpacing: 1,
  },
  statusBadge: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, letterSpacing: 1,
    border: '1px solid', borderRadius: 1,
    padding: '3px 8px',
  },
  timestamp: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10, color: 'rgba(255,255,255,0.65)',
  },
  msgPreview: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 12, color: 'rgba(255,255,255,0.72)',
    fontStyle: 'italic',
  },
};
