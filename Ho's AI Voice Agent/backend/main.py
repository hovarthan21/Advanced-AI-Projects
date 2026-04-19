"""
JARVIS Voice Agent - Backend API
Developed by Hovarthan S | An AI Innovator
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, timedelta
from passlib.context import CryptContext
import jwt
import uuid
import json
import os
import traceback
from pathlib import Path

# ─── Config ──────────────────────────────────────────────
SECRET_KEY = "jarvis-super-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours
DB_FILE = Path("db.json")
VAPI_DEFAULT_API_KEY = "ad12658a-366e-4083-85a3-1a53030793a6"
VAPI_DEFAULT_PHONE_NUMBER_ID = "ad12658a-366e-4083-85a3-1a53030793a6"

app = FastAPI(title="JARVIS Voice Agent API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://localhost:3000",
        "https://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ─── Simple JSON Database ────────────────────────────────
def load_db():
    if not DB_FILE.exists():
        DB_FILE.write_text(json.dumps({"users": [], "calls": [], "sessions": []}))
    return json.loads(DB_FILE.read_text())

def save_db(data):
    DB_FILE.write_text(json.dumps(data, indent=2, default=str))

# ─── Models ──────────────────────────────────────────────
class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class CallRequest(BaseModel):
    phone: str
    message: str
    provider: str  # vapi | bland | twilio | browser
    api_key: Optional[str] = None
    phone_number_id: Optional[str] = Field(None, alias="phoneNumberId")
    voice: Optional[str] = "default"
    rate: Optional[float] = 1.0

    model_config = {
        "populate_by_name": True,
    }

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# ─── Auth Helpers ─────────────────────────────────────────
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    db = load_db()
    user = next((u for u in db["users"] if u["id"] == user_id), None)
    if user is None:
        raise credentials_exception
    return user

# ─── Auth Routes ─────────────────────────────────────────
@app.post("/auth/register", response_model=Token)
def register(data: UserRegister):
    try:
        db = load_db()
        if any(u["email"] == data.email for u in db["users"]):
            raise HTTPException(status_code=400, detail="Email already registered")

        user = {
            "id": str(uuid.uuid4()),
            "name": data.name,
            "email": data.email,
            "password": hash_password(data.password),
            "created_at": datetime.utcnow().isoformat(),
            "role": "user"
        }
        db["users"].append(user)
        save_db(db)

        token = create_token({"sub": user["id"]})
        safe_user = {k: v for k, v in user.items() if k != "password"}
        return {"access_token": token, "token_type": "bearer", "user": safe_user}
    except HTTPException:
        raise
    except Exception as exc:
        error_text = f"REGISTER ERROR: {exc}\n" + traceback.format_exc()
        print(error_text)
        with open('error.log', 'a', encoding='utf-8') as f:
            f.write(error_text + '\n')
        raise HTTPException(status_code=500, detail="Registration failed due to a server error")

@app.post("/auth/login", response_model=Token)
def login(data: UserLogin):
    db = load_db()
    user = next((u for u in db["users"] if u["email"] == data.email), None)
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_token({"sub": user["id"]})
    safe_user = {k: v for k, v in user.items() if k != "password"}
    return {"access_token": token, "token_type": "bearer", "user": safe_user}

@app.get("/auth/me")
def me(current_user=Depends(get_current_user)):
    safe = {k: v for k, v in current_user.items() if k != "password"}
    return safe

# ─── Call Routes ──────────────────────────────────────────
@app.post("/calls/initiate")
async def initiate_call(req: CallRequest, current_user=Depends(get_current_user)):
    import httpx

    call_id = str(uuid.uuid4())
    call_record = {
        "id": call_id,
        "user_id": current_user["id"],
        "phone": req.phone,
        "message": req.message,
        "provider": req.provider,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat(),
        "duration": None,
        "error": None
    }

    db = load_db()

    if req.provider == "browser":
        call_record["status"] = "delivered"
        call_record["duration"] = 0
        db["calls"].append(call_record)
        save_db(db)
        return {"call_id": call_id, "status": "delivered", "message": "Browser TTS mode — no real call made."}

    provider_key = req.api_key
    if req.provider == "vapi" and not provider_key:
        provider_key = VAPI_DEFAULT_API_KEY

    if req.provider != "browser" and not provider_key:
        call_record["status"] = "rejected"
        call_record["error"] = "No API key provided"
        db["calls"].append(call_record)
        save_db(db)
        raise HTTPException(status_code=400, detail="API key required for this provider")

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            if req.provider == "bland":
                response = await client.post(
                    "https://api.bland.ai/v1/calls",
                    headers={"Authorization": req.api_key, "Content-Type": "application/json"},
                    json={"phone_number": req.phone, "task": req.message, "voice": "maya", "reduce_latency": False}
                )
                result = response.json()
                if response.status_code == 200 and result.get("status") == "success":
                    call_record["status"] = "delivered"
                    call_record["provider_call_id"] = result.get("call_id")
                else:
                    call_record["status"] = "rejected"
                    call_record["error"] = result.get("message", "Unknown error")

            elif req.provider == "vapi":
                response = await client.post(
                    "https://api.vapi.ai/call/phone",
                    headers={"Authorization": f"Bearer {provider_key}", "Content-Type": "application/json"},
                    json={
                        "phoneNumberId": req.phone_number_id or VAPI_DEFAULT_PHONE_NUMBER_ID,
                        "customer": {"number": req.phone},
                        "assistant": {
                            "firstMessage": req.message,
                            "model": {"provider": "openai", "model": "gpt-3.5-turbo"},
                            "voice": {"provider": "11labs", "voiceId": "rachel"}
                        }
                    }
                )
                result = response.json()
                if response.status_code in [200, 201]:
                    call_record["status"] = "delivered"
                    call_record["provider_call_id"] = result.get("id")
                else:
                    call_record["status"] = "rejected"
                    call_record["error"] = result.get("message", "Unknown error")

            elif req.provider == "twilio":
                call_record["status"] = "rejected"
                call_record["error"] = "Twilio requires server-side TwiML endpoint. Use Bland or Vapi instead."

    except Exception as e:
        call_record["status"] = "rejected"
        call_record["error"] = str(e)

    db["calls"].append(call_record)
    save_db(db)

    if call_record["status"] == "delivered":
        return {"call_id": call_id, "status": "delivered", "provider_call_id": call_record.get("provider_call_id")}
    else:
        raise HTTPException(status_code=400, detail=call_record["error"])

@app.get("/calls/history")
def call_history(current_user=Depends(get_current_user)):
    db = load_db()
    calls = [c for c in db["calls"] if c["user_id"] == current_user["id"]]
    calls.sort(key=lambda x: x["created_at"], reverse=True)
    return calls

@app.get("/calls/stats")
def call_stats(current_user=Depends(get_current_user)):
    db = load_db()
    user_calls = [c for c in db["calls"] if c["user_id"] == current_user["id"]]

    total = len(user_calls)
    delivered = len([c for c in user_calls if c["status"] == "delivered"])
    rejected = len([c for c in user_calls if c["status"] == "rejected"])
    pending = len([c for c in user_calls if c["status"] == "pending"])

    # Daily stats for last 7 days
    from collections import defaultdict
    daily = defaultdict(lambda: {"delivered": 0, "rejected": 0})
    for call in user_calls:
        day = call["created_at"][:10]
        daily[day][call["status"]] = daily[day].get(call["status"], 0) + 1

    # Generate last 7 days
    days = []
    for i in range(6, -1, -1):
        d = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
        days.append({
            "date": d,
            "label": (datetime.utcnow() - timedelta(days=i)).strftime("%b %d"),
            "delivered": daily[d].get("delivered", 0),
            "rejected": daily[d].get("rejected", 0),
        })

    # Provider breakdown
    providers = defaultdict(int)
    for c in user_calls:
        providers[c["provider"]] += 1

    return {
        "total": total,
        "delivered": delivered,
        "rejected": rejected,
        "pending": pending,
        "success_rate": round((delivered / total * 100) if total > 0 else 0, 1),
        "daily": days,
        "providers": dict(providers)
    }

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "JARVIS Voice Agent API is running",
        "version": "1.0.0"
    }

@app.get("/health")
def health():
    return {"status": "online", "system": "JARVIS Voice Agent", "version": "1.0.0"}
