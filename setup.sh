#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}${BOLD}║       AIApplyMate — Quick Setup          ║${NC}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════╝${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}✗ Node.js 18+ is required. You have $(node -v). Please upgrade.${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Node.js $(node -v) detected"

# Check MongoDB
if command -v mongod &> /dev/null || command -v mongosh &> /dev/null; then
    echo -e "${GREEN}✓${NC} MongoDB detected"
else
    echo -e "${YELLOW}⚠ MongoDB not found locally. You can:"
    echo -e "  1. Install MongoDB: https://www.mongodb.com/docs/manual/installation/"
    echo -e "  2. Use MongoDB Atlas (free): https://www.mongodb.com/cloud/atlas"
    echo -e "  Either way, you'll need a connection string.${NC}"
fi

# Gemini API Key
echo ""
echo -e "${BLUE}${BOLD}🔑 Google Gemini API Key${NC}"
echo -e "   Get a free key at: ${BOLD}https://aistudio.google.com/app/apikey${NC}"
echo ""

if [ -f "autoapply-backend/.env" ] && grep -q "GEMINI_API_KEY=." "autoapply-backend/.env"; then
    echo -e "${GREEN}✓${NC} Existing .env with GEMINI_API_KEY found"
    read -p "   Keep existing config? (Y/n): " KEEP_ENV
    KEEP_ENV=${KEEP_ENV:-Y}
else
    KEEP_ENV="n"
fi

if [[ "$KEEP_ENV" =~ ^[Nn]$ ]]; then
    read -p "   Enter your Gemini API key: " GEMINI_KEY

    if [ -z "$GEMINI_KEY" ]; then
        echo -e "${RED}✗ API key is required for AI features. You can add it later in autoapply-backend/.env${NC}"
        GEMINI_KEY="YOUR_GEMINI_API_KEY_HERE"
    fi

    read -p "   MongoDB URI (press Enter for localhost default): " MONGO_URI
    MONGO_URI=${MONGO_URI:-mongodb://localhost:27017/aiapplymate}

    cat > autoapply-backend/.env << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=$MONGO_URI
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRE=7d
GEMINI_API_KEY=$GEMINI_KEY
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
MAX_DAILY_APPLICATIONS=50
AUTO_APPLY_INTERVAL=3600000
EOF

    echo -e "${GREEN}✓${NC} Backend .env created"
fi

# Install dependencies
echo ""
echo -e "${BLUE}${BOLD}📦 Installing dependencies...${NC}"

echo -e "   Installing backend dependencies..."
cd autoapply-backend && npm install --silent 2>&1 | tail -1
cd ..

echo -e "   Installing frontend dependencies..."
cd app && npm install --silent 2>&1 | tail -1
cd ..

echo -e "${GREEN}✓${NC} All dependencies installed"

# Create uploads directory
mkdir -p autoapply-backend/uploads

# Start instructions
echo ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}${BOLD}║          ✅ Setup Complete!               ║${NC}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BOLD}To start the app, run these in two separate terminals:${NC}"
echo ""
echo -e "  ${YELLOW}Terminal 1 (Backend):${NC}"
echo -e "  cd autoapply-backend && npm run dev"
echo ""
echo -e "  ${YELLOW}Terminal 2 (Frontend):${NC}"
echo -e "  cd app && npm run dev"
echo ""
echo -e "  Then open ${BOLD}http://localhost:5173${NC} in your browser."
echo ""
echo -e "  ${BLUE}Or start both at once:${NC}"
echo -e "  cd autoapply-backend && npm run dev & cd app && npm run dev"
echo ""

# Offer to start now
read -p "Start both servers now? (Y/n): " START_NOW
START_NOW=${START_NOW:-Y}

if [[ "$START_NOW" =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${GREEN}🚀 Starting AIApplyMate...${NC}"
    echo -e "   Backend: http://localhost:5000"
    echo -e "   Frontend: http://localhost:5173"
    echo ""
    cd autoapply-backend && npm run dev &
    BACKEND_PID=$!
    cd app && npm run dev &
    FRONTEND_PID=$!

    echo ""
    echo -e "${GREEN}${BOLD}Both servers are running!${NC}"
    echo -e "Open ${BOLD}http://localhost:5173${NC} in your browser."
    echo -e "Press Ctrl+C to stop both servers."

    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
    wait
fi
