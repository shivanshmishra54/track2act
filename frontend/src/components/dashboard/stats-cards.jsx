import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Package, Truck, AlertTriangle, CheckCircle } from "lucide-react"

const stats = [
  {
    title: "Active Shipments",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Package,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "In Transit",
    value: "1,423",
    change: "+8.2%",
    trend: "up",
    icon: Truck,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Disruptions",
    value: "23",
    change: "-15.3%",
    trend: "down",
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "On-Time Delivery",
    value: "94.7%",
    change: "+2.1%",
    trend: "up",
    icon: CheckCircle,
    color: "text-success",
    bgColor: "bg-success/10",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          className="rounded-xl border border-border/50 bg-card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className={`rounded-lg p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${
              stat.trend === "up" ? "text-success" : "text-destructive"
            }`}>
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {stat.change}
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
