import { useState, useEffect, useCallback } from "react"
import { useAuth, API } from "@/context/AuthContext"
import { queueActionIfOffline, syncOfflineQueue, initOfflineSyncListener } from "@/services/offlineSync"

export function useDriverShipments() {
  const { user } = useAuth()
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchShipments = useCallback(async () => {
    if (!user) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/shipments/driver/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setShipments(data.data || [])
      }
    } catch (err) {
      console.error("Failed to fetch shipments:", err)
      setError("Unable to connect to server.")
    } finally {
      if (loading) setLoading(false)
    }
  }, [user, loading])

  // Setup 15-second polling + offline listener
  useEffect(() => {
    fetchShipments()
    initOfflineSyncListener(() => localStorage.getItem("token"))

    const interval = setInterval(fetchShipments, 15000)
    return () => clearInterval(interval)
  }, [fetchShipments])

  const updateStatus = async (shipmentId, newStatus, notes = "", proofUrl = "") => {
    const originalShipments = [...shipments]
    const updatedShipments = shipments.map(s => 
      s.id === shipmentId ? { ...s, status: newStatus } : s
    )
    
    // Optimistic UI update
    setShipments(updatedShipments)

    const payload = { status: newStatus, notes, proofOfDeliveryUrl: proofUrl }
    const endpoint = `/api/shipments/${shipmentId}/status`

    if (queueActionIfOffline(endpoint, "PUT", payload)) {
      console.log(`[Offline] Scheduled status update -> ${newStatus}`)
      return true
    }

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }
      return true
    } catch (err) {
      console.error("Status update failed:", err)
      // Rollback optimistic update
      setShipments(originalShipments)
      throw err
    }
  }

  const activeShipment = shipments.find(s => s.status === "IN_TRANSIT" || s.status === "AT_RISK")
  const pendingTasks = shipments.filter(s => s.status === "PENDING" || s.status === "DELAYED")
  const deliveredShipments = shipments.filter(s => s.status === "DELIVERED")

  return {
    shipments,
    activeShipment,
    pendingTasks,
    deliveredShipments,
    loading,
    error,
    refetch: fetchShipments,
    updateStatus
  }
}
