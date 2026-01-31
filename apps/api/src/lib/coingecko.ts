/**
 * CoinGecko API Client
 * Fetches cryptocurrency prices and transaction data
 * Includes 5-minute caching and retry logic with exponential backoff
 */

import { env } from '../utils/env.js';
import { logger } from '../utils/logger.js';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

/** Cache configuration */
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;

/** In-memory cache store */
interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Get cached data if valid, otherwise return null
 * @param key - Cache key
 * @returns Cached data or null if expired/missing
 */
function getCached<T>(key: string): T | null {
    const entry = cache.get(key);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
        return entry.data as T;
    }
    return null;
}

/**
 * Set data in cache
 * @param key - Cache key
 * @param data - Data to cache
 */
function setCache<T>(key: string, data: T): void {
    cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Execute a function with retry logic and exponential backoff
 * @param fn - Async function to execute
 * @param retries - Number of retries remaining
 * @param delay - Current delay in ms
 * @returns Result of the function
 * @throws Error if all retries are exhausted
 */
async function withRetry<T>(
    fn: () => Promise<T>,
    retries: number = MAX_RETRIES,
    delay: number = INITIAL_RETRY_DELAY_MS
): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) {
            throw error;
        }

        logger.warn(`Retry attempt, ${retries} remaining. Waiting ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));

        return withRetry(fn, retries - 1, delay * 2);
    }
}

interface CoinGeckoPrice {
    usd: number;
    usd_24h_change: number;
}

interface CoinGeckoPrices {
    bitcoin?: CoinGeckoPrice;
    ethereum?: CoinGeckoPrice;
}

/**
 * Get current prices for Bitcoin and Ethereum
 * Uses 5-minute cache and retry logic
 * @returns Promise resolving to price data for BTC and ETH
 * @example
 * const prices = await getCurrentPrices();
 * console.log(prices.bitcoin?.usd); // 50000
 */
export const getCurrentPrices = async (): Promise<CoinGeckoPrices> => {
    const cacheKey = 'prices:current';

    // Check cache first
    const cached = getCached<CoinGeckoPrices>(cacheKey);
    if (cached) {
        logger.debug('Returning cached prices');
        return cached;
    }

    return withRetry(async () => {
        const url = `${COINGECKO_BASE_URL}/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true`;

        const headers: Record<string, string> = {
            Accept: 'application/json',
        };

        if (env.COINGECKO_API_KEY) {
            headers['x-cg-demo-api-key'] = env.COINGECKO_API_KEY;
        }

        const response = await fetch(url, { headers });
        const res = response as any;

        if (!res.ok) {
            throw new Error(`CoinGecko API error: ${res.status}`);
        }

        const data = await res.json() as CoinGeckoPrices;

        // Cache the result
        setCache(cacheKey, data);

        return data;
    });
};

/**
 * Get price for a specific coin
 * @param coinId - The coin to get price for ('bitcoin' or 'ethereum')
 * @returns Promise resolving to price in USD
 * @throws Error if price is not available
 * @example
 * const btcPrice = await getCoinPrice('bitcoin');
 */
export const getCoinPrice = async (
    coinId: 'bitcoin' | 'ethereum'
): Promise<number> => {
    const prices = await getCurrentPrices();
    const price = prices[coinId]?.usd;

    if (price === undefined) {
        throw new Error(`Price not available for ${coinId}`);
    }

    return price;
};

/** Bitcoin address validation regex */
const BITCOIN_ADDRESS_REGEX = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/;

/** Ethereum address validation regex */
const ETHEREUM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

/**
 * Validate wallet address format
 * @param address - Wallet address to validate
 * @param blockchain - Blockchain type ('bitcoin' or 'ethereum')
 * @returns True if address format is valid
 * @example
 * validateWalletAddress('bc1qxy2...', 'bitcoin'); // true
 */
export const validateWalletAddress = (
    address: string,
    blockchain: 'bitcoin' | 'ethereum'
): boolean => {
    if (blockchain === 'bitcoin') {
        return BITCOIN_ADDRESS_REGEX.test(address);
    }
    return ETHEREUM_ADDRESS_REGEX.test(address);
};

/**
 * Transaction data structure
 */
export interface Transaction {
    /** Transaction hash */
    hash: string;
    /** Block number containing the transaction */
    blockNumber: number;
    /** ISO timestamp of the transaction */
    timestamp: string;
    /** Sender address */
    from: string;
    /** Recipient address */
    to: string;
    /** Transaction value in native units */
    value: string;
    /** Transaction fee (optional) */
    fee?: string;
    /** Gas used (Ethereum only) */
    gasUsed?: string;
}

/**
 * Fetch Bitcoin transactions for an address
 * @param address - Bitcoin wallet address
 * @returns Promise resolving to array of transactions
 * @throws Error if address is invalid
 * @example
 * const txs = await fetchBitcoinTransactions('bc1q...');
 */
export const fetchBitcoinTransactions = async (
    address: string
): Promise<Transaction[]> => {
    if (!validateWalletAddress(address, 'bitcoin')) {
        throw new Error('Invalid Bitcoin address');
    }

    const cacheKey = `btc:txs:${address}`;
    const cached = getCached<Transaction[]>(cacheKey);
    if (cached) {
        return cached;
    }

    // Mock implementation - in production, use Blockstream API
    logger.info(`Fetching Bitcoin transactions for ${address}`);

    const transactions: Transaction[] = [
        {
            hash: '0x' + 'a'.repeat(64),
            blockNumber: 800000,
            timestamp: new Date().toISOString(),
            from: address,
            to: 'bc1q' + 'b'.repeat(38),
            value: '0.1',
            fee: '0.0001',
        },
    ];

    setCache(cacheKey, transactions);
    return transactions;
};

/**
 * Fetch Ethereum transactions for an address
 * @param address - Ethereum wallet address (0x...)
 * @param options - Optional configuration
 * @param options.includeTokenTransfers - Include ERC20 token transfers
 * @returns Promise resolving to array of transactions
 * @throws Error if address is invalid
 * @example
 * const txs = await fetchEthereumTransactions('0x...', { includeTokenTransfers: true });
 */
export const fetchEthereumTransactions = async (
    address: string,
    options?: { includeTokenTransfers?: boolean }
): Promise<Transaction[]> => {
    if (!validateWalletAddress(address, 'ethereum')) {
        throw new Error('Invalid Ethereum address');
    }

    const cacheKey = `eth:txs:${address}:${options?.includeTokenTransfers ?? false}`;
    const cached = getCached<Transaction[]>(cacheKey);
    if (cached) {
        return cached;
    }

    // Mock implementation - in production, use Etherscan API
    logger.info({ options }, `Fetching Ethereum transactions for ${address}`);

    const transactions: Transaction[] = [
        {
            hash: '0x' + 'c'.repeat(64),
            blockNumber: 19000000,
            timestamp: new Date().toISOString(),
            from: address, // Outgoing
            to: '0x' + 'd'.repeat(40),
            value: '0.5', // Reduced outgoing
            gasUsed: '21000',
        },
        {
            hash: '0x' + 'e'.repeat(64),
            blockNumber: 19000002,
            timestamp: new Date().toISOString(),
            from: '0x' + 'f'.repeat(40),
            to: address, // Incoming
            value: '5.0', // Large incoming
            gasUsed: '21000',
        },
    ];

    setCache(cacheKey, transactions);
    return transactions;
};

/**
 * Historical price data point
 */
interface HistoricalPricePoint {
    /** Unix timestamp in milliseconds */
    timestamp: number;
    /** Price in USD */
    price: number;
}

/**
 * Get historical price data for a coin
 * @param coinId - The coin to get history for
 * @param days - Number of days of history (default: 30)
 * @returns Promise resolving to array of price points
 * @example
 * const history = await getHistoricalPrices('bitcoin', 7);
 */
export const getHistoricalPrices = async (
    coinId: 'bitcoin' | 'ethereum',
    days: number = 30
): Promise<HistoricalPricePoint[]> => {
    const cacheKey = `history:${coinId}:${days}`;

    const cached = getCached<HistoricalPricePoint[]>(cacheKey);
    if (cached) {
        return cached;
    }

    return withRetry(async () => {
        const url = `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;

        const headers: Record<string, string> = {
            Accept: 'application/json',
        };

        if (env.COINGECKO_API_KEY) {
            headers['x-cg-demo-api-key'] = env.COINGECKO_API_KEY;
        }

        const response = await fetch(url, { headers });
        const res = response as any;

        if (!res.ok) {
            throw new Error(`CoinGecko API error: ${res.status}`);
        }

        const data = await res.json();

        const prices = (data.prices as Array<[number, number]>).map(([timestamp, price]) => ({
            timestamp,
            price,
        }));

        setCache(cacheKey, prices);
        return prices;
    });
};

/**
 * Clear the price cache (useful for testing)
 */
export const clearCache = (): void => {
    cache.clear();
};
