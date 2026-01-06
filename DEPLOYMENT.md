# Vercel Deployment Guide - Static Frontend Version

This branch contains a static frontend-only version of HomeFit that uses mock data, perfect for portfolio deployment on Vercel.

## Features

- ✅ **Static Build** - No backend required
- ✅ **Mock Data** - Pre-populated sample apartments, users, and data
- ✅ **Fully Functional UI** - All features work with mock data
- ✅ **Demo Accounts** - Test login credentials included

## Demo Accounts

### User Account
- **Email:** `demo@homefit.com`
- **Password:** `user123`
- **Type:** Regular User

### Admin Account
- **Email:** `admin@homefit.com`
- **Password:** `admin123`
- **Type:** Admin

### Broker Account
- **Email:** `broker@homefit.com`
- **Password:** `broker123`
- **Type:** Broker

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to project root:
```bash
cd /path/to/project
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts to configure your deployment.

### Option 2: Deploy via Vercel Dashboard

1. Push this branch to GitHub:
```bash
git add .
git commit -m "Add static frontend version for Vercel"
git push origin vercel-static-frontend
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Select the `vercel-static-frontend` branch
6. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`
7. Add Environment Variable:
   - `REACT_APP_USE_MOCK` = `true`
8. Click "Deploy"

### Option 3: Using vercel.json (Automatic)

The project includes a `vercel.json` configuration file that will automatically:
- Build from the `frontend` directory
- Use mock data (via `REACT_APP_USE_MOCK=true`)
- Configure routing for React Router

Simply connect your GitHub repo to Vercel and it will use these settings automatically.

## How It Works

### Mock API System

The static version uses an axios interceptor to intercept all API calls and return mock data:

1. **Mock Data** (`frontend/src/mockData/index.js`):
   - Sample apartments, users, preferences, etc.

2. **Mock API** (`frontend/src/mockData/mockAPI.js`):
   - Handles all API endpoints with simulated responses
   - Includes authentication state management
   - Simulates API delays for realism

3. **Axios Interceptor** (`frontend/src/axiosConfig.js`):
   - Automatically intercepts requests when `REACT_APP_USE_MOCK=true`
   - Routes requests to mock API handlers
   - Returns mock responses transparently

### Environment Variables

- **`REACT_APP_USE_MOCK=true`**: Enables mock data mode
- **`REACT_APP_API_URL`**: If set, uses real API instead of mocks

## Local Testing

To test the static version locally:

```bash
cd frontend
REACT_APP_USE_MOCK=true npm start
```

Or build and serve:

```bash
cd frontend
REACT_APP_USE_MOCK=true npm run build
npx serve -s build
```

## What's Included

### Mock Data
- 5 sample apartments with images
- User, Admin, and Broker accounts
- Sample preferences and saved listings
- Mock inquiries and tours

### Features That Work
- ✅ User authentication (mock)
- ✅ Apartment browsing and search
- ✅ Apartment details and images
- ✅ Preference-based matching
- ✅ Saved listings
- ✅ User profiles
- ✅ Broker dashboard (mock data)
- ✅ Admin dashboard (mock data)
- ✅ All UI components and navigation

### Features Not Included
- Real backend API calls
- File uploads (images show placeholders)
- Real-time data updates
- Database persistence
- Actual email/notifications

## Customization

To add more mock data:
1. Edit `frontend/src/mockData/index.js`
2. Add more apartments, users, etc.
3. Rebuild the project

To switch to real API:
1. Set `REACT_APP_USE_MOCK=false`
2. Set `REACT_APP_API_URL` to your API endpoint
3. Rebuild

## Troubleshooting

### Build Fails
- Make sure all dependencies are installed: `cd frontend && npm install`
- Check for TypeScript/ESLint errors
- Ensure `REACT_APP_USE_MOCK=true` is set during build

### Mock Data Not Loading
- Verify `REACT_APP_USE_MOCK=true` is set
- Check browser console for errors
- Ensure `axiosConfig.js` is being imported correctly

### Routing Issues on Vercel
- The `vercel.json` includes rewrite rules for React Router
- If issues persist, check Vercel's routing configuration

## Notes

- This is a **portfolio/demo version** - not for production use
- All data is client-side only and resets on page refresh
- Authentication state is stored in memory only
- Images use Unsplash placeholder URLs

