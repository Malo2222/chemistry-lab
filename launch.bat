@echo off
echo Starting the project...
cd /d %~dp0

echo Installing dependencies...
npm install
if %ERRORLEVEL% NEQ 0 (
  echo Error installing dependencies
  pause
  exit /b %ERRORLEVEL%
)

echo Starting development server...
npm run dev
if %ERRORLEVEL% NEQ 0 (
  echo Error starting development server
  pause
  exit /b %ERRORLEVEL%
)

pause