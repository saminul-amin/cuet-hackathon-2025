import { FC, useState, ChangeEvent } from "react";

interface UploadSectionProps {
  apiUrl: string;
}

const UploadSection: FC<UploadSectionProps> = ({ apiUrl }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first");
      setStatus("error");
      return;
    }

    setUploading(true);
    setStatus("idle");
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${apiUrl}/v1/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(`Uploaded ${data.filename} successfully! (Key: ${data.s3Key})`);
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        setStatus("error");
        setMessage(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("error");
      setMessage("Failed to upload file. Check network/backend.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">📤 Upload File</h2>
        <span className={`status-badge ${status === "success" ? "completed" : status === "error" ? "failed" : "info"}`}>
          {status === "idle" ? "Ready" : status}
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="file-upload" className="form-label">
          Select File to Upload to S3/MinIO
        </label>
        <input
          id="file-upload"
          type="file"
          className="form-input"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>

      {message && (
        <div className={`download-item`} style={{ 
          backgroundColor: status === "error" ? "#fee2e2" : "#dcfce7",
          color: status === "error" ? "#b91c1c" : "#15803d",
          border: `1px solid ${status === "error" ? "#f87171" : "#86efac"}`
        }}>
          {message}
        </div>
      )}

      <div className="button-group">
        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={!file || uploading}
          style={{ width: "100%" }}
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>
      </div>
      
      <div style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
        Files are uploaded to the <code>downloads</code> bucket in MinIO.
      </div>
    </div>
  );
};

export default UploadSection;
