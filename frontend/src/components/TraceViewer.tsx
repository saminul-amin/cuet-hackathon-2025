import { FC } from 'react';

const TraceViewer: FC = () => {
  const openJaeger = () => {
    window.open('http://localhost:16686', '_blank');
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">🔍 Distributed Tracing</h2>
        <span className="status-badge info">Jaeger UI</span>
      </div>

      <div style={{ padding: '1rem 0' }}>
        <p style={{ marginBottom: '1rem', color: '#6B7280' }}>
          View distributed traces across the application to debug performance issues and understand request flows.
        </p>

        <button className="btn btn-primary" onClick={openJaeger} style={{ width: '100%' }}>
          Open Jaeger UI
        </button>

        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#F3F4F6', borderRadius: '4px' }}>
          <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
            <strong>Jaeger Features:</strong>
          </div>
          <ul style={{ fontSize: '0.875rem', color: '#6B7280', marginLeft: '1.5rem' }}>
            <li>Search traces by service and operation</li>
            <li>View request timelines and dependencies</li>
            <li>Analyze performance bottlenecks</li>
            <li>Debug distributed systems</li>
          </ul>
        </div>

        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6B7280' }}>
          <strong>Trace Endpoint:</strong>{' '}
          <a href="http://localhost:16686" target="_blank" rel="noreferrer" className="link">
            http://localhost:16686
          </a>
        </div>
      </div>
    </div>
  );
};

export default TraceViewer;
