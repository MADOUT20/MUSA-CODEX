#!/bin/bash
# run_frontend.sh - Build and deploy the MUSA CODEX frontend to Android
set -e

# Define ADB path based on current environment
ADB_PATH="$HOME/Library/Android/sdk/platform-tools/adb"

if [ ! -f "$ADB_PATH" ]; then
  echo "❌ ADB not found at $ADB_PATH. Please ensure Android SDK is installed."
  exit 1
fi

echo "🎨 Building MUSA CODEX Frontend..."
npm run build --legacy-peer-deps

echo "📦 Syncing assets to Android app..."
rm -rf app/src/main/assets/web-ui/*
cp -r dist/* app/src/main/assets/web-ui/

echo "📱 Installing APK to device/emulator..."
./gradlew installDebug || {
  echo "⚠️ Gradle install failed. Check if an emulator is running."
  # We continue to try launch in case it was already installed
}

echo "🚀 Launching app via ADB..."
"$ADB_PATH" shell am start -n com.omnitrix.app/.MainActivity

echo "✅ Frontend deployed and launched successfully!"
