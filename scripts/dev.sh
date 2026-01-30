#!/bin/bash

# HelloYan Development Startup Script

set -e

echo "🚀 HelloYan Development Environment"
echo "===================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is installed
if command -v docker &> /dev/null; then
    echo -e "${YELLOW}Starting services with Docker Compose...${NC}"
    docker-compose up -d postgres redis
    
    # Wait for services to be ready
    echo "Waiting for services to be ready..."
    sleep 5
    
    echo -e "${GREEN}✓ Database and Redis started${NC}"
else
    echo -e "${RED}Docker is not installed${NC}"
    echo "Please install Docker or start PostgreSQL and Redis manually"
    exit 1
fi

# Check environment files
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local file...${NC}"
    cp .env.example .env.local
fi

if [ ! -f backend/.env ]; then
    echo -e "${YELLOW}Creating backend/.env file...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${YELLOW}Please configure backend/.env with your database credentials${NC}"
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install --silent
cd backend
npm install --silent
cd ..

# Generate Prisma client
echo -e "${YELLOW}Generating Prisma client...${NC}"
cd backend
npx prisma generate

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
npx prisma migrate dev --name init || npx prisma db push
cd ..

echo -e "${GREEN}✓ Setup completed${NC}"
echo ""

# Start services
echo "Starting development services..."
echo "Press Ctrl+C to stop all services"

# Start backend in background
echo -e "${YELLOW}Starting backend on port 3001...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Start frontend
echo -e "${YELLOW}Starting frontend on port 3000...${NC}"
npm run dev &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Stopping services...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    docker-compose down
    echo -e "${GREEN}✓ Services stopped${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Development environment ready!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001"
echo "API Docs: http://localhost:3001/api/v1/meta"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Wait for processes
wait
