@echo off
title Khoi dong NetFit Backend va Ngrok
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run_background.ps1"
pause
