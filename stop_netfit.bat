@echo off
title Dung NetFit Backend va Ngrok
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0stop_netfit.ps1"
pause
