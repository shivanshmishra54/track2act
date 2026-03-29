import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Search, Calendar, BadgeCheck, FileCheck2 } from "lucide-react"
import { useDriverShipments } from "./hooks/useDriverShipments"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function Delivered() {
  const { deliveredShipments } = useDriverShipments()
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  const filtered = deliveredShipments.filter(s => 
    s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
    (s.customerName && s.customerName.toLowerCase().includes(search.toLowerCase()))
  )

  // Group by date (simplified for styling)
  const grouped = filtered.reduce((acc, curr) => {
    const dateStr = new Date(curr.updatedAt || curr.createdAt).toLocaleDateString()
    if (!acc[dateStr]) acc[dateStr] = []
    acc[dateStr].push(curr)
    return acc
  }, {})

  return (
    <div className="flex flex-col min-h-full max-w-4xl mx-auto w-full">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 pt-6 pb-4 px-5 lg:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Delivery History</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Record of your completed assignments</p>
          </div>
          
          <div className="relative max-w-sm w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search ID or Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary/30"
            />
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-0 py-8">
        {Object.keys(grouped).length === 0 ? (
          <div className="py-24 text-center border border-dashed rounded-2xl border-border/60 bg-secondary/10">
            <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-success/60" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No delivery records</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Completed deliveries will appear here as a read-only historical ledger.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.keys(grouped).map((date) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{date}</h3>
                  <div className="flex-1 h-px bg-border/40 ml-2" />
                </div>
                
                <div className="grid gap-4">
                  {grouped[date].map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => navigate(`/dashboard/shipment/${item.id}`)}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-border/60 bg-card hover:bg-secondary/20 cursor-pointer card-shadow transition-all"
                    >
                      <div className="flex items-start gap-4 mb-4 sm:mb-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/15 border border-success/30">
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-primary">{item.trackingNumber}</span>
                            <span className="text-xs text-muted-foreground">|</span>
                            <span className="text-xs font-medium text-muted-foreground">
                              {new Date(item.updatedAt || item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <p className="text-sm font-medium">Customer: {item.customerName || "N/A"}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px] sm:max-w-xs">{item.destinationName}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-border/50 sm:border-0">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-medium border border-success/20">
                          <BadgeCheck className="h-3.5 w-3.5" /> PoD Saved
                        </div>
                        <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground group-hover:text-primary transition-colors">
                          <FileCheck2 className="h-4 w-4 mr-2" /> View
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
