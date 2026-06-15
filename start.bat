@echo off
cd /d "%~dp0"
start "Backend" cmd /k node server.js
start "Frontend" cmd /k npm run dev
timeout /t 4 >nul
start http://localhost:5173/
pause
