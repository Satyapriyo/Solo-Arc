@echo off
echo 🚀 Solo Leveling - Email Confirmation Deployment
echo ==============================================
echo.

REM Check if vercel is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

echo 🌐 Deploying to Vercel...
echo.

REM Deploy to production
vercel --prod

echo.
echo ✅ Deployment complete!
echo.
echo 📋 Next steps:
echo 1. Copy the deployment URL from above
echo 2. Go to your Supabase dashboard:
echo    https://supabase.com/dashboard/project/gzjgziopokzsaxlnnlzz/settings/auth
echo 3. Update Site URL and Redirect URLs with your new URL
echo 4. Update AuthContext.tsx with your new URL
echo.
echo 🎉 Then test the signup flow!
pause
