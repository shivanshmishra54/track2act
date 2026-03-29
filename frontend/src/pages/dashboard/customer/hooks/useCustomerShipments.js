import { useState, useEffect, useCallback } from "react"
import { useAuth, API } from "@/context/AuthContext"

export function useCustomerShipments() {
  const { user } = useAuth()
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchShipments = useCallback(async () => {
    if (!user) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/shipments/customer`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setShipments(data.data || [])
      } else if (res.status === 401) {
        // Handle session expiration by reloading, which triggers Unauth flow
        window.location.reload()
      }
    } catch (err) {
      console.error("Failed to fetch customer shipments:", err)
    } finally {
      if (loading) setLoading(false)
    }
  }, [user, loading])

  // Smart polling: Update every 15s to get real-time location tweaks
  useEffect(() => {
    fetchShipments()
    const interval = setInterval(fetchShipments, 15000)
    return () => clearInterval(interval)
  }, [fetchShipments])

  const getShipmentById = (id) => {
    return shipments.find(s => s.id === id || s.trackingNumber === id)
  }

  return {
    shipments,
    loading,
    refetch: fetchShipments,
    getShipmentById
  }
}
