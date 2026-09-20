# OMNITRIX: Privacy-Preserving Student Safety Intelligence

OMNITRIX (also known as MUSA CODEX) is a specialized multi-platform system for detecting distress and emotion in code-mixed (Hinglish) text, specifically tailored for student safety assessments. It employs a privacy-first architecture where analysis is performed on a secure backend, returning only high-level safety indicators to the end-user.

## 🏗️ System Architecture

The system follows a **decoupled, privacy-preserving architecture**:

```
Android App (Kotlin/Compose WebView)
         ↓
    React Web UI (Bundled in APK)
         ↓
   FastAPI Backend Server
         ↓
  MuRIL v3 ML Model (PEFT/LoRA)
         ↓
 Emotion Detection & Risk Assessment
```

## 🚀 Quick Start

### Prerequisites
- Android Emulator or physical device
- Python 3.8+
- Node.js v25.6.1+
- Android SDK 37+

---

# 🍎 macOS / Linux

## Two Commands to Run Everything

### Terminal 1 - Backend:
```bash
cd "/Users/siddharthchillapwar/Desktop/MUSA CODEX" && source .venv/bin/activate && uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 2 - Android App:
```bash
cd "/Users/siddharthchillapwar/Desktop/MUSA CODEX" && npm run build --legacy-peer-deps && rm -rf app/src/main/assets/web-ui/* && cp -r dist/* app/src/main/assets/web-ui/ && ./gradlew installDebug && ~/Library/Android/sdk/platform-tools/adb shell am start -n com.omnitrix.app/.MainActivity
```

See **RUN.md** for detailed setup and troubleshooting.

---

# 🪟 Windows

## Two Commands to Run Everything

### PowerShell/CMD 1 - Backend:
```batch
cd "C:\path\to\MUSA CODEX" && .venv\Scripts\activate && uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### PowerShell/CMD 2 - Android App:
```batch
cd "C:\path\to\MUSA CODEX" && npm run build --legacy-peer-deps && rmdir /s /q app\src\main\assets\web-ui && mkdir app\src\main\assets\web-ui && xcopy /E dist\* app\src\main\assets\web-ui\ && gradlew.bat installDebug && %ANDROID_HOME%\platform-tools\adb shell am start -n com.omnitrix.app/.MainActivity
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

### Endpoints

#### `/` (GET)
Health check endpoint
```json
{
  "service": "OMNITRIX",
  "status": "online"
}
```

#### `/api/complaint` (POST)
Main inference endpoint for emotion detection and safety assessment

**Request:**
```json
{
  "text": "Hinglish text to analyze"
}
```

**Response:**
```json
{
  "risk_level": "HIGH|MEDIUM|LOW",
  "distress_category": "DISTRESS|NEUTRAL|POSITIVE",
  "emotion": "anger|joy|sadness|etc",
  "confidence": 0.0-1.0
}
```

#### `/docs` (GET)
Interactive API documentation (Swagger UI)

### Key Features
- **Real-time inference** using trained LoRA adapters
- **Sanitized text processing** via `language_agent.py`
- **Privacy-first design**: No raw text storage, only aggregated metrics
- **Auto-restart on code changes** (development mode with `--reload`)

---

## 📱 Android Integration (Kotlin)

### Location
`/app/src/main/java/com/omnitrix/app/MainActivity.kt`

### How It Works
1. **WebView Wrapper**: Native Android app loads React UI in an embedded WebView
2. **Local Asset Loading**: UI bundled directly in APK (`file:///android_asset/web-ui/`)
3. **No network dependency for UI**: Only backend calls go over HTTP
4. **Privacy**: Device SDK paths auto-generated, not stored in VCS

### Configuration
- **Min SDK**: Android 8.1 (API 27)
- **Target SDK**: Android 14 (API 37)
- **Backend URL**: `http://10.0.2.2:8000` (Android Emulator default for localhost)
- **WebView Settings**: File access enabled for local assets, mixed content allowed

---

## 💻 React Web UI (TypeScript)

### Location
`/src/`

### Components
- **HomeScreen**: Landing page with reporting CTA and privacy info
- **ReportScreen**: Anonymous report submission with categorization
- **TrackScreen**: Report status tracking with timeline and confidential Ombuds channel
- **SupportScreen**: Campus support resources and hotlines
- **PrivacyModal**: Detailed privacy & confidentiality explanation
- **QuickExitOverlay**: Panic button disguises app as academic library catalog

### Features
- **Real-time inference feedback** on submitted reports
- **Anonymous token generation** for report tracking
- **Confidential messaging** with campus ombudsperson
- **Smooth animations** (iOS-style transitions between screens)
- **Mobile-optimized** Tailwind CSS design

### Build
```bash
npm run build --legacy-peer-deps
```

Outputs to `/dist/` (then bundled into Android assets)

---

## 📂 Project Structure

```
MUSA CODEX/
├── app/                                    # Android App (Kotlin)
│   ├── src/main/java/com/omnitrix/app/
│   │   └── MainActivity.kt                 # WebView entry point
│   ├── src/main/assets/web-ui/            # Bundled React build
│   │   ├── index.html
│   │   ├── assets/
│   │   └── holding_hands.jpg
│   └── build.gradle.kts                   # Android build config
│
├── src/                                    # React Web UI (TypeScript)
│   ├── App.tsx                            # Main component
│   ├── main.tsx                           # Entry point
│   ├── index.css                          # Custom animations
│   ├── components/
│   │   ├── HomeScreen.tsx
│   │   ├── ReportScreen.tsx
│   │   ├── TrackScreen.tsx
│   │   ├── SupportScreen.tsx
│   │   ├── BottomNav.tsx
│   │   ├── PrivacyModal.tsx
│   │   └── QuickExitOverlay.tsx
│   ├── types/
│   │   └── index.ts                       # TypeScript interfaces
│   └── data/
│       └── initialData.ts                 # Mock data for demo
│
├── backend/                                # Python Backend (FastAPI)
│   ├── main.py                            # FastAPI app + endpoints
│   ├── requirements.txt                   # Python dependencies
│   ├── language_agent.py                  # Text normalization
│   └── ml/
│       ├── inference.py                   # MuRIL v3 inference
│       ├── config.py                      # ML configuration
│       ├── models/
│       │   └── muril_emotion_v3/          # Fine-tuned model weights
│       └── scripts/
│           └── train_v3.py                # Training script
│
├── vite.config.ts                         # Vite build configuration
├── tsconfig.json                          # TypeScript config
├── package.json                           # Node dependencies
├── build.gradle.kts                       # Root Gradle config
├── settings.gradle.kts                    # Gradle settings
├── gradlew                                # Gradle wrapper (Linux/Mac)
├── gradlew.bat                            # Gradle wrapper (Windows)
├── local.properties                       # Android SDK path (auto-generated)
├── README.md                              # This file
└── RUN.md                                 # Setup & run guide
```

---

## 🔒 Privacy Architecture

### No Identity Retention
- Anonymous tokens generated at submission
- Raw narrative never stored with identifier
- IP addresses and device metadata purged immediately

### Data Minimization
- Only emotion scores sent to frontend
- De-identified narratives used for context
- No persistent raw text storage

### Two-Way Ombuds Communication
- Confidential messaging channel with campus advocate
- No sender footprints or IP logging
- Shielded end-to-end communication design

---

## 📊 Evaluation (v5b Model - Current Production)

### Test Performance (2569 test samples)
- **Test Accuracy**: 59.83%
- **Macro F1-Score**: 57.26%
- **Weighted F1-Score**: 58.52%

### Validation Performance
- **Validation Accuracy**: 58.97%
- **Validation Macro F1**: 56.83%

### Per-Class Performance (Test Set F1 Scores)
| Emotion | F1 Score |
|---------|----------|
| Disapproval | 0.8262 ⭐ (Strongest) |
| Love | 0.7645 |
| Admiration | 0.6587 |
| Fear | 0.6126 |
| Anger | 0.6013 |
| Joy | 0.6485 |
| Surprise | 0.4831 |
| Sadness | 0.4323 |
| Neutral | 0.3529 |
| Disgust | 0.3458 |

### Model Improvements (v5b vs v4)
| Metric | v4 | v5b | Improvement |
|--------|----|----|-------------|
| Accuracy | 56.83% | 59.83% | **+3.00%** |
| Macro F1 | 51.44% | 57.26% | **+5.82%** |
| Weighted F1 | 54.45% | 58.52% | **+4.07%** |

### Key Strengths
- **Excellent performance on Disapproval detection** (0.8262 F1) - critical for campus safety
- **Strong on Love & Admiration** - positive emotion recognition
- **Improved from v4** - significant gains across all metrics
- **Frozen model** - prevents catastrophic forgetting and ensures stability

### Status
- ✅ v5b is the current frozen production model
- 🎯 Training intentionally paused after v5b
- 📦 Checkpoint: `muril_emotion_v5b/results/checkpoint-3855`

---

## 🛠️ Development

### Making Changes to React UI

**macOS/Linux:**
```bash
# Edit files in src/
# Rebuild
npm run build --legacy-peer-deps
# Copy to Android assets
cp -r dist/* app/src/main/assets/web-ui/
# Rebuild APK
./gradlew installDebug
# Launch app
adb shell am start -n com.omnitrix.app/.MainActivity
```

**Windows:**
```batch
REM Edit files in src/
REM Rebuild
npm run build --legacy-peer-deps
REM Copy to Android assets
xcopy /E dist\* app\src\main\assets\web-ui\
REM Rebuild APK
gradlew.bat installDebug
REM Launch app
adb shell am start -n com.omnitrix.app/.MainActivity
```

### Making Changes to Backend
```bash
# Edit files in backend/
# Backend auto-restarts with --reload flag
# Test via http://localhost:8000/docs
```

### Making Changes to Android App
```bash
# Edit files in app/src/main/java/
# Rebuild (macOS/Linux)
./gradlew installDebug
# Rebuild (Windows)
gradlew.bat installDebug
# Launch
adb shell am start -n com.omnitrix.app/.MainActivity
```

---

## 🚨 Troubleshooting

See **RUN.md** for detailed troubleshooting guide specific to your OS.

Common issues:
- **Backend port 8000 in use**: Check RUN.md for OS-specific commands
- **NPM build fails**: `npm install --legacy-peer-deps`
- **App blank screen**: Verify `app/src/main/assets/web-ui/index.html` exists
- **APK won't install**: Ensure emulator is running or device connected

---

## 📋 App Details

| Property | Value |
|----------|-------|
| **App Name** | OMNITRIX / Read Between the Lines |
| **Package** | com.omnitrix.app |
| **Min SDK** | 27 (Android 8.1) |
| **Target SDK** | 37 (Android 14) |
| **UI Framework** | Jetpack Compose (Android), React 19 (Web) |
| **Backend** | FastAPI (Python) |
| **ML Model** | MuRIL v3 with LoRA |
| **Database** | In-memory (development), can integrate backend storage |

---

## 📝 License

This project is part of campus safety initiatives at [Your University].

---

## 👥 Contact & Support

For questions or support regarding this system, contact your campus ombudsperson or safety office.

**Backend API Docs**: `http://localhost:8000/docs` (when running)

