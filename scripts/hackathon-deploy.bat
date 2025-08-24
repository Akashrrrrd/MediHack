@echo off
echo 🏥 MediHack - Hackathon Deployment Script
echo ==========================================

echo ℹ️  Starting MediHack deployment process...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ package.json not found. Please run this script from the project root.
    exit /b 1
)

REM Install dependencies
echo ℹ️  Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)
echo ✅ Dependencies installed successfully

REM Setup demo environment
echo ℹ️  Setting up demo environment...
if not exist ".env.local" (
    copy .env.example .env.local
    echo ✅ Created .env.local from template
    echo ⚠️  Please add your OpenAI API key to .env.local
) else (
    echo ✅ .env.local already exists
)

REM Build the project
echo ℹ️  Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)
echo ✅ Build completed successfully

echo.
echo 🎉 MediHack Setup Complete!
echo =========================
echo ✅ Your hackathon project is ready!
echo ℹ️  Local development: npm run dev
echo ℹ️  Demo setup: npm run demo
echo ℹ️  Presentation guide: ./public/demo-presentation.md
echo ℹ️  Hackathon guide: ./HACKATHON_GUIDE.md

echo.
echo 🏆 Ready to win the hackathon!
echo Good luck! 🚀

pause