import React from 'react';
import './Alerts.css';

const Alerts: React.FC = () => {
  return (
    <div className="alerts">
      <div className="alerts-header">
        <h1>🔔 스마트 알림</h1>
        <p>맞춤형 가격 알림 및 시그널 알림 시스템</p>
      </div>

      <div className="alerts-content">
        <div className="coming-soon">
          <div className="coming-soon-icon">🚧</div>
          <h2>준비 중입니다!</h2>
          <p>스마트 알림 시스템을 개발 중입니다.</p>
          
          <div className="planned-features">
            <h3>계획된 기능들:</h3>
            <ul>
              <li>📱 실시간 가격 알림 설정</li>
              <li>🎯 기술적 시그널 알림</li>
              <li>📰 중요 뉴스 알림</li>
              <li>💬 카카오톡/텔레그램 봇 연동</li>
              <li>📧 이메일 알림 시스템</li>
              <li>📊 알림 히스토리 및 통계</li>
              <li>⚙️ 개인화된 알림 설정</li>
              <li>🔄 스마트 알림 자동 조정</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts; 