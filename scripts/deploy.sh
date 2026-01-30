#!/bin/bash

# HelloYan Deployment Script
# This script helps deploy both frontend and backend to production

set -e

echo "🚀 HelloYan Deployment Script"
echo "================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check environment
check_environment() {
    echo -e "${YELLOW}Checking environment...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Node.js is not installed${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}npm is not installed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Environment check passed${NC}"
}

# Install dependencies
install_dependencies() {
    echo -e "${YELLOW}Installing dependencies...${NC}"
    
    # Frontend dependencies
    echo "Installing frontend dependencies..."
    npm install --silent
    
    # Backend dependencies
    echo "Installing backend dependencies..."
    cd backend
    npm install --silent
    cd ..
    
    echo -e "${GREEN}✓ Dependencies installed${NC}"
}

# Build frontend
build_frontend() {
    echo -e "${YELLOW}Building frontend...${NC}"
    npm run build
    echo -e "${GREEN}✓ Frontend built${NC}"
}

# Build backend
build_backend() {
    echo -e "${YELLOW}Building backend...${NC}"
    cd backend
    npm run build
    npx prisma generate
    cd ..
    echo -e "${GREEN}✓ Backend built${NC}"
}

# Run database migrations
migrate_database() {
    echo -e "${YELLOW}Running database migrations...${NC}"
    cd backend
    npx prisma migrate deploy
    cd ..
    echo -e "${GREEN}✓ Database migrated${NC}"
}

# Deploy to Vercel (Frontend)
deploy_vercel() {
    echo -e "${YELLOW}Deploying frontend to Vercel...${NC}"
    if command -v vercel &> /dev/null; then
        vercel --prod
        echo -e "${GREEN}✓ Frontend deployed to Vercel${NC}"
    else
        echo -e "${YELLOW}Vercel CLI not found. Install it with: npm i -g vercel${NC}"
    fi
}

# Deploy to Railway (Backend)
deploy_railway() {
    echo -e "${YELLOW}Deploying backend to Railway...${NC}"
    if command -v railway &> /dev/null; then
        cd backend
        railway up
        cd ..
        echo -e "${GREEN}✓ Backend deployed to Railway${NC}"
    else
        echo -e "${YELLOW}Railway CLI not found. Install it with: npm i -g railway${NC}"
    fi
}

# Main deployment flow
main() {
    check_environment
    install_dependencies
    build_frontend
    build_backend
    migrate_database
    
    echo ""
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}Build successful!${NC}"
    echo -e "${GREEN}================================${NC}"
    echo ""
    
    read -p "Deploy frontend to Vercel? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_vercel
    fi
    
    read -p "Deploy backend to Railway? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_railway
    fi
    
    echo ""
    echo -e "${GREEN}Deployment completed!${NC}"
}

# Run main function
main "$@"
