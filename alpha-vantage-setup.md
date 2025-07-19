# Alpha Vantage API 설정 가이드

## 1. API 키 발급
- [Alpha Vantage](https://www.alphavantage.co/support/#api-key) 접속
- 무료 계정 생성
- API 키 발급 (하루 100회 무료 호출)

## 2. .env 파일 수정
```
FINNHUB_API_KEY=your_finnhub_key_here
ALPHA_VANTAGE_KEY=your_alpha_vantage_key_here
```

## 3. 서버 코드 수정
server.js에서 Alpha Vantage API 엔드포인트 추가:

```javascript
// Alpha Vantage API 엔드포인트
app.get('/api/alpha/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_KEY}`
    );
    const data = await response.json();
    
    if (data['Global Quote']) {
      const quote = data['Global Quote'];
      res.json({
        success: true,
        data: {
          symbol: quote['01. symbol'],
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', ''))
        }
      });
    } else {
      res.json({
        success: false,
        error: 'No data found'
      });
    }
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});
```

## 4. 장점
- 더 안정적인 서비스
- 명확한 요금 정책
- 다양한 데이터 제공
- 더 나은 문서화

## 5. 단점
- 무료 계정은 하루 100회 제한
- 실시간 데이터는 유료 계정에서만 제공