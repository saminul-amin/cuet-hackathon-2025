# Backend API Documentation

This document provides a summary of the backend API endpoints for the Delineate Hackathon Challenge.

## General Endpoints

### 1. Root Endpoint

- **Method:** `GET`
- **Path:** `/`
- **Description:** Returns a welcome message to verify the API is reachable.
- **Request:** None
- **Response (200 OK):**
  ```json
  {
    "message": "Hello Hono!"
  }
  ```

### 2. Health Check

- **Method:** `GET`
- **Path:** `/health`
- **Description:** Checks the health status of the service and its dependencies (e.g., S3).
- **Request:** None
- **Response (200 OK / 503 Service Unavailable):**
  ```json
  {
    "status": "healthy",
    "checks": {
      "storage": "ok"
    }
  }
  ```

### 3. Metrics

- **Method:** `GET`
- **Path:** `/metrics`
- **Description:** Exposes Prometheus metrics for monitoring system performance.
- **Request:** None
- **Response:** Plain text Prometheus metrics.

---

## Download Endpoints

### 4. Initiate Download Job

- **Method:** `POST`
- **Path:** `/v1/download/initiate`
- **Description:** Initiates a batch download job for multiple file IDs.
- **Request Body:**
  ```json
  {
    "file_ids": [10000, 10001, 10005]
  }
  ```
  _Constraints:_ `file_ids` must be an array of integers between 10,000 and 100,000,000.
- **Response (200 OK):**
  ```json
  {
    "jobId": "uuid-string",
    "status": "queued",
    "totalFileIds": 3
  }
  ```

### 5. Check Download Availability

- **Method:** `POST`
- **Path:** `/v1/download/check`
- **Description:** Checks if a specific file ID is available for download in S3.
- **Request Body:**
  ```json
  {
    "file_id": 10000
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "file_id": 10000,
    "available": true,
    "s3Key": "downloads/10000.zip",
    "size": 1024
  }
  ```

### 6. Start Download (Long Polling Simulation)

- **Method:** `POST`
- **Path:** `/v1/download/start`
- **Description:** Starts a file download process. This endpoint simulates a long-running operation with a random delay (configurabe via env vars) to test timeout handling.
- **Request Body:**
  ```json
  {
    "file_id": 10000
  }
  ```
- **Response (200 OK - Success):**
  ```json
  {
    "file_id": 10000,
    "status": "completed",
    "downloadUrl": "https://storage.example.com/downloads/10000.zip?token=...",
    "size": 1024,
    "processingTimeMs": 5000,
    "message": "Download ready after 5.0 seconds"
  }
  ```
- **Response (200 OK - Failed):**
  ```json
  {
    "file_id": 10000,
    "status": "failed",
    "downloadUrl": null,
    "size": null,
    "processingTimeMs": 5000,
    "message": "File not found after 5.0 seconds of processing"
  }
  ```

---

## Documentation Endpoints (Development Only)

### 7. OpenAPI Specification

- **Method:** `GET`
- **Path:** `/openapi`
- **Description:** Returns the raw OpenAPI 3.0.0 specification JSON.

### 8. API Reference UI

- **Method:** `GET`
- **Path:** `/docs`
- **Description:** Interactive API documentation using Scalar.
