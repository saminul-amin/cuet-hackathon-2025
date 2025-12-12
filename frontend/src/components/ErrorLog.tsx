import { FC, useState } from 'react';

interface ErrorLogProps {
  apiUrl: string;
}

interface ErrorEntry {
  id: string;
  message: string;
  time: string;
}

const ErrorLog: FC<ErrorLogProps> = ({ apiUrl }) => {
  const [errors, setErrors] = useState<ErrorEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const triggerBackendError = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/v1/download/check?sentry_test=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_id: 70000 }),
      });

      const data = await response.json();
      
      const error: ErrorEntry = {
        id: crypto.randomUUID(),
        message: data.message || 'Sentry test error triggered',
        time: new Date().toLocaleTimeString(),
      };

      setErrors([error, ...errors.slice(0, 4)]);
    } catch (error: any) {
      const errorEntry: ErrorEntry = {
        id: crypto.randomUUID(),
        message: error.message || 'Failed to trigger error',
        time: new Date().toLocaleTimeString(),
      };

      setErrors([errorEntry, ...errors.slice(0, 4)]);
    } finally {
      setLoading(false);
    }
  };

  const triggerFrontendError = () => {
    const errorEntry: ErrorEntry = {
      id: crypto.randomUUID(),
      message: 'Frontend test error - This should appear in Sentry!',
      time: new Date().toLocaleTimeString(),
    };

    setErrors([errorEntry, ...errors.slice(0, 4)]);
    throw new Error(errorEntry.message);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">🐛 Error Tracking</h2>
        <span className="status-badge danger">{errors.length} Errors</span>
      </div>

      <div className="button-group">
        <button
          className="btn btn-danger"
          onClick={triggerBackendError}
          disabled={loading}
        >
          {loading ? 'Triggering...' : 'Trigger Backend Error'}
        </button>
        <button
          className="btn btn-warning"
          onClick={triggerFrontendError}
        >
          Trigger Frontend Error
        </button>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        {errors.length === 0 ? (
          <div className="empty-state">No errors logged yet. Click the buttons above to test Sentry integration.</div>
        ) : (
          errors.map((error) => (
            <div key={error.id} className="error-item">
              <div className="error-message">{error.message}</div>
              <div className="error-time">{error.time}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ErrorLog;
