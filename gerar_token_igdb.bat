@echo off
set /p CLIENT_ID="Digite seu Client ID: "
set /p CLIENT_SECRET="Digite seu Client Secret: "

curl -X POST "https://id.twitch.tv/oauth2/token" ^
  -H "Content-Type: application/x-www-form-urlencoded" ^
  -d "client_id=%CLIENT_ID%" ^
  -d "client_secret=%CLIENT_SECRET%" ^
  -d "grant_type=client_credentials"

echo.
echo Pressione uma tecla para fechar...
pause >nul