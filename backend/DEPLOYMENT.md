# Backend Deployment Guide

## Quick Start with Docker

### Prerequisites
- Docker installed
- `.env` file configured

### Local Development

```bash
# Build image
docker build -t lms-backend:latest .

# Run container
docker run -d \
  --name lms-backend \
  -p 5000:5000 \
  --env-file .env \
  lms-backend:latest

# View logs
docker logs -f lms-backend

# Stop container
docker stop lms-backend
docker rm lms-backend
```

### Using Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## Production Checklist

- [ ] Environment variables configured in `.env`
- [ ] `NODE_ENV=production` set
- [ ] MongoDB Atlas connection string valid
- [ ] JWT_SECRET is at least 32 characters
- [ ] CORS_ORIGIN set to frontend URL
- [ ] Security group allows port 5000 (or configured port)
- [ ] Health check endpoint working (`/api/health`)

## Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```
