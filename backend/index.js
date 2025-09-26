require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectRedis } = require('./config/redis');
const stockService = require('./services/stockService');

const PORT = process.env.PORT || 8080;
const app = express();

// MongoDB connection
const connectMongoDB = async () => {
    try {
        // MongoDB Atlas connection string
        const mongoUrl = process.env.DATABASE_URL;
        
        if (!mongoUrl) {
            throw new Error('DATABASE_URL environment variable is required');
        }
        
        console.log('🔄 Connecting to MongoDB Atlas...');
        await mongoose.connect(mongoUrl);
        console.log('✅ MongoDB Atlas connected successfully');
        console.log('📊 Database:', mongoose.connection.name);
        console.log('🌐 Host:', mongoose.connection.host);
        
    } catch (error) {
        console.error('❌ MongoDB Atlas connection error:', error.message);
        console.log('⚠️ Running without database connection');
        console.log('💡 Set DATABASE_URL environment variable for database connection');
    }
};

// Initialize connections
const initializeConnections = async () => {
    await connectMongoDB();
    await connectRedis().then(() => {
        console.log('🚀 Redis initialization completed');
    }).catch((error) => {
        console.log('⚠️ Redis not available, running without cache:', error.message);
    });
};

initializeConnections();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://3.208.13.185:3000', 
    'http://3.208.13.185',
    'http://3.208.13.185:80'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        redis: 'connected' // We'll update this based on Redis status
    });
});

// Database status check
app.get('/api/db/status', (req, res) => {
    res.json({
        mongodb: {
            status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
            host: mongoose.connection.host,
            port: mongoose.connection.port,
            name: mongoose.connection.name
        },
        timestamp: new Date().toISOString()
    });
});

// Get NIFTY 50 and SENSEX data with Redis caching
app.get('/api/indices', async (req, res) => {
    try {
        const indices = await stockService.getIndices();
        res.json(indices);
    } catch (err) {
        console.error("Error fetching indices:", err.message);
        res.status(500).json({ error: 'Failed to fetch indices data' });
    }
});

// Get stock data for watchlist with Redis caching
app.post('/api/watchlist', async (req, res) => {
    try {
        const { symbols } = req.body;
        const watchlistData = await stockService.getWatchlist(symbols);
        res.json(watchlistData.data);
    } catch (err) {
        console.error('Error fetching watchlist data:', err.message);
        res.status(400).json({ error: err.message });
    }
});

// Get individual stock data with Redis caching
app.get('/api/stock/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const stockData = await stockService.getStock(symbol);
        res.json(stockData);
    } catch (err) {
        console.error('Error fetching stock:', err.message);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

// Cache management endpoints
app.get('/api/cache/stats', async (req, res) => {
    try {
        const stats = await stockService.getCacheStats();
        res.json(stats);
    } catch (err) {
        console.error('Error getting cache stats:', err.message);
        res.status(500).json({ error: 'Failed to get cache stats' });
    }
});

app.delete('/api/cache/stock/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        await stockService.clearStockCache(symbol);
        res.json({ message: `Cache cleared for ${symbol}` });
    } catch (err) {
        console.error('Error clearing cache:', err.message);
        res.status(500).json({ error: 'Failed to clear cache' });
    }
});

// MongoDB operations for trading data
const { HoldingsModel } = require('./model/HoldingsModel');
const { OrdersModel } = require('./model/OrdersModel');
const { PositionsModel } = require('./model/PositionsModel');

// Holdings endpoints
app.get('/api/holdings', async (req, res) => {
    try {
        const holdings = await HoldingsModel.find();
        res.json(holdings);
    } catch (err) {
        console.error('Error fetching holdings:', err.message);
        res.status(500).json({ error: 'Failed to fetch holdings' });
    }
});

app.post('/api/holdings', async (req, res) => {
    try {
        const holding = new HoldingsModel(req.body);
        await holding.save();
        res.json(holding);
    } catch (err) {
        console.error('Error creating holding:', err.message);
        res.status(500).json({ error: 'Failed to create holding' });
    }
});

// Orders endpoints
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await OrdersModel.find();
        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err.message);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const order = new OrdersModel(req.body);
        await order.save();
        res.json(order);
    } catch (err) {
        console.error('Error creating order:', err.message);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Positions endpoints
app.get('/api/positions', async (req, res) => {
    try {
        const positions = await PositionsModel.find();
        res.json(positions);
    } catch (err) {
        console.error('Error fetching positions:', err.message);
        res.status(500).json({ error: 'Failed to fetch positions' });
    }
});

app.post('/api/positions', async (req, res) => {
    try {
        const position = new PositionsModel(req.body);
        await position.save();
        res.json(position);
    } catch (err) {
        console.error('Error creating position:', err.message);
        res.status(500).json({ error: 'Failed to create position' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
