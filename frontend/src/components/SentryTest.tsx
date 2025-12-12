import { AlertTriangle, Bug } from "lucide-react";
import { useState } from "react";
import { api } from "../lib/api";

export function SentryTest() {
  const [loading, setLoading] = useState(false);

  const triggerError = async () => {
    setLoading(true);
    try {
      await api.post("v1/download/check?sentry_test=true", {
        json: { file_id: 70000 },
      });
    } catch (err) {
      console.log("Expected error triggered:", err);
      // Sentry should pick this up automatically via middleware if configured in backend,
      // OR we capture it here if we want frontend reporting.
      // But the challenge says "This error should appear in your Sentry dashboard" referring to backend.
      // We can also throw a frontend error.
    } finally {
      setLoading(false);
    }
  };

  const throwFrontendError = () => {
    throw new Error("This is a test error from the Frontend!");
  };

  return (
    <div className="space-y-4">
      <button
        onClick={triggerError}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500/10 px-4 py-3 text-orange-400 transition-all hover:bg-orange-500/20 border border-orange-500/20"
      >
        <Bug className="h-5 w-5" />
        <span className="font-medium">Trigger Backend Error</span>
      </button>

      <button
        onClick={throwFrontendError}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-red-400 transition-all hover:bg-red-500/20 border border-red-500/20"
      >
        <AlertTriangle className="h-5 w-5" />
        <span className="font-medium">Throw Frontend Error</span>
      </button>

      <p className="text-xs text-gray-500 text-center px-4">
        Clicking these will generate exceptions that show up in Sentry.
      </p>
    </div>
  );
}
