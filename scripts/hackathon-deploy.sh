#!/bin/bash

echo "🏥 MediHack - Hackathon Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_info "Starting MediHack deployment process..."

# Install dependencies
print_info "Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Setup demo environment
print_info "Setting up demo environment..."
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    print_status "Created .env.local from template"
    print_warning "Please add your OpenAI API key to .env.local"
else
    print_status ".env.local already exists"
fi

# Build the project
print_info "Building the project..."
npm run build
if [ $? -eq 0 ]; then
    print_status "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
print_info "Deploying to Vercel..."
vercel --prod
if [ $? -eq 0 ]; then
    print_status "Deployment successful!"
else
    print_error "Deployment failed"
    exit 1
fi

echo ""
echo "🎉 MediHack Deployment Complete!"
echo "================================="
print_status "Your hackathon project is now live!"
print_info "Local development: npm run dev"
print_info "Demo setup: npm run demo"
print_info "Presentation guide: ./public/demo-presentation.md"
print_info "Hackathon guide: ./HACKATHON_GUIDE.md"

echo ""
echo "🏆 Ready to win the hackathon!"
echo "Good luck! 🚀"