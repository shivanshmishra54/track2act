import { useState, useEffect, useCallback } from "react"
import { useAuth, API } from "@/context/AuthContext"

export function useSupportTickets() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTickets = useCallback(async () => {
    if (!user) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/support`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setTickets(data.data || [])
      }
    } catch (err) {
      console.error("Failed to fetch tickets:", err)
    } finally {
      if (loading) setLoading(false)
    }
  }, [user, loading])

  useEffect(() => {
    fetchTickets()
    const interval = setInterval(fetchTickets, 30000) // Poll for new replies every 30s
    return () => clearInterval(interval)
  }, [fetchTickets])

  const createTicket = async (payload) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API}/api/support`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error(await res.text())
    await fetchTickets()
  }

  const replyToTicket = async (ticketId, content) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API}/api/support/${ticketId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content })
    })
    if (!res.ok) throw new Error(await res.text())
    await fetchTickets()
  }

  return { tickets, loading, refetch: fetchTickets, createTicket, replyToTicket }
}
