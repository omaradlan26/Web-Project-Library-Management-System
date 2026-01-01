@echo off
SETLOCAL EnableExtensions

:: Add Node.js to PATH
SET "PATH=%PATH%;C:\Program Files\nodejs"

echo ===================================================
echo   Library Management System Launcher (Integrated)
echo ===================================================

:: Check Node
node --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is still not found.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Starting Server (Backend + Frontend)...
echo Open your browser to: http://localhost:5001
echo.
node backend/server.js
pause
