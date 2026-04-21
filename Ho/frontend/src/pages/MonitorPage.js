import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../utils/api';

const COLORS = { delivered: '#00ff88', rejected: '#ff3355', pending: '#ffd700' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={styles.tooltip}>
      <div style={styles.tooltipLabel}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontFamily: "'Share Tech Mono', monospace", fontSize: 11, marginTop: 4 }}>
          {p.name?.toUpperCase()}: {p.value}
        </div>
      ))}
    </div>
  );
};

export default function MonitorPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get('/calls/stats');
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  const providerData = stats ? Object.entries(stats.providers || {}).map(([name, value]) => ({
    name: name.toUpperCase(), value
  })) : [];

  const pieData = stats ? [
    { name: 'DELIVERED', value: stats.delivered },
    { name: 'REJECTED', value: stats.rejected },
    { name: 'PENDING', value: stats.pending },
  ].filter(d => d.value > 0) : [];

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <div style={styles.breadcrumb}>HO / MONITORING</div>
          <h1 style={styles.pageTitle}>CALL MONITORING DASHBOARD</h1>
        </div>
        <button style={styles.refreshBtn} onClick={load}>
          ↻ REFRESH
        </button>
      </div>

      {loading ? (
        <div style={styles.loadingState}>
          <div style={styles.loadingOrb} />
          <div style={styles.loadingText}>LOADING TELEMETRY DATA...</div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={styles.kpiGrid}>
            {[
              { label: 'TOTAL CALLS', value: stats?.total || 0, color: '#00bfff', icon: '◉' },
              { label: 'DELIVERED', value: stats?.delivered || 0, color: '#00ff88', icon: '✓' },
              { label: 'REJECTED', value: stats?.rejected || 0, color: '#ff3355', icon: '✗' },
              { label: 'SUCCESS RATE', value: `${stats?.success_rate || 0}%`, color: '#ffd700', icon: '◈' },
            ].map((kpi, i) => (
              <div key={i} style={{ ...styles.kpiCard, borderTopColor: kpi.color }}>
                <div style={styles.kpiHeader}>
                  <span style={{ color: kpi.color, fontSize: 16 }}>{kpi.icon}</span>
                  <span style={styles.kpiLabel}>{kpi.label}</span>
                </div>
                <div style={{ ...styles.kpiValue, color: kpi.color, textShadow: `0 0 20px ${kpi.color}66` }}>
                  {kpi.value}
                </div>
                <div style={{ ...styles.kpiGlow, background: `${kpi.color}08` }} />
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div style={styles.chartsRow}>
            {/* Area chart - 7 day trend */}
            <div style={{ ...styles.chartCard, flex: 2 }}>
              <div style={styles.chartHeader}>
                <span style={styles.chartTitle}>CALL VOLUME — 7 DAY TREND</span>
                <div style={styles.chartLegend}>
                  <span style={{ color: '#00ff88' }}>▬ DELIVERED</span>
                  <span style={{ color: '#ff3355' }}>▬ REJECTED</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={stats?.daily || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradDelivered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradRejected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff3355" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#ff3355" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="label" tick={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, fill: 'rgba(255,255,255,0.65)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, fill: 'rgba(255,255,255,0.65)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="delivered" stroke="#00ff88" strokeWidth={2} fill="url(#gradDelivered)" name="delivered" dot={{ fill: '#00ff88', r: 3 }} />
                  <Area type="monotone" dataKey="rejected" stroke="#ff3355" strokeWidth={2} fill="url(#gradRejected)" name="rejected" dot={{ fill: '#ff3355', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div style={{ ...styles.chartCard, flex: 1 }}>
              <div style={styles.chartHeader}>
                <span style={styles.chartTitle}>CALL STATUS DISTRIBUTION</span>
              </div>
              {pieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                        dataKey="value" stroke="none">
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[entry.name.toLowerCase()] || '#00bfff'} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={styles.pieLegend}>
                    {pieData.map((d, i) => (
                      <div key={i} style={styles.pieLegendItem}>
                        <span style={{ ...styles.pieDot, background: COLORS[d.name.toLowerCase()] || '#00bfff' }} />
                        <span style={styles.pieLegendText}>{d.name}: {d.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={styles.emptyChart}>NO DATA YET</div>
              )}
            </div>
          </div>

          {/* Charts Row 2 */}
          <div style={styles.chartsRow}>
            {/* Bar chart */}
            <div style={{ ...styles.chartCard, flex: 2 }}>
              <div style={styles.chartHeader}>
                <span style={styles.chartTitle}>DAILY CALL BREAKDOWN — BAR VIEW</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats?.daily || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="label" tick={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, fill: 'rgba(255,255,255,0.65)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, fill: 'rgba(255,255,255,0.65)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="delivered" fill="#00ff88" fillOpacity={0.8} radius={[2,2,0,0]} name="delivered" />
                  <Bar dataKey="rejected" fill="#ff3355" fillOpacity={0.8} radius={[2,2,0,0]} name="rejected" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Provider breakdown */}
            <div style={{ ...styles.chartCard, flex: 1 }}>
              <div style={styles.chartHeader}>
                <span style={styles.chartTitle}>PROVIDER USAGE</span>
              </div>
              {providerData.length > 0 ? (
                <div style={styles.providerList}>
                  {providerData.map((p, i) => {
                    const pct = stats.total > 0 ? Math.round(p.value / stats.total * 100) : 0;
                    return (
                      <div key={i} style={styles.providerItem}>
                        <div style={styles.providerItemHeader}>
                          <span style={styles.providerItemName}>{p.name}</span>
                          <span style={styles.providerItemCount}>{p.value} calls</span>
                        </div>
                        <div style={styles.providerBar}>
                          <div style={{
                            ...styles.providerBarFill,
                            width: `${pct}%`,
                            background: `hsl(${185 + i * 40}, 100%, 60%)`,
                          }} />
                        </div>
                        <div style={styles.providerPct}>{pct}%</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={styles.emptyChart}>NO CALL DATA</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '28px 32px 80px' },
  pageHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 28,
  },
  breadcrumb: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.58)', marginBottom: 6,
  },
  pageTitle: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 22, fontWeight: 800, letterSpacing: 3, color: '#e8f4ff',
  },
  refreshBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: 2, padding: '10px 20px',
    cursor: 'pointer',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.82)',
    transition: 'all 0.2s',
  },
  loadingState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: 300, gap: 20,
  },
  loadingOrb: {
    width: 40, height: 40, borderRadius: '50%',
    border: '2px solid rgba(0,191,255,0.3)',
    borderTopColor: '#00bfff',
    animation: 'radar-spin 1s linear infinite',
  },
  loadingText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.75)',
  },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 },
  kpiCard: {
    background: '#0c1623',
    border: '1px solid rgba(255,255,255,0.08)',
    borderTop: '2px solid',
    borderRadius: 4, padding: '18px 20px',
    position: 'relative', overflow: 'hidden',
  },
  kpiHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  kpiLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.65)',
  },
  kpiValue: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 36, fontWeight: 900, lineHeight: 1,
  },
  kpiGlow: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
  },
  chartsRow: { display: 'flex', gap: 16, marginBottom: 16 },
  chartCard: {
    background: '#0c1623',
    border: '1px solid rgba(0,191,255,0.06)',
    borderRadius: 4, padding: '20px',
  },
  chartHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 9, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.8)',
  },
  chartLegend: {
    display: 'flex', gap: 16,
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, letterSpacing: 1, color: 'rgba(255,255,255,0.72)',
  },
  pieLegend: { display: 'flex', flexDirection: 'column', gap: 8, padding: '8px 0' },
  pieLegendItem: { display: 'flex', alignItems: 'center', gap: 8 },
  pieDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  pieLegendText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10, color: 'rgba(255,255,255,0.72)',
  },
  emptyChart: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: 180,
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.55)',
  },
  providerList: { display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 },
  providerItem: {},
  providerItemHeader: {
    display: 'flex', justifyContent: 'space-between', marginBottom: 6,
  },
  providerItemName: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 10, fontWeight: 700, color: '#e8f4ff', letterSpacing: 1,
  },
  providerItemCount: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, color: 'rgba(255,255,255,0.72)',
  },
  providerBar: {
    height: 4, background: 'rgba(255,255,255,0.08)',
    borderRadius: 2, overflow: 'hidden',
  },
  providerBarFill: { height: '100%', borderRadius: 2, transition: 'width 0.5s ease' },
  providerPct: {
    textAlign: 'right', marginTop: 4,
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, color: 'rgba(255,255,255,0.55)',
  },
  tooltip: {
    background: '#0c1623',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 3, padding: '10px 14px',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
  },
  tooltipLabel: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 10, color: 'rgba(255,255,255,0.78)', letterSpacing: 1,
  },
};
