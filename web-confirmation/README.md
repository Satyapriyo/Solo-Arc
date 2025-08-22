# 🚀 Solo Leveling App - Email Confirmation Setup

## 📁 Deployment Steps

### Step 1: Deploy to Vercel (Free)

1. **Install Vercel CLI** (if you haven't already):
```bash
npm install -g vercel
```

2. **Deploy the confirmation page**:
```bash
cd web-confirmation
vercel --prod
```

3. **Follow the prompts**:
   - "Set up and deploy"? → **Y**
   - "Which scope"? → Choose your account
   - "Link to existing project"? → **N** 
   - "Project name"? → **solo-leveling-confirmation** (or any name you like)
   - "In which directory is your code located"? → **./** (current directory)

4. **Get your URL**: After deployment, you'll get a URL like:
   ```
   https://solo-leveling-confirmation.vercel.app
   ```

### Step 2: Update Supabase Settings

1. **Go to your Supabase Dashboard**:
   https://supabase.com/dashboard/project/gzjgziopokzsaxlnnlzz/settings/auth

2. **Update these fields**:
   - **Site URL**: `https://your-deployed-url.vercel.app`
   - **Redirect URLs**: Add `https://your-deployed-url.vercel.app`

### Step 3: Update Your App Code

The AuthContext is already configured with a placeholder. Update it with your real Vercel URL:

```typescript
emailRedirectTo: 'https://your-actual-vercel-url.vercel.app'
```

## 🎯 How It Works

1. **User signs up** in your app
2. **Gets email** with confirmation link
3. **Clicks link** → Opens web page
4. **Web page detects** mobile/desktop
5. **Automatically opens** your app with deep link
6. **App handles** the confirmation tokens
7. **User is confirmed** and can use the app!

## 🧪 Testing Flow

1. **Deploy the page**
2. **Update Supabase settings**
3. **Build your app**: `npx expo run:android`
4. **Test signup** with real email
5. **Check email** and click link
6. **Should open your app** automatically!

## 🔧 Troubleshooting

### If the web page doesn't open the app:
1. Make sure your app is built (not just Expo Go)
2. Check that the deep link scheme matches (`sololevelingapp://`)
3. Verify Supabase redirect URLs are correct

### If you get deployment errors:
1. Make sure you're in the `web-confirmation` directory
2. Check your Vercel account limits
3. Try `vercel login` first if authentication fails

## 📱 Mobile vs Desktop Behavior

- **Mobile**: Automatically tries to open your app
- **Desktop**: Shows buttons to download/open app
- **Fallback**: Always shows manual open button

## 🎨 Customization

The web page is fully customizable:
- Colors match your app theme
- Animated background
- Responsive design
- Loading states
- Error handling

You can modify the `index.html` file to match your branding!

---

**Next Step**: Run the deployment command and get your Vercel URL! 🚀
