#!/bin/bash

echo "======================================"
echo "Starting NextGen QA - Component 4"
echo "Backend + Frontend + Inventory System"
echo "======================================"
echo ""

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Kill existing processes on ports if needed
echo "Checking for existing processes..."
if check_port 8004; then
    echo "⚠️  Port 8004 is already in use. Killing process..."
    kill $(lsof -t -i:8004) 2>/dev/null || true
    sleep 2
fi

if check_port 3000; then
    echo "⚠️  Port 3000 is already in use. Killing process..."
    kill $(lsof -t -i:3000) 2>/dev/null || true
    sleep 2
fi

echo ""
echo "Starting Backend Server (Port 8004)..."
echo "--------------------------------------"

# Start backend in background
cd component-4-quality
python3 -m uvicorn api.main:app --host 0.0.0.0 --port 8004 --reload &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to initialize..."
sleep 5

echo ""
echo "Starting Frontend Server (Port 3000)..."
echo "----------------------------------------"

# Start frontend in background
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "======================================"
echo "✓ Services Starting..."
echo "======================================"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Access Points:"
echo "  🌐 Frontend: http://localhost:3000"
echo "  🔧 Backend API: http://localhost:8004"
echo "  📊 API Docs: http://localhost:8004/docs"
echo ""
echo "Available Features:"
echo "  ✓ Dashboard - Overview & Analytics"
echo "  ✓ Inventory - Product Management (Sauce Labs style)"
echo "  ✓ Quality Prediction - ML-based test quality"
echo "  ✓ RTM - Requirements Traceability Matrix"
echo "  ✓ Coverage Gaps - Identify testing gaps"
echo ""
echo "Press Ctrl+C to stop all services"
echo "======================================"

# Wait for both processes
wait
