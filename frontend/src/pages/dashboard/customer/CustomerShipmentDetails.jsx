import { useParams, useNavigate } from "react-router-dom"
import { useCustomerShipments } from "./hooks/useCustomerShipments"
import { ArrowLeft, Clock, MapPin, Navigation, Truck, Scale, ShieldCheck, Mail, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"

export default function CustomerShipmentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { shipments, loading } = useCustomerShipments()
  
  const s = shipments.find(s => s.id === id)

  if (loading) return <div className="p-12 animate-pulse text-center text-muted-foreground">LOADING DATA...</div>
  if (!s) return <div className="p-12 text-center text-destructive">Invoice Not Found</div>

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 p-6 lg:p-12">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Return
      </Button>

      <div className="flex justify-between items-start mb-8">
         <div>
           <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Digital Waybill</p>
           <h1 className="text-3xl font-black font-mono mt-1 text-primary">{s.trackingNumber}</h1>
         </div>
         <StatusBadge status={s.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        
        {/* Logistics Block */}
        <div className="bg-card rounded-2xl p-6 border border-border/60 card-shadow">
          <h3 className="font-bold border-b border-border/40 pb-4 mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-muted-foreground" /> Freight Parameters</h3>
          <div className="space-y-4 text-sm">
             <div className="flex justify-between text-muted-foreground">
               <span className="flex items-center gap-2"><Scale className="w-4 h-4"/> Cargo Type</span>
               <span className="font-bold text-foreground">{s.cargoType}</span>
             </div>
             <div className="flex justify-between text-muted-foreground">
               <span className="flex items-center gap-2"><Scale className="w-4 h-4"/> Cargo Weight</span>
               <span className="font-bold text-foreground">{s.cargoWeight} kg</span>
             </div>
             <div>
               <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Declared Description</p>
               <p className="bg-secondary/40 p-3 rounded-lg text-xs leading-relaxed border border-border/30">{s.cargoDescription}</p>
             </div>
          </div>
        </div>

        {/* Receiver Block */}
        <div className="bg-card rounded-2xl p-6 border border-border/60 card-shadow">
          <h3 className="font-bold border-b border-border/40 pb-4 mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-muted-foreground" /> Custody Record</h3>
          <div className="space-y-4 text-sm">
             <div className="flex justify-between text-muted-foreground">
               <span className="flex items-center gap-2">Receiver Contact</span>
               <span className="font-bold text-foreground">{s.receiverName}</span>
             </div>
             <div className="flex justify-between text-muted-foreground">
               <span className="flex items-center gap-2"><Mail className="w-4 h-4"/> Primary Notify</span>
               <span className="font-bold text-foreground font-mono">{s.receiverContact}</span>
             </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-12 mb-6">Historical Ledger</h2>
      <div className="bg-card border border-border/60 rounded-2xl p-6">
         {s.trackingHistory && s.trackingHistory.length > 0 ? (
           <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-6 before:w-[2px] before:bg-border/60">
             {s.trackingHistory.map((h, i) => (
                <div key={i} className="relative">
                   <div className="absolute -left-[30px] p-1 bg-card rounded-full ring-2 ring-primary ring-offset-2 ring-offset-card">
                      <Clock className="w-3 h-3 text-primary" />
                   </div>
                   <div className="flex justify-between items-start">
                     <div>
                       <h3 className="font-bold text-sm tracking-tight">{h.statusNote}</h3>
                       <p className="text-xs text-muted-foreground mt-1 font-mono">LAT {h.latitude.toFixed(4)} LNG {h.longitude.toFixed(4)}</p>
                     </div>
                     <span className="text-[10px] text-muted-foreground bg-secondary/40 px-2 py-1 rounded font-bold uppercase tracking-widest">{new Date(h.timestamp).toLocaleTimeString()}</span>
                   </div>
                </div>
             ))}
           </div>
         ) : (
           <p className="text-center text-muted-foreground text-sm py-4">No historical scans committed to the ledger yet.</p>
         )}
      </div>

    </div>
  )
}
