import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/ui/status-badge"
import { useDriverShipments } from "./hooks/useDriverShipments"
import { useNavigate } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MyShipments() {
  const { shipments } = useDriverShipments()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const navigate = useNavigate()

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
                          (s.destinationName && s.destinationName.toLowerCase().includes(search.toLowerCase()))
    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col min-h-full max-w-6xl mx-auto w-full">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 pt-6 pb-4 px-5 lg:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Shipments</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Comprehensive directory of all your assigned shipments</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-secondary/30"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-secondary/30">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="DELAYED">Delayed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-0 py-6">
        {filteredShipments.length === 0 ? (
          <div className="py-24 text-center border border-dashed rounded-2xl border-border/60 bg-secondary/10">
            <Package className="mx-auto h-10 w-10 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-1">No shipments found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 overflow-hidden bg-card card-shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/40 text-muted-foreground uppercase tracking-wider text-[10px] sm:text-xs">
                  <tr>
                    <th className="px-6 py-4 font-semibold">T2A ID</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Route</th>
                    <th className="px-6 py-4 font-semibold text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredShipments.map((shipment, idx) => (
                    <motion.tr 
                      key={shipment.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                      onClick={() => navigate(`/dashboard/shipment/${shipment.id}`)}
                      className="hover:bg-secondary/20 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-primary">{shipment.trackingNumber}</span>
                        <div className="text-xs text-muted-foreground mt-0.5">{shipment.cargoType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={shipment.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 max-w-xs sm:max-w-sm">
                          <span className="truncate" title={shipment.originName}>
                            <span className="text-muted-foreground text-[10px] uppercase font-bold mr-2">From</span> 
                            {shipment.originName || "N/A"}
                          </span>
                          <span className="truncate" title={shipment.destinationName}>
                            <span className="text-muted-foreground text-[10px] uppercase font-bold mr-2">To</span> 
                            {shipment.destinationName || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex flex-col items-end">
                           <span className="text-muted-foreground/50 text-xs">Assigned</span>
                           <span>{new Date(shipment.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-border/40 bg-secondary/20 text-xs text-muted-foreground flex justify-between items-center">
              <span>Showing {filteredShipments.length} item{filteredShipments.length !== 1 ? 's' : ''}</span>
              {/* Pagination controls would go here */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
