#!/bin/bash

# Automated Installation Script for Component 4
# This script handles all dependencies and setup automatically

set -e

echo "========================================================"
echo "Component 4 - Automated Installation"
echo "ML-Based Test Quality Prediction & RTM"
echo "========================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check Python version
echo -e "${YELLOW}Checking Python version...${NC}"
python_version=$(python3 --version | cut -d' ' -f2)
echo "Python version: $python_version"

if [[ "$python_version" < "3.10" ]]; then
    echo -e "${RED}Error: Python 3.10+ is required${NC}"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
else
    echo -e "${GREEN}✓ Virtual environment already exists${NC}"
fi

# Activate virtual environment
echo -e "${YELLOW}Activating virtual environment...${NC}"
source venv/bin/activate

# Upgrade pip
echo -e "${YELLOW}Upgrading pip...${NC}"
pip install --upgrade pip

# Install system dependencies (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${YELLOW}Detected macOS - checking for PostgreSQL...${NC}"
    if ! command -v pg_config &> /dev/null; then
        echo -e "${YELLOW}PostgreSQL not found. Installing via Homebrew...${NC}"
        if command -v brew &> /dev/null; then
            brew install postgresql || {
                echo -e "${RED}Failed to install PostgreSQL via Homebrew${NC}"
                echo -e "${YELLOW}Continuing with alternative installation...${NC}"
            }
        else
            echo -e "${YELLOW}Homebrew not installed. Skipping PostgreSQL installation.${NC}"
        fi
    fi
fi

# Install requirements
echo -e "${YELLOW}Installing Python dependencies...${NC}"
echo "This may take 5-10 minutes for ML packages..."

# Try to install with pip
pip install -r requirements.txt || {
    echo -e "${RED}Some packages failed to install${NC}"
    echo -e "${YELLOW}Attempting fallback installation...${NC}"
    
    # Install without psycopg2 first
    grep -v psycopg2 requirements.txt > requirements_temp.txt
    pip install -r requirements_temp.txt
    rm requirements_temp.txt
    
    # Try psycopg2 separately
    pip install psycopg2-binary || {
        echo -e "${YELLOW}psycopg2-binary installation failed${NC}"
        echo -e "${YELLOW}You can use SQLite instead or install PostgreSQL manually${NC}"
    }
}

echo -e "${GREEN}✓ Dependencies installed${NC}"

# Download spaCy model
echo -e "${YELLOW}Downloading spaCy model...${NC}"
python -m spacy download en_core_web_sm || {
    echo -e "${YELLOW}Failed to download spaCy model - will retry later${NC}"
}

# Create necessary directories
echo -e "${YELLOW}Creating directory structure...${NC}"
mkdir -p saved_models datasets reports/output chromadb

# Set up .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}Please review .env and update database settings if needed${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Generate datasets
echo -e "${YELLOW}Generating sample datasets...${NC}"
python dataset/import_dataset.py || {
    echo -e "${RED}Dataset generation failed${NC}"
    echo -e "${YELLOW}You can run this manually later: python dataset/import_dataset.py${NC}"
}

# Train ML models
echo -e "${YELLOW}Training ML models...${NC}"
echo "This typically takes 5-10 minutes..."
python ml/train_quality_model.py || {
    echo -e "${RED}Model training failed${NC}"
    echo -e "${YELLOW}You can train manually later: python ml/train_quality_model.py${NC}"
}

echo ""
echo -e "${GREEN}========================================================"
echo "Installation Complete!"
echo "========================================================${NC}"
echo ""
echo "Next Steps:"
echo "1. Review .env file and update database settings if needed"
echo "2. If model training failed, run: python ml/train_quality_model.py"
echo "3. Start the backend: uvicorn api.main:app --host 0.0.0.0 --port 8004 --reload"
echo ""
echo "Access API docs at: http://localhost:8004/docs"
echo ""

# Offer to start the server
read -p "Do you want to start the backend server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Starting backend server...${NC}"
    uvicorn api.main:app --host 0.0.0.0 --port 8004 --reload
fi
