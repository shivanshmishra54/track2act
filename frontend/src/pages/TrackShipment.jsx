import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { useAuth, API } from "@/context/AuthContext"
import {
  Search, MapPin, Package, Clock, CheckCircle2,
  Navigation, AlertCircle, Truck, ChevronRight, ArrowRight
} from "lucide-react"

function ProgressBar({ value }) {
  return (
    <div className="w-full bg-border/50 rounded-full h-2 overflow-hidden">
      <motion.div
        className="bg-gradient-to-r from-primary to-violet-500 h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value ?? 0}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  )
}

function DetailBox({ label, value }) {
  return (
    <div className="rounded-xl bg-secondary/40 border border-border/50 p-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value || "—"}</p>
    </div>
  )
}

export default function TrackShipment() {
  const { user } = useAuth()
  const [trackingNumber, setTrackingNumber] = useState("")
  const [shipment, setShipment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number")
      return
    }
    setLoading(true)
    setError("")
    setShipment(null)
    try {
      const response = await fetch(`${API}/api/shipments?trackingNumber=${trackingNumber}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      const data = await response.json()
      if (response.ok && data.data) {
        setShipment(data.data)
      } else {
        setError("Shipment not found. Please check the tracking number.")
      }
    } catch (err) {
      setError("Error fetching shipment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Track Your Shipment</h1>
          </div>
          <p className="text-muted-foreground ml-[52px]">
            Enter your tracking number for real-time delivery updates
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-border/60 card-shadow overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-secondary/20 pb-4">
              <CardTitle className="text-base">Find Your Shipment</CardTitle>
              <CardDescription>Enter your tracking number for real-time updates</CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              <form onSubmit={handleTrack} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Enter tracking number (e.g., T2A-123456789)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="pl-10 h-11 font-mono bg-background/60 border-border/70 focus-visible:ring-primary/30 text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 px-6 font-semibold gap-2 shadow-md hover:shadow-primary/25 transition-all"
                >
                  {loading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Tracking…
                    </>
                  ) : (
                    <>
                      Track
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </form>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-start gap-2.5 rounded-xl bg-destructive/10 border border-destructive/25 px-4 py-3"
                >
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Shipment Details */}
        {shipment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-border/60 card-shadow overflow-hidden">
              {/* Card Header */}
              <CardHeader className="border-b border-border/50 bg-secondary/20">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono font-bold text-lg text-primary">{shipment.trackingNumber}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{shipment.cargoType}</p>
                  </div>
                  <StatusBadge status={shipment.status} />
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-8">
                {/* Route Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Route Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-secondary/40 border border-border/50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                          <MapPin className="w-3 h-3 text-primary" />
                        </div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">From</p>
                      </div>
                      <p className="text-base font-bold text-foreground">{shipment.originName}</p>
                    </div>

                    <div className="rounded-xl bg-secondary/40 border border-border/50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15">
                          <MapPin className="w-3 h-3 text-success" />
                        </div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">To</p>
                      </div>
                      <p className="text-base font-bold text-foreground">{shipment.destinationName}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="rounded-xl bg-secondary/30 border border-border/40 p-5 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="space-y-0.5">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Departure</p>
                        <p className="font-semibold text-foreground">{shipment.originName}</p>
                      </div>
                      <div className="flex flex-col items-center px-4">
                        <Navigation className="w-4 h-4 text-primary rotate-45" />
                      </div>
                      <div className="space-y-0.5 text-right">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Delivery</p>
                        <p className="font-semibold text-foreground">{shipment.destinationName}</p>
                      </div>
                    </div>
                    <ProgressBar value={shipment.currentProgress} />
                    <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                      <span>Start</span>
                      <span className="text-primary font-bold">{shipment.currentProgress}% complete</span>
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-4 border-t border-border/40 pt-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Shipment Details
                  </h3>
                  <div className="grid md:grid-cols-3 gap-3">
                    <DetailBox label="Sender" value={shipment.customerName} />
                    <DetailBox label="Receiver" value={shipment.receiverName} />
                    <DetailBox label="Contact" value={shipment.receiverContact} />
                    <DetailBox label="Weight" value={shipment.cargoWeight ? `${shipment.cargoWeight} kg` : null} />
                    <DetailBox
                      label="Expected Delivery"
                      value={shipment.estimatedArrival ? new Date(shipment.estimatedArrival).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null}
                    />
                    <DetailBox label="Assigned Driver" value={shipment.assignedDriverName} />
                  </div>
                </div>

                {/* Tracking History */}
                {shipment.trackingHistory?.length > 0 && (
                  <div className="space-y-4 border-t border-border/40 pt-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary" />
                      Tracking History
                    </h3>
                    <div className="space-y-2 max-h-80 overflow-y-auto rounded-xl">
                      {shipment.trackingHistory.map((update, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          className="border-l-2 border-primary/50 bg-secondary/30 hover:bg-secondary/50 transition-colors pl-4 pr-4 py-3 rounded-r-xl"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-sm font-semibold font-mono">
                                {update.latitude.toFixed(4)}, {update.longitude.toFixed(4)}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {new Date(update.timestamp).toLocaleString("en-IN")}
                              </p>
                              {update.statusNote && (
                                <p className="text-xs mt-1.5 bg-background rounded-lg px-3 py-1.5 border border-border/50 inline-block">
                                  {update.statusNote}
                                </p>
                              )}
                            </div>
                            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
