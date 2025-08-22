#!/bin/bash

echo "🚀 Solo Leveling - Email Confirmation Deployment"
echo "=============================================="
echo

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🌐 Deploying to Vercel..."
echo

# Deploy to production
vercel --prod

echo
echo "✅ Deployment complete!"
echo
echo "📋 Next steps:"
echo "1. Copy the deployment URL from above"
echo "2. Go to your Supabase dashboard:"
echo "   https://supabase.com/dashboard/project/gzjgziopokzsaxlnnlzz/settings/auth"
echo "3. Update Site URL and Redirect URLs with your new URL"
echo "4. Update AuthContext.tsx with your new URL"
echo
echo "🎉 Then test the signup flow!"
