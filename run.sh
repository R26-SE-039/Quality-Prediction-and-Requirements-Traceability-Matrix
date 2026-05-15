#!/bin/bash

# NextGen QA - Component 4 Automated Setup & Run Script
# Student: Rashani K.G.M (IT22182678)

set -e  # Exit on error

echo "========================================================"
echo "NextGen QA - Component 4 Setup"
echo "ML-Based Test Quality Prediction & RTM Generation"
echo "========================================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}Docker Compose is not installed. Please install it first.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Docker and Docker Compose found${NC}"
}

# Check if Python is installed
check_python() {
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}Python 3 is not installed. Please install Python 3.10+${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Python 3 found${NC}"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${YELLOW}Node.js not found. Frontend won't start without it.${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✓ Node.js found${NC}"
    return 0
}

# Start all services with Docker
start_with_docker() {
    echo ""
    echo "========================================================"
    echo "Starting all services with Docker Compose..."
    echo "========================================================"
    
    # Start services
    docker-compose up --build
    
    echo ""
    echo -e "${GREEN}========================================================"
    echo "All services started successfully!"
    echo "========================================================${NC}"
    echo ""
    echo "Access Points:"
    echo "  - Frontend Dashboard: http://localhost:3000"
    echo "  - Backend API:        http://localhost:8004"
    echo "  - API Docs:           http://localhost:8004/docs"
    echo ""
}

# Manual setup (without Docker for frontend)
manual_setup() {
    echo ""
    echo "========================================================"
    echo "Manual Setup Mode"
    echo "========================================================"
    
    # Start databases only
    echo -e "${YELLOW}Starting database services...${NC}"
    docker-compose up -d postgres redis neo4j
    
    echo "Waiting for databases to be ready (30 seconds)..."
    sleep 30
    
    # Set up backend
    echo ""
    echo -e "${YELLOW}Setting up backend...${NC}"
    cd component-4-quality
    
    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python3 -m venv venv
    fi
    
    echo "Activating virtual environment..."
    source venv/bin/activate
    
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
    
    echo "Generating datasets..."
    python dataset/import_dataset.py
    
    echo "Training ML models (this may take 5-10 minutes)..."
    python ml/train_quality_model.py
    
    echo -e "${GREEN}✓ Backend setup complete${NC}"
    
    cd ..
    
    # Set up frontend
    if check_node; then
        echo ""
        echo -e "${YELLOW}Setting up frontend...${NC}"
        cd frontend
        
        if [ ! -d "node_modules" ]; then
            echo "Installing Node dependencies..."
            npm install
        fi
        
        echo -e "${GREEN}✓ Frontend setup complete${NC}"
        cd ..
    fi
    
    echo ""
    echo "========================================================"
    echo "Setup Complete!"
    echo "========================================================"
    echo ""
    echo "To start the system:"
    echo ""
    echo "1. Start backend (in terminal 1):"
    echo "   cd component-4-quality"
    echo "   source venv/bin/activate"
    echo "   uvicorn api.main:app --host 0.0.0.0 --port 8004 --reload"
    echo ""
    echo "2. Start frontend (in terminal 2, if Node.js installed):"
    echo "   cd frontend"
    echo "   npm start"
    echo ""
    echo "3. Access:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend API: http://localhost:8004"
    echo "   - API Docs: http://localhost:8004/docs"
    echo ""
}

# Show menu
show_menu() {
    echo ""
    echo "Choose setup mode:"
    echo "1. Docker Compose (Recommended - Everything automated)"
    echo "2. Manual Setup (For development)"
    echo "3. Just start databases"
    echo ""
    read -p "Enter choice [1-3]: " choice
    
    case $choice in
        1)
            check_docker
            start_with_docker
            ;;
        2)
            check_python
            manual_setup
            ;;
        3)
            check_docker
            echo "Starting databases only..."
            docker-compose up -d postgres redis neo4j
            echo "Databases started!"
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            exit 1
            ;;
    esac
}

# Main execution
main() {
    echo ""
    echo "System Requirements Check..."
    echo ""
    
    show_menu
}

# Run main function
main
