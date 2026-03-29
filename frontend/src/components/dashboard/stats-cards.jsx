import { motion } from "framer-motion"
import { Skeleton } from "../ui/skeleton"
import { TrendingUp, TrendingDown, Package, Truck, AlertTriangle, CheckCircle } from "lucide-react"

const STAT_CONFIGS = [
  {
    key: "totalShipments",
    title: "Total Shipments",
    change: "+12.5%",
    trend: "up",
    icon: Package,
    gradient: "from-indigo-500/20 to-indigo-600/5",
    iconBg: "bg-indigo-500/15 border-indigo-500/30",
    iconColor: "text-indigo-500 dark:text-indigo-400",
    badgeColor: "text-success",
  },
  {
    key: "activeShipments",
    title: "Active Shipments",
    change: "+8.2%",
    trend: "up",
    icon: Truck,
    gradient: "from-cyan-500/20 to-cyan-600/5",
    iconBg: "bg-cyan-500/15 border-cyan-500/30",
    iconColor: "text-cyan-500 dark:text-cyan-400",
    badgeColor: "text-success",
  },
  {
    key: "delayedShipments",
    title: "Delayed",
    change: "-15.3%",
    trend: "down",
    icon: AlertTriangle,
    gradient: "from-amber-500/20 to-amber-600/5",
    iconBg: "bg-amber-500/15 border-amber-500/30",
    iconColor: "text-amber-500 dark:text-amber-400",
    badgeColor: "text-success",
  },
  {
    key: "deliveredShipments",
    title: "Delivered",
    change: "+23.1%",
    trend: "up",
    icon: CheckCircle,
    gradient: "from-emerald-500/20 to-emerald-600/5",
    iconBg: "bg-emerald-500/15 border-emerald-500/30",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    badgeColor: "text-success",
  },
]

export function StatsCards({ stats = {}, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/50 bg-card p-5 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CONFIGS.map((config, index) => {
        const value = stats[config.key]?.toLocaleString() ?? 0
        const isUp = config.trend === "up"

        return (
          <motion.div
            key={config.title}
            className="group relative rounded-2xl border border-border/60 bg-card overflow-hidden card-shadow hover:card-shadow-lg transition-all duration-300 hover:border-border cursor-default"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            whileHover={{ y: -2 }}
          >
            {/* Gradient bg on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className="relative p-5">
              {/* Icon + Trend */}
              <div className="flex items-start justify-between mb-5">
                <div className={`inline-flex items-center justify-center rounded-xl p-2.5 border ${config.iconBg}`}>
                  <config.icon className={`h-5 w-5 ${config.iconColor}`} />
                </div>
                <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                  isUp 
                    ? "bg-success/10 text-success border border-success/20" 
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}>
                  {isUp 
                    ? <TrendingUp className="h-3 w-3" /> 
                    : <TrendingDown className="h-3 w-3" />
                  }
                  {config.change}
                </div>
              </div>

              {/* Value */}
              <div className="space-y-1">
                <p className="text-3xl font-extrabold tracking-tight">{value}</p>
                <p className="text-sm text-muted-foreground font-medium">{config.title}</p>
              </div>

              {/* Mini progress bar */}
              <div className="mt-4 h-0.5 w-full rounded-full bg-border/50 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${config.gradient.replace('/20', '').replace('/5', '')}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((Number(stats[config.key]) / 100) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.15, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
