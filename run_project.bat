@echo off
SETLOCAL EnableExtensions

:: Add Node.js to PATH for this session
SET "PATH=%PATH%;C:\Program Files\nodejs"

echo ===================================================
echo   Library Management System Launcher
echo ===================================================

:: Check if Node is available now
node --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is still not found.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo [1/2] Starting Backend Server...
start "Library Backend (Do not close)" cmd /k "node backend/server.js"

echo.
echo [2/2] Starting Frontend Server...
start "Library Frontend (Do not close)" cmd /k "npx http-server frontend -p 8081"

echo.
echo ===================================================
echo   Application started!
echo   Frontend: http://localhost:8081
echo   Backend:  http://localhost:5001
echo ===================================================
echo.
pause
