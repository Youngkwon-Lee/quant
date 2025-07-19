import React, { useEffect, useRef } from 'react';

interface CryptoChartProps {
  symbol: string;
  data: any;
  technicalIndicators: any;
}

const CryptoChart: React.FC<CryptoChartProps> = ({ symbol, data, technicalIndicators }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      // TradingView 차트 위젯 초기화
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if (window.TradingView) {
          new window.TradingView.widget({
            width: '100%',
            height: 400,
            symbol: `BINANCE:${symbol}USDT`,
            interval: '1H',
            timezone: 'Asia/Seoul',
            theme: 'dark',
            style: '1',
            locale: 'ko',
            toolbar_bg: '#1a1a24',
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: chartRef.current.id,
            studies: [
              'RSI@tv-basicstudies',
              'MACD@tv-basicstudies',
              'BB@tv-basicstudies'
            ],
            backgroundColor: '#1a1a24',
            gridColor: '#2a2a3a',
            overrides: {
              'paneProperties.background': '#1a1a24',
              'paneProperties.backgroundType': 'solid',
              'symbolWatermarkProperties.color': '#rgba(255, 255, 255, 0.1)',
              'scalesProperties.textColor': '#rgba(255, 255, 255, 0.8)',
              'scalesProperties.backgroundColor': '#1a1a24'
            }
          });
        }
      };
      document.head.appendChild(script);
    }
  }, [symbol]);

  return (
    <div className="crypto-chart-container">
      <div className="chart-header">
        <h3 className="chart-title">
          <span className="chart-icon">📈</span>
          {symbol.toUpperCase()} Advanced Chart
        </h3>
        <div className="chart-controls">
          <button className="btn btn-secondary btn-sm">1H</button>
          <button className="btn btn-secondary btn-sm">4H</button>
          <button className="btn btn-secondary btn-sm">1D</button>
          <button className="btn btn-secondary btn-sm">1W</button>
        </div>
      </div>
      
      <div 
        ref={chartRef} 
        id={`tradingview-chart-${symbol}`}
        className="tradingview-chart"
        style={{
          minHeight: '400px',
          backgroundColor: '#1a1a24',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden'
        }}
      />
      
      {technicalIndicators && (
        <div className="technical-indicators-overlay">
          <div className="indicator-item">
            <span className="indicator-label">RSI:</span>
            <span className={`indicator-value ${technicalIndicators.rsi?.value > 70 ? 'negative' : technicalIndicators.rsi?.value < 30 ? 'positive' : 'neutral'}`}>
              {technicalIndicators.rsi?.value?.toFixed(2)}
            </span>
          </div>
          <div className="indicator-item">
            <span className="indicator-label">MACD:</span>
            <span className={`indicator-value ${technicalIndicators.macd?.trend === 'Bullish' ? 'positive' : 'negative'}`}>
              {technicalIndicators.macd?.trend}
            </span>
          </div>
          <div className="indicator-item">
            <span className="indicator-label">BB:</span>
            <span className="indicator-value neutral">
              {technicalIndicators.bollingerBands?.position}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoChart;

// TypeScript 타입 확장
declare global {
  interface Window {
    TradingView: any;
  }
}