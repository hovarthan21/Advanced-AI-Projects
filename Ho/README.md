<div align="center">

<img src="https://capsule-render.vercel.app/api?type=cylinder&color=0:000000,50:001a33,100:003366&height=180&section=header&text=Ho's%20Voice%20AI%20Agent&fontSize=48&fontColor=ffffff&fontAlignY=55&desc=Next-Generation%20AI-Powered%20Outbound%20Voice%20Intelligence%20Platform&descAlignY=75&descColor=7ab8d4&animation=fadeIn" width="100%"/>

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/Built%20With-Artificial%20Intelligence-blueviolet?style=flat-square&logo=openai&logoColor=white"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Voice%20Engine-Multi--Provider-00bfff?style=flat-square&logo=amazonaws&logoColor=white"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Auth-JWT%20Secured-green?style=flat-square&logo=jsonwebtokens&logoColor=white"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square&logo=statuspage&logoColor=white"/>
</p>

<br/>

<p align="center">
  <b>Ho's Voice AI Agent</b> is an enterprise-grade conversational voice automation platform that transforms plain text into intelligent, real-time outbound phone calls — engineered with a JARVIS-inspired interface, multi-provider AI voice synthesis, JWT-secured authentication, and a live analytics monitoring suite.
</p>

<br/>

</div>

---

<div align="center">

##  Core Intelligence Stack

</div>

<br/>

<div align="center">

**Frontend Framework**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22b5bf?style=for-the-badge&logo=chartdotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

<br/>

**Backend Engine**

![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Uvicorn](https://img.shields.io/badge/Uvicorn-499848?style=for-the-badge&logo=gunicorn&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-E92063?style=for-the-badge&logo=pydantic&logoColor=white)
![HTTPX](https://img.shields.io/badge/HTTPX-009688?style=for-the-badge&logo=python&logoColor=white)

<br/>

**Security Layer**

![JWT](https://img.shields.io/badge/JSON_Web_Tokens-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Bcrypt](https://img.shields.io/badge/Bcrypt_Hashing-003A70?style=for-the-badge&logo=letsencrypt&logoColor=white)
![OAuth2](https://img.shields.io/badge/OAuth2_Bearer-EB5424?style=for-the-badge&logo=auth0&logoColor=white)

<br/>

**AI Voice Providers**

![Bland AI](https://img.shields.io/badge/Bland.ai-000000?style=for-the-badge&logo=soundcloud&logoColor=00bfff)
![Vapi](https://img.shields.io/badge/Vapi.ai-7c6cfc?style=for-the-badge&logo=amazonalexa&logoColor=white)
![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white)
![Web Speech](https://img.shields.io/badge/Web_Speech_API-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)

<br/>

**Developer Tooling**

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

</div>

---

##  System Architecture

```
╔══════════════════════════════════════════════════════════════════════════╗
║               Ho's Voice AI Agent — System Design                       ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║   ┌──────────────────────────────────────────────────────────────┐      ║
║   │                     PRESENTATION LAYER                        │      ║
║   │                                                               │      ║
║   │    React 18  ·  React Router 6  ·  Recharts  ·  Axios        │      ║
║   │    JARVIS UI  ·  JWT Context  ·  Web Speech API               │      ║
║   └─────────────────────────┬────────────────────────────────────┘      ║
║                             │  HTTPS / REST API                          ║
║   ┌─────────────────────────▼────────────────────────────────────┐      ║
║   │                      APPLICATION LAYER                        │      ║
║   │                                                               │      ║
║   │    FastAPI  ·  Uvicorn ASGI  ·  Pydantic  ·  JWT Auth        │      ║
║   │    BCrypt  ·  OAuth2 Bearer  ·  HTTPX Async Client            │      ║
║   └──────┬──────────────────────────────────────┬────────────────┘      ║
║          │                                       │                        ║
║   ┌──────▼───────────┐              ┌────────────▼──────────────┐       ║
║   │   AUTH SERVICE   │              │     CALL DISPATCH ENGINE  │       ║
║   │                  │              │                            │       ║
║   │  · Register      │              │  · Bland.ai REST API      │       ║
║   │  · Login         │              │  · Vapi.ai REST API       │       ║
║   │  · JWT Issue     │              │  · Twilio TwiML            │       ║
║   │  · BCrypt Hash   │              │  · Browser TTS fallback   │       ║
║   └──────────────────┘              └────────────────────────────┘       ║
║                                                                          ║
║   ┌──────────────────────────────────────────────────────────────┐      ║
║   │                       DATA LAYER                              │      ║
║   │         JSON Store  ·  Users  ·  Call Records  ·  Stats      │      ║
║   └──────────────────────────────────────────────────────────────┘      ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

##  Agent Flow Diagram

```
                    ┌─────────────────────────┐
                    │     SYSTEM BOOTUP        │
                    │   JARVIS Intro Animation │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   AUTHENTICATION GATE    │
                    └──────┬─────────┬────────┘
                           │         │
                    ┌──────▼──┐  ┌───▼──────┐
                    │  LOGIN  │  │ REGISTER │
                    └──────┬──┘  └───┬──────┘
                           │         │
                    ┌──────▼─────────▼────────┐
                    │   JWT TOKEN ISSUED        │
                    │   BCrypt Verification     │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    VOICE AGENT CONSOLE   │
                    │                          │
                    │  ① Compose Message       │
                    │  ② Set Target Number     │
                    │  ③ Choose AI Provider    │
                    │  ④ Configure API Access  │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     VOICE PREVIEW        │
                    │  Web Speech API · TTS    │
                    │  Live Waveform Display   │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    CALL INITIATION       │
                    │  POST /calls/initiate    │
                    │  JWT Bearer Auth Header  │
                    └────┬──────┬──────┬──────┘
                         │      │      │
               ┌─────────▼─┐ ┌──▼───┐ ┌▼────────┐
               │  BLAND.AI  │ │ VAPI │ │ TWILIO  │
               │ Outbound   │ │  AI  │ │ TwiML   │
               │ Voice Call │ │ Call │ │  Call   │
               └─────┬──────┘ └──┬───┘ └┬────────┘
                     │           │       │
                    ┌▼───────────▼───────▼────────┐
                    │      CALL RESULT HANDLER     │
                    └──────────┬──────────────────┘
                               │
               ┌───────────────┴───────────────┐
               │                               │
        ┌──────▼──────┐               ┌────────▼──────┐
        │  DELIVERED   │               │   REJECTED    │
        │  Logged ✓    │               │   Error Log ✗ │
        └──────┬──────┘               └────────┬──────┘
               │                               │
               └───────────────┬───────────────┘
                               │
                    ┌──────────▼──────────────┐
                    │   MONITORING DASHBOARD   │
                    │  KPIs · Charts · History │
                    │  Auto-refresh 15 seconds │
                    └─────────────────────────┘
```

---

##  Platform Capabilities

<table>
<tr>
<td width="50%" valign="top">

###  Voice Intelligence
Transforms any text into a natural-sounding AI voice call delivered to any phone number worldwide. Supports multiple neural voice providers with configurable pitch, speed, and voice profile selection. Browser-based TTS engine enables instant preview before dispatch.

</td>
<td width="50%" valign="top">

###  Enterprise Security
Full authentication pipeline secured with JSON Web Tokens and BCrypt password hashing. Every API endpoint enforces Bearer token validation. Sessions are managed client-side with automatic expiry and re-authentication flows.

</td>
</tr>
<tr>
<td width="50%" valign="top">

###  Real-Time Analytics
Live monitoring dashboard powered by Recharts with area trend charts, bar breakdowns, pie distributions, and provider usage analytics. Data refreshes automatically every 15 seconds with no manual intervention required.

</td>
<td width="50%" valign="top">

###  JARVIS Interface
Cinematic boot sequence with animated terminal output and logo reveal. Cyberpunk dark theme built with Orbitron, Rajdhani, and Share Tech Mono typefaces. Radar rings, neon orb effects, and dynamic waveform animations deliver a truly immersive experience.

</td>
</tr>
</table>

---


##  Deployment Guide

### System Requirements

```
Node.js     v18 or higher
Python      v3.9 or higher
NPM         v9 or higher
```

### Backend Initialization

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Initialization

```bash
cd frontend
npm install
npm start
```

### API Documentation

Once running, interactive API docs are available at:

```
http://localhost:8000/docs      ← Swagger UI
http://localhost:8000/redoc     ← ReDoc UI
```

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `POST` | `/auth/register` | Create a new operator account |
| `POST` | `/auth/login` | Authenticate and receive JWT token |
| `GET` | `/auth/me` | Retrieve authenticated user profile |

### Voice Calls

| Method | Endpoint | Description | Auth |
|:------:|----------|-------------|:----:|
| `POST` | `/calls/initiate` | Dispatch an outbound voice call | 🔒 |
| `GET` | `/calls/history` | Retrieve full call transmission log | 🔒 |
| `GET` | `/calls/stats` | Fetch analytics and monitoring data | 🔒 |

### System

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `GET` | `/health` | System health and version check |

---

##  Security Architecture

```
User Password  ──►  BCrypt Hash  ──►  Stored in DB
                         │
Login Request  ──►  BCrypt Verify  ──►  JWT Issued (HS256 · 24hr expiry)
                                              │
Every API Call ──►  Bearer Token Header  ──►  JWT Decoded  ──►  User Resolved
```

---

##  Monitoring Suite

```
┌─────────────────────────────────────────────────────────────┐
│                  ANALYTICS DASHBOARD                         │
│                                                             │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌─────────┐ │
│  │   TOTAL   │  │ DELIVERED │  │ REJECTED  │  │SUCCESS% │ │
│  │   CALLS   │  │     ✓     │  │     ✗     │  │  RATE   │ │
│  └───────────┘  └───────────┘  └───────────┘  └─────────┘ │
│                                                             │
│  ┌─────────────────────────┐   ┌───────────────────────┐  │
│  │  7-DAY AREA TREND CHART │   │  CALL STATUS PIE      │  │
│  │  Delivered · Rejected   │   │  Distribution View    │  │
│  └─────────────────────────┘   └───────────────────────┘  │
│                                                             │
│  ┌─────────────────────────┐   ┌───────────────────────┐  │
│  │  DAILY BAR BREAKDOWN    │   │  PROVIDER ANALYTICS   │  │
│  │  Per-day call volume    │   │  Usage by AI engine   │  │
│  └─────────────────────────┘   └───────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                    Auto-refresh · Every 15 seconds
```

---

##  Roadmap

- [x] Multi-provider AI voice call engine
- [x] JWT secured authentication system
- [x] Real-time monitoring and analytics dashboard
- [x] Call history with status filtering
- [x] JARVIS cinematic boot experience
- [ ] WebSocket live call status streaming
- [ ] Voice cloning and custom persona support
- [ ] SMS fallback on call failure
- [ ] Multi-language voice synthesis
- [ ] Docker and cloud deployment support
- [ ] Webhook integration for third-party platforms

---

<div align="center">

##  Contact

<br/>

**Hovarthan S**
*AI Innovator · Data Scientist · ML Specialist*

<br/>

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Hovarthan_S-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/hovarthan-ai)
&nbsp;
[![Gmail](https://img.shields.io/badge/Gmail-hovarthan04%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:hovarthan04@gmail.com)
&nbsp;
<br/>

---

*"The future of communication is not typed — it is spoken."*

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:003366,50:001a33,100:000000&height=100&section=footer&text=Developed%20by%20Hovarthan%20S%20%7C%20An%20AI%20Innovator&fontSize=14&fontColor=7ab8d4&fontAlignY=65&animation=fadeIn" width="100%"/>

</div>
