const { createClient } = require('redis');

// Redis configuration
const redisConfig = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
};

// Create Redis client
const redisClient = createClient({
    socket: {
        host: redisConfig.host,
        port: redisConfig.port,
    },
    password: redisConfig.password,
});

// Redis connection events
redisClient.on('connect', () => {
    console.log('🔄 Connecting to Redis...');
});

redisClient.on('ready', () => {
    console.log('✅ Redis connected successfully');
});

redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err.message);
});

redisClient.on('end', () => {
    console.log('🔌 Redis connection ended');
});

// Connect to Redis
const connectRedis = async () => {
    try {
        // Check if Redis credentials are provided
        if (!redisConfig.host || !redisConfig.password) {
            console.log('⚠️ Redis credentials not provided, skipping Redis connection');
            return null;
        }
        
        await redisClient.connect();
        return redisClient;
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        // Don't throw error - app should work without Redis
        return null;
    }
};

// Cache utility functions
const cacheUtils = {
    // Set cache with TTL (Time To Live)
    async set(key, value, ttlSeconds = 300) {
        try {
            if (!redisClient.isReady) return false;
            const serializedValue = JSON.stringify(value);
            await redisClient.setEx(key, ttlSeconds, serializedValue);
            console.log(`📦 Cached: ${key} (TTL: ${ttlSeconds}s)`);
            return true;
        } catch (error) {
            console.error('Cache set error:', error);
            return false;
        }
    },

    // Get from cache
    async get(key) {
        try {
            if (!redisClient.isReady) return null;
            const value = await redisClient.get(key);
            if (value) {
                console.log(`📥 Cache hit: ${key}`);
                return JSON.parse(value);
            }
            console.log(`📭 Cache miss: ${key}`);
            return null;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    },

    // Delete from cache
    async del(key) {
        try {
            if (!redisClient.isReady) return false;
            await redisClient.del(key);
            console.log(`🗑️ Cache deleted: ${key}`);
            return true;
        } catch (error) {
            console.error('Cache delete error:', error);
            return false;
        }
    },

    // Check if key exists
    async exists(key) {
        try {
            if (!redisClient.isReady) return false;
            const exists = await redisClient.exists(key);
            return exists === 1;
        } catch (error) {
            console.error('Cache exists error:', error);
            return false;
        }
    },

    // Get TTL of a key
    async getTTL(key) {
        try {
            if (!redisClient.isReady) return -1;
            return await redisClient.ttl(key);
        } catch (error) {
            console.error('Cache TTL error:', error);
            return -1;
        }
    }
};

module.exports = {
    redisClient,
    connectRedis,
    cacheUtils
};
