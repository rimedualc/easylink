@echo off
echo ========================================
echo Instalando dependencias do EasyLink
echo ========================================
echo.

echo [1/2] Instalando dependencias do Backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Erro ao instalar dependencias do backend!
    pause
    exit /b 1
)
cd ..

echo.
echo [2/2] Instalando dependencias do Frontend...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Erro ao instalar dependencias do frontend!
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Instalacao concluida com sucesso!
echo ========================================
echo.
echo O banco de dados sera criado automaticamente na primeira execucao.
echo.
pause

