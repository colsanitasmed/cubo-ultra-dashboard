@echo off
echo ===================================================
echo   INICIANDO SERVIDOR SEGURO CONTRATOS 360
echo ===================================================
echo.
echo Verificando e instalando Flask (libreria web)...
pip install Flask

echo.
echo Iniciando el Back-End Seguro...
python server.py
pause
