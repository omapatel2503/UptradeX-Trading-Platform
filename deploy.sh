#!/bin/bash

# Automated Deployment Script for Zerodha Clone
# This script will be used by GitHub Actions

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Navigate to project directory
cd /home/ubuntu/zerodha-clone

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Clean up old images
echo "🧹 Cleaning up old Docker images..."
docker system prune -f

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Health checks
echo "🏥 Running health checks..."

# Check backend
echo "Checking backend API..."
if curl -f http://localhost:8080/api/indices; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    exit 1
fi

# Check frontend
echo "Checking frontend..."
if curl -f http://localhost:80; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
    exit 1
fi

# Check dashboard
echo "Checking dashboard..."
if curl -f http://localhost:3000; then
    echo "✅ Dashboard is healthy"
else
    echo "❌ Dashboard health check failed"
    exit 1
fi

echo "🎉 Deployment successful!"
echo "🌐 Frontend: http://54.87.180.194"
echo "📊 Dashboard: http://54.87.180.194:3000"
echo "🔌 API: http://54.87.180.194:8080"
