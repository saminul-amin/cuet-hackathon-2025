import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App";
import { initInstrumentation } from "./tracing";
import "./index.css";

// Initialize OpenTelemetry
initInstrumentation();

// Initialize Sentry (will only work if SENTRY_DSN is provided via env)
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || "";

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<div>An error has occurred</div>}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
);
