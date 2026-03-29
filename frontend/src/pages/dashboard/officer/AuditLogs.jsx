import { useState } from "react"
import { Activity, Download, Search, Settings, ShieldCheck, Eye, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/ui/status-badge"

export default function AuditLogs() {
  const [search, setSearch] = useState('')
  
  const mockLogs = [
     { id: 'AL-904', time: new Date().toISOString(), actor: 'System AI', role: 'DEEP-MIND', action: 'Route override commanded', shipmentId: 'SH-1029', ip: 'internal-node-04', severity: 'CRITICAL' },
     { id: 'AL-903', time: new Date(Date.now() - 3600000).toISOString(), actor: 'Officer Rajesh', role: 'OFFICER', action: 'Assigned Driver Vikram R.', shipmentId: 'SH-1028', ip: '192.168.1.144', severity: 'INFO' },
     { id: 'AL-902', time: new Date(Date.now() - 7200000).toISOString(), actor: 'System Integrity', role: 'SERVICE', action: 'Failed KYC verification', shipmentId: 'SH-1027', ip: 'gateway-verify', severity: 'WARNING' },
     { id: 'AL-901', time: new Date(Date.now() - 8400000).toISOString(), actor: 'Officer Rajesh', role: 'OFFICER', action: 'Created new manifest', shipmentId: 'SH-1027', ip: '192.168.1.144', severity: 'INFO' },
     { id: 'AL-900', time: new Date(Date.now() - 10400000).toISOString(), actor: 'Driver Vikram R.', role: 'DRIVER', action: 'Marked DELIVERED', shipmentId: 'SH-1026', ip: '10.0.0.22', severity: 'INFO' },
     { id: 'AL-899', time: new Date(Date.now() - 86400000).toISOString(), actor: 'System AI', role: 'DEEP-MIND', action: 'Weather delay flag applied', shipmentId: 'SH-1011', ip: 'weather-api-sync', severity: 'WARNING' },
  ]

  const filteredLogs = mockLogs.filter(l => 
     l.actor.toLowerCase().includes(search.toLowerCase()) || 
     l.shipmentId.toLowerCase().includes(search.toLowerCase()) ||
     l.action.toLowerCase().includes(search.toLowerCase())
  )

  const getSeverityBadge = (severity) => {
    switch(severity) {
      case 'CRITICAL': return <span className="bg-destructive/10 text-destructive text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-widest">{severity}</span>
      case 'WARNING': return <span className="bg-amber-500/10 text-amber-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-widest">{severity}</span>
      default: return <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-widest">{severity}</span>
    }
  }

  return (
    <div className="flex flex-col min-h-full max-w-7xl mx-auto w-full pb-16">
      <div className="pt-8 pb-6 px-6 lg:px-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
             <Activity className="w-8 h-8 text-primary" /> System Audit Ledger
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Immutable tracking record of all manual operations, AI interventions, and fleet state modifications.
          </p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="gap-2"><Settings className="w-4 h-4"/> Filter Rules</Button>
           <Button className="gap-2"><Download className="w-4 h-4"/> Export CSV</Button>
        </div>
      </div>

      <div className="px-6 lg:px-8 mt-8">
         <div className="bg-card border border-border/60 rounded-3xl card-shadow overflow-hidden">
            
            <div className="p-4 border-b border-border/40 flex justify-between items-center bg-secondary/20 h-16">
               <div className="relative w-full max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                     placeholder="Search actor, action, or ID..." 
                     className="pl-9 h-10 bg-background border-border/60" 
                     value={search} onChange={e=>setSearch(e.target.value)} 
                  />
               </div>
               <div className="hidden sm:block text-xs font-mono text-muted-foreground">Showing max 1000 events</div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase text-muted-foreground tracking-wider border-b border-border/40 bg-secondary/10">
                  <tr>
                    <th className="px-6 py-4 font-medium min-w-[150px]">Timestamp / Vector</th>
                    <th className="px-6 py-4 font-medium min-w-[180px]">Responsible Entity</th>
                    <th className="px-6 py-4 font-medium min-w-[280px]">Operation Payload</th>
                    <th className="px-6 py-4 font-medium text-center">Reference ID</th>
                    <th className="px-6 py-4 font-medium text-right">Audit Trace</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => (
                     <tr key={log.id} className="border-b border-border/20 last:border-0 hover:bg-secondary/20 transition-colors group">
                        
                        <td className="px-6 py-4">
                            <p className="font-mono font-bold">{new Date(log.time).toLocaleDateString()} {new Date(log.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">IP: {log.ip}</p>
                        </td>
                        
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${log.role === 'DEEP-MIND' ? 'bg-[#8b5cf6]/20' : log.role === 'OFFICER' ? 'bg-primary/20' : log.role === 'DRIVER' ? 'bg-amber-500/20' : 'bg-secondary'}`}>
                                  {log.role === 'DEEP-MIND' ? <Terminal className="w-4 h-4 text-[#8b5cf6]" /> : <ShieldCheck className={`w-4 h-4 ${log.role === 'OFFICER' ? 'text-primary' : 'text-amber-500'}`} />}
                               </div>
                               <div>
                                  <p className="font-bold">{log.actor}</p>
                                  <p className="text-[10px] text-muted-foreground tracking-widest uppercase">{log.role}</p>
                               </div>
                            </div>
                        </td>
                        
                        <td className="px-6 py-4">
                            <p className="text-sm font-medium pr-4">{log.action}</p>
                        </td>
                        
                        <td className="px-6 py-4 text-center">
                            <span className="font-mono text-xs font-bold bg-secondary px-2 py-1 rounded">{log.shipmentId}</span>
                        </td>
                        
                        <td className="px-6 py-4 text-right flex flex-col justify-end items-end gap-2">
                           {getSeverityBadge(log.severity)}
                           <button className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"><Eye className="w-3 h-3"/> Reveal Frame</button>
                        </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLogs.length === 0 && (
               <div className="p-12 text-center flex flex-col items-center">
                  <Activity className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <p className="font-bold text-lg">Empty Data Stream</p>
                  <p className="text-muted-foreground text-sm mt-1">Try modifying your terminal filters.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  )
}
