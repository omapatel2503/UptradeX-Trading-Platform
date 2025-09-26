# Zerodha Clone - Production Ready Trading Platform

A full-stack clone of the Zerodha trading platform with real-time stock data, built with modern web technologies.

## 🚀 Features

- **Real-time Stock Data**: Live prices using Yahoo Finance API with 5-second auto-refresh
- **Authentication System**: Secure login/signup with protected routes
- **Trading Dashboard**: Complete portfolio management interface
- **Market Indices**: Live NIFTY 50 and SENSEX data
- **Responsive Design**: Modern, mobile-friendly UI
- **Production Ready**: Environment configuration, error handling, and proper structure

## 🏗️ Architecture

```
Zerodha Clone/
├── frontend/          # Marketing site & Authentication (Port 3001)
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
    ├── model/        # Database models
    ├── schema/       # Database schemas
    └── index.js      # Main server file
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
- **MongoDB** - Database
- **Mongoose** - ODM
- **Yahoo Finance API** - Real-time stock data

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm
- MongoDB (local or Atlas)

### 1. Clone Repository
```bash
git clone <repository-url>
cd Zerodha-main
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env file with MongoDB URI
echo "DATABASE_URL=mongodb://localhost:27017/zerodha" > .env
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

## 🌐 Access Points

- **Frontend**: http://localhost:3001 (Marketing site, Signup, Login)
- **Dashboard**: http://localhost:3000 (Trading dashboard - requires login)
- **Backend API**: http://localhost:8080 (REST API)

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

### Stock Data
- `GET /api/stock/:symbol` - Single stock data
- `POST /api/watchlist` - Multiple stocks data
- `GET /api/indices` - Market indices (NIFTY 50, SENSEX)

### Portfolio
- `GET /allHoldings` - User holdings
- `GET /allPositions` - Open positions
- `GET /allOrders` - Order history
- `POST /newOrder` - Place new order

## 🔧 Configuration

### Environment Variables
Create `.env` files in each project:

**Frontend (.env)**
```
REACT_APP_DASHBOARD_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:8080
REACT_APP_APP_NAME=Zerodha Clone
```

**Dashboard (.env)**
```
REACT_APP_API_URL=http://localhost:8080
REACT_APP_FRONTEND_URL=http://localhost:3001
REACT_APP_APP_NAME=Zerodha Dashboard
```

**Backend (.env)**
```
DATABASE_URL=mongodb://localhost:27017/zerodha
PORT=8080
```

## 🚀 Production Deployment

### 1. Build Applications
```bash
# Frontend
cd frontend && npm run build

# Dashboard
cd dashboard && npm run build
```

### 2. Environment Setup
- Set production environment variables
- Configure MongoDB Atlas for production
- Set up proper CORS policies
- Configure SSL certificates

### 3. Server Deployment
- Use PM2 for process management
- Set up Nginx for reverse proxy
- Configure load balancing if needed

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

## 📄 License

This project is for educational purposes only. Not affiliated with Zerodha.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create new issue with detailed description

---

**Note**: This is a clone project for educational purposes. Real trading requires proper regulatory compliance and security measures.CI/CD is now active!
# CI/CD Test - Fri Sep 26 03:53:04 UTC 2025
# CI/CD Test - Fri Sep 26 04:48:40 UTC 2025
