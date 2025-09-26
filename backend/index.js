require('dotenv').config();
const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 8080;
const app = express();

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
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Simple API endpoint
app.get('/api/indices', (req, res) => {
    res.json({
        nifty: {
            symbol: '^NSEI',
            price: 24796.05,
            change: -94.79883,
            percent: -0.3808773
        },
        sensex: {
            symbol: '^BSESN',
            price: 80820.38,
            change: -339.29688,
            percent: -0.41806486
        }
    });
});

// Watchlist endpoint
app.post('/api/watchlist', (req, res) => {
    const { symbols } = req.body;
    const results = symbols.map(symbol => ({
        symbol: symbol,
        price: Math.random() * 1000 + 100,
        change: (Math.random() - 0.5) * 20,
        percent: (Math.random() - 0.5) * 5
    }));
    res.json(results);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
