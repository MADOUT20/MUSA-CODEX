#!/bin/bash
export PYTHONPATH=$(pwd)
nohup python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 > backend/server.log 2>&1 &
PID=$!
sleep 7

echo "Testing POST..."
curl -s -X POST "http://localhost:8000/api/complaint"      -H "Content-Type: application/json"      -d '{"text": "Testing the backend connection", "category": "Test", "urgency": "Low"}' > post_res.json
cat post_res.json

TOKEN=$(jq -r '.tracking_token' post_res.json)
echo "Token: $TOKEN"

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo "Testing GET..."
    curl -s -X GET "http://localhost:8000/api/complaint/$TOKEN" > get_res.json
    cat get_res.json

    echo "Testing PATCH..."
    curl -s -X PATCH "http://localhost:8000/api/complaint/$TOKEN/status"          -H "Content-Type: application/json"          -d '{"status": "UNDER_REVIEW"}' > patch_res.json
    cat patch_res.json

    echo "Testing FINAL GET..."
    curl -s -X GET "http://localhost:8000/api/complaint/$TOKEN" > final_res.json
    cat final_res.json
else
    echo "POST failed to return a token."
fi

kill $PID
