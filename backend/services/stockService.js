const yahooFinance = require('yahoo-finance2').default;
const { cacheUtils } = require('../config/redis');

// Suppress Yahoo Finance survey notice
yahooFinance.suppressNotices(['yahooSurvey']);

class StockService {
    constructor() {
        this.cachePrefix = {
            stock: 'stock:',
            indices: 'indices:',
            watchlist: 'watchlist:'
        };
    }

    // Get market indices with caching
    async getIndices() {
        const cacheKey = `${this.cachePrefix.indices}market`;
        
        try {
            // Try to get from cache first
            const cachedData = await cacheUtils.get(cacheKey);
            if (cachedData) {
                console.log('📊 Serving indices from cache');
                return cachedData;
            }

            console.log('📊 Fetching fresh indices data from Yahoo Finance...');
            
            // Fetch fresh data from Yahoo Finance
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
                },
                lastUpdated: new Date().toISOString()
            };

            // Cache for 2 minutes (120 seconds)
            await cacheUtils.set(cacheKey, indices, 120);
            
            console.log('📊 Indices data cached successfully');
            return indices;

        } catch (error) {
            console.error('Error fetching indices:', error.message);
            
            // Return fallback data
            const fallbackData = {
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
                },
                lastUpdated: new Date().toISOString(),
                fallback: true
            };
            
            return fallbackData;
        }
    }

    // Get individual stock data with caching
    async getStock(symbol) {
        const cacheKey = `${this.cachePrefix.stock}${symbol}`;
        
        try {
            // Try to get from cache first
            const cachedData = await cacheUtils.get(cacheKey);
            if (cachedData) {
                console.log(`📈 Serving ${symbol} from cache`);
                return cachedData;
            }

            console.log(`📈 Fetching fresh data for ${symbol} from Yahoo Finance...`);
            
            // Fetch fresh data from Yahoo Finance
            const data = await yahooFinance.quote(symbol);
            
            const stockData = {
                symbol: symbol,
                price: data.regularMarketPrice || 1000,
                change: data.regularMarketChange || 0,
                percent: data.regularMarketChangePercent || 0,
                lastUpdated: new Date().toISOString()
            };

            // Cache for 1 minute (60 seconds) for individual stocks
            await cacheUtils.set(cacheKey, stockData, 60);
            
            console.log(`📈 ${symbol} data cached successfully`);
            return stockData;

        } catch (error) {
            console.error(`Error fetching stock ${symbol}:`, error.message);
            
            // Return fallback data
            return {
                symbol: symbol,
                price: 1000,
                change: 0,
                percent: 0,
                lastUpdated: new Date().toISOString(),
                fallback: true
            };
        }
    }

    // Get watchlist data with caching
    async getWatchlist(symbols) {
        if (!symbols || symbols.length === 0) {
            throw new Error('No symbols provided');
        }
        
        if (symbols.length > 25) {
            throw new Error('Too many symbols. Maximum 25 allowed per request.');
        }

        const cacheKey = `${this.cachePrefix.watchlist}${symbols.sort().join(',')}`;
        
        try {
            // Try to get from cache first
            const cachedData = await cacheUtils.get(cacheKey);
            if (cachedData) {
                console.log(`📋 Serving watchlist from cache (${symbols.length} symbols)`);
                return cachedData;
            }

            console.log(`📋 Fetching fresh watchlist data for ${symbols.length} symbols from Yahoo Finance...`);
            
            // Fetch fresh data for all symbols
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

            const watchlistData = {
                data: results,
                symbols: symbols,
                lastUpdated: new Date().toISOString()
            };

            // Cache for 1 minute (60 seconds)
            await cacheUtils.set(cacheKey, watchlistData, 60);
            
            console.log(`📋 Watchlist data cached successfully (${results.length} symbols)`);
            return watchlistData;

        } catch (error) {
            console.error('Error fetching watchlist data:', error.message);
            throw error;
        }
    }

    // Clear cache for specific stock
    async clearStockCache(symbol) {
        const cacheKey = `${this.cachePrefix.stock}${symbol}`;
        await cacheUtils.del(cacheKey);
        console.log(`🗑️ Cleared cache for ${symbol}`);
    }

    // Clear all stock cache
    async clearAllStockCache() {
        // Note: This is a simplified version. In production, you'd use SCAN
        console.log('🗑️ Stock cache clearing not implemented in this version');
    }

    // Get cache statistics
    async getCacheStats() {
        try {
            const indicesTTL = await cacheUtils.getTTL(`${this.cachePrefix.indices}market`);
            return {
                indices: {
                    cached: indicesTTL > 0,
                    ttl: indicesTTL
                },
                redisConnected: true
            };
        } catch (error) {
            return {
                redisConnected: false,
                error: error.message
            };
        }
    }
}

module.exports = new StockService();
