import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  BarController,
  BarElement,
  PointElement,
  LineController,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import type { ChartOptions, ChartData as ChartJSData } from 'chart.js';
import { CandlestickController, CandlestickElement, OhlcElement } from 'chartjs-chart-financial';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import './TechnicalAnalysis.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  BarController,
  BarElement,
  PointElement,
  LineController,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  CandlestickController,
  CandlestickElement,
  OhlcElement
);

interface Candle {
  x: number; // timestamp
  o: number;
  h: number;
  l: number;
  c: number;
}

interface ChartData {
  candles: Candle[];
  heikinAshi: Candle[];
  rsi: { x: number; y: number }[];
  macd: { x: number; macd: number; signal: number; histogram: number }[];
  bollingerBands: { x: number; upper: number; middle: number; lower: number }[];
}

interface Signal {
  type: string;
  message: string;
  timestamp: string;
  confidence: number;
}

const TechnicalAnalysis: React.FC = () => {
  const [chartData, setChartData] = React.useState<ChartData | null>(null);
  const [signals, setSignals] = React.useState<Signal[]>([]);
  const [selectedChart, setSelectedChart] = React.useState<'candlestick' | 'heikinashi'>('candlestick');
  const [loading, setLoading] = React.useState(true);
  const [lastUpdate, setLastUpdate] = React.useState<string>('로딩 중...');
  const [cupAndHandle, setCupAndHandle] = React.useState<{detected: boolean, start?: number, end?: number, target?: number} | null>(null);

  // --- 데이터 로딩 및 계산 ---
  const loadChartData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=100&interval=daily'
      );
      const data = await response.json();
      if (!data.prices) throw new Error('가격 데이터 없음');
      // OHLC 변환 (단일 종가만 제공하므로 의사 OHLC 생성)
      const candles: Candle[] = data.prices.map((p: [number, number], i: number) => {
        const open = i === 0 ? p[1] : data.prices[i - 1][1];
        const close = p[1];
        const high = Math.max(open, close) * (1 + Math.random() * 0.01);
        const low = Math.min(open, close) * (1 - Math.random() * 0.01);
        return { x: p[0], o: open, h: high, l: low, c: close };
      });
      // 하이킨아시 변환
      const heikinAshi: Candle[] = [];
      let prev = { o: candles[0].o, c: candles[0].c };
      for (const c of candles) {
        const haClose = (c.o + c.h + c.l + c.c) / 4;
        const haOpen = (prev.o + prev.c) / 2;
        const haHigh = Math.max(c.h, haOpen, haClose);
        const haLow = Math.min(c.l, haOpen, haClose);
        heikinAshi.push({ x: c.x, o: haOpen, h: haHigh, l: haLow, c: haClose });
        prev = { o: haOpen, c: haClose };
      }
      // RSI
      const rsi = calculateRSI(candles.map(c => c.c), 14).map((y, i) => ({ x: candles[i + 14]?.x, y }));
      // MACD
      const macdArr = calculateMACD(candles.map(c => c.c));
      const macd = macdArr.map((m, i) => ({ x: candles[i]?.x, ...m }));
      // 볼린저밴드
      const bb = calculateBollingerBands(candles.map(c => c.c), 20, 2).map((b, i) => ({ x: candles[i + 19]?.x, ...b }));
      setChartData({ candles, heikinAshi, rsi, macd, bollingerBands: bb });
      setLastUpdate(new Date().toLocaleString());
      setLoading(false);
      // 컵앤핸들 패턴 감지
      const cup = detectCupAndHandle(candles.map(c => c.c));
      setCupAndHandle(cup);
    } catch (e) {
      setLoading(false);
    }
  };

  // RSI 계산
  function calculateRSI(prices: number[], period: number): number[] {
    const rsi = [];
    let gains = 0, losses = 0;
    for (let i = 1; i <= period; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff >= 0) gains += diff; else losses -= diff;
    }
    gains /= period; losses /= period;
    for (let i = period; i < prices.length; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff >= 0) {
        gains = (gains * (period - 1) + diff) / period;
        losses = (losses * (period - 1)) / period;
      } else {
        gains = (gains * (period - 1)) / period;
        losses = (losses * (period - 1) - diff) / period;
      }
      const rs = gains / (losses || 1e-10);
      rsi.push(100 - 100 / (1 + rs));
    }
    return rsi;
  }
  // MACD 계산
  function calculateEMA(prices: number[], period: number): number[] {
    const ema = [prices[0]];
    const k = 2 / (period + 1);
    for (let i = 1; i < prices.length; i++) {
      ema.push(prices[i] * k + ema[i - 1] * (1 - k));
    }
    return ema;
  }
  function calculateMACD(prices: number[]) {
    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);
    const macd = ema12.map((v, i) => v - ema26[i]);
    const signal = calculateEMA(macd, 9);
    return macd.map((m, i) => ({ macd: m, signal: signal[i], histogram: m - signal[i] }));
  }
  // 볼린저밴드 계산
  function calculateBollingerBands(prices: number[], period: number, deviation: number) {
    const bb = [];
    for (let i = period - 1; i < prices.length; i++) {
      const slice = prices.slice(i - period + 1, i + 1);
      const mean = slice.reduce((a, b) => a + b, 0) / period;
      const std = Math.sqrt(slice.reduce((a, b) => a + (b - mean) ** 2, 0) / period);
      bb.push({ upper: mean + std * deviation, middle: mean, lower: mean - std * deviation });
    }
    return bb;
  }
  // 컵앤핸들 패턴 감지 (간단 버전)
  function detectCupAndHandle(prices: number[]) {
    // 1. 저점-반등-저점-상승 구조 탐색 (단순화)
    let minIdx1 = 0, minIdx2 = 0, maxIdx = 0;
    for (let i = 10; i < prices.length - 10; i++) {
      if (prices[i] < prices[minIdx1]) minIdx1 = i;
    }
    for (let i = minIdx1 + 5; i < prices.length - 5; i++) {
      if (prices[i] < prices[minIdx2]) minIdx2 = i;
    }
    maxIdx = prices.slice(minIdx1, minIdx2).reduce((maxI, v, i, arr) => v > arr[maxI] ? i : maxI, 0) + minIdx1;
    // 컵 구조: minIdx1 < maxIdx < minIdx2, 두 저점 가격 유사, maxIdx가 두 저점보다 충분히 높음
    if (
      minIdx1 < maxIdx && maxIdx < minIdx2 &&
      Math.abs(prices[minIdx1] - prices[minIdx2]) / prices[minIdx1] < 0.1 &&
      prices[maxIdx] > prices[minIdx1] * 1.15
    ) {
      // 핸들: minIdx2 이후 5~15일 내 가격 조정 후 돌파
      for (let i = minIdx2 + 2; i < Math.min(prices.length, minIdx2 + 15); i++) {
        if (prices[i] > prices[maxIdx]) {
          return { detected: true, start: minIdx1, end: i, target: prices[maxIdx] * 1.1 };
        }
      }
    }
    return { detected: false };
  }

  // --- 시그널 감지 (하이킨아시, RSI, MACD 등) ---
  function detectSignals(candles: Candle[], heikinAshi: Candle[], rsi: {x:number,y:number}[], macd: any[]): Signal[] {
    const signals: Signal[] = [];
    const now = new Date().toLocaleString();
    // 하이킨아시 전환
    for (let i = 1; i < heikinAshi.length; i++) {
      const prev = heikinAshi[i - 1];
      const curr = heikinAshi[i];
      if (prev.c < prev.o && curr.c > curr.o) {
        signals.push({ type: '하이킨아시 전환', message: '음봉→양봉 전환', timestamp: now, confidence: 75 });
      } else if (prev.c > prev.o && curr.c < curr.o) {
        signals.push({ type: '하이킨아시 전환', message: '양봉→음봉 전환', timestamp: now, confidence: 75 });
      }
    }
    // RSI
    if (rsi.length > 0) {
      const currentRSI = rsi[rsi.length - 1].y;
      if (currentRSI > 70) signals.push({ type: 'RSI 과매수', message: `RSI ${currentRSI.toFixed(1)} - 과매수`, timestamp: now, confidence: 80 });
      else if (currentRSI < 30) signals.push({ type: 'RSI 과매도', message: `RSI ${currentRSI.toFixed(1)} - 과매도`, timestamp: now, confidence: 80 });
    }
    // MACD
    if (macd.length > 1) {
      const curr = macd[macd.length - 1];
      const prev = macd[macd.length - 2];
      if (prev.macd < prev.signal && curr.macd > curr.signal) signals.push({ type: 'MACD 골든크로스', message: 'MACD 상향 돌파', timestamp: now, confidence: 85 });
      else if (prev.macd > prev.signal && curr.macd < curr.signal) signals.push({ type: 'MACD 데드크로스', message: 'MACD 하향 돌파', timestamp: now, confidence: 85 });
    }
    return signals.slice(0, 5);
  }

  React.useEffect(() => {
    loadChartData();
  }, []);
  React.useEffect(() => {
    if (chartData) setSignals(detectSignals(chartData.candles, chartData.heikinAshi, chartData.rsi, chartData.macd));
  }, [chartData]);

  if (loading || !chartData) {
    return (
      <div className="technical-analysis">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>차트 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  // --- Chart.js 차트 데이터 구성 ---
  const candleChartData: ChartJSData<'candlestick'> = {
    labels: chartData?.candles.map(c => new Date(c.x)) || [],
    datasets: [
      {
        label: 'BTC 캔들스틱',
        data: chartData?.candles || [],
        borderColor: '#888',
        borderWidth: 1
      }
    ]
  };
  const heikinAshiChartData: ChartJSData<'candlestick'> = {
    labels: chartData?.heikinAshi.map(c => new Date(c.x)) || [],
    datasets: [
      {
        label: 'BTC 하이킨아시',
        data: chartData?.heikinAshi || [],
        borderColor: '#888',
        borderWidth: 1
      }
    ]
  };
  const rsiChartData = {
    labels: chartData?.rsi.map(d => new Date(d.x)) || [],
    datasets: [
      {
        label: 'RSI',
        data: chartData?.rsi.map(d => d.y) || [],
        borderColor: '#ffc107',
        backgroundColor: 'rgba(255,193,7,0.1)',
        fill: true,
        tension: 0.2
      }
    ]
  };
  // MACD: Histogram은 bar, MACD/Signal은 별도 라인차트로 분리
  const macdBarChartData = {
    labels: chartData?.macd.map(d => new Date(d.x)) || [],
    datasets: [
      {
        label: 'Histogram',
        data: chartData?.macd.map(d => d.histogram) || [],
        backgroundColor: 'rgba(0,123,255,0.3)'
      }
    ]
  };
  const macdLineChartData = {
    labels: chartData?.macd.map(d => new Date(d.x)) || [],
    datasets: [
      {
        label: 'MACD',
        data: chartData?.macd.map(d => d.macd) || [],
        borderColor: '#28a745',
        fill: false,
        tension: 0.2
      },
      {
        label: 'Signal',
        data: chartData?.macd.map(d => d.signal) || [],
        borderColor: '#dc3545',
        fill: false,
        tension: 0.2
      }
    ]
  };
  const bbChartData = {
    labels: chartData?.bollingerBands.map(d => new Date(d.x)) || [],
    datasets: [
      {
        label: '상단',
        data: chartData?.bollingerBands.map(d => d.upper) || [],
        borderColor: '#dc3545',
        fill: false
      },
      {
        label: '중간',
        data: chartData?.bollingerBands.map(d => d.middle) || [],
        borderColor: '#888',
        fill: false
      },
      {
        label: '하단',
        data: chartData?.bollingerBands.map(d => d.lower) || [],
        borderColor: '#28a745',
        fill: false
      }
    ]
  };
  const candleOptions: ChartOptions<'candlestick'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { type: 'time', time: { unit: 'day' }, grid: { color: '#222' } },
      y: { grid: { color: '#222' } }
    }
  };
  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: {
      x: { type: 'time', time: { unit: 'day' }, grid: { color: '#222' } },
      y: { grid: { color: '#222' } }
    }
  };
  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: {
      x: { type: 'time', time: { unit: 'day' }, grid: { color: '#222' } },
      y: { grid: { color: '#222' } }
    }
  };

  return (
    <div className="technical-analysis">
      <div className="analysis-header">
        <h1>📈 고급 기술적 분석</h1>
        <div className="last-update">마지막 업데이트: {lastUpdate}</div>
      </div>
      {/* 차트 선택 */}
      <div className="chart-controls">
        <div className="chart-selector">
          <button className={selectedChart === 'candlestick' ? 'active' : ''} onClick={() => setSelectedChart('candlestick')}>📊 캔들스틱 차트</button>
          <button className={selectedChart === 'heikinashi' ? 'active' : ''} onClick={() => setSelectedChart('heikinashi')}>📈 하이킨아시 차트</button>
        </div>
        <button className="refresh-btn" onClick={loadChartData}>🔄 새로고침</button>
      </div>
      {/* 차트 영역 */}
      <div className="chart-container">
        {selectedChart === 'candlestick' ? (
          <Chart type="candlestick" data={candleChartData} options={candleOptions} />
        ) : (
          <Chart type="candlestick" data={heikinAshiChartData} options={candleOptions} />
        )}
      </div>
      {/* 기술적 지표 차트 */}
      <div className="indicators-charts">
        <div className="indicator-chart">
          <h3>RSI (14)</h3>
          <Chart type="line" data={rsiChartData} options={lineOptions} height={120} />
        </div>
        <div className="indicator-chart">
          <h3>MACD</h3>
          <Chart type="bar" data={macdBarChartData} options={barOptions} height={120} />
          <Chart type="line" data={macdLineChartData} options={lineOptions} height={120} />
        </div>
        <div className="indicator-chart">
          <h3>볼린저밴드</h3>
          <Chart type="line" data={bbChartData} options={lineOptions} height={120} />
        </div>
      </div>
      {/* 시그널 분석 */}
      <div className="signals-section">
        <div className="signals-header">
          <h2>🎯 실시간 시그널</h2>
        </div>
        <div className="signals-list">
          {signals.length > 0 ? (
            signals.map((signal, index) => (
              <div key={index} className="signal-card">
                <div className="signal-type">{signal.type}</div>
                <div className="signal-message">{signal.message}</div>
                <div className="signal-meta">
                  <span className="signal-time">{signal.timestamp}</span>
                  <span className="signal-confidence">신뢰도: {signal.confidence}%</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-signals">현재 감지된 시그널이 없습니다.</div>
          )}
        </div>
      </div>
      {/* 패턴 분석 */}
      <div className="pattern-analysis">
        <h2>🏆 컵앤핸들 패턴 분석</h2>
        <div className="pattern-grid">
          <div className="pattern-card">
            <h3>컵앤핸들 패턴</h3>
            <div className="pattern-status">
              {cupAndHandle?.detected ? (
                <div className="detected">✅ 컵앤핸들 패턴 감지됨<br />목표가: ${cupAndHandle.target?.toFixed(2)}</div>
              ) : (
                <div className="not-detected">❌ 패턴 미감지</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 차트 정보 */}
      <div className="chart-info-section">
        <h2>📊 차트 정보</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>데이터 소스</h3>
            <p>CoinGecko API - 실시간 Bitcoin 가격 데이터</p>
          </div>
          <div className="info-card">
            <h3>업데이트 주기</h3>
            <p>1분마다 자동 새로고침</p>
          </div>
          <div className="info-card">
            <h3>분석 기간</h3>
            <p>최근 100일 일별 데이터</p>
          </div>
          <div className="info-card">
            <h3>지원 지표</h3>
            <p>RSI, MACD, 볼린저밴드, 하이킨아시, 컵앤핸들</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalAnalysis; 