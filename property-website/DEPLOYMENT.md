# Vercel Deployment Guide

## Quick Deploy

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Production Deploy**:
   ```bash
   vercel --prod
   ```

## GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will automatically detect it's a React app and configure it
5. Deploy!

## Environment Variables

The app is pre-configured to use `https://nextdealappserver.onrender.com/api/v1` as the API URL.

To override, add in Vercel dashboard:
- `REACT_APP_API_URL` = `https://your-api-url.com/api/v1`

## Build Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

## Features Included

✅ Vercel configuration (`vercel.json`)
✅ Proper routing for SPA
✅ Static asset optimization
✅ Environment variable support
✅ Build optimization
✅ SEO meta tags
✅ Mobile responsive design

## Troubleshooting

- If build fails, check Node.js version (requires 18+)
- Ensure all dependencies are in `package.json`
- Check environment variables are set correctly
- Verify API endpoints are accessible

## Support

For issues, check:
1. Vercel deployment logs
2. Browser console for errors
3. Network tab for API calls
