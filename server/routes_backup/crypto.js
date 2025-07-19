const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const router = express.Router();

// 캐시 설정 (5분)
const cache = new NodeCache({ stdTTL: 300 });

// Finnhub API 기본 URL
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// 암호화폐 거래소 목록 조회
router.get('/exchanges', async (req, res) => {
  try {
    const cacheKey = 'crypto_exchanges';
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json({ success: true, data: cachedData, cached: true });
    }

    const response = await axios.get(`${FINNHUB_BASE_URL}/crypto/exchange`, {
      params: {
        token: process.env.FINNHUB_API_KEY
      }
    });

    const data = response.data;
    cache.set(cacheKey, data);

    res.json({ success: true, data, cached: false });
  } catch (error) {
    console.error('암호화폐 거래소 목록 조회 오류:', error.message);
    res.status(500).json({ 
      success: false, 
      error: '암호화폐 거래소 목록을 조회할 수 없습니다.',
      message: error.message 
    });
  }
});

// 특정 거래소의 암호화폐 심볼 목록 조회
router.get('/symbols/:exchange', async (req, res) => {
  try {
    const { exchange } = req.params;
    
    if (!exchange) {
      return res.status(400).json({ 
        success: false, 
        error: '거래소명을 입력해주세요.' 
      });
    }

    const cacheKey = `crypto_symbols_${exchange}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json({ success: true, data: cachedData, cached: true });
    }

    const response = await axios.get(`${FINNHUB_BASE_URL}/crypto/symbol`, {
      params: {
        exchange: exchange.toUpperCase(),
        token: process.env.FINNHUB_API_KEY
      }
    });

    const data = response.data;
    cache.set(cacheKey, data);

    res.json({ success: true, data, cached: false });
  } catch (error) {
    console.error('암호화폐 심볼 목록 조회 오류:', error.message);
    res.status(500).json({ 
      success: false, 
      error: '암호화폐 심볼 목록을 조회할 수 없습니다.',
      message: error.message 
    });
  }
});

// 암호화폐 캔들스틱 데이터 조회
router.get('/candles/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { resolution = 'D', from, to } = req.query;
    
    if (!symbol) {
      return res.status(400).json({ 
        success: false, 
        error: '암호화폐 심볼을 입력해주세요.' 
      });
    }

    // 기본값: 최근 30일
    const toTimestamp = to ? parseInt(to) : Math.floor(Date.now() / 1000);
    const fromTimestamp = from ? parseInt(from) : Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);

    const cacheKey = `crypto_candles_${symbol}_${resolution}_${fromTimestamp}_${toTimestamp}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json({ success: true, data: cachedData, cached: true });
    }

    const response = await axios.get(`${FINNHUB_BASE_URL}/crypto/candle`, {
      params: {
        symbol: symbol.toUpperCase(),
        resolution,
        from: fromTimestamp,
        to: toTimestamp,
        token: process.env.FINNHUB_API_KEY
      }
    });

    const data = response.data;
    cache.set(cacheKey, data);

    res.json({ success: true, data, cached: false });
  } catch (error) {
    console.error('암호화폐 캔들스틱 데이터 조회 오류:', error.message);
    res.status(500).json({ 
      success: false, 
      error: '암호화폐 캔들스틱 데이터를 조회할 수 없습니다.',
      message: error.message 
    });
  }
});

// 인기 암호화폐 목록 조회
router.get('/popular', async (req, res) => {
  try {
    const cacheKey = 'crypto_popular';
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json({ success: true, data: cachedData, cached: true });
    }

    // 주요 암호화폐 목록 (BINANCE 기준)
    const popularSymbols = [
      'BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'BINANCE:BNBUSDT',
      'BINANCE:XRPUSDT', 'BINANCE:ADAUSDT', 'BINANCE:DOGEUSDT',
      'BINANCE:SOLUSDT', 'BINANCE:DOTUSDT', 'BINANCE:LINKUSDT',
      'BINANCE:MATICUSDT'
    ];

    const promises = popularSymbols.map(symbol => 
      axios.get(`${FINNHUB_BASE_URL}/crypto/candle`, {
        params: {
          symbol,
          resolution: 'D',
          from: Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000),
          to: Math.floor(Date.now() / 1000),
          token: process.env.FINNHUB_API_KEY
        }
      }).catch(err => ({ data: { s: 'error', symbol } }))
    );

    const results = await Promise.all(promises);
    const data = results.map((result, index) => ({
      symbol: popularSymbols[index],
      data: result.data
    }));

    cache.set(cacheKey, data);

    res.json({ success: true, data, cached: false });
  } catch (error) {
    console.error('인기 암호화폐 조회 오류:', error.message);
    res.status(500).json({ 
      success: false, 
      error: '인기 암호화폐 목록을 조회할 수 없습니다.',
      message: error.message 
    });
  }
});

module.exports = router; 