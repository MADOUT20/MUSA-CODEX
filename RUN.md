# MUSA CODEX - Setup & Run Guide

## What Was Fixed
Your Android app was showing a blank white screen because `MainActivity.kt` tried to load a web server on `http://10.0.2.2:3000` that wasn't running. 

**The Fix:**
1. Updated `MainActivity.kt` to load the bundled web UI from local assets (`file:///android_asset/web-ui/`)
2. Fixed `vite.config.ts` to use relative paths (`base: './'`) so assets load correctly
3. Rebuilt the web UI and copied it into Android assets

## Quick Start Commands

### Option 1: Run on Android Emulator (Recommended)
```bash
cd "/Users/siddharthchillapwar/Desktop/MUSA CODEX"

# Start an Android emulator first (or use an existing one)
# Then run:
./gradlew installDebug

# Open your emulator and launch the app, or use adb:
adb shell am start -n com.omnitrix.app/.MainActivity
```

### Option 2: Run on Physical Android Device
```bash
cd "/Users/siddharthchillapwar/Desktop/MUSA CODEX"

# Connect your device via USB with debugging enabled, then:
./gradlew installDebug

# The app will install. Open it from your device's app drawer.
```

### Option 3: Direct APK Installation
```bash
# The built APK is at:
app/build/outputs/apk/debug/app-debug.apk

# Install on emulator or device:
adb install app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.omnitrix.app/.MainActivity
```

## Project Structure

```
MUSA CODEX/
├── app/                          # Android app (Kotlin)
│   ├── src/main/
│   │   ├── java/.../MainActivity.kt   # WebView loads local assets
│   │   └── assets/web-ui/             # Built React web UI (updated)
│   └── build.gradle.kts
├── src/                           # React web UI source
│   ├── App.tsx
│   ├── main.tsx
│   └── components/
├── backend/                       # Python backend (ML inference)
│   ├── main.py
│   └── ml/
├── vite.config.ts                # Vite config (base path fixed)
├── package.json
└── build.gradle.kts
```

## What Each Part Does

- **Android App (`/app`)**: WebView wrapper that loads the React UI from local assets
- **Web UI (`/src`)**: React + Tailwind campus safety reporting app
- **Backend (`/backend`)**: Python Flask server for API and ML inference

## To Rebuild Everything

```bash
# Rebuild web UI
npm run build

# Copy to Android assets
cp -r dist app/src/main/assets/web-ui

# Rebuild Android app
./gradlew clean assembleDebug

# Install and run
./gradlew installDebug
adb shell am start -n com.omnitrix.app/.MainActivity
```

## Troubleshooting

**App still shows blank screen?**
- Make sure `app/src/main/assets/web-ui/index.html` exists
- Check Android logcat: `adb logcat | grep "MainActivity\|WebView"`

**Build fails?**
- Run `./gradlew clean` before rebuilding
- Ensure you have Android SDK 37 installed

**adb not found?**
- Add Android SDK tools to PATH, or use the full path:
  ```bash
  ~/Library/Android/sdk/platform-tools/adb
  ```

---

**App Details:**
- Name: OMNITRIX / Read Between the Lines
- Package: com.omnitrix.app
- Min SDK: 27 (Android 8.1)
- Target SDK: 37 (Android 14)
