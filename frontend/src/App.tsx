import { useState, useEffect } from 'react';
import HealthStatus from './components/HealthStatus';
import DownloadJobs from './components/DownloadJobs';
import ErrorLog from './components/ErrorLog';
import MetricsPanel from './components/MetricsPanel';
import TraceViewer from './components/TraceViewer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      setHealthData(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch health:', error);
      setHealthData({ status: 'unhealthy', checks: { storage: 'error' } });
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>📊 Observability Dashboard</h1>
          <p>Monitor download microservice health, performance, and errors</p>
        </div>
      </header>

      <div className="container">
        {loading ? (
          <div className="loading">Loading dashboard...</div>
        ) : (
          <>
            <div className="dashboard-grid">
              <HealthStatus data={healthData} apiUrl={API_URL} />
              <MetricsPanel apiUrl={API_URL} />
            </div>

            <div className="dashboard-grid">
              <DownloadJobs apiUrl={API_URL} />
              <ErrorLog apiUrl={API_URL} />
            </div>

            <TraceViewer />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
