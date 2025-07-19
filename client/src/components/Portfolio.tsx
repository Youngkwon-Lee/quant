import React from 'react';
import './Portfolio.css';

const Portfolio: React.FC = () => {
  return (
    <div className="portfolio">
      <div className="portfolio-header">
        <h1>💼 포트폴리오 관리</h1>
        <p>개인 암호화폐 포트폴리오 추적 및 분석</p>
      </div>

      <div className="portfolio-content">
        <div className="coming-soon">
          <div className="coming-soon-icon">🚧</div>
          <h2>준비 중입니다!</h2>
          <p>포트폴리오 관리 기능을 개발 중입니다.</p>
          
          <div className="planned-features">
            <h3>계획된 기능들:</h3>
            <ul>
              <li>✨ 포트폴리오 추적 및 수익률 계산</li>
              <li>📊 자산 배분 시각화</li>
              <li>📈 성과 분석 및 벤치마크 비교</li>
              <li>🎯 리스크 분석 및 분산투자 제안</li>
              <li>💰 세금 계산 및 손익 리포트</li>
              <li>🔔 포트폴리오 기반 알림 시스템</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio; 