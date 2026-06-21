# Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth credentials so you can use "Continue with Google" in your application.

## Prerequisites
- A Google account.
- Access to the [Google Cloud Console](https://console.cloud.google.com/).

## Step 1: Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown in the top-left corner (next to the Google Cloud logo) and click **New Project**.
3. Enter a project name (e.g., `FitnessTrainingSystem`) and click **Create**.
4. Once created, make sure your new project is selected in the top-left dropdown.

## Step 2: Configure the OAuth Consent Screen
1. In the left-hand navigation menu, go to **APIs & Services** > **OAuth consent screen**.
2. Choose **External** (unless you are setting this up for an internal Google Workspace organization) and click **Create**.
3. Fill out the required fields:
   - **App name**: E.g., `Fitness Training System`
   - **User support email**: Select your email.
   - **Developer contact information**: Enter your email.
4. Click **Save and Continue**.
5. On the **Scopes** page, you don't need to add any special scopes for basic login. Just click **Save and Continue**.
6. On the **Test users** page, add any email addresses you want to use for testing while the app is unpublished. Click **Save and Continue**.
7. Review your settings and click **Back to Dashboard**.

## Step 3: Create OAuth Credentials
1. In the left-hand navigation menu, go to **APIs & Services** > **Credentials**.
2. Click the **+ CREATE CREDENTIALS** button at the top and select **OAuth client ID**.
3. Under **Application type**, select **Web application**.
4. Name your client (e.g., `React Frontend`).
5. Under **Authorized JavaScript origins**, click **ADD URI** and add your frontend's local development URL:
   - `http://localhost:5173` (or whatever port Vite is running on).
6. Under **Authorized redirect URIs**, you usually don't need this for `@react-oauth/google` because it handles the flow via pop-ups and Javascript. You can leave this blank or add `http://localhost:5173`.
7. Click **Create**.
8. A modal will pop up displaying your **Client ID** and **Client Secret**.
   - **Copy the Client ID**. This is what you will need for both the frontend and the backend. You do not strictly need the Client Secret for the ID token verification flow used in `@react-oauth/google`.

## Step 4: Configure Your Application
Now that you have your **Client ID**, you need to add it to your project:

### Frontend
Create a `.env` file in your `frontend` directory (or update the existing `.env.example`) and add:
```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
```

### Backend
Update your `backend/src/FitnessTrainingSystem.WebApi/appsettings.Development.json` (or use user secrets) to include the Client ID:
```json
{
  "GoogleAuth": {
    "ClientId": "your_client_id_here.apps.googleusercontent.com"
  }
}
```

That's it! Your application will now be able to securely authenticate users via Google.
