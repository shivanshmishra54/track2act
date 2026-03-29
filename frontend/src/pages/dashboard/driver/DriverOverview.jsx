import { useState } from "react"
import { motion } from "framer-motion"
import { Package, Truck, CheckCircle2, Navigation, AlertCircle, RefreshCw } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { useDriverShipments } from "./hooks/useDriverShipments"

export default function DriverOverview() {
  const { shipments, activeShipment, pendingTasks, deliveredShipments, loading, refetch } = useDriverShipments()
  const [isOnline, setIsOnline] = useState(true)
  const navigate = useNavigate()

  const STATS = [
    { label: "Active", value: activeShipment ? 1 : 0, icon: Truck, gradient: "from-primary/10 to-transparent", color: "text-primary", bg: "bg-primary/10" },
    { label: "Pending Tasks", value: pendingTasks.length, icon: Package, gradient: "from-amber-500/10 to-transparent", color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Delivered Today", value: deliveredShipments.length, icon: CheckCircle2, gradient: "from-success/10 to-transparent", color: "text-success", bg: "bg-success/10" },
  ]

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-5 lg:p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Your daily operations center</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={refetch} variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-border/60 bg-secondary/50">
              <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
              <span className="text-sm font-semibold">{isOnline ? "Online" : "Offline"}</span>
              <Switch checked={isOnline} onCheckedChange={setIsOnline} className="ml-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-5 lg:p-6 space-y-6">
        {/* Dynamic Hero Section */}
        <section>
          {activeShipment ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card p-6 lg:p-8 card-shadow-lg"
            >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              
              <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex h-6 items-center px-2.5 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">
                      ACTIVE SHIPMENT
                    </span>
                    <span className="text-sm font-mono text-muted-foreground">{activeShipment.trackingNumber}</span>
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight mb-2">Heading to {activeShipment.destinationName || "Destination"}</h2>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Navigation className="h-4 w-4" /> 
                    {activeShipment.currentProgress}% Journey completed
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="gap-2 font-semibold shadow-md shadow-primary/20" onClick={() => navigate('/dashboard/location')}>
                    <Navigation className="h-4 w-4" /> Open Navigation
                  </Button>
                  <Button size="lg" variant="secondary" className="gap-2 font-semibold" onClick={() => navigate(`/dashboard/shipment/${activeShipment.id}`)}>
                    View Details
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-border/60 bg-secondary/30 p-8 text-center card-shadow"
            >
              <div className="mx-auto w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <h2 className="text-xl font-bold mb-2">No Active Journey</h2>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                {isOnline ? "You don't have any shipments in transit right now. Check your pending tasks." : "Switch to Online mode to receive and manage new assignments."}
              </p>
              {isOnline && pendingTasks.length > 0 && (
                <Button onClick={() => navigate('/dashboard/tasks')}>View Pending Tasks</Button>
              )}
            </motion.div>
          )}
        </section>

        {/* Metrics Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATS.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className={`relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 card-shadow hover:-translate-y-0.5 transition-transform`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient}`} />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Up Next List */}
        {pendingTasks.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-base font-semibold tracking-tight">Up Next</h3>
            <div className="space-y-3">
              {pendingTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{task.originName || "Origin"} → {task.destinationName || "Destination"}</p>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">{task.trackingNumber}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/dashboard/shipment/${task.id}`}>Review</Link>
                  </Button>
                </div>
              ))}
            </div>
            {pendingTasks.length > 3 && (
              <Button variant="link" asChild className="text-muted-foreground h-auto p-0">
                <Link to="/dashboard/tasks">View all {pendingTasks.length} tasks</Link>
              </Button>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
