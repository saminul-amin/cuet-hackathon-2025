import { FC, useState, useEffect } from "react";

interface MetricsPanelProps {
  apiUrl: string;
}

const MetricsPanel: FC<MetricsPanelProps> = ({ apiUrl }) => {
  const [metrics, setMetrics] = useState<string>("Loading metrics...");

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`${apiUrl}/metrics`);
      const text = await response.text();

      // Parse key metrics
      const httpRequests =
        text.match(/http_requests_total\{.*?\}\s+(\d+)/)?.[1] || "0";
      const activeDownloads =
        text.match(/active_downloads\s+(\d+)/)?.[1] || "0";

      setMetrics(
        `Requests: ${httpRequests} | Active Downloads: ${activeDownloads}`,
      );
    } catch (error) {
      setMetrics("Failed to fetch metrics");
    }
  };

  const openPrometheus = () => {
    window.open("http://localhost:9090", "_blank");
  };

  const openGrafana = () => {
    window.open("http://localhost:3001", "_blank");
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">📈 Performance Metrics</h2>
        <span className="status-badge processing">Live</span>
      </div>

      <div className="metrics-grid">
        <div className="metric-item">
          <div className="metric-label">Prometheus</div>
          <button
            className="btn btn-primary"
            onClick={openPrometheus}
            style={{ marginTop: "0.5rem", width: "100%" }}
          >
            Open Prometheus
          </button>
        </div>

        <div className="metric-item">
          <div className="metric-label">Grafana</div>
          <button
            className="btn btn-success"
            onClick={openGrafana}
            style={{ marginTop: "0.5rem", width: "100%" }}
          >
            Open Grafana
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          backgroundColor: "#F3F4F6",
          borderRadius: "4px",
        }}
      >
        <div
          style={{
            fontSize: "0.875rem",
            color: "#6B7280",
            marginBottom: "0.25rem",
          }}
        >
          Quick Metrics
        </div>
        <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>{metrics}</div>
      </div>

      <div
        style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#6B7280" }}
      >
        <strong>Available Services:</strong>
        <ul style={{ marginTop: "0.5rem", marginLeft: "1.5rem" }}>
          <li>
            Prometheus:{" "}
            <a
              href="http://localhost:9090"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              localhost:9090
            </a>
          </li>
          <li>
            Grafana:{" "}
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              localhost:3001
            </a>{" "}
            (admin/admin)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MetricsPanel;
