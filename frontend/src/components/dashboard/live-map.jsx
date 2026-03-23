import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { AlertTriangle, Package, Truck, CloudRain, Ship } from "lucide-react"

const disruptions = [
  {
    id: "d1",
    type: "port_delay",
    location: { x: 18, y: 58 },
    name: "Mumbai/JNPT",
    severity: "high",
    message: "Container backlog - 48hr delay",
    affectedShipments: 127,
  },
  {
    id: "d2",
    type: "weather",
    location: { x: 55, y: 78 },
    name: "Chennai",
    severity: "medium",
    message: "Cyclone warning - Route diversions",
    affectedShipments: 45,
  },
  {
    id: "d3",
    type: "supplier",
    location: { x: 45, y: 80 },
    name: "Bangalore Hub",
    severity: "low",
    message: "Supplier delay - Alternative sourced",
    affectedShipments: 12,
  },
]

const shipments = [
  {
    id: "s1",
    from: { x: 15, y: 48, name: "Mundra" },
    to: { x: 42, y: 32, name: "Delhi NCR" },
    progress: 0.65,
    status: "on-time",
    value: "₹2.4Cr",
  },
  {
    id: "s2",
    from: { x: 18, y: 58, name: "Mumbai" },
    to: { x: 48, y: 65, name: "Hyderabad" },
    progress: 0.3,
    status: "delayed",
    value: "₹1.8Cr",
  },
  {
    id: "s3",
    from: { x: 75, y: 48, name: "Kolkata" },
    to: { x: 45, y: 80, name: "Bangalore" },
    progress: 0.85,
    status: "on-time",
    value: "₹3.2Cr",
  },
  {
    id: "s4",
    from: { x: 55, y: 78, name: "Chennai" },
    to: { x: 42, y: 32, name: "Delhi NCR" },
    progress: 0.15,
    status: "at-risk",
    value: "₹4.1Cr",
  },
]

function DisruptionMarker({ disruption, index }) {
  const [isHovered, setIsHovered] = useState(false)
  
  const colors = {
    high: "var(--destructive)",
    medium: "var(--warning)",
    low: "var(--accent)",
  }

  const icons = {
    weather: CloudRain,
    port_delay: Ship,
    supplier: Package,
    transport: Truck,
  }

  const Icon = icons[disruption.type]

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: "pointer" }}
    >
      {/* Ripple effect */}
      <motion.circle
        cx={disruption.location.x}
        cy={disruption.location.y}
        r="2"
        fill="none"
        stroke={colors[disruption.severity]}
        strokeWidth="0.5"
        animate={{
          r: [2, 8, 2],
          opacity: [0.8, 0, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.3,
        }}
      />
      
      {/* Secondary ripple */}
      <motion.circle
        cx={disruption.location.x}
        cy={disruption.location.y}
        r="2"
        fill="none"
        stroke={colors[disruption.severity]}
        strokeWidth="0.3"
        animate={{
          r: [2, 12, 2],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: index * 0.3 + 0.5,
        }}
      />

      {/* Main marker */}
      <motion.circle
        cx={disruption.location.x}
        cy={disruption.location.y}
        r={isHovered ? 3 : 2.5}
        fill={colors[disruption.severity]}
      />

      {/* Tooltip */}
      {isHovered && (
        <foreignObject
          x={disruption.location.x + 5}
          y={disruption.location.y - 15}
          width="35"
          height="25"
        >
          <div className="rounded bg-popover px-2 py-1 text-[3px] text-popover-foreground shadow-lg">
            <div className="font-medium">{disruption.name}</div>
            <div className="text-muted-foreground">{disruption.message}</div>
          </div>
        </foreignObject>
      )}
    </motion.g>
  )
}

function ShipmentRoute({ shipment, index }) {
  const colors = {
    "on-time": "var(--success)",
    delayed: "var(--destructive)",
    "at-risk": "var(--warning)",
  }

  const midX = (shipment.from.x + shipment.to.x) / 2
  const midY = (shipment.from.y + shipment.to.y) / 2 - 8
  const pathD = `M ${shipment.from.x} ${shipment.from.y} Q ${midX} ${midY} ${shipment.to.x} ${shipment.to.y}`

  // Calculate position along path
  const currentX = shipment.from.x + (shipment.to.x - shipment.from.x) * shipment.progress
  const currentY = shipment.from.y + (shipment.to.y - shipment.from.y) * shipment.progress - 
    (Math.sin(shipment.progress * Math.PI) * 8) // Arc effect

  return (
    <g>
      {/* Route path */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={colors[shipment.status]}
        strokeWidth="0.4"
        strokeOpacity="0.4"
        strokeDasharray="2 1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: index * 0.2 }}
      />

      {/* Traveled portion */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={colors[shipment.status]}
        strokeWidth="0.6"
        strokeDasharray={`${shipment.progress * 100} 100`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: shipment.progress }}
        transition={{ duration: 1.5, delay: index * 0.2 }}
      />

      {/* Shipment indicator */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.2 + 1 }}
      >
        <circle
          cx={currentX}
          cy={currentY}
          r="1.5"
          fill={colors[shipment.status]}
        />
        <motion.circle
          cx={currentX}
          cy={currentY}
          r="2"
          fill="none"
          stroke={colors[shipment.status]}
          strokeWidth="0.3"
          animate={{
            r: [2, 3.5, 2],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      </motion.g>
    </g>
  )
}

export function LiveMap() {
  const [mounted, setMounted] = useState(false)
  const [selectedDisruption, setSelectedDisruption] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="relative h-full w-full rounded-xl border border-border/50 bg-card overflow-hidden">
      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-background/90 px-3 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-xs font-medium">Live Tracking</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 rounded-lg bg-background/90 px-3 py-1.5 backdrop-blur-sm text-xs">
          <span className="text-muted-foreground">Active Disruptions:</span>
          <span className="font-bold text-destructive">{disruptions.length}</span>
        </div>
      </div>

      {/* SVG Map */}
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        style={{ filter: "drop-shadow(0 0 30px rgba(100, 150, 255, 0.1))" }}
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
          <filter id="mapBlur">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* India outline */}
        <motion.path
          d="M35 15 L55 12 L70 20 L78 35 L80 50 L75 55 L78 70 L70 80 L55 88 L45 85 L40 78 L35 82 L25 75 L20 65 L15 55 L12 45 L15 35 L25 25 Z"
          fill="url(#mapGlow)"
          stroke="var(--border)"
          strokeWidth="0.3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2 }}
        />

        {/* Grid overlay */}
        {[20, 40, 60, 80].map((x) => (
          <line
            key={`v-${x}`}
            x1={x}
            y1="10"
            x2={x}
            y2="90"
            stroke="var(--border)"
            strokeWidth="0.1"
            strokeOpacity="0.3"
          />
        ))}
        {[20, 40, 60, 80].map((y) => (
          <line
            key={`h-${y}`}
            x1="10"
            y1={y}
            x2="90"
            y2={y}
            stroke="var(--border)"
            strokeWidth="0.1"
            strokeOpacity="0.3"
          />
        ))}

        {/* Shipment routes */}
        {shipments.map((shipment, index) => (
          <ShipmentRoute key={shipment.id} shipment={shipment} index={index} />
        ))}

        {/* Disruption markers */}
        {disruptions.map((disruption, index) => (
          <DisruptionMarker key={disruption.id} disruption={disruption} index={index} />
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 rounded-lg bg-background/90 p-3 backdrop-blur-sm text-xs">
        <div className="font-medium mb-1">Shipment Status</div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="text-muted-foreground">On Time</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-warning" />
          <span className="text-muted-foreground">At Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-destructive" />
          <span className="text-muted-foreground">Delayed</span>
        </div>
      </div>

      {/* Active Disruptions Panel */}
      <div className="absolute bottom-4 right-4 w-64 rounded-lg bg-background/90 p-3 backdrop-blur-sm text-xs">
        <div className="font-medium mb-2">Active Disruptions</div>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {disruptions.map((d) => (
            <div
              key={d.id}
              className="flex items-start gap-2 rounded-md bg-secondary/50 p-2"
            >
              <AlertTriangle className={`h-3 w-3 mt-0.5 flex-shrink-0 ${
                d.severity === "high" ? "text-destructive" :
                d.severity === "medium" ? "text-warning" : "text-accent"
              }`} />
              <div className="min-w-0">
                <div className="font-medium truncate">{d.name}</div>
                <div className="text-muted-foreground truncate">{d.message}</div>
                <div className="text-muted-foreground mt-0.5">
                  {d.affectedShipments} shipments affected
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
