# Quick Start

This page runs the Android app with the FastAPI backend on macOS/Linux or Windows.

## Prerequisites

- Android Emulator (Pixel recommended)
- Python 3.8+
- Node.js 25.6.1+
- Android SDK 37+
- A configured Python virtual environment at `.venv`

See [RUN.md](../RUN.md) for detailed setup and troubleshooting.

## macOS / Linux

### Terminal 1: backend

```bash
source .venv/bin/activate
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 2: build and launch Android

```bash
npm run build --legacy-peer-deps
rm -rf app/src/main/assets/web-ui/*
cp -r dist/* app/src/main/assets/web-ui/
./gradlew installDebug
adb shell am start -n com.omnitrix.app/.MainActivity
```

## Windows

### PowerShell/CMD 1: backend

```batch
.venv\Scripts\activate
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### PowerShell/CMD 2: build and launch Android

```batch
npm run build --legacy-peer-deps
rmdir /s /q app\src\main\assets\web-ui
mkdir app\src\main\assets\web-ui
xcopy /E dist\* app\src\main\assets\web-ui\
gradlew.bat installDebug
%ANDROID_HOME%\platform-tools\adb shell am start -n com.omnitrix.app/.MainActivity
```

## Common fixes

- Backend port in use: see [RUN.md](../RUN.md).
- Build dependency error: run `npm install --legacy-peer-deps`.
- Blank Android screen: confirm `app/src/main/assets/web-ui/index.html` exists.
