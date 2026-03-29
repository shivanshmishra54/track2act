import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Package, Navigation, CheckCircle2, AlertTriangle, ArrowRight, MapPin } from "lucide-react"
import { useCustomerShipments } from "./hooks/useCustomerShipments"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"

export default function CustomerOverview() {
  const { shipments, loading } = useCustomerShipments()
  const [searchId, setSearchId] = useState("")
  const [errorObj, setErrorObj] = useState(false)
  const navigate = useNavigate()

  const handleTrack = (e) => {
    e.preventDefault()
    if (!searchId.trim()) {
      setErrorObj(true)
      setTimeout(() => setErrorObj(false), 2000)
      return
    }
    const found = shipments.find(s => s.trackingNumber.toLowerCase() === searchId.toLowerCase().trim() || s.id === searchId.trim())
    if (found) {
      navigate(`/dashboard/tracking/${found.id}`)
    } else {
      setErrorObj(true)
      setTimeout(() => setErrorObj(false), 3000)
    }
  }

  const activeCount = shipments.filter(s => s.status === "IN_TRANSIT" || s.status === "OUT_FOR_DELIVERY" || s.status === "PICKED_UP").length
  const delayCount = shipments.filter(s => s.status === "DELAYED" || s.status === "AT_RISK" || s.status === "ISSUES").length
  const deliveredCount = shipments.filter(s => s.status === "DELIVERED").length

  return (
    <div className="flex flex-col min-h-full max-w-6xl mx-auto w-full pb-20">
      
      {/* Hero Section Container */}
      <div className="relative pt-12 pb-24 px-6 lg:px-0 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-3xl opacity-50 -z-10 rounded-full scale-150 transform translate-y-1/2" />
        
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-balance">
          Where is your <span className="text-primary bg-primary/10 px-2 rotate-2 inline-block rounded-md border border-primary/20">shipment</span> right now?
        </h1>
        <p className="text-muted-foreground text-lg mb-10 max-w-xl text-balance">
          Enter your Track2Act ID below for military-grade location telemetry and real-time status updates.
        </p>

        <form onSubmit={handleTrack} className="w-full max-w-xl relative group">
          <motion.div animate={errorObj ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
            <div className={`relative flex items-center bg-card rounded-full p-2 border shadow-2xl transition-colors duration-300 ${errorObj ? 'border-destructive ring-4 ring-destructive/20' : 'border-primary/40 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20'}`}>
              <Search className={`absolute left-6 h-6 w-6 ${errorObj ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary'}`} />
              <Input
                type="text"
                value={searchId}
                onChange={(e) => { setSearchId(e.target.value); setErrorObj(false); }}
                placeholder="e.g. TRK17105..."
                className="flex-1 border-0 bg-transparent pl-16 h-14 text-lg focus-visible:ring-0 shadow-none font-mono tracking-wider"
              />
              <Button type="submit" size="lg" className="rounded-full h-14 px-8 font-bold text-base shadow-primary/20 shadow-lg group-hover:bg-primary/90 transition-all gap-2">
                TRACK NOW <Navigation className="h-4 w-4" />
              </Button>
            </div>
            <AnimatePresence>
              {errorObj && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -bottom-8 left-0 right-0 text-destructive font-bold text-sm">
                  We couldn't locate that shipment. Check the ID and try again.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </form>
      </div>

      <div className="px-5 lg:px-0 -mt-10 relative z-10">
        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="rounded-2xl border border-border/60 bg-card p-5 card-shadow text-center sm:text-left flex items-center sm:block">
            <div className="h-10 w-10 sm:mb-2 rounded-lg bg-secondary flex items-center justify-center shrink-0 mr-4 sm:mr-0">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-3xl font-extrabold">{shipments.length}</p>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Orders</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 card-shadow text-center sm:text-left flex items-center sm:block">
            <div className="h-10 w-10 sm:mb-2 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mr-4 sm:mr-0">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-3xl font-extrabold text-primary">{activeCount}</p>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">In Transit</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 card-shadow text-center sm:text-left flex items-center sm:block">
            <div className="h-10 w-10 sm:mb-2 rounded-lg bg-success/10 flex items-center justify-center shrink-0 mr-4 sm:mr-0">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
             <div className="flex-1">
               <p className="text-3xl font-extrabold text-success">{deliveredCount}</p>
               <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Delivered</p>
             </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 card-shadow text-center sm:text-left flex items-center sm:block cursor-pointer hover:bg-destructive/5 transition-colors" onClick={() => navigate('/dashboard/customer-shipments')}>
            <div className="h-10 w-10 sm:mb-2 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0 mr-4 sm:mr-0">
              <AlertTriangle className={`h-5 w-5 text-destructive ${delayCount > 0 ? 'animate-pulse' : ''}`} />
            </div>
            <div className="flex-1">
               <p className="text-3xl font-extrabold text-destructive">{delayCount}</p>
               <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-destructive/80">Active Issues</p>
            </div>
          </div>
        </div>

        {/* Recent Feed */}
        <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" /> Recently Updated
        </h2>
        
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-secondary/30 animate-pulse rounded-2xl" />)}
          </div>
        ) : shipments.length === 0 ? (
          <div className="text-center py-16 bg-secondary/10 border border-dashed rounded-3xl">
            <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-bold">No Shipments Found</h3>
            <p className="text-muted-foreground">When you book a shipment with us, it will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Take top 6 most recently updated */}
            {shipments.slice().sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6).map((item, id) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: id * 0.05 }}
                onClick={() => navigate(`/dashboard/tracking/${item.id}`)}
                className="p-5 rounded-2xl border border-border/60 bg-card hover:bg-secondary/20 cursor-pointer card-shadow group transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono font-bold text-primary group-hover:underline underline-offset-4">{item.trackingNumber}</span>
                  <StatusBadge status={item.status} />
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm truncate"><span className="text-xs font-bold text-muted-foreground mr-2">FROM</span> {item.originName}</p>
                  <p className="text-sm truncate"><span className="text-xs font-bold text-muted-foreground mr-2">TO</span> {item.destinationName}</p>
                </div>
                
                <div className="pt-4 border-t border-border/40 flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Updated {new Date(item.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-primary group-hover:bg-primary/10">
                    Track <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
