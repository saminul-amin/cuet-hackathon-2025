import { useEffect, useState } from "react";
import { SentryTest } from "./components/SentryTest";
import { StatsCard } from "./components/StatsCard";
import { Activity, Download, HardDrive, RefreshCw } from "lucide-react";
import { api, type HealthStatus } from "./lib/api";
import { motion } from "framer-motion";

function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // Poll health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await api.get("health").json<HealthStatus>();
        setHealth(res);
      } catch (err) {
        setHealth({ status: "unhealthy", checks: { storage: "error" } });
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-purple-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 shadow-lg shadow-purple-500/20">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                System Observability
              </h1>
              <p className="text-gray-400">Real-time metrics & performance</p>
            </div>
          </div>
          <div className="flex gap-4">
            <a
              href="http://localhost:16686"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10 border border-white/10"
            >
              <Activity className="h-4 w-4" />
              Opening Jaeger UI
            </a>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="System Status"
            value={health?.status === "healthy" ? "Healthy" : "Critical"}
            icon={Activity}
            color={health?.status === "healthy" ? "green" : "red"}
            loading={loading}
          />
          <StatsCard
            title="Storage Connection"
            value={health?.checks?.storage === "ok" ? "Connected" : "Error"}
            icon={HardDrive}
            color={health?.checks?.storage === "ok" ? "blue" : "red"}
            loading={loading}
          />
          <StatsCard
            title="Active Downloads"
            value="0" // TODO: Implement state tracking
            icon={Download}
            color="purple"
            loading={loading}
          />
          <StatsCard
            title="Response Time"
            value="45ms" // Mock
            icon={RefreshCw}
            color="blue"
            loading={loading}
          />
        </div>

        {/* Dashboard Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h2 className="text-xl font-semibold mb-6">Active Jobs</h2>
              <div className="rounded-xl border border-white/5 bg-black/20 p-8 text-center text-gray-500">
                No active downloads
              </div>
            </div>
          </div>

          {/* Sidebar / Actions */}
          <div className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h2 className="text-xl font-semibold mb-6">Actions</h2>
              <SentryTest />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
