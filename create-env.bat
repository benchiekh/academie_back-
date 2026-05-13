@echo off
echo Création du fichier .env pour Supabase...
echo.
echo Veuillez entrer vos informations Supabase :
echo.
set /p supabase_url="URL de votre projet Supabase (ex: https://votre-projet.supabase.co): "
set /p supabase_key="Clé ANON de votre projet Supabase: "
echo.
echo Création du fichier .env...
(
echo # Configuration Supabase
echo SUPABASE_URL="%supabase_url%"
echo SUPABASE_ANON_KEY="%supabase_key%"
echo.
echo # Configuration fallback
echo DATABASE_URL="postgresql://username:password@localhost:5432/academie_db"
echo JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
echo NODE_ENV="development"
echo PORT=3000
echo FRONTEND_URL="http://localhost:3001"
) > .env
echo.
echo ✅ Fichier .env créé avec succès !
echo.
echo Maintenant lancez: npm run start:dev
pause
