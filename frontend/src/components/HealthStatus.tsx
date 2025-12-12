import { FC } from 'react';

interface HealthStatusProps {
  data: {
    status: string;
    checks: {
      storage: string;
    };
  };
  apiUrl: string;
}

const HealthStatus: FC<HealthStatusProps> = ({ data, apiUrl }) => {
  const isHealthy = data.status === 'healthy';
  const storageOk = data.checks.storage === 'ok';

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">🏥 System Health</h2>
        <span className={`status-badge ${isHealthy ? 'healthy' : 'unhealthy'}`}>
          {isHealthy ? 'Healthy' : 'Unhealthy'}
        </span>
      </div>

      <div className="metrics-grid">
        <div className="metric-item">
          <div className="metric-label">API Status</div>
          <div className="metric-value">{isHealthy ? '✅' : '❌'}</div>
        </div>

        <div className="metric-item">
          <div className="metric-label">Storage (S3)</div>
          <div className="metric-value">{storageOk ? '✅' : '❌'}</div>
        </div>

        <div className="metric-item">
          <div className="metric-label">API Endpoint</div>
          <div className="metric-value" style={{ fontSize: '0.875rem' }}>{apiUrl}</div>
        </div>

        <div className="metric-item">
          <div className="metric-label">Last Check</div>
          <div className="metric-value" style={{ fontSize: '0.875rem' }}>
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthStatus;
