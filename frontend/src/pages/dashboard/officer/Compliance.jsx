import { useState } from "react"
import { ShieldAlert, FileSearch, ShieldCheck, CheckCircle2, Clock, Upload, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Compliance() {
  const [activeTab, setActiveTab] = useState('ALL') // ALL, CLEARED, PENDING, INVALID

  const waybills = [
    { id: 'WB-10992', driver: 'Arjun Singh', route: 'Chennai \u2192 Bangalore', missing: 0, status: 'CLEARED', timer: 'Pass' },
    { id: 'WB-10991', driver: 'Vikram R.', route: 'Surat \u2192 Ahmedabad', missing: 1, status: 'PENDING', timer: '2h 14m' },
    { id: 'WB-10990', driver: 'Samuel K.', route: 'Delhi \u2192 Jaipur', missing: 2, status: 'INVALID', timer: '0m' },
    { id: 'WB-10989', driver: 'Rajesh S.', route: 'Mumbai \u2192 Pune', missing: 0, status: 'CLEARED', timer: 'Pass' },
    { id: 'WB-10988', driver: 'Mahesh B.', route: 'Hyderabad \u2192 Vijayawada', missing: 0, status: 'CLEARED', timer: 'Pass' },
  ]

  const filtered = activeTab === 'ALL' ? waybills : waybills.filter(w => w.status === activeTab)

  return (
    <div className="flex flex-col min-h-full max-w-6xl mx-auto w-full pb-16">
      <div className="pt-8 pb-6 px-6 lg:px-8 border-b border-border/40 mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
             <ShieldCheck className="w-8 h-8 text-primary" /> Compliance Ledger
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Audit and verify E-Way bills, border crossing documentation, and driver KYC clearances.
          </p>
        </div>
        <div className="flex bg-secondary/30 rounded-xl p-1 border border-border/60">
           {['ALL', 'CLEARED', 'PENDING', 'INVALID'].map(t => (
             <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-widest ${activeTab === t ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                {t}
             </button>
           ))}
        </div>
      </div>

      <div className="px-6 lg:px-8 space-y-6">
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-success/5 border border-success/20 rounded-2xl p-6 card-shadow">
               <div className="flex justify-between items-center mb-4"><p className="text-xs uppercase font-bold text-success tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Cleared</p><h2 className="text-3xl font-mono font-black text-success">64</h2></div>
               <p className="text-xs text-muted-foreground">Manifests verified for interstate crossing.</p>
            </div>
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 card-shadow">
               <div className="flex justify-between items-center mb-4"><p className="text-xs uppercase font-bold text-amber-500 tracking-widest flex items-center gap-2"><Clock className="w-4 h-4"/> Pending</p><h2 className="text-3xl font-mono font-black text-amber-500">3</h2></div>
               <p className="text-xs text-muted-foreground">Awaiting driver uploads passing through weigh stations.</p>
            </div>
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 card-shadow">
               <div className="flex justify-between items-center mb-4"><p className="text-xs uppercase font-bold text-destructive tracking-widest flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Violations</p><h2 className="text-3xl font-mono font-black text-destructive">1</h2></div>
               <p className="text-xs text-muted-foreground">Expired E-Way bills detected. Action immediately required.</p>
            </div>
         </div>

         <div className="bg-card border border-border/60 rounded-3xl card-shadow overflow-hidden">
            <div className="p-5 border-b border-border/40 flex justify-between items-center bg-secondary/20">
               <h3 className="font-bold flex items-center gap-2"><FileSearch className="w-5 h-5 text-muted-foreground"/> Document Archive</h3>
               <Button variant="outline" size="sm" className="h-8 gap-2 text-xs"><Filter className="w-3 h-3"/> Filter View</Button>
            </div>
            
            <div className="overflow-x-auto p-2">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase text-muted-foreground tracking-wider border-b border-border/40">
                  <tr>
                    <th className="px-4 py-4 font-medium min-w-[120px]">E-Way Bill ID</th>
                    <th className="px-4 py-4 font-medium">Assigned Route</th>
                    <th className="px-4 py-4 font-medium text-center">Missing Docs</th>
                    <th className="px-4 py-4 font-medium">Border Window</th>
                    <th className="px-4 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(w => (
                     <tr key={w.id} className="border-b border-border/20 last:border-0 hover:bg-secondary/10 transition-colors">
                        <td className="px-4 py-5 font-mono font-bold">{w.id}</td>
                        <td className="px-4 py-5 min-w-[200px]">
                            <p>{w.route}</p>
                            <p className="text-xs text-muted-foreground font-mono mt-1">OPERATOR: {w.driver}</p>
                        </td>
                        <td className="px-4 py-5 text-center">
                            <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${w.missing > 0 ? 'bg-destructive/10 text-destructive' : 'text-success'}`}>{w.missing === 0 ? 'COMPLETE' : `${w.missing} REQUIRED`}</span>
                        </td>
                        <td className="px-4 py-5">
                            {w.timer === 'Pass' ? (
                               <span className="text-success text-xs font-bold uppercase tracking-widest">Cleared</span>
                            ) : (
                               <span className={`font-mono text-xs font-bold px-2 py-1 rounded ${w.timer === '0m' ? 'bg-destructive text-destructive-foreground animate-pulse' : 'bg-amber-500/10 text-amber-500'}`}>T-Minus {w.timer}</span>
                            )}
                        </td>
                        <td className="px-4 py-5 text-right">
                            {w.status === 'CLEARED' ? (
                               <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-muted-foreground"><ShieldCheck className="w-4 h-4 mr-2"/> Verified</Button>
                            ) : (
                               <Button size="sm" variant={w.status === 'INVALID' ? 'destructive' : 'default'} className="h-8 px-4 text-xs">
                                 <Upload className="w-3 h-3 mr-2"/> Force Upload
                               </Button>
                            )}
                        </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
         </div>
      </div>
    </div>
  )
}
