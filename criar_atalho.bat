@echo off
echo ========================================
echo Criando Atalho do EasyLink
echo ========================================
echo.

set "SCRIPT_DIR=%~dp0"
set "ICON_PATH=%SCRIPT_DIR%frontend\icon.ico"
set "TARGET_PATH=%SCRIPT_DIR%EasyLink.bat"
set "SHORTCUT_NAME=EasyLink"
set "DESKTOP_PATH=%USERPROFILE%\Desktop"

:: Verificar se o ícone existe
if not exist "%ICON_PATH%" (
    echo ERRO: Arquivo de icone nao encontrado: %ICON_PATH%
    pause
    exit /b 1
)

:: Verificar se o script principal existe
if not exist "%TARGET_PATH%" (
    echo ERRO: Script principal nao encontrado: %TARGET_PATH%
    pause
    exit /b 1
)

:: Criar atalho usando PowerShell
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP_PATH%\%SHORTCUT_NAME%.lnk'); $Shortcut.TargetPath = '%TARGET_PATH%'; $Shortcut.WorkingDirectory = '%SCRIPT_DIR%'; $Shortcut.IconLocation = '%ICON_PATH%'; $Shortcut.Description = 'EasyLink - Gerenciador de Links'; $Shortcut.Save()"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Atalho criado com sucesso!
    echo ========================================
    echo.
    echo Localizacao: %DESKTOP_PATH%\%SHORTCUT_NAME%.lnk
    echo.
) else (
    echo.
    echo ERRO: Falha ao criar atalho.
    echo.
)

pause


