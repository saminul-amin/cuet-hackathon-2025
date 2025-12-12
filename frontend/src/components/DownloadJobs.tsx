import { FC, useState } from "react";

interface DownloadJobsProps {
  apiUrl: string;
}

interface Download {
  id: string;
  fileId: number;
  status: string;
  time: string;
}

const DownloadJobs: FC<DownloadJobsProps> = ({ apiUrl }) => {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [fileId, setFileId] = useState("70000");
  const [loading, setLoading] = useState(false);

  const handleCheckFile = async () => {
    if (!fileId) return;
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/v1/download/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_id: parseInt(fileId) }),
      });

      const data = await response.json();
      const download: Download = {
        id: crypto.randomUUID(),
        fileId: data.file_id,
        status: data.available ? "Available" : "Not Available",
        time: new Date().toLocaleTimeString(),
      };

      setDownloads([download, ...downloads.slice(0, 4)]);
    } catch (error) {
      console.error("Check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDownload = async () => {
    if (!fileId) return;
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/v1/download/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_id: parseInt(fileId) }),
      });

      const data = await response.json();
      const download: Download = {
        id: crypto.randomUUID(),
        fileId: data.file_id,
        status: data.status === "completed" ? "Completed" : "Failed",
        time: new Date().toLocaleTimeString(),
      };

      setDownloads([download, ...downloads.slice(0, 4)]);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">💾 Download Jobs</h2>
        <span className="status-badge info">{downloads.length} Total</span>
      </div>

      <div className="form-group">
        <label className="form-label">File ID (10,000 - 100,000,000)</label>
        <input
          type="number"
          className="form-input"
          value={fileId}
          onChange={(e) => setFileId(e.target.value)}
          placeholder="Enter file ID"
          min="10000"
          max="100000000"
        />
      </div>

      <div className="button-group">
        <button
          className="btn btn-primary"
          onClick={handleCheckFile}
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Availability"}
        </button>
        <button
          className="btn btn-success"
          onClick={handleStartDownload}
          disabled={loading}
        >
          {loading ? "Processing..." : "Start Download"}
        </button>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        {downloads.length === 0 ? (
          <div className="empty-state">
            No jobs yet. Try checking or starting a download.
          </div>
        ) : (
          downloads.map((download) => (
            <div key={download.id} className="download-item">
              <div className="download-header">
                <span className="download-id">File #{download.fileId}</span>
                <span
                  className={`status-badge ${download.status.toLowerCase().replace(" ", "-")}`}
                >
                  {download.status}
                </span>
              </div>
              <div className="download-meta">{download.time}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DownloadJobs;
