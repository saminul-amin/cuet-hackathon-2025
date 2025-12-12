import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "blue" | "green" | "red" | "purple";
  loading?: boolean;
}

const colorMap = {
  blue: "from-blue-500 to-cyan-400",
  green: "from-emerald-500 to-green-400",
  red: "from-rose-500 to-red-400",
  purple: "from-violet-500 to-purple-400",
};

export function StatsCard({ title, value, icon: Icon, color, loading }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-2xl bg-white/5 p-6 shadow-xl backdrop-blur-xl border border-white/10"
    >
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${colorMap[color]} opacity-20 blur-2xl`} />
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          {loading ? (
            <div className="mt-2 h-8 w-24 animate-pulse rounded bg-white/10" />
          ) : (
            <h3 className="mt-1 text-3xl font-bold text-white tracking-tight">{value}</h3>
          )}
        </div>
        <div className={`rounded-xl bg-gradient-to-br ${colorMap[color]} p-3 shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
