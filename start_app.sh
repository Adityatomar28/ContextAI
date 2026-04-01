#!/bin/bash

# Start Backend
echo "Starting FastAPI Backend..."
./.venv/bin/pip3.11 install -q -r backend/requirements.txt
cd backend
../.venv/bin/python3.11 -m uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

# Start Frontend
echo "Starting Next.js Frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Both systems started!"
echo "Frontend: http://localhost:3000"
echo "Backend API: https://contextai-z4py.onrender.com"
echo "Press Ctrl+C to stop both."

wait $BACKEND_PID
wait $FRONTEND_PID
