# UptradeX - Advanced Trading Platform

A full-stack trading platform with real-time stock data, Redis caching, and MongoDB persistence. Built with modern web technologies and production-ready architecture.

## 🚀 Features

- **Real-time Stock Data**: Live prices using Yahoo Finance API with intelligent caching
- **High Performance**: Redis caching for 80-90% faster response times
- **Data Persistence**: MongoDB Atlas for reliable data storage
- **Trading Dashboard**: Complete portfolio management interface
- **Market Indices**: Live NIFTY 50 and SENSEX data
- **Graceful Degradation**: Works with or without external services
- **Production Ready**: Environment configuration, error handling, and robust architecture

## 🏗️ Architecture

![System Architecture](assets/system_architucture.png)

```
UptradeX/
├── frontend/          # Marketing site & Authentication (Port 80)
│   ├── src/
│   │   ├── landing/   # Landing pages, signup, login
│   │   ├── config/    # Environment configuration
│   │   └── ...
├── dashboard/         # Trading Dashboard (Port 3000)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── constants/     # App constants
│   │   ├── config/        # Configuration
│   │   └── ...
└── backend/          # API Server (Port 8080)
    ├── config/       # Redis & MongoDB configuration
    ├── services/     # Stock service with caching
    ├── model/        # Database models
    ├── schema/       # Database schemas
    └── index.js      # Main server file
```

### 🔄 Data Flow
```
User Request → Backend API → Redis Cache → MongoDB Atlas
     ↓              ↓            ↓            ↓
   Response ← Cached Data ← Fresh Data ← Yahoo Finance
```

## 🛠️ Tech Stack

### Frontend & Dashboard
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Bootstrap 5** - CSS framework
- **Material-UI** - Component library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Redis Cloud** - In-memory caching
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM
- **Yahoo Finance API** - Real-time stock data

### Infrastructure
- **Redis Cloud** - High-performance caching
- **MongoDB Atlas** - Managed database
- **AWS EC2** - Cloud hosting
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm
- Redis Cloud account (optional)
- MongoDB Atlas account (optional)

### 1. Clone Repository
```bash
git clone <repository-url>
cd UptradeX-Trading-Platform
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file (copy from env.example)
cp env.example .env

# Edit .env with your credentials:
# - Redis Cloud credentials
# - MongoDB Atlas connection string
# - Other configuration

npm start
```

### 3. Dashboard Setup
```bash
cd dashboard
npm install
npm start
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 5. Environment Configuration
Create `.env` files in each project with your credentials:

**Backend (.env)**
```env
# Server Configuration
PORT=8080
NODE_ENV=development

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

## 🌐 Access Points

- **Frontend**: http://localhost:80 (Marketing site, Signup, Login)
- **Dashboard**: http://localhost:3000 (Trading dashboard - requires login)
- **Backend API**: http://localhost:8080 (REST API)

## ⚡ Performance Features

### Redis Caching
- **Stock Data**: Cached for 1-2 minutes
- **Market Indices**: Cached for 2 minutes
- **Watchlist**: Cached for 1 minute
- **Performance**: 80-90% faster response times

### Graceful Degradation
- **Without Redis**: Direct API calls (slower but works)
- **Without MongoDB**: In-memory storage (data lost on restart)
- **Without both**: Basic functionality still available

## 🔐 Authentication Flow

1. **Signup**: Frontend → Create account → Redirect to login
2. **Login**: Frontend → Authenticate → Redirect to dashboard
3. **Dashboard**: Protected route → Requires authentication
4. **Logout**: Dashboard → Clear auth → Redirect to frontend

## 📊 Real-time Features

- **Auto-refresh**: All stock data updates every 5 seconds
- **Live Indicators**: Visual feedback for real-time data
- **Market Indices**: NIFTY 50 and SENSEX with live updates
- **Stock Watchlist**: Real-time prices for selected stocks
- **Holdings**: Live portfolio valuation

## 🎯 API Endpoints

### Health & Status
- `GET /health` - Server health status
- `GET /api/db/status` - Database connection status

### Stock Data (with Redis caching)
- `GET /api/stock/:symbol` - Single stock data
- `POST /api/watchlist` - Multiple stocks data
- `GET /api/indices` - Market indices (NIFTY 50, SENSEX)

### Portfolio (MongoDB operations)
- `GET /api/holdings` - User holdings
- `POST /api/holdings` - Create holding
- `GET /api/orders` - User orders
- `POST /api/orders` - Create order
- `GET /api/positions` - User positions
- `POST /api/positions` - Create position

### Cache Management
- `GET /api/cache/stats` - Cache statistics
- `DELETE /api/cache/stock/:symbol` - Clear stock cache

## 🔧 Configuration

### Environment Variables
Create `.env` files in each project:

**Frontend (.env)**
```
REACT_APP_DASHBOARD_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:8080
REACT_APP_APP_NAME=UptradeX
```

**Dashboard (.env)**
```
REACT_APP_API_URL=http://localhost:8080
REACT_APP_FRONTEND_URL=http://localhost:80
REACT_APP_APP_NAME=UptradeX Dashboard
```

**Backend (.env)**
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

## 🚀 Production Deployment

### 1. Environment Setup
Set up your production environment variables:

**Required Services:**
- **Redis Cloud**: For high-performance caching
- **MongoDB Atlas**: For data persistence
- **AWS EC2**: For hosting

### 2. Deploy to EC2
```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Clone and setup
git clone <your-repo-url>
cd UptradeX-Trading-Platform

# Setup environment variables
cd backend
cp env.example .env
# Edit .env with your production credentials

# Install dependencies
npm install

# Start the application
npm start
```

### 3. Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### 4. CI/CD with GitHub Actions
The project is configured for automatic deployment:
- Push to main branch triggers deployment
- Environment variables set as GitHub secrets
- Automatic deployment to EC2 instance

## 🧪 Testing

```bash
# Run tests for each project
cd frontend && npm test
cd dashboard && npm test
cd backend && npm test
```

## 📝 Development Guidelines

### Code Structure
- **Components**: Reusable UI components
- **Services**: API communication layer
- **Utils**: Helper functions and utilities
- **Constants**: Application constants
- **Config**: Environment configuration

### Best Practices
- Use TypeScript for better type safety
- Implement proper error handling
- Add loading states for better UX
- Use environment variables for configuration
- Implement proper logging
- Add unit and integration tests

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit pull request

## 🎓 Educational Value

This project demonstrates:
- **Advanced Caching Strategies** with Redis
- **Database Design** with MongoDB
- **API Development** with Express.js
- **Real-time Data Processing**
- **Production Deployment** practices
- **CI/CD Pipeline** implementation
- **Graceful Degradation** patterns

## 📄 License

This project is for educational purposes only. Not affiliated with any trading platform.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create new issue with detailed description

## 🚀 Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd UptradeX-Trading-Platform

# Setup backend
cd backend
npm install
cp env.example .env
# Edit .env with your credentials
npm start

# Setup dashboard (in new terminal)
cd dashboard
npm install
npm start

# Setup frontend (in new terminal)
cd frontend
npm install
npm start
```

---

**UptradeX** - Advanced Trading Platform with Redis Caching & MongoDB Persistence 
