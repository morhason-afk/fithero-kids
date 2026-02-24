@echo off
cd /d "%~dp0"
echo Starting FitHero Kids...
echo Opening browser at http://localhost:3002
echo.
where npx >nul 2>nul
if errorlevel 1 (
  echo Node.js not found. Please install from https://nodejs.org and try again.
  pause
  exit /b 1
)
start /b cmd /c "ping -n 4 127.0.0.1 >nul && start http://localhost:3002"
npx -y serve@latest out -l 3002
echo.
pause
