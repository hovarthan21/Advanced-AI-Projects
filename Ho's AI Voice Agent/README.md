# JARVIS Voice Agent System
### Developed by Hovarthan S | An AI Innovator

A professional MNC-grade AI Voice Call System with JARVIS-style UI, secure authentication, and real-time monitoring dashboard.

---

## 🚀 QUICK START

### Backend Setup (Python FastAPI)

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

Or use the run script:
```bash
cd backend
bash run.sh
```

Backend runs at: http://localhost:8000
API Docs (Swagger): http://localhost:8000/docs

---

### Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

Frontend runs at: http://localhost:3000

---

## 🎯 FEATURES

### ✅ JARVIS Boot Intro Animation
- Full-screen animated boot sequence with terminal output
- Orb and ring animations
- JARVIS logo reveal with glow effects

### ✅ Secure Auth System
- JWT-based login & registration
- Passwords hashed with bcrypt
- Sessions stored securely in localStorage
- Protected routes

### ✅ Voice Agent Interface
- Type message, choose voice profile, speed control
- Live waveform animation during playback
- 4 providers: Browser TTS, Bland.ai, Vapi.ai, Twilio
- Real-time system log terminal

### ✅ Monitoring Dashboard
- Total / Delivered / Rejected / Success Rate KPIs
- 7-day area trend chart
- Daily bar chart
- Call status pie chart
- Provider usage breakdown
- Auto-refreshes every 15 seconds

### ✅ Call History
- Full call log with status, phone, provider, timestamp
- Filterable by status (all / delivered / rejected / pending)

---

## 📞 FREE CALLING PROVIDERS

| Provider | Free Tier | Setup |
|----------|-----------|-------|
| Browser TTS | 100% Free | Zero setup |
| Bland.ai | Free API tier | Sign up at bland.ai |
| Vapi.ai | Free tier | Sign up at vapi.ai |
| Twilio | $15 trial credit | Sign up at twilio.com |

---

## 🔧 ENVIRONMENT

Create `frontend/.env` (optional):
```
REACT_APP_API_URL=http://localhost:8000
```

---

## 📁 PROJECT STRUCTURE

```
jarvis-voice-agent/
├── backend/
│   ├── main.py          # FastAPI server
│   ├── requirements.txt
│   ├── run.sh
│   └── db.json          # Auto-created JSON database
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── index.css
        ├── components/
        │   ├── JarvisIntro.js    # Boot animation
        │   ├── Sidebar.js        # Navigation
        │   └── Footer.js         # Footer with credit
        ├── context/
        │   └── AuthContext.js    # Auth state
        ├── pages/
        │   ├── AuthPage.js       # Login / Register
        │   ├── AgentPage.js      # Voice call interface
        │   ├── MonitorPage.js    # Monitoring dashboard
        │   └── HistoryPage.js    # Call history
        └── utils/
            └── api.js            # Axios config
```

---

## 💡 TIPS

- First launch shows the JARVIS boot intro (once per session)
- Use "Browser Only" provider for instant voice preview (no API key needed)
- For real phone calls, sign up for Bland.ai or Vapi.ai free tier
- All call data stored locally in `backend/db.json`

---

*Developed by Hovarthan S | An AI Innovator*
