import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { shipmentService } from '@/services/shipmentService'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function NewShipmentPage() {
  const [locations, setLocations] = useState([])
  const [form, setForm] = useState({
    cargoType: '',
    originId: '',
    destinationId: '',
    estimatedArrival: '',
    currentLatitude: 20.0,
    currentLongitude: 77.0,
    driverName: '',
    driverContact: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    shipmentService.getLocations().then(setLocations).catch(console.error)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await shipmentService.createShipment(form)
      toast.success('Shipment created successfully!')
      navigate('/dashboard/map')
    } catch (err) {
      toast.error('Failed to create shipment: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>New Shipment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Cargo Type</Label>
              <Input value={form.cargoType} onChange={(e) => setForm({...form, cargoType: e.target.value})} required />
            </div>
            <div>
              <Label>Origin</Label>
              <Select value={form.originId} onValueChange={(v) => setForm({...form, originId: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(l => <SelectItem key={l.id} value={l.id}>{l.name} ({l.type})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Destination</Label>
              <Select value={form.destinationId} onValueChange={(v) => setForm({...form, destinationId: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(l => <SelectItem key={l.id} value={l.id}>{l.name} ({l.type})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Estimated Arrival</Label>
              <Input type="datetime-local" value={form.estimatedArrival} onChange={(e) => setForm({...form, estimatedArrival: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Current Lat</Label>
                <Input type="number" step="any" value={form.currentLatitude} onChange={(e) => setForm({...form, currentLatitude: parseFloat(e.target.value)})} />
              </div>
              <div>
                <Label>Current Lng</Label>
                <Input type="number" step="any" value={form.currentLongitude} onChange={(e) => setForm({...form, currentLongitude: parseFloat(e.target.value)})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Driver Name</Label>
                <Input value={form.driverName} onChange={(e) => setForm({...form, driverName: e.target.value})} />
              </div>
              <div>
                <Label>Driver Contact</Label>
                <Input value={form.driverContact} onChange={(e) => setForm({...form, driverContact: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Creating...' : 'Create Shipment'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard/map')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
