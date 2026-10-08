@echo off
title CrediTrust AI - Explainable Credit Risk Management
echo ===================================================
echo Starting CrediTrust AI (Backend + Frontend)
echo ===================================================

echo [1/2] Starting Python ML & SHAP API Server on port 8000...
start "CrediTrust AI - Python API Server" cmd /k "cd /d "%~dp0" && python server.py"

echo [2/2] Starting React Vite Frontend on port 3000...
start "CrediTrust AI - Web Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

timeout /t 3 /nobreak >nul
echo.
echo Opening CrediTrust AI in your browser...
start http://localhost:3000/

echo ===================================================
echo Both servers are running!
echo - Web Frontend:  http://localhost:3000/
echo - Backend API:   http://localhost:8000/
echo ===================================================
pause
