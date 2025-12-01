@echo off
echo Starting Complete Leave Management System...
echo.
echo This will start both backend and frontend servers.
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000
echo.
echo Make sure MongoDB is running before proceeding!
echo.
pause

echo Starting Backend...
start "Leave Management Backend" cmd /k "cd backend && npm install && npm start"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting Frontend...
start "Leave Management Frontend" cmd /k "cd frontend && npm install && npm start"

echo.
echo Both servers are starting...
echo Frontend will open automatically in your browser once ready.
echo.
pause