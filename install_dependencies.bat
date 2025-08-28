@echo off
echo ========================================
echo    Invest Bot - Install Dependencies
echo ========================================
echo.

echo Choose installation method:
echo 1. Standard installation (recommended)
echo 2. Windows-friendly installation
echo 3. Minimal installation (for testing)
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Installing standard dependencies...
    cd backend
    pip install -r requirements.txt
) else if "%choice%"=="2" (
    echo.
    echo Installing Windows-friendly dependencies...
    cd backend
    pip install -r requirements_windows.txt
) else if "%choice%"=="3" (
    echo.
    echo Installing minimal dependencies...
    cd backend
    pip install python-telegram-bot fastapi uvicorn sqlalchemy pymysql python-dotenv
) else (
    echo Invalid choice. Using standard installation...
    cd backend
    pip install -r requirements.txt
)

echo.
if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully!
    echo.
    echo Next steps:
    echo 1. Copy backend/env_example.txt to backend/.env
    echo 2. Update .env with your bot token and database credentials
    echo 3. Setup MySQL database
    echo 4. Run start_development.bat to start all services
) else (
    echo ❌ Installation failed with error code %errorlevel%
    echo.
    echo Troubleshooting tips:
    echo - Try updating pip: python -m pip install --upgrade pip
    echo - Try using Windows-friendly requirements: pip install -r requirements_windows.txt
    echo - Check if you have Visual Studio Build Tools installed
)

echo.
pause
