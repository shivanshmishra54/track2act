import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Map, Navigation, Phone, MapPin, CheckCircle2, AlertTriangle, RadioTower, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth, API } from "@/context/AuthContext"
import { useDriverShipments } from "./hooks/useDriverShipments"
import { useNavigate } from "react-router-dom"

export default function LiveTracking() {
  const { activeShipment, pendingTasks, updateStatus } = useDriverShipments()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [sharingLocation, setSharingLocation] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [lastPings, setLastPings] = useState([])

  // Load state from local storage so toggle persists across reloads
  useEffect(() => {
    const isSharing = localStorage.getItem("driver_tracking_active") === "true"
    if (isSharing && activeShipment) {
      startLiveLocation()
    }
    return () => stopLiveLocation() // cleanup on unmount, but real tracking should use service workers. For this demo, watchPosition handles it.
  }, [])

  const startLiveLocation = () => {
    if (!activeShipment) return alert("You need an active IN_TRANSIT shipment to start tracking.")
    
    setSharingLocation(true)
    localStorage.setItem("driver_tracking_active", "true")
    
    if (navigator.geolocation) {
      window.trackingId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setCurrentLocation({ latitude, longitude })
          setLastPings(p => [{ lat: latitude, lng: longitude, time: new Date() }, ...p].slice(0, 5))
          
          try {
            const token = localStorage.getItem("token")
            await fetch(`${API}/api/shipments/location-update`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ shipmentId: activeShipment.id, latitude, longitude, statusNote: "Live telemetry" }),
            })
          } catch (error) {
            console.error("Telemetry failed:", error)
          }
        },
        (error) => { console.error("Location error:", error); setSharingLocation(false); localStorage.setItem("driver_tracking_active", "false") },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 27000 }
      )
    }
  }

  const stopLiveLocation = () => {
    setSharingLocation(false)
    localStorage.setItem("driver_tracking_active", "false")
    if (window.trackingId) navigator.geolocation.clearWatch(window.trackingId)
  }

  const nextTask = pendingTasks.length > 0 ? pendingTasks[0] : null

  return (
    <div className="flex flex-col lg:flex-row h-full absolute inset-0 pt-14">
      
      {/* 70% Map Area */}
      <div className="flex-1 relative bg-slate-900 border-r border-border/50 overflow-hidden">
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=India&zoom=5&size=800x800&maptype=roadmap&style=feature:all|element:labels.text.fill|color:0x8ec3b9&style=feature:all|element:labels.text.stroke|color:0x1a3646&style=feature:administrative.country|element:geometry.stroke|color:0x4b6878&style=feature:administrative.land_parcel|element:labels.text.fill|color:0x64779e&style=feature:administrative.province|element:geometry.stroke|color:0x4b6878&style=feature:landscape.man_made|element:geometry.stroke|color:0x334e87&style=feature:landscape.natural|element:geometry|color:0x023e58&style=feature:poi|element:geometry|color:0x283d6a&style=feature:poi|element:labels.text.fill|color:0x6f9ba5&style=feature:poi|element:labels.text.stroke|color:0x1d2c4d&style=feature:poi.park|element:geometry.fill|color:0x023e58&style=feature:poi.park|element:labels.text.fill|color:0x3C7680&style=feature:road|element:geometry|color:0x304a7d&style=feature:road|element:labels.text.fill|color:0x98a5be&style=feature:road|element:labels.text.stroke|color:0x1d2c4d&style=feature:road.highway|element:geometry|color:0x2c6675&style=feature:road.highway|element:geometry.stroke|color:0x255763&style=feature:road.highway|element:labels.text.fill|color:0xb0d5ce&style=feature:road.highway|element:labels.text.stroke|color:0x023e58&style=water|element:geometry|color:0x0e1626&style=water|element:labels.text.fill|color:0x4e6d70')] bg-cover bg-center" />
        
        {/* Dynamic Map UI Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {!activeShipment ? (
             <div className="bg-background/80 backdrop-blur-md border border-border/50 p-6 rounded-2xl max-w-sm text-center shadow-2xl">
               <Map className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
               <h3 className="font-bold text-lg mb-2">No Active Journey</h3>
               <p className="text-sm text-muted-foreground">Select a task and mark it 'In Transit' to begin live tracking sequence.</p>
               {nextTask && (
                 <Button className="mt-6 w-full" onClick={() => navigate(`/dashboard/shipment/${nextTask.id}`)}>
                   View Next Task: {nextTask.trackingNumber}
                 </Button>
               )}
             </div>
          ) : (
            <div className="relative w-full h-full max-w-2xl max-h-[600px] border-2 border-primary/20 rounded-3xl overflow-hidden bg-background/40 backdrop-blur-sm shadow-2xl flex items-center justify-center">
              {/* Animated Map Route Mock */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
              
              {/* Origin Marker */}
              <div className="absolute top-[20%] left-[20%] flex flex-col items-center">
                <div className="bg-background p-1.5 rounded-full border shadow-lg border-primary">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <span className="text-[10px] font-bold mt-1 bg-background/80 px-2 py-0.5 rounded shadow">Origin</span>
              </div>
              
              {/* Connecting Line */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none">
                <path d="M 160 120 Q 300 150 480 400" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray="6 6" className="opacity-50" />
              </svg>

              {/* Destination Marker */}
              <div className="absolute top-[66%] left-[75%] flex flex-col items-center">
                <div className="bg-background p-1.5 rounded-full border shadow-lg border-success">
                  <MapPin className="h-4 w-4 text-success" />
                </div>
                <span className="text-[10px] font-bold mt-1 bg-background/80 px-2 py-0.5 rounded shadow">Dropoff</span>
              </div>

              {/* Current Driver Position Ping */}
              {sharingLocation && currentLocation && (
                <motion.div 
                  className="absolute top-[40%] left-[45%] flex flex-col items-center"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                >
                  <div className="relative flex h-6 w-6 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-primary border-2 border-background" />
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* 30% Side Panel */}
      <div className="w-full lg:w-[400px] xl:w-[450px] bg-card flex flex-col h-full overflow-y-auto z-10 shadow-[-10px_0_20px_rgba(0,0,0,0.1)]">
        
        {/* Toggle Header */}
        <div className="p-6 border-b border-border/50 sticky top-0 bg-card z-20">
          <h2 className="text-xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
            <RadioTower className="h-5 w-5 text-primary" /> Tracking Systems
          </h2>
          
          <Button 
            disabled={!activeShipment}
            onClick={() => sharingLocation ? stopLiveLocation() : startLiveLocation()}
            className={`w-full h-14 text-lg font-bold gap-3 shadow-lg transition-all duration-300 ${
              !activeShipment ? "bg-secondary text-muted-foreground opacity-50" :
              sharingLocation 
                ? "bg-destructive hover:bg-destructive/90 text-white shadow-destructive/20 animate-pulse-slow" 
                : "bg-success hover:bg-success/90 text-white shadow-success/20"
            }`}
          >
            {sharingLocation ? (
              <><span className="h-3 w-3 bg-white rounded-full animate-ping mr-1"/> STOP BROADCASTING</>
            ) : (
              <><Navigation className="h-5 w-5"/> START LIVE TRACKING</>
            )}
          </Button>
          
          {!activeShipment && (
            <p className="text-xs text-center text-muted-foreground mt-3">Requires an active IN_TRANSIT shipment.</p>
          )}
        </div>

        {activeShipment && (
          <div className="p-6 space-y-6 flex-1">
            {/* Active Cargo Info */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Cargo</span>
                <span className="font-mono text-sm font-bold text-primary">{activeShipment.trackingNumber}</span>
              </div>
              
              <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50 space-y-3">
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-semibold">{activeShipment.cargoType}</h4>
                    <p className="text-sm text-muted-foreground">{activeShipment.cargoDescription}</p>
                    <p className="text-xs font-mono text-muted-foreground mt-1">Weight: {activeShipment.cargoWeight}kg</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient Info */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recipient Details</span>
              <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-sm">{activeShipment.receiverName || "Contact"}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{activeShipment.destinationName}</p>
                </div>
                <Button size="icon" variant="outline" className="h-10 w-10 shrink-0 shadow-sm border-border/60 hover:bg-primary/10 hover:text-primary">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Telemetry Stream */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Live Telemetry</span>
                {sharingLocation && <span className="text-[10px] font-bold text-success flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success animate-ping" /> SYNCING</span>}
              </div>
              
              <div className="p-4 rounded-2xl bg-slate-950 border border-border/40 font-mono text-xs space-y-2 h-[200px] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/90 pointer-events-none" />
                
                {!sharingLocation ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-40">
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    <span>Transmitter Offline</span>
                  </div>
                ) : lastPings.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-primary animate-pulse">
                    Acquiring GPS Signal...
                  </div>
                ) : (
                  lastPings.map((ping, i) => (
                    <motion.div 
                      key={ping.time.getTime()}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: Math.max(1 - (i * 0.2), 0.2), x: 0 }}
                      className="flex gap-3"
                    >
                      <span className="text-muted-foreground w-16">{ping.time.toLocaleTimeString([], {hour12:false})}</span>
                      <span className="text-success">&gt;</span>
                      <span>LAT:{ping.lat.toFixed(4)} LNG:{ping.lng.toFixed(4)}</span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
