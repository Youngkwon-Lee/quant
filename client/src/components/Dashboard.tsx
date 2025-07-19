import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

interface BitcoinData {
  usd: number;
  usd_24h_change: number;
  usd_24h_vol: number;
  usd_market_cap: number;
}

const Dashboard: React.FC = () => {
  const [bitcoinData, setBitcoinData] = useState<BitcoinData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('로딩 중...');
  const [isLoading, setIsLoading] = useState(true);

  const loadBitcoinData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true'
      );
      const data = await response.json();
      
      if (data.bitcoin) {
        setBitcoinData(data.bitcoin);
        setLastUpdate(new Date().toLocaleString());
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Bitcoin 데이터 로딩 오류:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBitcoinData();
    
    // 30초마다 자동 새로고침
    const interval = setInterval(loadBitcoinData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    return num.toLocaleString();
  };

  return (
    <div className="dashboard">
      {/* 실시간 상태 바 */}
      <div className="status-bar">
        <div className="status-indicator">
          <div className="status-dot"></div>
          실시간 데이터 연결됨 | CoinGecko API | 마지막 업데이트: {lastUpdate}
        </div>
      </div>

      {/* 히어로 섹션 */}
      <div className="hero-section">
        <h1 className="hero-title">Bitcoin Analysis Platform</h1>
        <p className="hero-subtitle">실시간 암호화폐 분석, 기술적 지표, 온체인 데이터를 한 곳에서</p>
        
        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-value bitcoin-price">
              {isLoading ? 'Loading...' : `$${bitcoinData?.usd.toLocaleString()}`}
            </div>
            <div>Bitcoin (BTC)</div>
          </div>
          <div className="stat-card">
            <div className={`stat-value ${bitcoinData && bitcoinData.usd_24h_change > 0 ? 'change-positive' : 'change-negative'}`}>
              {isLoading ? 'Loading...' : 
                `${bitcoinData && bitcoinData.usd_24h_change > 0 ? '+' : ''}${bitcoinData?.usd_24h_change.toFixed(2)}%`
              }
            </div>
            <div>24h 변동률</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {isLoading ? 'Loading...' : `$${formatNumber(bitcoinData?.usd_24h_vol || 0)}`}
            </div>
            <div>거래량 (24h)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {isLoading ? 'Loading...' : `$${formatNumber(bitcoinData?.usd_market_cap || 0)}`}
            </div>
            <div>시가총액</div>
          </div>
        </div>
      </div>

      {/* 대시보드 그리드 */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">📊</div>
          <h3 className="card-title">실시간 Bitcoin 분석</h3>
          <p className="card-description">
            실시간 가격 데이터와 기본적인 기술적 분석을 제공합니다.
          </p>
          <ul className="card-features">
            <li>실시간 가격 및 변동률</li>
            <li>RSI, MACD, 볼린저밴드</li>
            <li>온체인 메트릭</li>
            <li>가치 투자 지표</li>
            <li>자동 30초 새로고침</li>
          </ul>
          <Link to="/realtime" className="launch-button">
            🚀 실시간 분석 시작
          </Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📈</div>
          <h3 className="card-title">고급 기술적 분석</h3>
          <p className="card-description">
            Chart.js 기반의 고급 차트와 시그널 감지 시스템입니다.
          </p>
          <ul className="card-features">
            <li>캔들스틱 & 하이킨아시 차트</li>
            <li>양봉/음봉 전환 시그널</li>
            <li>컵앤핸들 패턴 감지</li>
            <li>MACD, RSI 차트 시각화</li>
            <li>시그널 내보내기</li>
          </ul>
          <Link to="/technical" className="launch-button">
            📈 고급 차트 보기
          </Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🔗</div>
          <h3 className="card-title">온체인 분석</h3>
          <p className="card-description">
            블록체인 데이터 기반의 심화 분석을 제공합니다.
          </p>
          <ul className="card-features">
            <li>고래 거래 추적</li>
            <li>거래소 유입/유출</li>
            <li>네트워크 해시레이트</li>
            <li>DeFi 프로토콜 TVL</li>
            <li>스테이킹 리워드</li>
          </ul>
          <button className="launch-button" onClick={() => alert('준비 중입니다!')}>
            🔗 온체인 분석
          </button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🎯</div>
          <h3 className="card-title">AI 예측 모델</h3>
          <p className="card-description">
            머신러닝 기반의 가격 예측 및 트렌드 분석입니다.
          </p>
          <ul className="card-features">
            <li>LSTM 가격 예측</li>
            <li>감정 분석</li>
            <li>뉴스 영향도 분석</li>
            <li>거래량 예측</li>
            <li>변동성 모델링</li>
          </ul>
          <button className="launch-button" onClick={() => alert('준비 중입니다!')}>
            🎯 AI 예측
          </button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">💼</div>
          <h3 className="card-title">포트폴리오 관리</h3>
          <p className="card-description">
            개인 포트폴리오 추적 및 수익률 분석 도구입니다.
          </p>
          <ul className="card-features">
            <li>포트폴리오 추적</li>
            <li>수익률 계산</li>
            <li>리스크 분석</li>
            <li>분산투자 제안</li>
            <li>세금 계산</li>
          </ul>
          <Link to="/portfolio" className="launch-button">
            💼 포트폴리오
          </Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🔔</div>
          <h3 className="card-title">스마트 알림</h3>
          <p className="card-description">
            맞춤형 가격 알림 및 시그널 알림 시스템입니다.
          </p>
          <ul className="card-features">
            <li>가격 알림 설정</li>
            <li>기술적 시그널 알림</li>
            <li>뉴스 알림</li>
            <li>카카오톡/이메일 연동</li>
            <li>알림 히스토리</li>
          </ul>
          <Link to="/alerts" className="launch-button">
            🔔 알림 설정
          </Link>
        </div>
      </div>

      {/* 푸터 */}
      <div className="footer">
        <p>&copy; 2024 CryptoQuant Pro - Bitcoin Analysis Platform</p>
        <p>실시간 데이터 제공: CoinGecko API | 모든 분석은 참고용이며 투자 권유가 아닙니다</p>
      </div>
    </div>
  );
};

export default Dashboard; 