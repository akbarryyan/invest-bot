@echo off
echo Starting Invest Bot Development Environment...
echo.

echo Starting Backend API...
start "Backend API" cmd /k "cd backend && python start_api.py"

echo.
echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Starting Bot Telegram...
start "Bot Telegram" cmd /k "cd backend && python start_bot.py"

echo.
echo Development environment started!
echo.
echo Backend API: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul
