# Daily Routine Tracker

A React application for tracking daily kilometers with Google OAuth authentication and Google Drive sync. Optimized for EC2 deployment via Docker.

## Setup

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google OAuth2 API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - Your production domain (for EC2)
6. Add authorized redirect URIs:
   - `http://localhost:5173`
   - Your production domain
7. Copy the Client ID

### 2. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Google Client ID:

```
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

### 3. Development

```bash
npm install
npm run dev
```

## Docker Build & Push

**Important**: Build with environment variables:

```bash
# Build the image with Google Client ID
docker build --build-arg VITE_GOOGLE_CLIENT_ID=your-client-id-here -t your-dockerhub-username/routine-tracker:latest .

# Test locally
docker-compose up

# Push to Docker Hub
docker login
docker push your-dockerhub-username/routine-tracker:latest
```

## EC2 Deployment

```bash
# On EC2 instance
docker pull your-dockerhub-username/routine-tracker:latest
docker run -d -p 80:80 your-dockerhub-username/routine-tracker:latest
```

**Note**: Make sure to update your Google OAuth authorized origins to include your EC2 domain.

## Image Size

This setup uses:
- Multi-stage build to minimize final image size
- nginx:alpine base (minimal footprint)
- Production-only dependencies
- Optimized build output

Expected final image size: ~25-30MB
