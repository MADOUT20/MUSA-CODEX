# OMNITRIX / MUSA CODEX

## Start Here

OMNITRIX is a privacy-focused student safety system. It accepts anonymous complaints, removes direct identifiers and selected writing-style signals before analysis, detects emotion in Hinglish and other code-mixed text, and gives authorized operators high-level risk indicators instead of exposing the original complaint.

> **Current status:** The backend, privacy pipeline, MuRIL V5-B inference, Supabase persistence, admin API, and React/Vite admin dashboard are integrated. Privacy hardening, model upgrades, authorization, and final validation are still in progress.

### What happens to a complaint?

```text
Anonymous complaint
  -> Privacy transformation
  -> Hinglish/code-mixed normalization
  -> MuRIL V5-B emotion classification
  -> Risk and distress mapping
  -> Privacy-safe Supabase record
  -> Admin dashboard
```

The intended order is important: text is privacy-transformed **before** normalization or external language processing. The original complaint is not intentionally persisted; the database is designed around a `privacy_safe_text` representation.

### Jump to what you need

| I want to... | Go to |
| --- | --- |
| Run the Android app | [Quick Start](#-quick-start) |
| Run the backend and admin dashboard | [Local Admin Setup](#local-admin-setup) |
| Understand the privacy layer | [Privacy Architecture](#-privacy-architecture) |
| Call the complaint API | [Backend API](#-backend-fastapi) |
| See the current scope and limitations | [Project Status](#project-status) |
| Fix a local setup issue | [Troubleshooting](#-troubleshooting) or [RUN.md](RUN.md) |

### Current feature checklist

- [x] Anonymous complaint submission and tracking tokens
- [x] PII masking and privacy-safe persistence
- [x] MuRIL V5-B emotion inference
- [x] Supabase integration
- [x] Admin complaint listing, details, status updates, and history
- [x] React/Vite admin dashboard
- [ ] Stronger adversarial privacy evaluation
- [ ] Production-grade admin authentication and authorization
- [ ] V5-C/V6 model integration and full regression testing

## Local Admin Setup

For the backend and admin dashboard, use two terminals from the repository root:

**Terminal 1: backend**

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

**Terminal 2: admin dashboard**

```bash
cd admin-frontend
npm install
npm run dev
```

The backend starts at `http://127.0.0.1:8000`. Configure local secrets in `.env` and never commit API keys, Supabase secret keys, passwords, or authentication tokens.

Run the privacy tests with:

```bash
python -m pytest -q
```

For the Android emulator workflow, continue to [Quick Start](#-quick-start) below and see [RUN.md](RUN.md) for platform-specific troubleshooting.

## Privacy Architecture

The privacy layer lives in `backend/privacy/transformer.py` and currently handles:

- Email addresses, phone numbers, URLs, student IDs, roll numbers, and enrollment numbers
- Social handles, long numeric identifiers, titled person references, and selected academic context
- Unicode, whitespace, capitalization, punctuation, and word-elongation normalization

Example:

```text
Raw: My roll number is 23AIML12345 and my email is student@example.com.
Safe: my roll number is [STUDENT_ID] and my email is [EMAIL].
```

The privacy layer reduces exposure; it is not a mathematical guarantee that re-identification is impossible. Indian names, context-dependent identifiers, false positives, and cross-complaint stylometric linkage remain active evaluation areas.

## Project Status

OMNITRIX is a student/hackathon project and should not be used as a standalone safety, disciplinary, or incident-ground-truth system. The ML model predicts emotion classes, and application rules map those predictions to broad risk indicators.

Before real institutional deployment, the project still needs stronger privacy evaluation, production authorization, database-policy hardening, model benchmarking, UI refinement, and complete end-to-end regression testing.

# OMNITRIX: Privacy-Preserving Student Safety Intelligence

OMNITRIX (also known as MUSA CODEX) is a specialized multi-platform system for detecting distress and emotion in code-mixed (Hinglish) text, specifically tailored for student safety assessments. It employs a privacy-first architecture where analysis is performed on a secure backend, returning only high-level safety indicators to the end-user.

## 🏗️ System Architecture

The system follows a **secure, end-to-end functional pipeline**:

```
Android App (Kotlin WebView Wrapper)
         ↓
    React Web UI (Vite/TypeScript/Tailwind)
         ↓
   FastAPI Backend Server (http://10.0.2.2:8000)
         ↓
  Privacy Transformation (PII Removal)
         ↓
  MuRIL V5-B ML Inference (Emotion/Risk Analysis)
         ↓
  Supabase Database (public.complaints)
         ↓
  Admin Dashboard (Status Management)
```

## 🚀 Quick Start

### Prerequisites
- Android Emulator (Pixel recommended)
- Python 3.8+
- Node.js v25.6.1+
- Android SDK 37+

---

# 🍎 macOS / Linux

## Two Commands to Run Everything

### Terminal 1 - Backend:
```bash
source .venv/bin/activate && uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 2 - Android App:
```bash
npm run build --legacy-peer-deps && rm -rf app/src/main/assets/web-ui/* && cp -r dist/* app/src/main/assets/web-ui/ && ./gradlew installDebug && adb shell am start -n com.omnitrix.app/.MainActivity
```

See **RUN.md** for detailed setup and troubleshooting.

---

# 🪟 Windows

## Two Commands to Run Everything

### PowerShell/CMD 1 - Backend:
```batch
.venv\Scripts\activate && uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### PowerShell/CMD 2 - Android App:
```batch
npm run build --legacy-peer-deps && rmdir /s /q app\src\main\assets\web-ui && mkdir app\src\main\assets\web-ui && xcopy /E dist\* app\src\main\assets\web-ui\ && gradlew.bat installDebug && %ANDROID_HOME%\platform-tools\adb shell am start -n com.omnitrix.app/.MainActivity
```

See **RUN.md** for detailed setup and troubleshooting.

---

## 🧠 Machine Learning Core

### Model Architecture
- **Base Model**: `google/muril-base-cased` 
  - Multilingual Representations for Indian Languages
  - Pre-trained on large corpus of Indian language text
  
- **Fine-Tuning Technique**: Parameter-Efficient Fine-Tuning (PEFT) using **LoRA** (Low-Rank Adaptation)
  - **Model Version**: v5b (Current production model)
  - Rank (r): 16
  - Alpha (α): 32
  - Target Modules: `query`, `value`
  - Learning Rate: 1×10⁻⁴
  - Optimizer: AdamW with weight decay
  - Hardware: GPU-accelerated training
  - Validation Strategy: Epoch-based with best model selection

### Classification Task
**10-class emotion classification** with mapping to campus safety indicators:
- **High Risk**: Anger, Disapproval, Disgust, Fear
- **Medium Risk**: Sadness, Anxiety
- **Positive**: Joy, Admiration, Surprise, Neutral

### Safety Metric Mapping
Each emotion is mapped to actionable campus safety metrics:
```
Emotion → Risk Level (LOW/MEDIUM/HIGH)
        → Distress Category (POSITIVE/NEUTRAL/DISTRESS)
        → Confidence Score (0.0-1.0)
```

---

## 🌐 Backend (FastAPI)

### Location
`/backend/main.py`

### Core Pipeline
1. **Endpoint**: `POST /api/complaint` receives user narrative and metadata.
2. **Privacy**: `backend/privacy/transformer.py` removes PII before storage.
3. **ML**: `backend/ml/inference.py` runs MuRIL V5-B to detect emotion/risk.
4. **Database**: Results are stored in **Supabase** (`public.complaints`).
5. **Tokens**: A unique tracking token is returned to the user; only the SHA-256 hash of the token is stored in the DB.

### Endpoints
#### `/api/complaint` (POST)
Main submission endpoint.
**Request:**
```json
{
  "text": "Hinglish text to analyze",
  "category": "...",
  "location": "...",
  "timeframe": "...",
  "desired_action": "...",
  "urgency": "..."
}
```
**Response:**
```json
{
  "tracking_token": "...",
  "risk_level": "...",
  "emotion": "...",
  "confidence": 0.0-1.0
}
```

#### `/api/complaint/{token}` (GET)
Retrieves the current status and risk metrics for a specific report.

---

## 📱 Android Integration (Kotlin)

### Location
`/app/src/main/java/com/omnitrix/app/MainActivity.kt`

### How It Works
1. **WebView Wrapper**: Native Android app loads React UI in an embedded WebView.
2. **Local Asset Loading**: UI bundled directly in APK (`file:///android_asset/web-ui/`).
3. **Connectivity**: Backend calls are routed via `http://10.0.2.2:8000`.

### Configuration
- **Min SDK**: Android 8.1 (API 27)
- **Target SDK**: Android 14 (API 37)

---

## 💻 React Web UI (TypeScript)

### Location
`/src/`

### Components
- **HomeScreen**: Landing page with reporting CTA and privacy info.
- **ReportScreen**: Full submission flow with real-time backend integration.
- **TrackScreen**: Real-time status tracking, automatic refresh every 10s, and a demo-only chat interface.
- **SupportScreen**: Campus support resources and hotlines.

### Key Functionality
- **Real-time Submission**: Connects to FastAPI to store anonymized complaints in Supabase.
- **Live Tracking**: Retrieves current report status from the backend using the anonymous token.
- **Auto-Refresh**: The tracking screen automatically updates if an admin changes the status in the database.
- **Mock Chat**: The "Confidential Ombuds Channel" is currently a demo-only interface with static conversations.

### Build
```bash
npm run build --legacy-peer-deps
```

---

## 📂 Project Structure

```
MUSA CODEX/
├── app/                                    # Android App (Kotlin)
│   ├── src/main/java/com/omnitrix/app/
│   │   └── MainActivity.kt                 # WebView entry point
│   ├── src/main/assets/web-ui/            # Bundled React build
│   └── build.gradle.kts                   # Android build config
│
├── src/                                    # React Web UI (TypeScript)
│   ├── App.tsx                            # Main component
│   ├── components/
│   │   ├── HomeScreen.tsx
│   │   ├── ReportScreen.tsx
│   │   ├── TrackScreen.tsx
│   │   └── SupportScreen.tsx
│   └── types/
│       └── index.ts                       # TypeScript interfaces
│
├── backend/                                # Python Backend (FastAPI)
│   ├── main.py                            # FastAPI app + endpoints
│   ├── privacy/                               # PII Removal Logic
│   │   └── transformer.py
│   └── ml/                                    # MuRIL v5b inference
│       ├── inference.py
│       └── config.py
│
├── README.md                              # This file
└── RUN.md                                 # Setup & run guide
```

---

## 🔒 Privacy Architecture

### No Identity Retention
- Anonymous tokens generated at submission.
- Raw narrative never stored with identifier.
- IP addresses and device metadata purged immediately.

### Data Minimization
- Only emotion scores and privacy-safe text are stored in Supabase.
- Token hashes (SHA-256) are used for tracking to prevent raw token leakage.

---

## 📊 Evaluation (v5b Model - Current Production)

### Test Performance (2569 test samples)
- **Test Accuracy**: 59.83%
- **Macro F1-Score**: 57.26%
- **Weighted F1-Score**: 58.52%

### Per-Class Performance (Test Set F1 Scores)
| Emotion | F1 Score |
|---------|----------|
| Disapproval | 0.8262 ⭐ |
| Fear | 0.6126 |
| Anger | 0.6013 |
| Joy | 0.6485 |
| Neutral | 0.3529 |

---

## 🛠️ Development

### Making Changes to React UI
```bash
# Edit files in src/
npm run build --legacy-peer-deps
cp -r dist/* app/src/main/assets/web-ui/
./gradlew installDebug
adb shell am start -n com.omnitrix.app/.MainActivity
```

---

## 🚨 Troubleshooting
Common issues:
- **Backend port 8000 in use**: Check RUN.md for OS-specific commands.
- **NPM build fails**: `npm install --legacy-peer-deps`.
- **App blank screen**: Verify `app/src/main/assets/web-ui/index.html` exists.
