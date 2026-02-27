@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo    AIApplyMate — Quick Setup (Windows)
echo ========================================
echo.

:: Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [X] Node.js is not installed. Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=1 delims=v." %%a in ('node -v') do set NODE_MAJOR=%%a
echo [OK] Node.js detected

:: Check MongoDB
where mongod >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] MongoDB detected
) else (
    echo [!] MongoDB not found locally. You can:
    echo     1. Install MongoDB: https://www.mongodb.com/docs/manual/installation/
    echo     2. Use MongoDB Atlas (free): https://www.mongodb.com/cloud/atlas
)

:: Gemini API Key
echo.
echo --- Google Gemini API Key ---
echo Get a free key at: https://aistudio.google.com/app/apikey
echo.

if exist "autoapply-backend\.env" (
    findstr /C:"GEMINI_API_KEY=" "autoapply-backend\.env" >nul 2>nul
    if !ERRORLEVEL! equ 0 (
        echo [OK] Existing .env with GEMINI_API_KEY found
        set /p KEEP_ENV="Keep existing config? (Y/n): "
        if /i "!KEEP_ENV!"=="" set KEEP_ENV=Y
    ) else (
        set KEEP_ENV=n
    )
) else (
    set KEEP_ENV=n
)

if /i "!KEEP_ENV!"=="n" (
    set /p GEMINI_KEY="Enter your Gemini API key: "
    if "!GEMINI_KEY!"=="" (
        echo [!] No key entered. You can add it later in autoapply-backend\.env
        set GEMINI_KEY=YOUR_GEMINI_API_KEY_HERE
    )

    set /p MONGO_URI="MongoDB URI (press Enter for localhost default): "
    if "!MONGO_URI!"=="" set MONGO_URI=mongodb://localhost:27017/aiapplymate

    (
        echo PORT=5000
        echo NODE_ENV=development
        echo MONGODB_URI=!MONGO_URI!
        echo JWT_SECRET=change-this-to-a-random-string-%RANDOM%%RANDOM%%RANDOM%
        echo JWT_EXPIRE=7d
        echo GEMINI_API_KEY=!GEMINI_KEY!
        echo FRONTEND_URL=http://localhost:5173
        echo MAX_FILE_SIZE=5242880
        echo UPLOAD_PATH=./uploads
        echo MAX_DAILY_APPLICATIONS=50
        echo AUTO_APPLY_INTERVAL=3600000
    ) > autoapply-backend\.env

    echo [OK] Backend .env created
)

:: Install dependencies
echo.
echo Installing backend dependencies...
cd autoapply-backend
call npm install
cd ..

echo.
echo Installing frontend dependencies...
cd app
call npm install
cd ..

:: Create uploads directory
if not exist "autoapply-backend\uploads" mkdir autoapply-backend\uploads

echo.
echo ========================================
echo        Setup Complete!
echo ========================================
echo.
echo To start the app, open TWO terminals:
echo.
echo   Terminal 1 (Backend):
echo     cd autoapply-backend
echo     npm run dev
echo.
echo   Terminal 2 (Frontend):
echo     cd app
echo     npm run dev
echo.
echo Then open http://localhost:5173 in your browser.
echo.

set /p START_NOW="Start both servers now? (Y/n): "
if /i "%START_NOW%"=="" set START_NOW=Y

if /i "%START_NOW%"=="Y" (
    echo.
    echo Starting AIApplyMate...
    echo   Backend: http://localhost:5000
    echo   Frontend: http://localhost:5173
    echo.
    start "AIApplyMate Backend" cmd /k "cd autoapply-backend && npm run dev"
    start "AIApplyMate Frontend" cmd /k "cd app && npm run dev"
    echo Both servers starting in new windows.
    echo Open http://localhost:5173 in your browser.
    echo.
)

pause
