# Google Drive API Setup

The app now saves kilometer data to Google Drive as a CSV file. You need to enable the Google Drive API to make this work.

## Enable Google Drive API

1. Go to https://console.cloud.google.com/
2. Select your project (Daily Routine Tracker)
3. Go to **"APIs & Services"** > **"Library"**
4. Search for **"Google Drive API"**
5. Click on it and click **"ENABLE"**
6. That's it!

## Update OAuth Consent Screen (if needed)

If you haven't already added the Drive scope:

1. Go to **"APIs & Services"** > **"OAuth consent screen"**
2. Click **"EDIT APP"**
3. Scroll to **"Scopes"**
4. Click **"ADD OR REMOVE SCOPES"**
5. Find and select:
   - `.../auth/drive.file` (View and manage Google Drive files created by this app)
6. Click **"UPDATE"**
7. Click **"SAVE AND CONTINUE"**

## How It Works

- When users login, they grant access to create/edit files in their Google Drive
- The app creates a file called `daily-run-tracker.csv` in their Drive
- Data is automatically saved every time they add/edit kilometers
- Data is automatically loaded when they login
- Users can see the CSV file in their Google Drive and download/backup it anytime

## CSV Format

```csv
Date,Kilometers
2025-01-15,5.2
2025-01-16,3.8
2025-01-17,6.0
```

Simple and portable!
