@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo   KEIBA AI を起動しています...
echo ========================================
start "KEIBA Backend"  cmd /k node server.js
start "KEIBA Frontend" cmd /k npm run dev
timeout /t 4 >nul
start http://localhost:5173/
echo ブラウザが開きます。少し待ってください。
timeout /t 2 >nul
exit
