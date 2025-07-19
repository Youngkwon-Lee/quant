const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const router = express.Router();

// 캐시 설정 (5분)
const cache = new NodeCache({ stdTTL: 300 });

// Finnhub API 기본 URL
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// 미국 주식 목록 조회
router.get('/symbols', async (req, res) => {
  try {
    const cacheKey = 'us_stocks_symbols';
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json({ success: true, data: cachedData, cached: true });
    }

    const response = await axios.get(`${FINNHUB_BASE_URL}/stock/symbol`, {
      params: {
        exchange: 'US',
        token: process.env.FINNHUB_API_KEY
      }
    });

    const data = response.data;
    cache.set(cacheKey, data);

    res.json({ success: true, data, cached: false });
  } catch (error) {
    console.error('주식 목록 조회 오류:', error.message);
    res.status(500).json({ 
      success: false, 
      error: '주식 목록을 조회할 수 없습니다.',
      message: error.message 
    });
  }
});

// 주식 검색
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ 
        success: false, 
        error: '검색어를 입력해주세요.' 
      });
    }

    const cacheKey = `stock_search_${q}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json({ success: true, data: cachedData, cached: true });
    }

    const response = await axios.get(`${FINNHUB_BASE_URL}/search`, {
      params: {
        q,
        token: process.env.FINNHUB_API_KEY
      }
    });

    const data = response.data;
    cache.set(cacheKey, data);

    res.json({ success: true, data, cached: false });
  } catch (error) {
    console.error('주식 검색 오류:', error.message);
    res.status(500).json({ 
      success: false, 
      error: '주식 검색을 수행할 수 없습니다.',
      message: error.message 
    });
  }
});

// 주식 가격 조회 (Quote)
router.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ 
        success: false, 
        error: '주식 심볼을 입력해주세요.' 
      });
    }

    const cacheKey = `stock_quote_${symbol}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json({ success: true, data: cachedData, cached: true });
    }

    const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
      params: {
        symbol: symbol.toUpperCase(),
        token: process.env.FINNHUB_API_KEY
      }
    });

    const data = response.data;
    cache.set(cacheKey, data);

    res.json({ success: true, data, cached: false });
  } catch (error) {
    console.error('주식 가격 조회 오류:', error.message);
    res.status(500).json({ 
      success: false, 
      error: '주식 가격을 조회할 수 없습니다.',
      message: error.message 
    });
  }
});

// 주식 뉴스 조회
router.get('/news/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { from, to } = req.query;
    
    if (!symbol) {
      return res.status(400).json({ 
        success: false, 
        error: '주식 심볼을 입력해주세요.' 
      });
    }

    const cacheKey = `stock_news_${symbol}_${from}_${to}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json({ success: true, data: cachedData, cached: true });
    }

    const response = await axios.get(`${FINNHUB_BASE_URL}/company-news`, {
      params: {
        symbol: symbol.toUpperCase(),
        from: from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        to: to || new Date().toISOString().split('T')[0],
        token: process.env.FINNHUB_API_KEY
      }
    });

    const data = response.data;
    cache.set(cacheKey, data);

    res.json({ success: true, data, cached: false });
  } catch (error) {
    console.error('주식 뉴스 조회 오류:', error.message);
    res.status(500).json({ 
      success: false, 
      error: '주식 뉴스를 조회할 수 없습니다.',
      message: error.message 
    });
  }
});

module.exports = router; 