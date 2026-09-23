from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import hashlib
import secrets
from datetime import datetime
from dotenv import load_dotenv

from supabase import create_client, Client
from backend.ml.inference import analyze_text
from backend.language_agent import normalize_text
from backend.privacy.transformer import transform_to_safe_text

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Initialize Supabase Client
supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
else:
    print("WARNING: Supabase credentials not found. Database operations will fail.")

app = FastAPI(
    title="OMNITRIX API",
    description="Privacy-preserving student safety analysis API",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class ComplaintRequest(BaseModel):
    text: str
    category: Optional[str] = None
    location: Optional[str] = None
    timeframe: Optional[str] = None
    desired_action: Optional[str] = None
    urgency: Optional[str] = None

class ComplaintResponse(BaseModel):
    risk_level: str
    distress_category: str
    emotion: str
    confidence: float
    tracking_token: str

class StatusResponse(BaseModel):
    status: str
    risk_level: str
    distress_category: str
    emotion: str
    confidence: float
    updated_at: str

def map_emotion_to_risk(emotion: str):
    high_risk = {"disapproval", "anger", "disgust", "fear"}
    medium_risk = {"sadness"}
    positive = {"joy", "admiration", "surprise"}

    if emotion in high_risk:
        return "HIGH", "DISTRESS"
    elif emotion in medium_risk:
        return "MEDIUM", "DISTRESS"
    elif emotion in positive:
        return "LOW", "POSITIVE"
    else:
        return "LOW", "NEUTRAL"

@app.get("/")
def root():
    return {"service": "OMNITRIX", "status": "online"}

@app.post("/api/complaint", response_model=ComplaintResponse)
async def analyze_complaint(request: ComplaintRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not configured")

    # 1. Generate secure tracking token
    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode()).hexdigest()

    # 2. Privacy Transformation (RAW TEXT -> SAFE TEXT)
    # Raw complaint must NOT be persisted.
    safe_text = transform_to_safe_text(request.text)

    # 3. Normalization (SAFE TEXT -> NORMALIZED TEXT)
    normalized_text = normalize_text(safe_text)

    # 4. ML Inference (MURIL V5-B)
    result = analyze_text(normalized_text)
    emotion = result["emotion"]
    confidence = result["confidence"]
    risk_level, distress_category = map_emotion_to_risk(emotion)

    # 5. Persist to public.complaints
    try:
        data = {
            "tracking_token_hash": token_hash,
            "privacy_safe_text": safe_text,
            "category": request.category,
            "location": request.location,
            "timeframe": request.timeframe,
            "desired_action": request.desired_action,
            "urgency": request.urgency,
            "emotion": emotion,
            "confidence": confidence,
            "distress_category": distress_category,
            "risk_level": risk_level,
            "ml_model_version": "MuRIL-V5B",
            "normalization_applied": True,
            "status": "NEW"
        }

        # Using supabase-py to insert record
        supabase.table("complaints").insert(data).execute()
    except Exception as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Failed to store complaint")

    return ComplaintResponse(
        risk_level=risk_level,
        distress_category=distress_category,
        emotion=emotion,
        confidence=confidence,
        tracking_token=raw_token
    )

@app.get("/api/complaint/{token}", response_model=StatusResponse)
async def get_complaint_status(token: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not configured")

    # Hash the provided token to lookup
    token_hash = hashlib.sha256(token.encode()).hexdigest()

    # Lookup in public.complaints
    result = supabase.table("complaints").select("*").eq("tracking_token_hash", token_hash).execute()

    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Complaint not found")

    record = result.data[0]
    return StatusResponse(
        status=record["status"],
        risk_level=record["risk_level"],
        distress_category=record["distress_category"],
        emotion=record["emotion"],
        confidence=record["confidence"],
        updated_at=record["updated_at"]
    )

@app.patch("/api/complaint/{token}/status")
async def update_complaint_status(token: str, status_update: dict):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not configured")

    # Basic validation of status values
    valid_statuses = {"NEW", "UNDER_REVIEW", "ACTION_REQUIRED", "RESOLVED", "CLOSED"}
    new_status = status_update.get("status")
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")

    token_hash = hashlib.sha256(token.encode()).hexdigest()

    try:
        supabase.table("complaints").update({"status": new_status, "updated_at": "now()"}).eq("tracking_token_hash", token_hash).execute()
    except Exception as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update status")

    return {"status": "updated", "new_status": new_status}
