import { useState, useEffect, useCallback } from "react"
import { API } from "@/context/AuthContext"

export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      
      const res = await fetch(`${API}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        const notifs = data.data || []
        setNotifications(notifs)
        setUnreadCount(notifs.filter(n => !n.read).length)
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
    }
  }, [])

  // Poll every 30 seconds
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const markAsRead = async (id) => {
    try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${API}/api/notifications/${id}/read`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))
        }
    } catch (err) {
        console.error("Failed to mark notification as read", err)
    }
  }

  return { notifications, unreadCount, markAsRead, refetch: fetchNotifications }
}
