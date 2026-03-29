import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Activity, AlertTriangle, Brain, Package, Users, Plus, ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { API } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function CompanyOfficerOverview() {
  const [stats, setStats] = useState({
    activeShipments: 0,
    driversOnRoad: 0,
    criticalAlerts: 0,
    aiInterventions: 0
  })
  const [recentShipments, setRecentShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // In a real app, we would fetch /api/shipments/active for this officer
    // Mocking the high-level dashboard fetch since there isn't a dedicated Company Officer endpoint that groups AI alerts, etc.
    setTimeout(() => {
      setStats({
        activeShipments: 124,
        driversOnRoad: 86,
        criticalAlerts: 3,
        aiInterventions: 12
      })
      setRecentShipments([
        { id: "SH-1029", route: "Chennai \u2192 Bangalore", driver: "Arun Kumar", value: "\u20B9 14.5L", status: "IN_TRANSIT" },
        { id: "SH-1028", route: "Mumbai \u2192 Pune", driver: "Rajesh S.", value: "\u20B9 8.2L", status: "DELAYED" },
        { id: "SH-1027", route: "Delhi \u2192 Gurugram", driver: "Vikram S.", value: "\u20B9 2.1L", status: "PENDING" },
        { id: "SH-1026", route: "Hyderabad \u2192 Vijayawada", driver: "Mahesh B.", value: "\u20B9 18.0L", status: "DELIVERED" }
      ])
      setLoading(false)
    }, 800)
  }, [])

  return (
    <div className="flex flex-col min-h-full w-full max-w-7xl mx-auto pb-16">
      <div className="pt-8 pb-6 px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground mt-1">Enterprise Supply Chain & Logistics Control</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="gap-2" onClick={() => navigate('/dashboard/decision-ai')}>
              <Brain className="w-4 h-4 text-primary" /> AI Insights
           </Button>
           <Button className="gap-2" onClick={() => navigate('/dashboard/create-shipment')}>
              <Plus className="w-4 h-4" /> Dispatch Asset
           </Button>
        </div>
      </div>

      <div className="px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Network", value: stats.activeShipments, icon: Package, color: "text-foreground", bg: "bg-secondary" },
          { label: "Personnel Deployed", value: stats.driversOnRoad, icon: Users, color: "text-primary", bg: "bg-primary/10" },
          { label: "Supply Chain Threats", value: stats.criticalAlerts, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", pulse: true },
          { label: "AI Decisions Executed", value: stats.aiInterventions, icon: Brain, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10" }
        ].map((s, idx) => (
           <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} 
             className="bg-card border border-border/60 rounded-2xl p-5 card-shadow flex items-center justify-between group cursor-default"
           >
              <div>
                 <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
                 <div className={`text-4xl font-extrabold mt-2 ${s.color}`}>
                   {loading ? <div className="h-10 w-16 bg-secondary/50 animate-pulse rounded" /> : s.value}
                 </div>
              </div>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
                 <s.icon className={`w-6 h-6 ${s.color} ${s.pulse && stats.criticalAlerts > 0 ? "animate-pulse" : ""}`} />
              </div>
           </motion.div>
        ))}
      </div>

      <div className="px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Panel: Recent Invoices/Shipments */}
        <div className="lg:col-span-2 bg-card border border-border/60 rounded-2xl card-shadow overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border/40 flex justify-between items-center bg-secondary/20">
             <h2 className="font-bold flex items-center gap-2"><Activity className="w-4 h-4 text-muted-foreground"/> Recent Dispatches</h2>
             <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground" onClick={() => navigate('/dashboard/live-map')}>
               View Global Map <ArrowRight className="w-3 h-3 ml-1" />
             </Button>
          </div>
          <div className="overflow-x-auto flex-1 p-2">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase text-muted-foreground tracking-wider border-b border-border/40">
                <tr>
                  <th className="px-4 py-3 font-medium">Logistics ID</th>
                  <th className="px-4 py-3 font-medium min-w-[180px]">Routing Vector</th>
                  <th className="px-4 py-3 font-medium">Driver Operator</th>
                  <th className="px-4 py-3 font-medium">Declared Value</th>
                  <th className="px-4 py-3 font-medium text-right">Live Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? [1,2,3,4].map(i => (
                  <tr key={i} className="border-b border-border/20 last:border-0"><td colSpan={5} className="px-4 py-4"><div className="h-6 bg-secondary/30 animate-pulse rounded" /></td></tr>
                )) : recentShipments.map((s, idx) => (
                  <tr key={idx} className="border-b border-border/20 last:border-0 hover:bg-secondary/10 transition-colors group">
                     <td className="px-4 py-4 font-mono font-bold text-primary">{s.id}</td>
                     <td className="px-4 py-4">{s.route}</td>
                     <td className="px-4 py-4">{s.driver}</td>
                     <td className="px-4 py-4 font-mono text-muted-foreground">{s.value}</td>
                     <td className="px-4 py-4 text-right flex justify-end"><StatusBadge status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: AI & Compliance Health */}
        <div className="space-y-6">
           {/* AI Threat Board */}
           <div className="bg-[#8b5cf6]/5 border border-[#8b5cf6]/20 rounded-2xl p-5 card-shadow relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 blur-xl pointer-events-none">
                <Brain className="w-32 h-32 text-[#8b5cf6]" />
             </div>
             <h2 className="font-bold flex items-center gap-2 text-[#8b5cf6] mb-4 relative z-10"><Brain className="w-5 h-5"/> Deep-Mind AI Alerts</h2>
             
             {loading ? <div className="space-y-3 relative z-10"><div className="h-16 bg-[#8b5cf6]/10 animate-pulse rounded-xl"/><div className="h-16 bg-[#8b5cf6]/10 animate-pulse rounded-xl"/></div> : (
               <div className="space-y-3 relative z-10">
                 <div className="bg-card border border-[#8b5cf6]/30 p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/dashboard/decision-ai')}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-[#8b5cf6] font-mono border border-[#8b5cf6]/30 px-1 rounded">DR-2024-1847</span>
                      <span className="text-[10px] text-muted-foreground">2m ago</span>
                    </div>
                    <p className="text-sm font-semibold mb-1">Port Congestion Predicted</p>
                    <p className="text-xs text-muted-foreground">Mumbai/JNPT throughput dropped 40%. Alternate routing calculated.</p>
                 </div>
                 <div className="bg-card border border-border/60 p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/dashboard/decision-ai')}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-muted-foreground font-mono border border-border/60 px-1 rounded">WX-2024-0991</span>
                      <span className="text-[10px] text-muted-foreground">1hr ago</span>
                    </div>
                    <p className="text-sm font-semibold mb-1">Severe Weather Warning</p>
                    <p className="text-xs text-muted-foreground">Cyclone formations affecting Coastal route T2. 23 trucks at risk.</p>
                 </div>
               </div>
             )}
           </div>

           {/* Compliance Quick Check */}
           <div className="bg-card border border-border/60 rounded-2xl p-5 card-shadow">
             <h2 className="font-bold flex items-center gap-2 mb-4"><ShieldCheck className="w-5 h-5 text-muted-foreground"/> Ledger Compliance</h2>
             <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-xs mb-1 font-bold"><span className="text-muted-foreground">Cleared Waybills</span> <span>94%</span></div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden flex"><div className="bg-success w-[94%]"></div></div>
               </div>
               <div>
                  <div className="flex justify-between text-xs mb-1 font-bold"><span className="text-muted-foreground">Border Delays</span> <span className="text-amber-500">6%</span></div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden flex"><div className="bg-amber-500 w-[6%]"></div></div>
               </div>
             </div>
             <Button variant="ghost" className="w-full mt-4 text-xs h-8" onClick={() => navigate('/dashboard/compliance')}>Review Invalid Documents</Button>
           </div>
        </div>

      </div>
    </div>
  )
}
