import ky from "ky";

const API_Base = "http://localhost:3000";

export const api = ky.create({
  prefixUrl: API_Base,
  timeout: 30000,
  hooks: {
    beforeRequest: [
      (request) => {
        // Add custom headers if needed
        // request.headers.set('X-Custom', 'value');
      },
    ],
  },
});

export interface HealthStatus {
  status: "healthy" | "unhealthy";
  checks: {
    storage: "ok" | "error";
  };
}

export interface DownloadJob {
  file_id: number;
  status: "completed" | "failed";
  downloadUrl: string | null;
  processingTimeMs?: number;
  message?: string;
  size?: number;
}
