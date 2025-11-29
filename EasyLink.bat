@echo off
echo ========================================
echo Iniciando EasyLink
echo ========================================
echo.

echo Iniciando servidor backend...
start "EasyLink Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Iniciando servidor frontend...
start "EasyLink Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo Servidores iniciados!
echo ========================================
echo.
echo Backend: http://localhost:3018
echo Frontend: http://localhost:3017
echo.
echo Abrindo navegador...

start http://localhost:3017

