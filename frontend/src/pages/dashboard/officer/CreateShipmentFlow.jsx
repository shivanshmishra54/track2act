import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Truck, CheckCircle2, ChevronRight, TruckIcon, Star, Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth, API } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function CreateShipmentFlow() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [locations, setLocations] = useState([])
  const [drivers, setDrivers] = useState([])

  const [form, setForm] = useState({
    cargoType: "Electronics",
    cargoWeight: "5000",
    originId: "",
    destinationId: "",
    estimatedArrival: "",
    customerName: "",
    customerContact: "",
    receiverName: "",
    receiverContact: "",
    assignedDriverId: null
  })

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${API}/api/locations`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})
        if (res.ok) setLocations((await res.json()).data || [])
      } catch (e) {
        console.error(e)
      }
    }
    const fetchDrivers = async () => {
      try {
        const res = await fetch(`${API}/api/users/role/DRIVER`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})
        if (res.ok) {
           const data = await res.json()
           const realDrivers = (data.data || []).map(d => ({
              ...d,
              isAvailable: true,
              rating: (4 + Math.random()).toFixed(1),
              distance: Math.floor(Math.random() * 50) + " km",
              vehicleType: ["Heavy Truck", "Medium Carrier"][Math.floor(Math.random()*2)]
           }))
           setDrivers(realDrivers)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchLocations()
    fetchDrivers()
  }, [])

  const dispatchShipment = async () => {
     setLoading(true)
     try {
       const payload = { ...form, cargoWeight: parseFloat(form.cargoWeight) }
       const res = await fetch(`${API}/api/shipments`, {
         method: "POST",
         headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}` },
         body: JSON.stringify(payload)
       })
       
       if (!res.ok) {
           const errText = await res.text()
           throw new Error(errText || "Database verification failed.")
       }
       
       setLoading(false)
       navigate('/dashboard/live-map')
     } catch (err) {
       console.error(err)
       alert("Error dispatching shipment: " + err.message)
       setLoading(false)
     }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] w-full max-w-5xl mx-auto py-10 px-6">
      <div className="mb-10 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
         <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Create Waybill</h1>
            <p className="text-muted-foreground mt-1">Assign logistics and initiate tracking protocol</p>
         </div>
         {/* Stepper Progress */}
         <div className="flex items-center gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step === s ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)]" : step > s ? "bg-primary/20 text-primary" : "bg-card border border-border/60 text-muted-foreground"}`}>
                   {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                 </div>
                 {s < 3 && <div className={`w-10 md:w-16 h-1 mx-2 rounded-full transition-colors ${step > s ? "bg-primary/50" : "bg-border/40"}`} />}
              </div>
            ))}
         </div>
      </div>

      <div className="flex-1 bg-card border border-border/60 rounded-3xl p-6 md:p-10 card-shadow overflow-hidden relative min-h-[500px]">
         <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                 <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><MapPin className="text-primary"/> Routing & Cargo Parameters</h2>
                 <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <div><label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Origin Hub</label>
                        <select className="w-full h-12 bg-secondary/30 border border-border/60 rounded-xl px-4 mt-2 focus:ring-1 focus:ring-primary" value={form.originId} onChange={e=>setForm({...form, originId: e.target.value})}>
                          <option value="">Select Origin...</option>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                      </div>
                      <div><label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Destination Hub</label>
                        <select className="w-full h-12 bg-secondary/30 border border-border/60 rounded-xl px-4 mt-2 focus:ring-1 focus:ring-primary" value={form.destinationId} onChange={e=>setForm({...form, destinationId: e.target.value})}>
                          <option value="">Select Destination...</option>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div><label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cargo Category</label>
                           <Input className="mt-2 h-12 bg-secondary/30" value={form.cargoType} onChange={e=>setForm({...form, cargoType: e.target.value})} placeholder="e.g. Automobiles" />
                         </div>
                         <div><label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gross Tonnage (kg)</label>
                           <Input type="number" className="mt-2 h-12 bg-secondary/30" value={form.cargoWeight} onChange={e=>setForm({...form, cargoWeight: e.target.value})} />
                         </div>
                      </div>
                   </div>
                   <div className="space-y-4 p-5 bg-secondary/10 border border-border/40 rounded-2xl">
                     <h3 className="text-sm font-bold border-b border-border/40 pb-2 mb-2">Customer Entity (Biller)</h3>
                     <Input className="h-10 bg-secondary/30" placeholder="Corporate Name" value={form.customerName} onChange={e=>setForm({...form, customerName: e.target.value})} />
                     <Input className="h-10 bg-secondary/30" placeholder="Billing Email/Phone" value={form.customerContact} onChange={e=>setForm({...form, customerContact: e.target.value})} />
                     <h3 className="text-sm font-bold border-b border-border/40 pb-2 mb-2 mt-4">Receiver Identity</h3>
                     <Input className="h-10 bg-secondary/30" placeholder="Receiver Name" value={form.receiverName} onChange={e=>setForm({...form, receiverName: e.target.value})} />
                     <Input className="h-10 bg-secondary/30" placeholder="Receiver Email/Phone" value={form.receiverContact} onChange={e=>setForm({...form, receiverContact: e.target.value})} />
                     
                     <div className="mt-4"><label className="text-xs font-bold uppercase tracking-wider text-muted-foreground"><Calendar className="w-3 h-3 inline mr-1 -mt-0.5"/> Estimated DB Arrival</label>
                        <Input type="datetime-local" className="mt-2 h-10 bg-secondary/30" value={form.estimatedArrival} onChange={e=>setForm({...form, estimatedArrival: e.target.value})} />
                     </div>
                   </div>
                 </div>
                 <div className="flex justify-end pt-6 border-t border-border/40">
                   <Button size="lg" className="w-full md:w-auto h-12 px-8" onClick={() => setStep(2)}>Next: Fleet Allocation <ChevronRight className="w-4 h-4 ml-2"/></Button>
                 </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 flex flex-col h-full">
                 <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold flex items-center gap-2"><TruckIcon className="text-primary"/> Fleet Asset Allocation</h2>
                   <div className="flex gap-2">
                     <select className="text-xs h-8 bg-card border-border/60 px-2 rounded-md"><option>Sort: Nearest</option><option>Sort: Best Rating</option></select>
                   </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-4 overflow-y-auto pr-2 pb-6 max-h-[40vh]">
                   {drivers.map(d => (
                     <div key={d.id} 
                       onClick={() => d.isAvailable ? setForm({...form, assignedDriverId: d.id}) : null}
                       className={`p-4 rounded-2xl border transition-all ${!d.isAvailable ? "opacity-50 grayscale cursor-not-allowed bg-card" : form.assignedDriverId === d.id ? "border-primary bg-primary/5 ring-1 ring-primary shadow-[0_0_15px_rgba(var(--primary),0.15)]" : "border-border/60 bg-card hover:border-primary/50 cursor-pointer"}`}
                     >
                        <div className="flex justify-between items-start mb-3">
                           <div>
                             <h4 className="font-bold flex items-center gap-2">{d.fullName} {form.assignedDriverId === d.id && <CheckCircle2 className="w-4 h-4 text-primary" />}</h4>
                             <p className="text-xs text-muted-foreground">{d.vehicleType}</p>
                           </div>
                           <div className="text-right">
                             <div className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm ${d.isAvailable ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>{d.isAvailable ? 'Available' : 'On Shift'}</div>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t border-border/40">
                           <span className="flex items-center"><Star className="w-3 h-3 text-amber-500 mr-1 fill-amber-500" /> {d.rating}</span>
                           <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {d.distance} away</span>
                        </div>
                     </div>
                   ))}
                 </div>

                 <div className="flex justify-between mt-auto pt-6 border-t border-border/40">
                   <Button variant="ghost" onClick={() => setStep(1)}><ArrowLeft className="w-4 h-4 mr-2"/> Back Parameters</Button>
                   <Button size="lg" disabled={!form.assignedDriverId} onClick={() => setStep(3)} className="h-12 px-8">Review Manifest <ChevronRight className="w-4 h-4 ml-2"/></Button>
                 </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                 <h2 className="text-xl font-bold flex items-center gap-2 mb-6">Dispatch Protocol</h2>
                 
                 <div className="bg-secondary/10 border border-border/40 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                       
                       <div>
                         <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-widest mb-3 border-b border-border/40 pb-2">Waybill Structure</h3>
                         <dl className="space-y-2 text-sm">
                           <div className="flex justify-between"><dt className="text-muted-foreground">Commodity</dt><dd className="font-bold">{form.cargoType}</dd></div>
                           <div className="flex justify-between"><dt className="text-muted-foreground">Weight</dt><dd className="font-bold">{form.cargoWeight} kg</dd></div>
                           <div className="flex justify-between"><dt className="text-muted-foreground">Biller (Cust.)</dt><dd className="font-bold">{form.customerName || "N/A"}</dd></div>
                           <div className="flex justify-between"><dt className="text-muted-foreground">ETA</dt><dd className="font-mono">{form.estimatedArrival ? new Date(form.estimatedArrival).toLocaleString() : "TBD"}</dd></div>
                         </dl>
                       </div>

                       <div>
                         <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-widest mb-3 border-b border-border/40 pb-2">Assigned Logistics</h3>
                         <div className="bg-card border border-border/60 p-4 rounded-xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0"><Truck className="w-6 h-6 text-primary"/></div>
                            <div>
                               <p className="font-bold">{drivers.find(d => d.id === form.assignedDriverId)?.fullName || "Driver Locked"}</p>
                               <p className="text-xs text-muted-foreground">{drivers.find(d => d.id === form.assignedDriverId)?.vehicleType || "Asset"}</p>
                            </div>
                         </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex justify-between pt-6 border-t border-border/40">
                   <Button variant="ghost" onClick={() => setStep(2)} disabled={loading}><ArrowLeft className="w-4 h-4 mr-2"/> Modify Fleet</Button>
                   <Button size="lg" onClick={dispatchShipment} disabled={loading} className={`h-12 px-8 font-bold ${loading ? 'animate-pulse' : ''}`}>
                     {loading ? "Transmitting Protocol..." : "Confirm & Dispatch System"} 
                     {!loading && <TruckIcon className="w-4 h-4 ml-2"/>}
                   </Button>
                 </div>
              </motion.div>
            )}

         </AnimatePresence>
      </div>
    </div>
  )
}
