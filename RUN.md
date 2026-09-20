# MUSA CODEX - Setup & Run Guide

## Project Overview
MUSA CODEX is a privacy-preserving campus safety reporting system with:
- **Android App**: Kotlin/Compose WebView wrapper
- **React Web UI**: Campus safety reporting interface (bundled in APK)
- **Python Backend**: FastAPI + MuRIL v3 ML inference for emotion detection

## Prerequisites
- Android Emulator running OR physical device connected via USB
- Python 3.8+
- Node.js v25.6.1 (or later)
- Android SDK 37+

---

# 🍎 macOS / Linux Setup

## Quick Start - Two Commands

### Command 1: Start Backend (Terminal 1)
```bash
cd "/Users/siddharthchillapwar/Desktop/MUSA CODEX" && source .venv/bin/activate && uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

**What it does:**
- Activates Python virtual environment
- Starts FastAPI server on `http://localhost:8000`
- Accessible from Android Emulator at `http://10.0.2.2:8000`
- Auto-restarts on code changes

**Verify it's working:**
- Open browser: `http://localhost:8000/docs` (interactive API docs)
- Or: `http://localhost:8000/` (health check)

---

### Command 2: Build & Deploy Android App (Terminal 2)
```bash
cd "/Users/siddharthchillapwar/Desktop/MUSA CODEX" && npm run build --legacy-peer-deps && rm -rf app/src/main/assets/web-ui/* && cp -r dist/* app/src/main/assets/web-ui/ && ./gradlew installDebug && ~/Library/Android/sdk/platform-tools/adb shell am start -n com.omnitrix.app/.MainActivity
```

**What it does (step by step):**
1. `npm run build --legacy-peer-deps` — Builds React UI into `dist/`
2. `rm -rf app/src/main/assets/web-ui/*` — Clears old bundled assets
3. `cp -r dist/* app/src/main/assets/web-ui/` — Copies fresh build into Android assets
4. `./gradlew installDebug` — Compiles and installs APK on emulator/device
5. `~/Library/Android/sdk/platform-tools/adb shell am start -n com.omnitrix.app/.MainActivity` — Launches the app

---

## Full Setup (First Time Only - macOS/Linux)

```bash
# 1. Create Python virtual environment and install dependencies
cd "/Users/siddharthchillapwar/Desktop/MUSA CODEX"
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt

# 2. Install Node dependencies
npm install --legacy-peer-deps

# 3. Start backend (in Terminal 1)
source .venv/bin/activate && uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

# 4. In Terminal 2, start Android emulator
emulator -avd <your_emulator_name>

# 5. Build and deploy app (in Terminal 2, after emulator is running)
npm run build --legacy-peer-deps && rm -rf app/src/main/assets/web-ui/* && cp -r dist/* app/src/main/assets/web-ui/ && ./gradlew installDebug && ~/Library/Android/sdk/platform-tools/adb shell am start -n com.omnitrix.app/.MainActivity
```

---

## Troubleshooting (macOS/Linux)

### Backend won't start
```bash
# Check if port 8000 is in use
lsof -i :8000
# Kill if needed
kill -9 <PID>
```

### NPM build fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build --legacy-peer-deps
```

### Android build fails
```bash
./gradlew clean
./gradlew installDebug
```

### App shows blank screen
- Verify: `app/src/main/assets/web-ui/index.html` exists
- Check logcat: `adb logcat | grep MainActivity`
- Ensure web-ui assets were copied correctly

### APK won't install
- Ensure emulator is running: `emulator -avd <name>`
- Or connect device with USB debugging enabled
- Check: `adb devices` to see connected devices

---

# 🪟 Windows Setup

## Quick Start - Two Commands

### Command 1: Start Backend (PowerShell/CMD 1)
```batch
cd "C:\path\to\MUSA CODEX" && .venv\Scripts\activate && uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

**What it does:**
- Activates Python virtual environment
- Starts FastAPI server on `http://localhost:8000`
- Accessible from Android Emulator at `http://10.0.2.2:8000`
- Auto-restarts on code changes

**Verify it's working:**
- Open browser: `http://localhost:8000/docs` (interactive API docs)
- Or: `http://localhost:8000/` (health check)

---

### Command 2: Build & Deploy Android App (PowerShell/CMD 2)
```batch
cd "C:\path\to\MUSA CODEX" && npm run build --legacy-peer-deps && rmdir /s /q app\src\main\assets\web-ui && mkdir app\src\main\assets\web-ui && xcopy /E dist\* app\src\main\assets\web-ui\ && gradlew.bat installDebug && %ANDROID_HOME%\platform-tools\adb shell am start -n com.omnitrix.app/.MainActivity
```

**What it does (step by step):**
1. `npm run build --legacy-peer-deps` — Builds React UI into `dist/`
2. `rmdir /s /q app\src\main\assets\web-ui` — Deletes old bundled assets
3. `mkdir app\src\main\assets\web-ui` — Creates fresh directory
4. `xcopy /E dist\* app\src\main\assets\web-ui\` — Copies build into Android assets
5. `gradlew.bat installDebug` — Compiles and installs APK on emulator/device
6. `%ANDROID_HOME%\platform-tools\adb shell am start -n com.omnitrix.app/.MainActivity` — Launches the app

---

## Full Setup (First Time Only - Windows)

```batch
REM 1. Create Python virtual environment and install dependencies
cd "C:\path\to\MUSA CODEX"
python -m venv .venv
.venv\Scripts\activate
pip install -r backend\requirements.txt

REM 2. Install Node dependencies
npm install --legacy-peer-deps

REM 3. Start backend (in Terminal 1)
.venv\Scripts\activate && uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

REM 4. In Terminal 2, start Android emulator
emulator -avd <your_emulator_name>

REM 5. Build and deploy app (in Terminal 2, after emulator is running)
npm run build --legacy-peer-deps && rmdir /s /q app\src\main\assets\web-ui && mkdir app\src\main\assets\web-ui && xcopy /E dist\* app\src\main\assets\web-ui\ && gradlew.bat installDebug && %ANDROID_HOME%\platform-tools\adb shell am start -n com.omnitrix.app/.MainActivity
```

---

## Troubleshooting (Windows)

### Backend won't start
```batch
REM Check if port 8000 is in use (requires netstat)
netstat -ano | findstr :8000
REM Kill process by PID
taskkill /PID <PID> /F
```

### NPM build fails
```batch
REM Clear cache and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install --legacy-peer-deps
npm run build --legacy-peer-deps
```

### Android build fails
```batch
gradlew.bat clean
gradlew.bat installDebug
```

### App shows blank screen
- Verify: `app\src\main\assets\web-ui\index.html` exists
- Check logcat: `adb logcat | findstr MainActivity`
- Ensure web-ui assets were copied correctly

### APK won't install
- Ensure emulator is running: `emulator -avd <name>`
- Or connect device with USB debugging enabled
- Check: `adb devices` to see connected devices

### ANDROID_HOME not set
```batch
REM Set ANDROID_HOME to your Android SDK location
setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\Sdk"
REM Restart terminal for changes to take effect
```

---

# 📂 Project Structure

```
MUSA CODEX/
├── app/                          # Android app (Kotlin)
│   ├── src/main/
│   │   ├── java/.../MainActivity.kt   # WebView loads local bundled UI
│   │   └── assets/web-ui/             # Built React UI (bundled in APK)
│   └── build.gradle.kts
├── src/                           # React web UI source
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/                # UI screens
│   │   ├── HomeScreen.tsx
│   │   ├── ReportScreen.tsx
│   │   ├── TrackScreen.tsx
│   │   └── SupportScreen.tsx
│   └── index.css                  # Custom smooth animations
├── backend/                       # Python backend (ML inference)
│   ├── main.py                    # FastAPI server
│   ├── requirements.txt           # Python dependencies
│   └── ml/
│       ├── inference.py           # MuRIL v3 emotion detection
│       └── models/                # Fine-tuned model weights
├── vite.config.ts                 # Vite build config
├── package.json                   # Node dependencies
├── build.gradle.kts               # Android build config
└── README.md                      # Project documentation
```

## Architecture Flow

```
Android App (WebView)
    ↓
Loads: file:///android_asset/web-ui/index.html
    ↓
React UI (Bundled in APK)
    ↓
User submits report
    ↓
HTTP POST to Backend
    ↓
http://10.0.2.2:8000/api/complaint
    ↓
FastAPI + MuRIL v3 ML Model
    ↓
Emotion Detection & Analysis
    ↓
Returns: {risk_level, distress_category, emotion, confidence}
    ↓
Display results in app
```

---

## Development Notes

### Making changes to React UI
1. Edit files in `src/` directory
2. Run `npm run build --legacy-peer-deps`
3. Copy to assets:
   - **macOS/Linux**: `cp -r dist/* app/src/main/assets/web-ui/`
   - **Windows**: `xcopy /E dist\* app\src\main\assets\web-ui\`
4. Rebuild APK: `./gradlew installDebug` (macOS/Linux) or `gradlew.bat installDebug` (Windows)
5. Launch: `adb shell am start -n com.omnitrix.app/.MainActivity`

### Making changes to backend
1. Edit files in `backend/` directory
2. Backend auto-restarts due to `--reload` flag
3. Test via `http://localhost:8000/docs`

### Making changes to Android app
1. Edit files in `app/src/main/java/`
2. Run: `./gradlew installDebug` (macOS/Linux) or `gradlew.bat installDebug` (Windows)
3. Launch: `adb shell am start -n com.omnitrix.app/.MainActivity`

---

## Specs

- **Language**: Kotlin (Android), TypeScript/React (Web), Python (Backend)
- **Min SDK**: Android 8.1 (API 27)
- **Target SDK**: Android 14 (API 37)
- **ML Model**: google/muril-base-cased with LoRA fine-tuning
- **Emotion Classes**: 10 categories (Anger, Joy, Sadness, etc.)

