#!/bin/bash

# Exercise Game App - Deployment Helper Script

echo "🎮 Exercise Game App - Deployment Helper"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Build the app
echo "📦 Building the app..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Ask which deployment method
echo "Choose deployment method:"
echo "1) Deploy to Vercel (Recommended - Free, HTTPS, Easy)"
echo "2) Deploy to Netlify (Free, HTTPS)"
echo "3) Run production server locally"
echo "4) Create shareable zip file"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        vercel
        ;;
    2)
        echo ""
        echo "🚀 Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        netlify deploy --prod
        ;;
    3)
        echo ""
        echo "🚀 Starting production server..."
        echo "App will be available at: http://localhost:3000"
        npm start
        ;;
    4)
        echo ""
        echo "📦 Creating shareable zip file..."
        cd ..
        zip -r exercise-game-app-shareable.zip exercise-game-app \
            -x "exercise-game-app/.git/*" \
            -x "exercise-game-app/node_modules/*" \
            -x "exercise-game-app/.next/*" \
            -x "exercise-game-app/*.log" \
            -x "exercise-game-app/.DS_Store"
        echo "✅ Created: exercise-game-app-shareable.zip"
        echo "Share this file with others!"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
