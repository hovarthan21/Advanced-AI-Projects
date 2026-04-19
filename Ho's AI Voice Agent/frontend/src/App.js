import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import JarvisIntro from './components/JarvisIntro';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import AgentPage from './pages/AgentPage';
import MonitorPage from './pages/MonitorPage';
import HistoryPage from './pages/HistoryPage';

function ProtectedLayout({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="grid-bg" />
      <div className="scanline" />
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const [introShown, setIntroShown] = useState(false);
  const [showIntro, setShowIntro] = useState(!sessionStorage.getItem('jarvis_intro_shown'));

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020409' }}>
      <div style={{ fontFamily: "'Orbitron', monospace", color: 'rgba(0,191,255,0.4)', fontSize: 12, letterSpacing: 4, animation: 'blink 1s ease-in-out infinite' }}>
        INITIALIZING...
      </div>
    </div>
  );

  if (showIntro && !introShown) {
    return <JarvisIntro onComplete={() => {
      setShowIntro(false);
      setIntroShown(true);
      sessionStorage.setItem('jarvis_intro_shown', '1');
    }} />;
  }

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/agent" replace /> : <AuthPage />} />
      <Route path="/agent" element={<ProtectedLayout><AgentPage /></ProtectedLayout>} />
      <Route path="/monitor" element={<ProtectedLayout><MonitorPage /></ProtectedLayout>} />
      <Route path="/history" element={<ProtectedLayout><HistoryPage /></ProtectedLayout>} />
      <Route path="*" element={<Navigate to={user ? "/agent" : "/auth"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
