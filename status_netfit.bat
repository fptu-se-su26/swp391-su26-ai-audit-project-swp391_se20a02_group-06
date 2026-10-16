@echo off
title Kiem tra trang thai NetFit Backend va Ngrok
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0status_netfit.ps1"
pause
