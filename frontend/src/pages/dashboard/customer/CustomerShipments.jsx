import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Package, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/ui/status-badge"
import { useCustomerShipments } from "./hooks/useCustomerShipments"
import { useNavigate } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function CustomerShipments() {
  const { shipments, loading } = useCustomerShipments()
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const navigate = useNavigate()

  // Custom debounce hook replica
  useMemo(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(handler)
  }, [search])

  const filteredShipments = useMemo(() => {
    return shipments.filter(s => {
      const qs = debouncedSearch.toLowerCase().trim()
      const matchesSearch = s.trackingNumber.toLowerCase().includes(qs) ||
                            (s.destinationName && s.destinationName.toLowerCase().includes(qs))
      const matchesStatus = statusFilter === "ALL" || s.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [debouncedSearch, statusFilter, shipments])

  return (
    <div className="flex flex-col min-h-full max-w-6xl mx-auto w-full">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 pt-6 pb-4 px-5 lg:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Active Directory</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Filter and query your complete shipment ledger</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search ID or Destination..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-secondary/30 transition-all border-border/60 focus-visible:ring-primary/20"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-secondary/30 border-border/60">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                <SelectItem value="DELAYED">Delayed / Issues</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-0 py-6">
        {loading ? (
           <div className="space-y-4">
              {[1,2,3,4].map(i => <div key={i} className="h-16 bg-secondary/30 animate-pulse rounded-xl" />)}
           </div>
        ) : filteredShipments.length === 0 ? (
          <div className="py-24 text-center border border-dashed rounded-2xl border-border/60 bg-secondary/10 mx-auto max-w-2xl mt-8">
            <Package className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold mb-2 tracking-tight">Zero Records Located</h3>
            <p className="text-muted-foreground">Adjust your filters or verify the Tracking ID.</p>
            <Button variant="outline" className="mt-6" onClick={() => { setSearch(""); setStatusFilter("ALL"); }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 overflow-hidden bg-card card-shadow shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left line-clamp-1">
                <thead className="bg-secondary/40 text-muted-foreground uppercase tracking-wider text-[10px] sm:text-xs">
                  <tr>
                    <th className="px-6 py-4 font-bold">Tracking / Type</th>
                    <th className="px-6 py-4 font-bold">Live Status</th>
                    <th className="px-6 py-4 font-bold">Assigned Route</th>
                    <th className="px-6 py-4 font-bold text-right">Logistics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  <AnimatePresence>
                    {filteredShipments.map((shipment, idx) => (
                      <motion.tr 
                        key={shipment.id}
                        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2, delay: Math.min(idx * 0.05, 0.4) }}
                        onClick={() => navigate(`/dashboard/tracking/${shipment.id}`)}
                        className="hover:bg-secondary/20 cursor-pointer group transition-all"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="font-mono font-bold text-primary group-hover:underline underline-offset-4">{shipment.trackingNumber}</span>
                          <div className="text-xs text-muted-foreground mt-0.5">{shipment.cargoType} • {shipment.cargoWeight}kg</div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <StatusBadge status={shipment.status} />
                          {shipment.status === "DELAYED" && <span className="text-[10px] font-bold text-destructive ml-2 animate-pulse">ATTENTION</span>}
                        </td>
                        <td className="px-6 py-5 max-w-[200px]">
                          <div className="flex flex-col gap-1.5 min-w-[150px]">
                            <span className="truncate" title={shipment.originName}>
                              <span className="text-muted-foreground text-[10px] uppercase font-bold mr-2">Pick</span> 
                              {shipment.originName || "N/A"}
                            </span>
                            <span className="truncate font-medium text-foreground" title={shipment.destinationName}>
                              <span className="text-muted-foreground text-[10px] uppercase font-bold mr-2">Drop</span> 
                              {shipment.destinationName || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right">
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            View <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-border/40 bg-secondary/30 text-xs text-muted-foreground flex justify-between items-center">
              <span>Showing <strong>{filteredShipments.length}</strong> matching records</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
