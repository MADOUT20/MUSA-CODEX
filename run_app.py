#!/usr/bin/env python3
"""
Install and run MUSA CODEX Android app
Usage: python3 run_app.py
"""

import subprocess
import os
import sys
import time

PROJECT_ROOT = "/Users/siddharthchillapwar/Desktop/MUSA CODEX"
APK_PATH = f"{PROJECT_ROOT}/app/build/outputs/apk/debug/app-debug.apk"
PACKAGE_NAME = "com.omnitrix.app"
ACTIVITY_NAME = "com.omnitrix.app.MainActivity"

def find_adb():
    """Find adb in common locations"""
    possible_paths = [
        "adb",  # Already in PATH
        os.path.expanduser("~/Library/Android/sdk/platform-tools/adb"),
        "/usr/local/bin/adb",
        "/opt/android-sdk/platform-tools/adb",
    ]

    for path in possible_paths:
        try:
            subprocess.run([path, "version"], capture_output=True, check=True)
            return path
        except (subprocess.CalledProcessError, FileNotFoundError):
            continue

    return None

def run_command(cmd, description):
    """Run a shell command and print output"""
    print(f"\n{'='*60}")
    print(f"▶ {description}")
    print(f"{'='*60}")
    try:
        result = subprocess.run(cmd, shell=isinstance(cmd, str), cwd=PROJECT_ROOT)
        if result.returncode != 0:
            print(f"❌ Command failed: {description}")
            return False
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    # Find adb
    adb = find_adb()
    if not adb:
        print("❌ adb not found. Please install Android SDK Platform Tools.")
        print("   Download from: https://developer.android.com/tools/releases/platform-tools")
        sys.exit(1)

    print(f"✓ Found adb at: {adb}")

    # Check if APK exists
    if not os.path.exists(APK_PATH):
        print(f"❌ APK not found at {APK_PATH}")
        print("   Building APK first...")
        if not run_command("./gradlew clean assembleDebug", "Building Android app"):
            sys.exit(1)

    print(f"✓ APK ready at: {APK_PATH}")

    # Check for connected devices
    print("\nChecking for connected devices...")
    result = subprocess.run([adb, "devices"], capture_output=True, text=True)
    print(result.stdout)

    if "no devices" in result.stdout.lower() or result.stdout.count("\n") < 3:
        print("⚠️  No devices detected. Please:")
        print("   1. Start an Android emulator, OR")
        print("   2. Connect a physical device via USB with debugging enabled")
        print("\nThen run this script again.")
        sys.exit(1)

    # Install APK
    print(f"\nInstalling APK...")
    result = subprocess.run([adb, "install", "-r", APK_PATH], capture_output=True, text=True)
    if "Success" in result.stdout:
        print("✓ APK installed successfully")
    else:
        print(f"❌ Installation failed:\n{result.stdout}\n{result.stderr}")
        sys.exit(1)

    # Launch app
    print(f"\nLaunching {PACKAGE_NAME}...")
    time.sleep(1)
    subprocess.run([adb, "shell", "am", "start", "-n", f"{PACKAGE_NAME}/.MainActivity"])

    print("\n✓ App launched!")
    print("   The app should appear on your device in a few seconds...")
    print("\nTo view logs:")
    print(f"   {adb} logcat | grep -E 'MainActivity|WebView|Error'")

if __name__ == "__main__":
    main()
