import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const ports = [
  { id: "mumbai", name: "Mumbai/JNPT", x: 18, y: 58, type: "port" },
  { id: "mundra", name: "Mundra", x: 15, y: 48, type: "port" },
  { id: "chennai", name: "Chennai", x: 55, y: 78, type: "port" },
  { id: "kolkata", name: "Kolkata", x: 75, y: 48, type: "port" },
  { id: "delhi", name: "Delhi NCR", x: 42, y: 32, type: "hub" },
  { id: "bangalore", name: "Bangalore", x: 45, y: 80, type: "warehouse" },
  { id: "hyderabad", name: "Hyderabad", x: 48, y: 65, type: "warehouse" },
  { id: "ahmedabad", name: "Ahmedabad", x: 22, y: 45, type: "warehouse" },
  { id: "pune", name: "Pune", x: 25, y: 62, type: "warehouse" },
  { id: "jaipur", name: "Jaipur", x: 35, y: 38, type: "hub" },
]

const routes = [
  { id: "r1", from: "mumbai", to: "delhi", active: true },
  { id: "r2", from: "mundra", to: "delhi", active: true },
  { id: "r3", from: "chennai", to: "bangalore", active: true },
  { id: "r4", from: "chennai", to: "hyderabad", active: true },
  { id: "r5", from: "kolkata", to: "delhi", active: true },
  { id: "r6", from: "delhi", to: "jaipur", active: true },
  { id: "r7", from: "mumbai", to: "pune", active: true },
  { id: "r8", from: "ahmedabad", to: "mumbai", active: true },
  { id: "r9", from: "hyderabad", to: "bangalore", active: true },
  { id: "r10", from: "delhi", to: "hyderabad", active: true },
]

function getPortPosition(portId) {
  const port = ports.find((p) => p.id === portId)
  return port ? { x: port.x, y: port.y } : { x: 0, y: 0 }
}

function AnimatedRoute({ route, index }) {
  const from = getPortPosition(route.from)
  const to = getPortPosition(route.to)
  
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2 - 5
  
  const pathD = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`

  return (
    <g>
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#routeGradient)"
        strokeWidth="0.5"
        strokeOpacity="0.3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: index * 0.1 }}
      />
      <motion.circle
        r="1"
        fill="var(--glow)"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 3,
          delay: index * 0.2,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        <animateMotion
          dur={`${3 + index * 0.3}s`}
          repeatCount="indefinite"
          path={pathD}
        />
      </motion.circle>
      <motion.circle
        r="0.8"
        fill="var(--accent)"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{
          duration: 4,
          delay: index * 0.3 + 1,
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
      >
        <animateMotion
          dur={`${4 + index * 0.2}s`}
          repeatCount="indefinite"
          path={pathD}
        />
      </motion.circle>
    </g>
  )
}

function PortNode({ port, index }) {
  const [isHovered, setIsHovered] = useState(false)
  
  const colors = {
    port: "var(--primary)",
    warehouse: "var(--accent)",
    hub: "var(--success)",
  }

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: "pointer" }}
    >
      {/* Pulse effect */}
      <motion.circle
        cx={port.x}
        cy={port.y}
        r="3"
        fill={colors[port.type]}
        opacity="0.2"
        animate={{
          r: [3, 6, 3],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.2,
        }}
      />
      
      {/* Main node */}
      <motion.circle
        cx={port.x}
        cy={port.y}
        r={isHovered ? 2.5 : 2}
        fill={colors[port.type]}
        animate={{
          filter: isHovered ? "drop-shadow(0 0 4px var(--glow))" : "none",
        }}
      />
      
      {/* Label */}
      <motion.text
        x={port.x}
        y={port.y - 4}
        textAnchor="middle"
        fill="currentColor"
        fontSize="2.5"
        fontWeight="500"
        opacity={isHovered ? 1 : 0.7}
        className="pointer-events-none select-none"
      >
        {port.name}
      </motion.text>
    </motion.g>
  )
}

export function IndiaMap() {
  const [mounted, setMounted] = useState(false)

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
    <div className="relative h-full w-full">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        style={{ filter: "drop-shadow(0 0 20px rgba(100, 150, 255, 0.1))" }}
      >
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="var(--glow)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="indiaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* India outline - simplified stylized version */}
        <motion.path
          d="M35 15 L55 12 L70 20 L78 35 L80 50 L75 55 L78 70 L70 80 L55 88 L45 85 L40 78 L35 82 L25 75 L20 65 L15 55 L12 45 L15 35 L25 25 Z"
          fill="url(#indiaGlow)"
          stroke="var(--primary)"
          strokeWidth="0.3"
          strokeOpacity="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />

        {/* Animated routes */}
        {routes.map((route, index) => (
          <AnimatedRoute key={route.id} route={route} index={index} />
        ))}

        {/* Port nodes */}
        {ports.map((port, index) => (
          <PortNode key={port.id} port={port} index={index} />
        ))}
      </svg>

      {/* Legend */}
      <motion.div
        className="absolute bottom-4 left-4 flex flex-col gap-2 rounded-lg bg-card/80 p-3 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <div className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-muted-foreground">Major Ports</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="text-muted-foreground">Warehouses</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="text-muted-foreground">Distribution Hubs</span>
        </div>
      </motion.div>
    </div>
  )
}
