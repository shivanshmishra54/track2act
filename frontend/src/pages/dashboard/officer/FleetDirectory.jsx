import { useState, useEffect } from "react"
import { Users, UserCheck, UserX, Phone, Mail, Award, Clock } from "lucide-react"
import { API } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"

export default function FleetDirectory() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  
  const mockFallback = [
      { id: 'f1', fullName: 'Arjun Singh', email: 'arjun@track2act.com', isActive: true, vehicle: 'Rig-T10', rating: 4.8, distance: '12km' },
      { id: 'f2', fullName: 'Vikram R.', email: 'vikram@track2act.com', isActive: true, vehicle: 'Rig-T12', rating: 4.9, distance: '4km' },
      { id: 'f3', fullName: 'Priya K.', email: 'priya@track2act.com', isActive: false, vehicle: 'Van-V2', rating: 4.5, distance: '0km' },
      { id: 'f4', fullName: 'Samuel K.', email: 'samuel@track2act.com', isActive: true, vehicle: 'Rig-T05', rating: 4.2, distance: '89km' },
  ]

  useEffect(() => {
    const fetchFleet = async () => {
      try {
        const res = await fetch(`${API}/api/users/role/DRIVER`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})
        if (res.ok) {
           const data = await res.json()
           if (data.data && data.data.length > 0) {
              const enhanced = data.data.map((d, i) => ({
                 ...d,
                 vehicle: `Rig-T0${i+1}`,
                 rating: (4 + Math.random()).toFixed(1),
                 distance: Math.floor(Math.random() * 100) + 'km',
              }))
              setDrivers(enhanced)
           } else {
              setDrivers(mockFallback)
           }
        } else {
           setDrivers(mockFallback)
        }
      } catch (err) {
        setDrivers(mockFallback)
      } finally {
        setLoading(false)
      }
    }
    fetchFleet()
  }, [])

  const activeCount = drivers.filter(d => d.isActive).length

  return (
    <div className="flex flex-col min-h-full max-w-6xl mx-auto w-full pb-16">
      <div className="pt-8 pb-6 px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Active Fleet Directory</h1>
          <p className="text-muted-foreground mt-1">Global manifest of transportation personnel</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-secondary/30 px-4 py-2 rounded-xl flex items-center gap-3 border border-border/60">
              <UserCheck className="w-5 h-5 text-success" />
              <div>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Available</p>
                 <p className="font-mono font-bold">{activeCount}</p>
              </div>
           </div>
           <div className="bg-secondary/30 px-4 py-2 rounded-xl flex items-center gap-3 border border-border/60">
              <UserX className="w-5 h-5 text-destructive" />
              <div>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">On Break</p>
                 <p className="font-mono font-bold">{drivers.length - activeCount}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="px-6 lg:px-8 mt-8">
        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => <div key={i} className="bg-card h-40 rounded-2xl animate-pulse card-shadow border border-border/60" />)}
             </div>
        ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drivers.map(d => (
                   <div key={d.id} className="bg-card border border-border/60 rounded-2xl p-6 card-shadow hover:shadow-lg hover:border-primary/30 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                         <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center font-bold text-lg text-primary group-hover:bg-primary/10 transition-colors">
                           {d.fullName.charAt(0)}
                         </div>
                         <StatusBadge status={d.isActive ? 'IN_TRANSIT' : 'DELAYED'} />
                      </div>
                      
                      <h3 className="text-lg font-bold truncate">{d.fullName}</h3>
                      <p className="text-xs text-muted-foreground font-mono mb-4">{d.id}</p>
                      
                      <div className="space-y-2 text-sm">
                         <div className="flex items-center justify-between text-muted-foreground"><span className="flex items-center gap-2"><Mail className="w-4 h-4" /> Comms</span> <span className="text-foreground truncate ml-4 max-w-[150px]">{d.email}</span></div>
                         <div className="flex items-center justify-between text-muted-foreground"><span className="flex items-center gap-2"><Award className="w-4 h-4" /> Rating</span> <span className="text-amber-500 font-bold">{d.rating}</span></div>
                         <div className="flex items-center justify-between text-muted-foreground"><span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Distance</span> <span className="text-foreground">{d.distance}</span></div>
                      </div>

                      <Button variant="secondary" className="w-full mt-6 bg-secondary/50 hover:bg-secondary">Transmit Protocol</Button>
                   </div>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}
