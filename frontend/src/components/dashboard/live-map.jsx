import React from "react"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { AlertTriangle, Package, Truck, CloudRain, Ship } from "lucide-react"

// ─── Static data (unchanged) ────────────────────────────────────────────────
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

// ─── SVG sub-components (unchanged) ─────────────────────────────────────────
function DisruptionMarker({ disruption, index }) {
  const [isHovered, setIsHovered] = React.useState(false)
  
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
      <motion.circle
        cx={disruption.location.x}
        cy={disruption.location.y}
        r="2"
        fill="none"
        stroke={colors[disruption.severity]}
        strokeWidth="0.5"
        animate={{ r: [2, 8, 2], opacity: [0.8, 0, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
      />
      <motion.circle
        cx={disruption.location.x}
        cy={disruption.location.y}
        r="2"
        fill="none"
        stroke={colors[disruption.severity]}
        strokeWidth="0.3"
        animate={{ r: [2, 12, 2], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 + 0.5 }}
      />
      <motion.circle
        cx={disruption.location.x}
        cy={disruption.location.y}
        r={isHovered ? 3 : 2.5}
        fill={colors[disruption.severity]}
      />
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

  const currentX = shipment.from.x + (shipment.to.x - shipment.from.x) * shipment.progress
  const currentY = shipment.from.y + (shipment.to.y - shipment.from.y) * shipment.progress -
    (Math.sin(shipment.progress * Math.PI) * 8)

  return (
    <g>
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
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.2 + 1 }}
      >
        <circle cx={currentX} cy={currentY} r="1.5" fill={colors[shipment.status]} />
        <motion.circle
          cx={currentX}
          cy={currentY}
          r="2"
          fill="none"
          stroke={colors[shipment.status]}
          strokeWidth="0.3"
          animate={{ r: [2, 3.5, 2], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.g>
    </g>
  )
}

// ─── Leaflet Real-Map Overlay ────────────────────────────────────────────────
// Loaded lazily so it doesn't break SSR or non-map views
const ROUTE = [
  [19.076, 72.8777],
  [19.08,  72.88],
  [19.085, 72.885],
  [19.09,  72.89],
]

function LeafletMap({ aiData }) {
  const containerRef = useRef(null)
  const mapRef      = useRef(null)
  const markerRef   = useRef(null)
  const aiLayerRef  = useRef([])
  const indexRef    = useRef(0)

  // Init map once
  useEffect(() => {
    if (mapRef.current) return
    if (!containerRef.current) return

    // Dynamic import so leaflet CSS is loaded too
    import("leaflet").then((L) => {
      // Fix default icon paths broken by bundlers
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      const map = L.map(containerRef.current, { zoomControl: true }).setView(ROUTE[0], 14)
      mapRef.current = map

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map)

      // Route polyline
      const polyline = L.polyline(ROUTE, { color: "#3b82f6", weight: 4 }).addTo(map)
      map.fitBounds(polyline.getBounds(), { padding: [30, 30] })

      // Moving vehicle marker
      const vehicleIcon = L.divIcon({
        html: '<div style="width:14px;height:14px;border-radius:50%;background:#10b981;border:2px solid white;box-shadow:0 0 6px rgba(16,185,129,0.8)"></div>',
        className: "",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })
      const marker = L.marker(ROUTE[0], { icon: vehicleIcon }).addTo(map)
      markerRef.current = marker

      // Animate marker along route
      const interval = setInterval(() => {
        indexRef.current = (indexRef.current + 1) % ROUTE.length
        marker.setLatLng(ROUTE[indexRef.current])
      }, 2000)

      // Cleanup on unmount
      mapRef.current._cleanupInterval = interval
    })

    // Load leaflet CSS once
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link")
      link.id   = "leaflet-css"
      link.rel  = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)
    }

    return () => {
      if (mapRef.current?._cleanupInterval) {
        clearInterval(mapRef.current._cleanupInterval)
      }
    }
  }, [])

  // Add/refresh AI markers whenever aiData changes
  useEffect(() => {
    if (!mapRef.current || !aiData?.length) return

    import("leaflet").then((L) => {
      // Remove old AI markers
      aiLayerRef.current.forEach((m) => m.remove())
      aiLayerRef.current = []

      aiData.forEach((item) => {
        const severityColor =
          item.severity === "high"   ? "#ef4444" :
          item.severity === "medium" ? "#f59e0b" : "#6366f1"

        const icon = L.divIcon({
          html: `<div style="width:18px;height:18px;border-radius:50%;background:${severityColor};border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:9px;color:white;box-shadow:0 0 8px ${severityColor}88">!</div>`,
          className: "",
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        })

        const m = L.marker([item.lat, item.lng], { icon })
          .addTo(mapRef.current)
          .bindPopup(`<b>🚨 ${item.problem}</b><br/><span style="font-size:11px;color:#888">Severity: ${item.severity || "unknown"}</span>`)

        aiLayerRef.current.push(m)
      })
    })
  }, [aiData])

  return <div ref={containerRef} style={{ height: "100%", width: "100%", zIndex: 0 }} />
}

// ─── Main exported component (keeps all existing UI, adds tab toggle) ────────
export function LiveMap({ aiData }) {
  const [mounted, setMounted] = useState(false)
  const [view, setView]       = useState("svg") // "svg" | "leaflet"

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="relative h-full w-full rounded-xl border border-border/50 bg-card overflow-hidden">

      {/* ── Map Header (unchanged) ── */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-background/90 px-3 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-xs font-medium">Live Tracking</span>
          </div>

          {/* View toggle — injected cleanly next to existing badge */}
          <div className="flex items-center rounded-lg bg-background/90 backdrop-blur-sm overflow-hidden border border-border/40 text-xs">
            <button
              onClick={() => setView("svg")}
              className={`px-2.5 py-1.5 font-medium transition-colors ${view === "svg" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Overview
            </button>
            <button
              onClick={() => setView("leaflet")}
              className={`px-2.5 py-1.5 font-medium transition-colors ${view === "leaflet" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Real Map
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-background/90 px-3 py-1.5 backdrop-blur-sm text-xs">
          <span className="text-muted-foreground">Active Disruptions:</span>
          <span className="font-bold text-destructive">
            {disruptions.length + (aiData?.length ?? 0)}
          </span>
        </div>
      </div>

      {/* ── SVG Map (original, unchanged) ── */}
      {view === "svg" && (
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          style={{ filter: "drop-shadow(0 0 30px rgba(100, 150, 255, 0.1))" }}
        >
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="var(--primary)" stopOpacity="0.1" />
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

          <motion.path
            d="M35 15 L55 12 L70 20 L78 35 L80 50 L75 55 L78 70 L70 80 L55 88 L45 85 L40 78 L35 82 L25 75 L20 65 L15 55 L12 45 L15 35 L25 25 Z"
            fill="url(#mapGlow)"
            stroke="var(--border)"
            strokeWidth="0.3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2 }}
          />

          {[20, 40, 60, 80].map((x) => (
            <line key={`v-${x}`} x1={x} y1="10" x2={x} y2="90"
              stroke="var(--border)" strokeWidth="0.1" strokeOpacity="0.3" />
          ))}
          {[20, 40, 60, 80].map((y) => (
            <line key={`h-${y}`} x1="10" y1={y} x2="90" y2={y}
              stroke="var(--border)" strokeWidth="0.1" strokeOpacity="0.3" />
          ))}

          {shipments.map((shipment, index) => (
            <ShipmentRoute key={shipment.id} shipment={shipment} index={index} />
          ))}
          {disruptions.map((disruption, index) => (
            <DisruptionMarker key={disruption.id} disruption={disruption} index={index} />
          ))}

          {/* AI markers overlaid on SVG view too */}
          {aiData?.map((item, i) => (
            <motion.circle
              key={`ai-${i}`}
              cx={((item.lng - 68) / (97 - 68)) * 100}
              cy={((37 - item.lat) / (37 - 8)) * 100}
              r="3"
              fill="#ef4444"
              opacity={0.85}
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </svg>
      )}

      {/* ── Leaflet Real Map ── */}
      {view === "leaflet" && (
        <div className="absolute inset-0 pt-12">
          <LeafletMap aiData={aiData} />
        </div>
      )}

      {/* ── Legend (unchanged) ── */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 rounded-lg bg-background/90 p-3 backdrop-blur-sm text-xs z-10">
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
        {aiData?.length > 0 && (
          <div className="flex items-center gap-2 border-t border-border/40 pt-2">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-muted-foreground">AI Alerts ({aiData.length})</span>
          </div>
        )}
      </div>

      {/* ── Active Disruptions Panel (unchanged) ── */}
      <div className="absolute bottom-4 right-4 w-64 rounded-lg bg-background/90 p-3 backdrop-blur-sm text-xs z-10">
        <div className="font-medium mb-2">Active Disruptions</div>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {disruptions.map((d) => (
            <div key={d.id} className="flex items-start gap-2 rounded-md bg-secondary/50 p-2">
              <AlertTriangle className={`h-3 w-3 mt-0.5 flex-shrink-0 ${
                d.severity === "high" ? "text-destructive" :
                d.severity === "medium" ? "text-warning" : "text-accent"
              }`} />
              <div className="min-w-0">
                <div className="font-medium truncate">{d.name}</div>
                <div className="text-muted-foreground truncate">{d.message}</div>
                <div className="text-muted-foreground mt-0.5">{d.affectedShipments} shipments affected</div>
              </div>
            </div>
          ))}
          {/* AI-generated disruptions appended below */}
          {aiData?.map((item, i) => (
            <div key={`ai-d-${i}`} className="flex items-start gap-2 rounded-md bg-red-500/10 border border-red-500/20 p-2">
              <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0 text-red-500" />
              <div className="min-w-0">
                <div className="font-medium truncate text-red-500">AI Alert</div>
                <div className="text-muted-foreground truncate">{item.problem}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
