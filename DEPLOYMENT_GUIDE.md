# Deployment Guide

## Overview

This guide covers deploying the Leave Management System to production using:
- **Frontend**: AWS S3 + CloudFront
- **Backend**: AWS EC2 with Docker

---

## Prerequisites

- AWS account with appropriate permissions
- AWS CLI installed and configured
- Docker installed locally
- MongoDB Atlas account with production cluster
- Domain name (optional but recommended)

---

## Part 1: Backend Deployment (AWS EC2)

### Step 1: Prepare EC2 Instance

1. **Launch EC2 Instance**
   - Instance type: `t2.micro` or `t2.small` (for production, consider `t3.medium`)
   - OS: Ubuntu Server 22.04 LTS
   - Configure security group:
     - Inbound: Port 22 (SSH), Port 5000 (Backend API), Port 80 (HTTP), Port 443 (HTTPS)
   - Create/assign key pair for SSH access

2. **Connect to EC2 Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Docker on EC2**
   ```bash
   # Update system
   sudo apt update

   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

   # Add user to docker group
   sudo usermod -aG docker ubuntu

   # Log out and log back in for changes to take effect
   ```

4. **Install Docker Compose (optional)**
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

### Step 2: Prepare Backend Docker Image

1. **Create Dockerfile in backend directory**
   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   # Copy package files
   COPY package*.json ./

   # Install dependencies
   RUN npm ci --only=production

   # Copy application code
   COPY . .

   # Expose port
   EXPOSE 5000

   # Start application
   CMD ["node", "src/server.js"]
   ```

2. **Create .dockerignore**
   ```
   node_modules
   npm-debug.log
   .env
   .git
   .gitignore
   README.md
   tests
   .env.example
   ```

3. **Build Docker image locally (optional)**
   ```bash
   cd backend
   docker build -t lms-backend:latest .
   ```

### Step 3: Deploy to EC2

**Option A: Using Docker Hub**

1. **Push image to Docker Hub**
   ```bash
   docker tag lms-backend:latest your-dockerhub-username/lms-backend:latest
   docker push your-dockerhub-username/lms-backend:latest
   ```

2. **On EC2, pull and run**
   ```bash
   docker pull your-dockerhub-username/lms-backend:latest
   
   docker run -d \
     --name lms-backend \
     -p 5000:5000 \
     -e MONGODB_URI="your_mongodb_atlas_connection_string" \
     -e JWT_SECRET="your_super_secret_jwt_key" \
     -e NODE_ENV="production" \
     -e PORT="5000" \
     -e CORS_ORIGIN="https://your-frontend-domain.com" \
     --restart unless-stopped \
     your-dockerhub-username/lms-backend:latest
   ```

**Option B: Direct Deployment**

1. **Copy files to EC2**
   ```bash
   scp -i your-key.pem -r backend/ ubuntu@your-ec2-ip:/home/ubuntu/
   ```

2. **SSH into EC2 and build**
   ```bash
   cd /home/ubuntu/backend
   docker build -t lms-backend:latest .
   
   docker run -d \
     --name lms-backend \
     -p 5000:5000 \
     -e MONGODB_URI="your_mongodb_atlas_connection_string" \
     -e JWT_SECRET="your_super_secret_jwt_key" \
     -e NODE_ENV="production" \
     -e PORT="5000" \
     -e CORS_ORIGIN="https://your-frontend-domain.com" \
     --restart unless-stopped \
     lms-backend:latest
   ```

### Step 4: Set Up Nginx Reverse Proxy (Recommended)

1. **Install Nginx**
   ```bash
   sudo apt install nginx -y
   ```

2. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/lms-backend
   ```

3. **Add configuration**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

4. **Enable site and restart Nginx**
   ```bash
   sudo ln -s /etc/nginx/sites-available/lms-backend /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Set up SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d api.yourdomain.com
   ```

---

## Part 2: Frontend Deployment (AWS S3 + CloudFront)

### Step 1: Build React Application

```bash
cd frontend
npm install
npm run build
```

This creates a `build/` directory with production-ready files.

### Step 2: Create S3 Bucket

1. **Create S3 bucket**
   ```bash
   aws s3 mb s3://your-lms-frontend-bucket
   ```

2. **Configure bucket for static website hosting**
   - Go to S3 Console → Your bucket → Properties
   - Enable "Static website hosting"
   - Set index document: `index.html`
   - Set error document: `index.html` (for React Router)

3. **Set bucket policy (make public for CloudFront)**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-lms-frontend-bucket/*"
       }
     ]
   }
   ```

4. **Upload build files**
   ```bash
   aws s3 sync build/ s3://your-lms-frontend-bucket --delete
   ```

### Step 3: Set Up CloudFront Distribution

1. **Create CloudFront distribution**
   - Origin: S3 bucket (your-lms-frontend-bucket)
   - Origin access: Use OAC (Origin Access Control) for security
   - Default root object: `index.html`
   - Viewer protocol policy: Redirect HTTP to HTTPS
   - Allowed HTTP methods: GET, HEAD, OPTIONS
   - Caching behavior: Optimize for performance

2. **Configure error pages**
   - 403: `/index.html` (200 status)
   - 404: `/index.html` (200 status)
   (Necessary for React Router to work)

3. **Custom domain (optional)**
   - Add alternate domain name: `app.yourdomain.com`
   - Request SSL certificate in AWS Certificate Manager
   - Associate certificate with CloudFront

### Step 4: Update Frontend Environment Variables

1. **Update .env.production**
   ```env
   REACT_APP_API_URL=https://api.yourdomain.com/api
   REACT_APP_ENV=production
   ```

2. **Rebuild and redeploy**
   ```bash
   npm run build
   aws s3 sync build/ s3://your-lms-frontend-bucket --delete
   ```

3. **Invalidate CloudFront cache**
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id YOUR_DISTRIBUTION_ID \
     --paths "/*"
   ```

---

## Part 3: MongoDB Atlas Configuration

### Step 1: Production Cluster Setup

1. **Create production cluster** (M10 or higher recommended)
2. **Configure network access**
   - Add EC2 instance IP address
   - Or allow `0.0.0.0/0` (less secure, but easier)

3. **Configure database user**
   - Create dedicated user for production
   - Use strong password

4. **Get connection string**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/lms?retryWrites=true&w=majority
   ```

### Step 2: Environment Variables

Update your EC2 Docker container with MongoDB connection string:
```bash
docker stop lms-backend
docker rm lms-backend

docker run -d \
  --name lms-backend \
  -p 5000:5000 \
  -e MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/lms?retryWrites=true&w=majority" \
  -e JWT_SECRET="your_production_jwt_secret_min_32_chars" \
  -e NODE_ENV="production" \
  -e PORT="5000" \
  -e CORS_ORIGIN="https://app.yourdomain.com" \
  --restart unless-stopped \
  lms-backend:latest
```

---

## Part 4: Domain Configuration

### DNS Settings

1. **Backend API (api.yourdomain.com)**
   - Type: A record
   - Value: EC2 instance public IP
   - Or use CloudFront distribution domain

2. **Frontend (app.yourdomain.com)**
   - Type: CNAME
   - Value: CloudFront distribution domain name

---

## Part 5: Monitoring and Maintenance

### 1. Set Up CloudWatch (Optional)

Monitor EC2 instance metrics:
- CPU utilization
- Memory usage
- Network traffic

### 2. Application Logs

View Docker container logs:
```bash
docker logs lms-backend
docker logs -f lms-backend  # Follow logs
```

### 3. Update Application

```bash
# Stop container
docker stop lms-backend

# Pull new image or rebuild
docker pull your-dockerhub-username/lms-backend:latest

# Start new container
docker start lms-backend
```

### 4. Backup Strategy

- MongoDB Atlas automated backups (recommended)
- Regular database exports
- Docker image versioning

---

## Part 6: Security Checklist

- [ ] Use HTTPS for all endpoints
- [ ] Secure MongoDB Atlas with IP whitelist
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable CORS only for frontend domain
- [ ] Set up rate limiting
- [ ] Use environment variables for secrets
- [ ] Regular security updates on EC2
- [ ] Enable AWS CloudTrail for audit logs
- [ ] Set up AWS WAF (optional, advanced)

---

## Troubleshooting

### Backend Issues

1. **Container not starting**
   ```bash
   docker logs lms-backend
   docker ps -a
   ```

2. **Connection to MongoDB fails**
   - Check MongoDB Atlas network access
   - Verify connection string
   - Check environment variables

3. **Port already in use**
   ```bash
   sudo lsof -i :5000
   # Kill process or change port
   ```

### Frontend Issues

1. **Blank page after deployment**
   - Check CloudFront error pages configuration
   - Verify S3 bucket policy
   - Check browser console for errors

2. **API calls failing**
   - Verify CORS configuration
   - Check API URL in environment variables
   - Verify backend is accessible

---

## Cost Estimation (Approximate)

- **EC2 t2.micro**: ~$8-10/month
- **S3 storage**: ~$0.023/GB/month (minimal for static site)
- **CloudFront**: ~$0.085/GB (first 10TB)
- **MongoDB Atlas M0 (Free tier)**: Free (limited)
- **MongoDB Atlas M10**: ~$57/month (production recommended)

**Total**: ~$65-75/month (with M10 cluster)

---

## Next Steps

1. Set up CI/CD pipeline (GitHub Actions, AWS CodePipeline)
2. Implement automated testing
3. Set up monitoring and alerting
4. Configure backup strategies
5. Implement logging aggregation (CloudWatch Logs)
6. Set up staging environment

---

**Deployment Complete! 🎉**

Your Leave Management System should now be accessible at:
- Frontend: `https://app.yourdomain.com`
- Backend API: `https://api.yourdomain.com/api`
