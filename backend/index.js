require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const yahooFinance = require('yahoo-finance2').default;

// Suppress Yahoo Finance survey notice
yahooFinance.suppressNotices(['yahooSurvey']);

const { HoldingsModel } = require('./model/HoldingsModel');
const { PositionsModel } = require('./model/PositionsModel');
const { OrdersModel } = require('./model/OrdersModel');

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.DATABASE_URL;

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ---------- DB ----------
if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('✅ Connected to MongoDB'))
        .catch(err => console.warn('⚠️ MongoDB not available:', err.message));
} else {
    console.log('⚠️ MongoDB URI not provided - running without database');
}

// ---------- Holdings ----------
app.get('/allHoldings', async (req, res) => {
    try {
        const allHoldings = await HoldingsModel.find({});
        res.json(allHoldings);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching holdings', error: err.message });
    }
});

// ---------- Positions ----------
app.get('/allPositions', async (req, res) => {
    try {
        const allPositions = await PositionsModel.find({});
        res.json(allPositions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching positions', error: err.message });
    }
});

// ---------- Orders ----------
app.get('/allOrders', async (req, res) => {
    try {
        const allOrders = await OrdersModel.find({});
        res.json(allOrders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching orders', error: err.message });
    }
});

app.post('/newOrder', async (req, res) => {
    const { name, qty, price, mode } = req.body;
    try {
        const newOrder = new OrdersModel({ name, qty, price, mode });
        await newOrder.save();
        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (err) {
        res.status(500).json({ message: 'Error creating order', error: err.message });
    }
});

// ---------- Live Stock APIs ----------

// single stock
app.get('/api/stock/:symbol', async (req, res) => {
    const { symbol } = req.params;
    try {
        const data = await yahooFinance.quote(symbol);
        res.json({
            symbol: data.symbol,
            price: data.regularMarketPrice,
            change: data.regularMarketChange,
            percent: data.regularMarketChangePercent,
        });
    } catch (err) {
        console.error('Error fetching stock:', err.message);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

// batch watchlist
app.post('/api/watchlist', async (req, res) => {
    const { symbols } = req.body; // e.g. ["RELIANCE.NS","TCS.NS"]
    
    // Rate limiting check
    if (!symbols || symbols.length === 0) {
        return res.status(400).json({ error: 'No symbols provided' });
    }
    
    if (symbols.length > 25) {
        return res.status(400).json({ error: 'Too many symbols. Maximum 25 allowed per request.' });
    }
    
    try {
        console.log(`Fetching data for ${symbols.length} symbols:`, symbols);
        
        // Add small delay between requests to avoid rate limiting
        const results = await Promise.all(
            symbols.map(async (sym, index) => {
                // Small delay for each request to avoid overwhelming the API
                if (index > 0) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                return yahooFinance.quote(sym);
            })
        );
        
        const formatted = results.map(d => ({
            symbol: d.symbol,
            price: d.regularMarketPrice || 0,
            change: d.regularMarketChange || 0,
            percent: d.regularMarketChangePercent || 0,
        }));
        
        console.log(`Successfully fetched data for ${formatted.length} symbols`);
        res.json(formatted);
    } catch (err) {
        console.error('Error fetching watchlist data:', err.message);
        res.status(500).json({ 
            error: 'Failed to fetch watchlist data', 
            details: err.message,
            suggestion: 'Try reducing the number of symbols or check your internet connection'
        });
    }
});

// indices (NIFTY 50 & SENSEX)
app.get('/api/indices', async (req, res) => {
    try {
        const [nifty, sensex] = await Promise.all([
            yahooFinance.quote("^NSEI"),  // NIFTY 50
            yahooFinance.quote("^BSESN") // SENSEX
        ]);
        res.json({
            nifty: {
                symbol: nifty.symbol,
                price: nifty.regularMarketPrice,
                change: nifty.regularMarketChange,
                percent: nifty.regularMarketChangePercent,
            },
            sensex: {
                symbol: sensex.symbol,
                price: sensex.regularMarketPrice,
                change: sensex.regularMarketChange,
                percent: sensex.regularMarketChangePercent,
            }
        });
    } catch (err) {
        console.error("Error fetching indices:", err.message);
        res.status(500).json({ error: 'Failed to fetch indices' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    if (mongoose.connection.readyState === 1) {
        mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    if (mongoose.connection.readyState === 1) {
        mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
    process.exit(0);
});

// ---------- Server ----------
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💾 Memory limit: ${process.env.NODE_OPTIONS || 'default'}`);
});
