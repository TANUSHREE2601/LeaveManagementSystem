# Deployment Guide - Leave Management System

This guide provides step-by-step instructions for deploying the Leave Management System to AWS using the Free Tier.

---

## 📋 Prerequisites

- AWS Free Tier account
- MongoDB Atlas account (Free tier available)
- Domain name (optional, can use EC2 public IP)
- Basic knowledge of AWS services
- Docker installed (for local testing)

---

## 🐳 Backend Deployment (EC2 with Docker)

### Step 1: Launch EC2 Instance (Free Tier)

1. **Navigate to EC2 Console**
   - Go to AWS Console → EC2 → Instances
   - Click "Launch Instance"

2. **Configure Instance**
   - **Name**: `lms-backend`
   - **AMI**: Amazon Linux 2023 (Free Tier eligible)
   - **Instance Type**: `t2.micro` (Free Tier eligible)
   - **Key Pair**: Create new or select existing (.pem file)
   - **Network Settings**: 
     - Allow HTTP (port 80)
     - Allow HTTPS (port 443)
     - Allow Custom TCP (port 5000)

3. **Launch Instance**

### Step 2: Connect to EC2 Instance

```bash
# Using SSH (Windows PowerShell or Git Bash)
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

### Step 3: Install Docker on EC2

```bash
# Update system
sudo yum update -y

# Install Docker
sudo yum install docker -y

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add ec2-user to docker group (to run without sudo)
sudo usermod -aG docker ec2-user

# Log out and log back in for changes to take effect
exit
# Then SSH again
```

### Step 4: Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### Step 5: Transfer Files to EC2

**Option A: Using SCP**
```bash
# From your local machine
scp -i your-key.pem -r backend/ ec2-user@your-ec2-ip:/home/ec2-user/lms-backend
```

**Option B: Using Git**
```bash
# On EC2
cd /home/ec2-user
git clone your-repository-url lms-backend
cd lms-backend/backend
```

### Step 6: Create Environment File

```bash
# On EC2, navigate to backend directory
cd /home/ec2-user/lms-backend/backend

# Create .env file
nano .env
```

**Add environment variables:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lms?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRES_IN=1h
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Save and exit (Ctrl+X, then Y, then Enter)

### Step 7: Build and Run Docker Container

```bash
# Build Docker image
docker build -t lms-backend:latest .

# Or use docker-compose
docker-compose up -d --build

# Check if container is running
docker ps

# View logs
docker logs lms-backend
```

### Step 8: Set Up Nginx Reverse Proxy (Optional but Recommended)

```bash
# Install Nginx
sudo yum install nginx -y

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Configure Nginx
sudo nano /etc/nginx/conf.d/lms-backend.conf
```

**Add configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # Or use EC2 public IP

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

```bash
# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 9: Set Up SSL with Let's Encrypt (Optional)

```bash
# Install Certbot
sudo yum install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal (already configured by certbot)
```

---

## ☁️ Frontend Deployment (AWS S3 + CloudFront)

### Step 1: Build Frontend

```bash
# On your local machine, navigate to frontend directory
cd frontend

# Create production .env file
echo "VITE_API_URL=https://api.yourdomain.com/api" > .env.production

# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `dist/` directory with production-ready files.

### Step 2: Create S3 Bucket

1. **Navigate to S3 Console**
   - Go to AWS Console → S3
   - Click "Create bucket"

2. **Configure Bucket**
   - **Bucket name**: `lms-frontend` (must be globally unique)
   - **Region**: Same as EC2 (e.g., us-east-1)
   - **Block Public Access**: Uncheck "Block all public access"
   - **Bucket Versioning**: Enable (optional)
   - Click "Create bucket"

### Step 3: Configure Bucket for Static Website Hosting

1. **Select your bucket** → **Properties** tab
2. Scroll to **Static website hosting**
3. Click **Edit**:
   - **Static website hosting**: Enable
   - **Hosting type**: Static website hosting
   - **Index document**: `index.html`
   - **Error document**: `index.html` (for React Router)
   - Click **Save**

### Step 4: Set Bucket Policy

1. Go to **Permissions** tab → **Bucket policy**
2. Click **Edit** and add:

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

3. Click **Save**

### Step 5: Upload Build Files

**Option A: Using AWS Console**
1. Go to S3 bucket → **Objects** tab
2. Click **Upload** → **Add files**
3. Select all files from `frontend/dist/`
4. Click **Upload**

**Option B: Using AWS CLI**
```bash
# Install AWS CLI (if not installed)
# Windows: https://awscli.amazonaws.com/AWSCLIV2.msi
# Mac: brew install awscli
# Linux: sudo apt install awscli

# Configure AWS CLI
aws configure
# Enter AWS Access Key ID
# Enter AWS Secret Access Key
# Enter region (e.g., us-east-1)
# Enter output format (json)

# Upload files
aws s3 sync frontend/dist/ s3://lms-frontend --delete
```

### Step 6: Set Up CloudFront Distribution (Optional but Recommended)

1. **Navigate to CloudFront Console**
   - Go to AWS Console → CloudFront
   - Click "Create Distribution"

2. **Configure Distribution**
   - **Origin Domain**: Select your S3 bucket (website endpoint)
   - **Origin Path**: Leave empty
   - **Viewer Protocol Policy**: Redirect HTTP to HTTPS
   - **Allowed HTTP Methods**: GET, HEAD, OPTIONS
   - **Default Root Object**: `index.html`
   - **Error Pages**:
     - 403 → `/index.html` (200)
     - 404 → `/index.html` (200)
   - Click **Create Distribution**

3. **Update Frontend Environment**
   - Update CORS_ORIGIN in backend `.env` to CloudFront URL
   - Rebuild frontend if needed

---

## 🗄️ MongoDB Atlas Setup

### Step 1: Create Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Select region close to your EC2 region

### Step 2: Configure Network Access

1. **Network Access** → **Add IP Address**
2. Add EC2 instance IP address (or `0.0.0.0/0` for testing - less secure)

### Step 3: Create Database User

1. **Database Access** → **Add New Database User**
2. Create user with strong password
3. Grant "Read and write to any database" privilege

### Step 4: Get Connection String

1. **Database** → **Connect** → **Connect your application**
2. Copy connection string
3. Replace `<password>` and `<dbname>` in `.env` file

---

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use AWS Systems Manager Parameter Store or Secrets Manager for production

2. **EC2 Security Groups**
   - Only allow necessary ports (22, 80, 443)
   - Restrict SSH access to your IP only

3. **MongoDB Atlas**
   - Whitelist only EC2 IP (not 0.0.0.0/0)
   - Use strong database passwords

4. **HTTPS**
   - Always use HTTPS in production
   - CloudFront provides free SSL certificate

---

## 🧪 Testing Deployment

### Backend Health Check
```bash
curl http://your-ec2-ip:5000/api/health
# Or
curl https://api.yourdomain.com/api/health
```

### Frontend Access
- S3 Website: `http://lms-frontend.s3-website-region.amazonaws.com`
- CloudFront: `https://your-cloudfront-id.cloudfront.net`

---

## 💰 AWS Free Tier Costs (Estimated)

| Service | Free Tier | Monthly Cost |
|---------|-----------|--------------|
| EC2 t2.micro | 750 hours/month | $0 |
| S3 Storage | 5 GB | $0 |
| S3 Requests | 20,000 GET | $0 |
| CloudFront | 50 GB transfer | $0 |
| Data Transfer | 1 GB/month | $0 |
| MongoDB Atlas M0 | Free | $0 |

**Total Monthly Cost: ~$0** (if within Free Tier limits)

---

## 📝 Post-Deployment Checklist

- [ ] Backend API accessible and health check passing
- [ ] Frontend loads correctly
- [ ] Authentication working (login/signup)
- [ ] CORS configured correctly
- [ ] Environment variables set in production
- [ ] SSL certificate configured (HTTPS)
- [ ] MongoDB connection working
- [ ] Error logs monitored
- [ ] Database backups configured (MongoDB Atlas)

---

## 🔄 Updating Application

### Backend Update

```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Navigate to project
cd /home/ec2-user/lms-backend/backend

# Pull latest changes
git pull

# Rebuild and restart container
docker-compose down
docker-compose up -d --build

# Check logs
docker logs lms-backend -f
```

### Frontend Update

```bash
# On local machine
cd frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://lms-frontend --delete

# Invalidate CloudFront cache (if using)
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

---

## 🐛 Troubleshooting

### Backend Issues

**Container not starting:**
```bash
docker logs lms-backend
docker ps -a
```

**Port already in use:**
```bash
sudo lsof -i :5000
# Kill process or change port in .env
```

**Database connection failed:**
- Check MongoDB Atlas network access (IP whitelist)
- Verify connection string in `.env`
- Check security group allows outbound connections

### Frontend Issues

**Blank page:**
- Check CloudFront error pages configuration
- Verify S3 bucket policy
- Check browser console for errors

**API calls failing:**
- Verify CORS configuration in backend
- Check API URL in environment variables
- Verify backend is accessible

---

## 📚 Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Docker Documentation](https://docs.docker.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

---

**Deployment Complete! 🎉**

Your Leave Management System should now be live and accessible.
