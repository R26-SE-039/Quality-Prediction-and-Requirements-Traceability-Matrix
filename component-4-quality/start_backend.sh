#!/bin/bash

# Automated Backend Startup Script
# This script starts the Component 4 backend with all dependencies

set -e

echo "========================================================"
echo "Component 4 - Backend Startup"
echo "ML-Based Test Quality Prediction & RTM"
echo "========================================================"
echo ""

# Activate virtual environment
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    echo "✓ Virtual environment activated"
else
    echo "✗ Virtual environment not found. Please run install.sh first"
    exit 1
fi

# Check if models exist
if [ ! -f "saved_models/quality_scorer.pkl" ]; then
    echo "✗ ML models not found. Training now..."
    python ml/train_quality_model.py
else
    echo "✓ ML models found"
fi

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

# Start the backend
echo ""
echo "Starting backend server on port 8004..."
echo "Access API docs at: http://localhost:8004/docs"
echo "Press CTRL+C to stop"
echo ""

uvicorn api.main:app --host 0.0.0.0 --port 8004 --reload
