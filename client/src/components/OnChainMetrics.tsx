import React, { useState, useEffect } from 'react';

interface OnChainMetricsProps {
  symbol: string;
  data: any;
}

interface MetricCard {
  title: string;
  value: number;
  change: number;
  unit: string;
  icon: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
}

const OnChainMetrics: React.FC<OnChainMetricsProps> = ({ symbol, data }) => {
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  useEffect(() => {
    if (data) {
      const mockMetrics: MetricCard[] = [
        {
          title: 'Network Value to Transactions',
          value: Math.random() * 100 + 50,
          change: (Math.random() - 0.5) * 20,
          unit: '',
          icon: '🌐',
          description: 'Market cap to 24h transaction volume ratio',
          trend: 'up'
        },
        {
          title: 'MVRV Ratio',
          value: Math.random() * 3 + 1,
          change: (Math.random() - 0.5) * 10,
          unit: '',
          icon: '💰',
          description: 'Market Value to Realized Value ratio',
          trend: 'neutral'
        },
        {
          title: 'Realized Cap',
          value: Math.random() * 500 + 200,
          change: (Math.random() - 0.5) * 5,
          unit: 'B',
          icon: '💎',
          description: 'Total value of all coins at their last moved price',
          trend: 'up'
        },
        {
          title: 'HODLer Net Position',
          value: Math.random() * 1000 + 500,
          change: (Math.random() - 0.5) * 50,
          unit: 'K',
          icon: '🤝',
          description: 'Net position change of long-term holders',
          trend: 'up'
        },
        {
          title: 'Exchange Whale Ratio',
          value: Math.random() * 0.1 + 0.05,
          change: (Math.random() - 0.5) * 0.02,
          unit: '',
          icon: '🐋',
          description: 'Ratio of whale transactions to total exchange transactions',
          trend: 'down'
        },
        {
          title: 'Futures Open Interest',
          value: Math.random() * 10 + 5,
          change: (Math.random() - 0.5) * 2,
          unit: 'B',
          icon: '📊',
          description: 'Total open interest in futures contracts',
          trend: 'up'
        },
        {
          title: 'Fear & Greed Index',
          value: Math.random() * 100,
          change: (Math.random() - 0.5) * 20,
          unit: '',
          icon: '🔥',
          description: 'Market sentiment indicator (0-100)',
          trend: 'neutral'
        },
        {
          title: 'Long/Short Ratio',
          value: Math.random() * 2 + 0.5,
          change: (Math.random() - 0.5) * 0.5,
          unit: '',
          icon: '⚖️',
          description: 'Ratio of long to short positions',
          trend: 'up'
        }
      ];

      setMetrics(mockMetrics);
    }
  }, [data, selectedTimeframe]);

  const formatValue = (value: number, unit: string) => {
    if (unit === 'B') return `$${value.toFixed(2)}B`;
    if (unit === 'K') return `${value.toFixed(0)}K`;
    if (unit === '%') return `${value.toFixed(2)}%`;
    return value.toFixed(2);
  };

  const getSignalColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'positive';
      case 'down': return 'negative';
      default: return 'neutral';
    }
  };

  return (
    <div className="onchain-metrics">
      <div className="metrics-header">
        <h3 className="metrics-title">
          <span className="metrics-icon">🔗</span>
          On-Chain Metrics - {symbol.toUpperCase()}
        </h3>
        <div className="timeframe-selector">
          {['1h', '24h', '7d', '30d'].map(timeframe => (
            <button
              key={timeframe}
              className={`btn btn-sm ${selectedTimeframe === timeframe ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-header">
              <div className="metric-icon">{metric.icon}</div>
              <div className="metric-info">
                <h4 className="metric-title">{metric.title}</h4>
                <p className="metric-description">{metric.description}</p>
              </div>
            </div>
            
            <div className="metric-value">
              <span className="value">{formatValue(metric.value, metric.unit)}</span>
              <span className={`change ${getSignalColor(metric.trend)}`}>
                {metric.change > 0 ? '+' : ''}{metric.change.toFixed(2)}%
              </span>
            </div>
            
            <div className="metric-chart">
              <div className="mini-chart">
                <svg viewBox="0 0 100 30" className="chart-svg">
                  <path
                    d={`M 0 15 Q 25 ${15 + Math.random() * 10 - 5} 50 ${15 + Math.random() * 10 - 5} T 100 ${15 + Math.random() * 10 - 5}`}
                    fill="none"
                    stroke={metric.trend === 'up' ? '#00ff88' : metric.trend === 'down' ? '#ff6b35' : '#00d4ff'}
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="additional-metrics">
        <div className="metric-category">
          <h4>🌊 Market Depth Analysis</h4>
          <div className="depth-metrics">
            <div className="depth-item">
              <span>Bid-Ask Spread:</span>
              <span className="value">{(Math.random() * 0.5).toFixed(3)}%</span>
            </div>
            <div className="depth-item">
              <span>Order Book Imbalance:</span>
              <span className="value">{(Math.random() * 20 + 40).toFixed(1)}%</span>
            </div>
            <div className="depth-item">
              <span>Liquidity Score:</span>
              <span className="value positive">{(Math.random() * 40 + 60).toFixed(0)}/100</span>
            </div>
          </div>
        </div>

        <div className="metric-category">
          <h4>⚡ Network Activity</h4>
          <div className="activity-metrics">
            <div className="activity-item">
              <span>Active Addresses (24h):</span>
              <span className="value">{Math.floor(Math.random() * 500000 + 200000).toLocaleString()}</span>
            </div>
            <div className="activity-item">
              <span>Transaction Count:</span>
              <span className="value">{Math.floor(Math.random() * 300000 + 100000).toLocaleString()}</span>
            </div>
            <div className="activity-item">
              <span>Average Fee:</span>
              <span className="value">${(Math.random() * 50 + 10).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="metric-category">
          <h4>🏦 Institutional Flow</h4>
          <div className="flow-metrics">
            <div className="flow-item">
              <span>Grayscale Holdings:</span>
              <span className="value">{(Math.random() * 100 + 600).toFixed(0)}K BTC</span>
            </div>
            <div className="flow-item">
              <span>MicroStrategy Holdings:</span>
              <span className="value">{(Math.random() * 50 + 120).toFixed(0)}K BTC</span>
            </div>
            <div className="flow-item">
              <span>ETF Flows (24h):</span>
              <span className="value positive">+${(Math.random() * 500 + 100).toFixed(0)}M</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnChainMetrics;