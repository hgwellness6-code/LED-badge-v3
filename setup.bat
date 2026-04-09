@echo off
echo.
echo ╔══════════════════════════════════════╗
echo ║   LED Badge S1144 — Setup Script     ║
echo ╚══════════════════════════════════════╝
echo.

:: Check for Node
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo  Node.js not found. Install it from https://nodejs.org ^(v18+^) and re-run.
    pause
    exit /b 1
)

for /f "tokens=1 delims=." %%v in ('node -e "process.stdout.write(process.versions.node)"') do set NODE_MAJOR=%%v
if %NODE_MAJOR% LSS 18 (
    echo  Node.js v18+ required. Please upgrade from https://nodejs.org
    pause
    exit /b 1
)

echo  Node.js found: 
node -v

echo.
echo  Installing dependencies...
call npm install

echo.
echo  Done! Run the app with:
echo.
echo     npm start              <- launch desktop app
echo     npm run build:win      <- build Windows installer
echo.
pause
