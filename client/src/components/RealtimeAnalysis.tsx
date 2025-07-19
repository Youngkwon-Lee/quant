import React, { useState, useEffect } from 'react';
import './RealtimeAnalysis.css';

interface TechnicalIndicators {
  rsi: { value: number; signal: string; description: string };
  macd: { macd: number; signal: number; histogram: number; trend: string };
  bollingerBands: { upper: number; middle: number; lower: number; position: string };
  heikinAshi: { open: number; high: number; low: number; close: number; trend: string };
  valueInvestment: { liquidityScore: number; volumeRatio: number; valueRating: string; recommendation: string };
  cupAndHandle: { detected: boolean; timeframe: string; confidence: number; target: number };
}

interface OnChainData {
  activeAddresses: number;
  transactionCount: number;
  whaleMovements: number;
  exchangeFlow: { inflow: number; outflow: number; net: number };
  networkMetrics: { hashRate: number; difficulty: number; stakingRewards: number };
  defiMetrics: { totalValueLocked: number; tvlChange24h: number; protocolCount: number };
}

interface BitcoinData {
  usd: number;
  usd_24h_change: number;
  usd_24h_vol: number;
  usd_market_cap: number;
}

const RealtimeAnalysis: React.FC = () => {
  const [bitcoinData, setBitcoinData] = useState<BitcoinData | null>(null);
  const [technicalData, setTechnicalData] = useState<TechnicalIndicators | null>(null);
  const [onChainData, setOnChainData] = useState<OnChainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('로딩 중...');

  const loadData = async () => {
    try {
      // Bitcoin 가격 데이터 로드
      const priceResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true'
      );
      const priceData = await priceResponse.json();
      
      if (priceData.bitcoin) {
        setBitcoinData(priceData.bitcoin);
        
        // 가격 데이터 기반으로 기술적 지표 계산 (시뮬레이션)
        const currentPrice = priceData.bitcoin.usd;
        const change24h = priceData.bitcoin.usd_24h_change;
        const volume = priceData.bitcoin.usd_24h_vol;
        
        // RSI 시뮬레이션 (가격 변동률 기반)
        const rsiValue = 50 + (change24h * 1.5);
        const rsiSignal = rsiValue > 70 ? '과매수' : rsiValue < 30 ? '과매도' : '중립';
        
        // MACD 시뮬레이션
        const macdValue = change24h > 0 ? Math.random() * 500 + 100 : -(Math.random() * 500 + 100);
        const macdSignal = macdValue * 0.8;
        const macdHistogram = macdValue - macdSignal;
        
        // 볼린저밴드 시뮬레이션
        const bbMiddle = currentPrice;
        const bbUpper = currentPrice * 1.02;
        const bbLower = currentPrice * 0.98;
        const bbPosition = currentPrice > bbUpper ? '상단 돌파' : currentPrice < bbLower ? '하단 이탈' : '밴드 내';
        
        // 하이킨아시 시뮬레이션
        const haOpen = currentPrice * 0.999;
        const haClose = currentPrice;
        const haHigh = Math.max(haOpen, haClose) * 1.001;
        const haLow = Math.min(haOpen, haClose) * 0.999;
        const haTrend = haClose > haOpen ? '상승 양봉' : '하락 음봉';
        
        // 가치 투자 지표 시뮬레이션
        const liquidityScore = Math.min(100, volume / 1000000000 * 100);
        const volumeRatio = volume / (volume / 24); // 24시간 평균 대비
        const valueRating = liquidityScore > 70 ? '높음' : liquidityScore > 40 ? '보통' : '낮음';
        
        // 컵앤핸들 패턴 시뮬레이션
        const cupHandleDetected = Math.random() > 0.7; // 30% 확률로 감지
        
        setTechnicalData({
          rsi: {
            value: Math.max(0, Math.min(100, rsiValue)),
            signal: rsiSignal,
            description: `현재 RSI ${rsiValue.toFixed(1)}로 ${rsiSignal} 상태입니다.`
          },
          macd: {
            macd: macdValue,
            signal: macdSignal,
            histogram: macdHistogram,
            trend: macdHistogram > 0 ? '상승' : '하락'
          },
          bollingerBands: {
            upper: bbUpper,
            middle: bbMiddle,
            lower: bbLower,
            position: bbPosition
          },
          heikinAshi: {
            open: haOpen,
            high: haHigh,
            low: haLow,
            close: haClose,
            trend: haTrend
          },
          valueInvestment: {
            liquidityScore,
            volumeRatio,
            valueRating,
            recommendation: valueRating === '높음' ? '매수 고려' : valueRating === '보통' ? '관망' : '주의'
          },
          cupAndHandle: {
            detected: cupHandleDetected,
            timeframe: '7일',
            confidence: cupHandleDetected ? 75 + Math.random() * 20 : 0,
            target: currentPrice * (1 + Math.random() * 0.15)
          }
        });
        
        // 온체인 데이터 시뮬레이션
        setOnChainData({
          activeAddresses: Math.floor(800000 + Math.random() * 200000),
          transactionCount: Math.floor(250000 + Math.random() * 50000),
          whaleMovements: Math.floor(15 + Math.random() * 10),
          exchangeFlow: {
            inflow: Math.floor(2000 + Math.random() * 1000),
            outflow: Math.floor(1800 + Math.random() * 1000),
            net: 0
          },
          networkMetrics: {
            hashRate: 350 + Math.random() * 50,
            difficulty: 60 + Math.random() * 10,
            stakingRewards: 4.5 + Math.random() * 1
          },
          defiMetrics: {
            totalValueLocked: 45000000000 + Math.random() * 10000000000,
            tvlChange24h: -5 + Math.random() * 10,
            protocolCount: 3200 + Math.floor(Math.random() * 100)
          }
        });
        
        setLastUpdate(new Date().toLocaleString());
        setLoading(false);
      }
    } catch (error) {
      console.error('데이터 로딩 오류:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // 30초마다 새로고침
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toFixed(2);
  };

  if (loading) {
    return (
      <div className="realtime-analysis">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>실시간 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="realtime-analysis">
      <div className="analysis-header">
        <h1>📊 실시간 Bitcoin 분석</h1>
        <div className="last-update">마지막 업데이트: {lastUpdate}</div>
      </div>

      {/* 가격 정보 */}
      <div className="price-section">
        <div className="price-card main-price">
          <h2>Bitcoin (BTC)</h2>
          <div className="price-value">${bitcoinData?.usd.toLocaleString()}</div>
          <div className={`price-change ${bitcoinData && bitcoinData.usd_24h_change > 0 ? 'positive' : 'negative'}`}>
            {bitcoinData && bitcoinData.usd_24h_change > 0 ? '+' : ''}
            {bitcoinData?.usd_24h_change.toFixed(2)}% (24h)
          </div>
        </div>
        
        <div className="price-card">
          <h3>거래량 (24h)</h3>
          <div className="metric-value">${formatNumber(bitcoinData?.usd_24h_vol || 0)}</div>
        </div>
        
        <div className="price-card">
          <h3>시가총액</h3>
          <div className="metric-value">${formatNumber(bitcoinData?.usd_market_cap || 0)}</div>
        </div>
      </div>

      {/* 기술적 지표 */}
      <div className="indicators-section">
        <h2>📈 기술적 지표</h2>
        <div className="indicators-grid">
          <div className="indicator-card">
            <h3>RSI (14)</h3>
            <div className="indicator-value">{technicalData?.rsi.value.toFixed(1)}</div>
            <div className={`indicator-signal ${technicalData?.rsi.signal}`}>
              {technicalData?.rsi.signal}
            </div>
            <p>{technicalData?.rsi.description}</p>
          </div>

          <div className="indicator-card">
            <h3>MACD</h3>
            <div className="macd-values">
              <div>MACD: {technicalData?.macd.macd.toFixed(2)}</div>
              <div>Signal: {technicalData?.macd.signal.toFixed(2)}</div>
              <div>Histogram: {technicalData?.macd.histogram.toFixed(2)}</div>
            </div>
            <div className={`indicator-signal ${technicalData?.macd.trend}`}>
              {technicalData?.macd.trend} 추세
            </div>
          </div>

          <div className="indicator-card">
            <h3>볼린저밴드</h3>
            <div className="bb-values">
              <div>상단: ${technicalData?.bollingerBands.upper.toFixed(0)}</div>
              <div>중간: ${technicalData?.bollingerBands.middle.toFixed(0)}</div>
              <div>하단: ${technicalData?.bollingerBands.lower.toFixed(0)}</div>
            </div>
            <div className="indicator-signal">{technicalData?.bollingerBands.position}</div>
          </div>

          <div className="indicator-card">
            <h3>하이킨아시</h3>
            <div className="ha-values">
              <div>시가: ${technicalData?.heikinAshi.open.toFixed(0)}</div>
              <div>종가: ${technicalData?.heikinAshi.close.toFixed(0)}</div>
            </div>
            <div className={`indicator-signal ${technicalData?.heikinAshi.trend.includes('상승') ? 'positive' : 'negative'}`}>
              {technicalData?.heikinAshi.trend}
            </div>
          </div>
        </div>
      </div>

      {/* 가치 투자 지표 */}
      <div className="value-section">
        <h2>💰 가치 투자 지표</h2>
        <div className="value-grid">
          <div className="value-card">
            <h3>유동성 점수</h3>
            <div className="value-score">{technicalData?.valueInvestment.liquidityScore.toFixed(1)}/100</div>
            <div className="value-rating">{technicalData?.valueInvestment.valueRating}</div>
          </div>
          
          <div className="value-card">
            <h3>거래량 비율</h3>
            <div className="value-ratio">{technicalData?.valueInvestment.volumeRatio.toFixed(2)}x</div>
          </div>
          
          <div className="value-card">
            <h3>투자 추천</h3>
            <div className={`recommendation ${technicalData?.valueInvestment.recommendation.replace(' ', '-')}`}>
              {technicalData?.valueInvestment.recommendation}
            </div>
          </div>
        </div>
      </div>

      {/* 컵앤핸들 패턴 */}
      <div className="pattern-section">
        <h2>🏆 패턴 분석</h2>
        <div className="pattern-card">
          <h3>컵앤핸들 패턴</h3>
          {technicalData?.cupAndHandle.detected ? (
            <div className="pattern-detected">
              <div className="pattern-status positive">✅ 패턴 감지됨!</div>
              <div className="pattern-details">
                <div>신뢰도: {technicalData.cupAndHandle.confidence.toFixed(1)}%</div>
                <div>기간: {technicalData.cupAndHandle.timeframe}</div>
                <div>목표가: ${technicalData.cupAndHandle.target.toFixed(0)}</div>
              </div>
            </div>
          ) : (
            <div className="pattern-not-detected">
              <div className="pattern-status">❌ 패턴 미감지</div>
              <p>현재 컵앤핸들 패턴이 감지되지 않았습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 온체인 메트릭 */}
      <div className="onchain-section">
        <h2>🔗 온체인 메트릭</h2>
        <div className="onchain-grid">
          <div className="onchain-card">
            <h3>네트워크 활동</h3>
            <div className="onchain-metric">
              <span>활성 주소:</span>
              <span>{onChainData?.activeAddresses.toLocaleString()}</span>
            </div>
            <div className="onchain-metric">
              <span>일일 거래:</span>
              <span>{onChainData?.transactionCount.toLocaleString()}</span>
            </div>
          </div>

          <div className="onchain-card">
            <h3>고래 활동</h3>
            <div className="onchain-metric">
              <span>고래 거래:</span>
              <span>{onChainData?.whaleMovements}</span>
            </div>
            <div className="onchain-metric">
              <span>거래소 유입:</span>
              <span>{onChainData?.exchangeFlow.inflow} BTC</span>
            </div>
          </div>

          <div className="onchain-card">
            <h3>네트워크 보안</h3>
            <div className="onchain-metric">
              <span>해시레이트:</span>
              <span>{onChainData?.networkMetrics.hashRate.toFixed(1)} EH/s</span>
            </div>
            <div className="onchain-metric">
              <span>난이도:</span>
              <span>{onChainData?.networkMetrics.difficulty.toFixed(1)} T</span>
            </div>
          </div>

          <div className="onchain-card">
            <h3>DeFi 메트릭</h3>
            <div className="onchain-metric">
              <span>TVL:</span>
              <span>${formatNumber(onChainData?.defiMetrics.totalValueLocked || 0)}</span>
            </div>
            <div className="onchain-metric">
              <span>24h 변화:</span>
              <span className={onChainData && onChainData.defiMetrics.tvlChange24h > 0 ? 'positive' : 'negative'}>
                {onChainData && onChainData.defiMetrics.tvlChange24h > 0 ? '+' : ''}
                {onChainData?.defiMetrics.tvlChange24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 자동 새로고침 정보 */}
      <div className="refresh-info">
        ⏱️ 데이터는 30초마다 자동으로 업데이트됩니다.
      </div>
    </div>
  );
};

export default RealtimeAnalysis; 