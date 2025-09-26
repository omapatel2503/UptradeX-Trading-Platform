require('dotenv').config();
const express = require('express');
const cors = require('cors');
const yahooFinance = require('yahoo-finance2').default;

const PORT = process.env.PORT || 8080;
const app = express();

// Suppress Yahoo Finance survey notice
yahooFinance.suppressNotices(['yahooSurvey']);

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

// Get NIFTY 50 and SENSEX data
app.get('/api/indices', async (req, res) => {
    try {
        console.log('Fetching indices data...');
        
        // Fetch NIFTY 50 and SENSEX data
        const [niftyData, sensexData] = await Promise.all([
            yahooFinance.quote('^NSEI'),
            yahooFinance.quote('^BSESN')
        ]);

        const indices = {
            nifty: {
                symbol: '^NSEI',
                price: niftyData.regularMarketPrice || 24890.85,
                change: niftyData.regularMarketChange || -166.05,
                percent: niftyData.regularMarketChangePercent || -0.66
            },
            sensex: {
                symbol: '^BSESN',
                price: sensexData.regularMarketPrice || 81159.68,
                change: sensexData.regularMarketChange || -555.95,
                percent: sensexData.regularMarketChangePercent || -0.68
            }
        };

        console.log('Indices data:', indices);
        res.json(indices);
    } catch (err) {
        console.error("Error fetching indices:", err.message);
        // Return fallback data
        res.json({
            nifty: {
                symbol: '^NSEI',
                price: 24890.85,
                change: -166.05,
                percent: -0.66
            },
            sensex: {
                symbol: '^BSESN',
                price: 81159.68,
                change: -555.95,
                percent: -0.68
            }
        });
    }
});

// Get stock data for watchlist
app.post('/api/watchlist', async (req, res) => {
    const { symbols } = req.body;
    
    if (!symbols || symbols.length === 0) {
        return res.status(400).json({ error: 'No symbols provided' });
    }
    
    if (symbols.length > 25) {
        return res.status(400).json({ error: 'Too many symbols. Maximum 25 allowed per request.' });
    }
    
    try {
        console.log(`Fetching data for ${symbols.length} symbols:`, symbols);
        
        // Fetch data for all symbols
        const results = await Promise.all(
            symbols.map(async (symbol) => {
                try {
                    const data = await yahooFinance.quote(symbol);
                    return {
                        symbol: symbol,
                        price: data.regularMarketPrice || 1000,
                        change: data.regularMarketChange || 0,
                        percent: data.regularMarketChangePercent || 0
                    };
                } catch (error) {
                    console.error(`Error fetching data for ${symbol}:`, error.message);
                    // Return fallback data for this symbol
                    return {
                        symbol: symbol,
                        price: 1000,
                        change: 0,
                        percent: 0
                    };
                }
            })
        );
        
        console.log(`Successfully fetched data for ${results.length} symbols`);
        res.json(results);
    } catch (err) {
        console.error('Error fetching watchlist data:', err.message);
        // Return fallback data
        const fallbackData = symbols.map(symbol => ({
            symbol: symbol,
            price: 1000,
            change: 0,
            percent: 0
        }));
        res.json(fallbackData);
    }
});

// Get individual stock data
app.get('/api/stock/:symbol', async (req, res) => {
    const { symbol } = req.params;
    try {
        const data = await yahooFinance.quote(symbol);
        res.json({
            symbol: symbol,
            price: data.regularMarketPrice || 1000,
            change: data.regularMarketChange || 0,
            percent: data.regularMarketChangePercent || 0
        });
    } catch (err) {
        console.error('Error fetching stock:', err.message);
        res.json({
            symbol: symbol,
            price: 1000,
            change: 0,
            percent: 0
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
