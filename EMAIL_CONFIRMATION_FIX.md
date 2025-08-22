# Email Confirmation Fix for Solo Leveling App

## Problem
The email confirmation links from Supabase are redirecting to `localhost:3000` instead of your React Native app, causing "access_denied" and "otp_expired" errors.

## Solution Implemented

### 1. Updated Supabase Configuration
- Enabled `detectSessionInUrl: true` in supabase client config
- Added proper storage configuration for session persistence

### 2. Updated Authentication Context
- Modified `signUp` function to include `emailRedirectTo: 'sololevelingapp://auth/confirm'`
- Added better logging for auth state changes

### 3. Created Deep Link Handler
- Added `DeepLinkHandler.tsx` component to handle email confirmation links
- Handles both initial app opening and runtime deep links
- Properly processes token_hash from confirmation URLs

### 4. Updated App Layout
- Integrated DeepLinkHandler into the main app layout

### 5. Improved Auth Screen
- Added better user feedback after signup
- Shows instruction to check email for confirmation

## Required Supabase Dashboard Configuration

**IMPORTANT**: You must update these settings in your Supabase dashboard:

1. Go to: https://supabase.com/dashboard/project/gzjgziopokzsaxlnnlzz/settings/auth
2. Update these fields:
   - **Site URL**: `sololevelingapp://`
   - **Redirect URLs**: Add `sololevelingapp://auth/confirm`

## Testing the Fix

1. **Build and install the app** (confirmation links don't work in Expo Go):
   ```
   npx expo run:android
   # or
   npx expo run:ios
   ```

2. **Test signup flow**:
   - Create a new account
   - Check your email for the confirmation link
   - Tap the link - it should now open your app and show success message

## Alternative Solution (If Deep Linking Still Doesn't Work)

If you continue having issues, you can implement email confirmation without clicking links:

1. **Add a manual confirmation screen**
2. **Ask user to enter the confirmation code from email**
3. **Use OTP verification instead of email links**

## Deep Link URL Scheme

Your app uses the scheme: `sololevelingapp://`

Confirmation links will now redirect to: `sololevelingapp://auth/confirm?token_hash=...`

## Files Modified

- `lib/supabase.ts` - Updated client configuration
- `contexts/AuthContext.tsx` - Added emailRedirectTo parameter
- `components/DeepLinkHandler.tsx` - New component for handling deep links
- `app/_layout.tsx` - Integrated DeepLinkHandler
- `components/AuthScreen.tsx` - Better user feedback
- `lib/emailConfirmation.ts` - Helper functions for testing

## Next Steps

1. Update Supabase dashboard settings (CRITICAL)
2. Build the app for testing (can't test in Expo Go)
3. Test the signup and email confirmation flow
4. If still having issues, we can implement the alternative OTP solution
