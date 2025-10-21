# Google OAuth Setup Guide

## Step-by-Step Instructions

### 1. Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Click "Select a project" at the top
3. Click "NEW PROJECT"
4. Enter project name: `Daily Routine Tracker`
5. Click "CREATE"

### 2. Configure OAuth Consent Screen

1. In the left menu: **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Click "CREATE"
4. Fill in the form:
   - App name: `Daily Routine Tracker`
   - User support email: (your email)
   - Developer contact: (your email)
5. Click "SAVE AND CONTINUE"
6. Skip "Scopes" - Click "SAVE AND CONTINUE"
7. Add test users: Add your email address
8. Click "SAVE AND CONTINUE"
9. Review and go back to dashboard

### 3. Create OAuth 2.0 Client ID

1. Go to **APIs & Services** > **Credentials**
2. Click "+ CREATE CREDENTIALS" at the top
3. Select "OAuth client ID"
4. Choose Application type: **Web application**
5. Name: `Daily Routine Tracker Web Client`
6. Under **Authorized JavaScript origins**:
   - Click "+ ADD URI"
   - Add: `http://localhost:5173`
7. **DO NOT add any Authorized redirect URIs** (leave empty)
8. Click "CREATE"
9. A popup appears with your Client ID - **COPY IT**
   - It looks like: `123456789-abcdefg.apps.googleusercontent.com`

### 4. Configure Your Project

1. Open the `.env` file in your project root
2. Replace the placeholder with your actual Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
   ```
3. Make sure there are NO quotes around the ID
4. Save the file

### 5. Restart Dev Server

1. Stop the running dev server (press Ctrl+C in terminal)
2. Start it again:
   ```bash
   npm run dev
   ```
3. Open http://localhost:5173 in your browser

### 6. Test Login

1. Click the "Sign in with Google" button
2. Choose your Google account
3. If prompted, click "Continue" to allow the app

## Common Issues

### Issue: "400: invalid_request"

**Cause:** Mismatch between configured origins and actual origin

**Solution:**
- Make sure the origin in Google Cloud Console is EXACTLY: `http://localhost:5173` (no trailing slash)
- Make sure you're accessing the app at `http://localhost:5173` (not a different port)
- Clear browser cache or try incognito mode
- Wait 2-3 minutes after saving changes in Google Cloud Console

### Issue: "Configuration Required" message

**Cause:** Client ID not loaded

**Solution:**
- Check `.env` file exists in project root (same level as package.json)
- Check the variable name is exactly: `VITE_GOOGLE_CLIENT_ID`
- Restart the dev server after creating/editing .env
- Check browser console for "Client ID configured: true"

### Issue: "Access Denied"

**Cause:** OAuth consent screen not configured or user not added as test user

**Solution:**
- Complete OAuth consent screen setup
- Add your email as a test user
- Make sure app is not in "Production" status (should be "Testing")

## Verification Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured with External type
- [ ] Your email added as test user
- [ ] OAuth 2.0 Client ID created
- [ ] Authorized JavaScript origin set to `http://localhost:5173`
- [ ] No redirect URIs configured
- [ ] Client ID copied to `.env` file correctly
- [ ] Dev server restarted after adding `.env`
- [ ] Accessing app at `http://localhost:5173`
- [ ] Browser console shows "Client ID configured: true"

## Still Having Issues?

Check the browser console (F12) for errors and messages. Look for:
- "Client ID configured: true" - means .env is loaded correctly
- "Client ID length: [number]" - should be around 60-80 characters
- Any Google OAuth error messages
