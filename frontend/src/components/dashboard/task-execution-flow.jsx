import { motion } from "framer-motion"
import { 
  Radar, 
  BarChart3, 
  Brain, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Clock
} from "lucide-react"

const flowStages = [
  {
    id: "detection",
    name: "Detection",
    description: "Disruption identified",
    icon: Radar,
    status: "completed",
    timestamp: "14:23:07",
    details: "Port congestion detected at Mumbai/JNPT via IoT sensors",
  },
  {
    id: "impact",
    name: "Impact Analysis",
    description: "Affected assets mapped",
    icon: BarChart3,
    status: "completed",
    timestamp: "14:23:12",
    details: "127 shipments, 23 warehouses, ₹4.2Cr value at risk",
  },
  {
    id: "decision",
    name: "Decision",
    description: "Options evaluated",
    icon: Brain,
    status: "completed",
    timestamp: "14:23:18",
    details: "3 options analyzed, 'Reroute via Mundra' selected (94% confidence)",
  },
  {
    id: "action",
    name: "Action",
    description: "Executing response",
    icon: Zap,
    status: "active",
    timestamp: "14:23:25",
    details: "Initiating reroute for 84 priority shipments...",
  },
  {
    id: "outcome",
    name: "Outcome",
    description: "Resolution verified",
    icon: CheckCircle,
    status: "pending",
    details: "Awaiting completion confirmation",
  },
]

export function TaskExecutionFlow() {
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-accent/10 p-2">
            <Zap className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Task Execution Flow</h3>
            <p className="text-xs text-muted-foreground">Detection to Resolution Pipeline</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Started:</span>
          <span className="font-mono">14:23:07 IST</span>
        </div>
      </div>

      {/* Flow Visualization */}
      <div className="p-4">
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-border hidden sm:block" />
          <motion.div
            className="absolute top-6 left-6 h-0.5 bg-primary hidden sm:block"
            initial={{ width: 0 }}
            animate={{ width: "60%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Stages */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            {flowStages.map((stage, index) => (
              <motion.div
                key={stage.id}
                className="relative flex-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                {/* Stage Node */}
                <div className="flex sm:flex-col items-start sm:items-center gap-3 sm:gap-2">
                  <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                    stage.status === "completed"
                      ? "border-primary bg-primary text-primary-foreground"
                      : stage.status === "active"
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border bg-secondary text-muted-foreground"
                  }`}>
                    {stage.status === "active" && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [1, 0, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                      />
                    )}
                    <stage.icon className="h-5 w-5" />
                  </div>

                  <div className="sm:text-center flex-1">
                    <h4 className={`text-sm font-medium ${
                      stage.status === "pending" ? "text-muted-foreground" : ""
                    }`}>
                      {stage.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">{stage.description}</p>
                    
                    {stage.timestamp && (
                      <p className="text-[10px] font-mono text-muted-foreground mt-1">
                        {stage.timestamp}
                      </p>
                    )}
                  </div>

                  {/* Arrow for mobile */}
                  {index < flowStages.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground sm:hidden flex-shrink-0" />
                  )}
                </div>

                {/* Details Card */}
                {stage.details && (
                  <motion.div
                    className={`mt-3 rounded-lg p-2.5 text-xs ${
                      stage.status === "active"
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-secondary/50"
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.3 }}
                  >
                    <p className="text-muted-foreground leading-relaxed">{stage.details}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress Summary */}
        <motion.div
          className="mt-6 flex items-center justify-between rounded-lg bg-secondary/30 p-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm">
              <span className="font-medium">Stage 4 of 5:</span>
              <span className="text-muted-foreground ml-1">Executing reroute actions...</span>
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            ETA: ~8 minutes
          </div>
        </motion.div>
      </div>
    </div>
  )
}
