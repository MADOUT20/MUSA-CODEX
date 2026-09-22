#!/bin/bash
# run_backend.sh - Start the MUSA CODEX backend
set -e

echo "🚀 Starting MUSA CODEX Backend..."

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
  echo "📦 Virtual environment not found. Creating one..."
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r backend/requirements.txt
else
  source .venv/bin/activate
fi

echo "🌐 Launching FastAPI server on port 8000..."
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
