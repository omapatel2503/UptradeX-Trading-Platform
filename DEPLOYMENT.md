# 🚀 Deployment Guide

## Environment Variables Required

### Backend (.env)
```env
# Server Configuration
PORT=8080
NODE_ENV=production

# Redis Cloud Configuration
REDIS_HOST=your_redis_host_here
REDIS_PORT=your_redis_port_here
REDIS_PASSWORD=your_redis_password_here

# MongoDB Atlas Configuration
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&appName=Cluster0

# API Configuration
YAHOO_FINANCE_ENABLED=true
CACHE_TTL_STOCK=60
CACHE_TTL_INDICES=120
CACHE_TTL_WATCHLIST=60
```

## Deployment Steps

### 1. Set Environment Variables
- Copy `backend/env.example` to `backend/.env`
- Fill in your actual credentials

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Start the Application
```bash
npm start
```

## CI/CD Configuration

### GitHub Actions
The project is configured to work with GitHub Actions for automatic deployment.

### Required Secrets in GitHub
- `REDIS_HOST`
- `REDIS_PORT` 
- `REDIS_PASSWORD`
- `DATABASE_URL`

## Features

### ✅ Working Without Dependencies
- **MongoDB**: Optional - app works without database
- **Redis**: Optional - app works without cache
- **Graceful degradation**: All features work with or without external services

### 🔧 Fallback Behavior
- **No Redis**: Direct API calls to Yahoo Finance
- **No MongoDB**: In-memory data storage
- **No external services**: Basic functionality still works

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Stock Data
- `GET /api/indices` - Market indices (NIFTY, SENSEX)
- `GET /api/stock/:symbol` - Individual stock data
- `POST /api/watchlist` - Multiple stocks data

### Database Operations (if MongoDB connected)
- `GET /api/holdings` - User holdings
- `POST /api/holdings` - Create holding
- `GET /api/orders` - User orders
- `POST /api/orders` - Create order
- `GET /api/positions` - User positions
- `POST /api/positions` - Create position

### Cache Management (if Redis connected)
- `GET /api/cache/stats` - Cache statistics
- `DELETE /api/cache/stock/:symbol` - Clear stock cache
