# Frontend Deployment Guide

## Build for Production

### Prerequisites
- Node.js installed
- Environment variables configured

### Build Steps

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create production environment file
echo "VITE_API_URL=https://api.yourdomain.com/api" > .env.production

# Build for production
npm run build
```

This creates a `dist/` directory with optimized production files.

### Build Output

- **Location**: `frontend/dist/`
- **Optimizations**:
  - Code minification (Terser)
  - Tree shaking
  - Code splitting (vendor chunks)
  - Asset optimization
  - No sourcemaps in production

### Verify Build

```bash
# Preview production build locally
npm run preview

# Build output should be accessible at
# http://localhost:4173
```

---

## AWS S3 Static Website Hosting

### Step 1: Create S3 Bucket

1. AWS Console → S3 → Create bucket
2. **Bucket name**: `lms-frontend` (globally unique)
3. **Region**: Same as backend
4. **Uncheck** "Block all public access"
5. Click Create

### Step 2: Enable Static Website Hosting

1. Bucket → **Properties** → **Static website hosting**
2. Enable static website hosting
3. **Index document**: `index.html`
4. **Error document**: `index.html` (for React Router)
5. Save

### Step 3: Set Bucket Policy

1. Bucket → **Permissions** → **Bucket policy**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::lms-frontend/*"
    }
  ]
}
```

### Step 4: Upload Files

```bash
# Using AWS CLI
aws s3 sync dist/ s3://lms-frontend --delete

# Or using S3 Console
# Upload all files from dist/ directory
```

### Step 5: Access Website

- **S3 Website URL**: `http://lms-frontend.s3-website-region.amazonaws.com`
- Or configure custom domain in Route 53

---

## CloudFront Distribution (Recommended)

### Benefits
- Global CDN
- HTTPS (free SSL)
- Custom domain
- Better performance
- DDoS protection

### Setup Steps

1. **Create Distribution**
   - CloudFront Console → Create Distribution
   - **Origin Domain**: S3 bucket website endpoint
   - **Viewer Protocol**: Redirect HTTP to HTTPS
   - **Default Root Object**: `index.html`

2. **Configure Error Pages**
   - **403 Error** → `/index.html` (Status: 200)
   - **404 Error** → `/index.html` (Status: 200)
   - (Necessary for React Router)

3. **Custom Domain** (Optional)
   - Add alternate domain name
   - Request SSL certificate in Certificate Manager
   - Associate with distribution

### Update After Deployment

```bash
# After uploading new build
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

---

## Environment Variables

### Production (.env.production)
```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Development (.env.development)
```env
VITE_API_URL=http://localhost:5000/api
```

**Note**: Vite requires `VITE_` prefix for environment variables.

---

## Build Optimization

The production build includes:

- **Code Splitting**: Separate vendor chunks
- **Minification**: Terser minification
- **Tree Shaking**: Remove unused code
- **Asset Optimization**: Images and fonts
- **No Sourcemaps**: Reduced build size

### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev vite-bundle-visualizer

# Add to vite.config.js (optional)
import { visualizer } from 'vite-bundle-visualizer'

# Build with analysis
npm run build
```

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Production build successful (`npm run build`)
- [ ] Build tested locally (`npm run preview`)
- [ ] S3 bucket created and configured
- [ ] Bucket policy set for public access
- [ ] Files uploaded to S3
- [ ] CloudFront distribution created (optional)
- [ ] Error pages configured for React Router
- [ ] Custom domain configured (optional)
- [ ] SSL certificate configured (optional)
- [ ] Backend CORS updated with frontend URL
- [ ] API calls working from frontend

---

## Troubleshooting

### Build Fails
- Check Node.js version (v16+)
- Clear `node_modules` and reinstall
- Check for syntax errors in code

### Blank Page After Deployment
- Check CloudFront error pages configuration
- Verify index.html is in root of bucket
- Check browser console for errors
- Verify API URL in environment variables

### API Calls Failing
- Check CORS configuration in backend
- Verify API URL is correct
- Check browser network tab for errors
- Verify backend is accessible from frontend domain

---

**Frontend Deployment Complete! 🎉**
