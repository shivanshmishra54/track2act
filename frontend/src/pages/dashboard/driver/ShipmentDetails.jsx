import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, CheckCircle2, Package, Truck, Navigation, AlertCircle, FileCheck2, StopCircle, RefreshCw, X, FileImage, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { useDriverShipments } from "./hooks/useDriverShipments"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ShipmentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { shipments, updateStatus, loading, pendingTasks } = useDriverShipments()
  
  const [shipment, setShipment] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deliveryNotes, setDeliveryNotes] = useState("")

  useEffect(() => {
    if (!loading) {
      const found = shipments.find(s => s.id === id)
      if (found) setShipment(found)
      else navigate('/dashboard/tasks')
    }
  }, [id, shipments, loading, navigate])

  if (loading || !shipment) {
    return <div className="flex h-full items-center justify-center p-20"><RefreshCw className="h-8 w-8 animate-spin text-primary" /></div>
  }

  const isPending = shipment.status === "PENDING" || shipment.status === "DELAYED"
  const inTransit = shipment.status === "IN_TRANSIT"
  const delivered = shipment.status === "DELIVERED"

  const handleStartJourney = async () => {
    try {
      setSubmitting(true)
      await updateStatus(shipment.id, "IN_TRANSIT")
      navigate('/dashboard/location')
    } catch (err) {
      alert(err.message || "Failed to start tracking")
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmDelivery = async () => {
    try {
      setSubmitting(true)
      // Trigger offline-compatible delivery update
      await updateStatus(shipment.id, "DELIVERED", deliveryNotes, "proof_signature_123.jpg")
      setShowConfirmModal(false)
    } catch (err) {
      alert("Failed to confirm delivery: " + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-full max-w-5xl mx-auto w-full pb-20">
      
      {/* Navigation Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 pt-6 pb-4 px-5 xl:px-0">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight uppercase font-mono">{shipment.trackingNumber}</h1>
            <StatusBadge status={shipment.status} />
          </div>
          <div className="text-sm font-medium text-muted-foreground border border-border/50 px-3 py-1.5 rounded-full bg-secondary/30">
            {new Date(shipment.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="px-5 xl:px-0 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Strict Actions Banner */}
          {!delivered && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 card-shadow ${
                inTransit ? "bg-primary/5 border-primary/20" : "bg-card border-border/60"
              }`}
            >
              <div>
                <h3 className="text-lg font-bold mb-1">
                  {inTransit ? "Shipment is Active" : "Pending Action Required"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {inTransit 
                    ? "You are currently assigned to deliver this cargo. Once you reach the destination, mark it as delivered."
                    : "Review cargo details and begin transit to origin pickup to start location tracking."}
                </p>
              </div>
              
              <div className="w-full sm:w-auto shrink-0 flex flex-col gap-2">
                {isPending && (
                  <Button size="lg" disabled={submitting} onClick={handleStartJourney} className="w-full sm:w-48 font-semibold shadow-primary/20 shadow-lg">
                    {submitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <><Navigation className="h-4 w-4 mr-2" /> Start Transit</>}
                  </Button>
                )}
                {inTransit && (
                  <Button size="lg" disabled={submitting} onClick={() => setShowConfirmModal(true)} className="w-full sm:w-48 bg-success hover:bg-success/90 text-white font-semibold shadow-success/20 shadow-lg">
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Mark Delivered
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* Details Section */}
          <div className="grid sm:grid-cols-2 gap-4">
            
            {/* Cargo Box */}
            <div className="rounded-2xl border border-border/60 bg-card p-6 card-shadow">
               <div className="flex items-center gap-2 mb-4">
                 <Package className="h-5 w-5 text-primary" />
                 <h2 className="text-lg font-bold tracking-tight">Cargo Details</h2>
               </div>
               <div className="space-y-4">
                 <div>
                   <span className="text-xs text-muted-foreground uppercase font-semibold">Type</span>
                   <p className="text-sm font-medium mt-0.5">{shipment.cargoType}</p>
                 </div>
                 <div>
                   <span className="text-xs text-muted-foreground uppercase font-semibold">Weight</span>
                   <p className="font-mono text-sm mt-0.5">{shipment.cargoWeight} kg</p>
                 </div>
                 <div>
                   <span className="text-xs text-muted-foreground uppercase font-semibold">Description</span>
                   <p className="text-sm mt-0.5 text-muted-foreground bg-secondary/20 p-3 rounded-xl border border-border/40 min-h-[80px]">
                     {shipment.cargoDescription || "No specific handling instructions provided."}
                   </p>
                 </div>
               </div>
            </div>

            {/* Recipient & Contact Box */}
            <div className="rounded-2xl border border-border/60 bg-card p-6 card-shadow space-y-6">
              <div>
                <h2 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Delivery Target
                </h2>
                <div>
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Dropoff Address</span>
                  <p className="text-sm font-medium mt-0.5 max-w-[200px]">{shipment.destinationName}</p>
                </div>
              </div>
              
              <div className="border-t border-border/40 pt-6">
                <h3 className="text-sm mb-4 font-bold tracking-tight">Access Control</h3>
                <div className="space-y-4">
                  <div>
                     <span className="text-xs text-muted-foreground uppercase font-semibold">Recipient</span>
                     <p className="text-sm font-medium mt-0.5">{shipment.receiverName}</p>
                  </div>
                  <div>
                     <span className="text-xs text-muted-foreground uppercase font-semibold">Contact Ping</span>
                     <div className="flex items-center gap-2 mt-1">
                       <span className="font-mono text-sm">{shipment.receiverContact}</span>
                       <Button variant="secondary" size="sm" className="h-7 px-2 text-[10px] font-bold">SMS</Button>
                     </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Vertical Stepper Timeline (1/3 width) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card p-6 lg:p-8 card-shadow sticky top-32">
            <h2 className="text-lg font-bold tracking-tight mb-6 hidden lg:block">Route Context</h2>
            
            <div className="relative pl-8 space-y-8">
              <div className="absolute top-2 left-[15px] bottom-4 w-[2px] bg-border/80 border-dashed border-l-2" />
              
              <div className="relative">
                <div className={`absolute -left-10 top-0 h-6 w-6 rounded-full border-2 bg-background flex items-center justify-center ${inTransit || delivered ? 'border-primary' : 'border-muted-foreground/30'}`}>
                  {(inTransit || delivered) && <div className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider mb-1">Origin Pickup</h3>
                <p className="text-sm font-medium">{shipment.originName}</p>
              </div>

              <div className="relative">
                <div className={`absolute -left-10 top-0 h-6 w-6 rounded-full border-2 bg-background flex items-center justify-center ${inTransit ? 'border-primary ring-4 ring-primary/20' : delivered ? 'border-primary' : 'border-muted-foreground/30'}`}>
                  {inTransit && <Navigation className="h-3 w-3 text-primary animate-pulse" />}
                  {delivered && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </div>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-1 ${inTransit ? 'text-primary' : 'text-muted-foreground'}`}>In Transit</h3>
                <p className="text-sm text-muted-foreground">{inTransit ? `${shipment.currentProgress}% Distance Covered` : 'En route to destination'}</p>
              </div>

              <div className="relative">
                <div className={`absolute -left-10 top-0 h-6 w-6 rounded-full border-2 bg-background flex items-center justify-center ${delivered ? 'border-success ring-4 ring-success/20' : 'border-muted-foreground/30'}`}>
                  {delivered && <ShieldCheck className="h-4 w-4 text-success" />}
                </div>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-1 ${delivered ? 'text-success' : 'text-muted-foreground'}`}>Delivered</h3>
                <p className="text-sm font-medium">{shipment.destinationName}</p>
                {delivered && (
                  <div className="mt-3 px-3 py-2 rounded-xl bg-success/10 border border-success/20 w-fit">
                     <p className="text-xs font-bold text-success flex items-center gap-1.5"><FileCheck2 className="h-3.5 w-3.5"/> Verified Drop-off</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proof of Delivery / Confirmation Modal Base */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 10 }}
               className="w-full max-w-lg bg-card border border-border/80 rounded-3xl shadow-2xl p-6 lg:p-8"
             >
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h2 className="text-2xl font-extrabold tracking-tight">Confirm Delivery</h2>
                   <p className="text-sm text-muted-foreground mt-1">Submit Proof of Delivery payload</p>
                 </div>
                 <Button variant="ghost" size="icon" onClick={() => setShowConfirmModal(false)} className="rounded-full -mr-2 -mt-2">
                   <X className="h-5 w-5" />
                 </Button>
               </div>
               
               <div className="space-y-6">
                 <div className="rounded-xl border border-dashed border-border/80 bg-secondary/20 p-8 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/40 transition-colors">
                    <FileImage className="h-8 w-8 text-muted-foreground/60 mb-3" />
                    <p className="text-sm font-semibold mb-1">Capture Proof</p>
                    <p className="text-xs text-muted-foreground">Upload signature or dropoff photo</p>
                 </div>
                 
                 <div className="space-y-2">
                   <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                   <Input 
                     id="notes" 
                     placeholder="e.g. Left at south gate security..." 
                     value={deliveryNotes}
                     onChange={(e) => setDeliveryNotes(e.target.value)}
                     className="bg-secondary/30"
                   />
                 </div>
                 
                 <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500/90 text-xs p-3 rounded-xl flex items-start gap-2">
                   <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                   <p>By confirming, you assert the shipment has been securely transferred to the verified recipient. This action cannot be reversed.</p>
                 </div>
                 
                 <Button size="lg" disabled={submitting} onClick={handleConfirmDelivery} className="w-full bg-success hover:bg-success/90 text-white font-bold shadow-success/20 shadow-lg text-lg h-14 rounded-full">
                   {submitting ? <RefreshCw className="mr-2 h-5 w-5 animate-spin"/> : <ShieldCheck className="mr-2 h-6 w-6"/>}
                   CONFIRM FINAL DELIVERY
                 </Button>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
