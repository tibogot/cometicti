@echo off
echo Killing Node processes...
taskkill /F /IM node.exe
echo Cleaning Vite cache...
rd /s /q "node_modules\.vite"
echo Cleaning completed!
pause
