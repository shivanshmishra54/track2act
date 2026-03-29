// src/services/offlineSync.js
import { API } from "@/context/AuthContext"

const QUEUE_KEY = "track2act_offline_queue"

/**
 * Pushes an action to the local storage queue if offline.
 * Returns true if queued (offline), false if online (should execute normally).
 */
export const queueActionIfOffline = (endpoint, method, body) => {
  if (navigator.onLine) return false

  const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]")
  queue.push({
    endpoint,
    method,
    body,
    timestamp: Date.now(),
  })
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  return true
}

/**
 * Processes all queued offline actions when connection is restored.
 */
export const syncOfflineQueue = async (token) => {
  const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]")
  if (queue.length === 0) return

  console.log(`[OfflineSync] Syncing ${queue.length} pending actions...`)
  const remainingQueue = []

  for (const action of queue) {
    try {
      const res = await fetch(`${API}${action.endpoint}`, {
        method: action.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(action.body)
      })
      if (!res.ok) {
        console.error(`[OfflineSync] Failed action against ${action.endpoint}`, await res.text())
        // Keep in queue if it's a 5xx error, but drop if 4xx (bad request)
        if (res.status >= 500) remainingQueue.push(action)
      }
    } catch (err) {
      console.error(`[OfflineSync] Network error syncing action:`, err)
      remainingQueue.push(action)
    }
  }

  localStorage.setItem(QUEUE_KEY, JSON.stringify(remainingQueue))
  if (remainingQueue.length === 0) {
    console.log("[OfflineSync] Sync complete!")
  } else {
    console.log(`[OfflineSync] Sync partially complete. ${remainingQueue.length} actions remaining.`)
  }
}

// Global listener to trigger sync when coming online
export const initOfflineSyncListener = (tokenProvider) => {
  window.addEventListener('online', async () => {
    const token = tokenProvider()
    if (token) await syncOfflineQueue(token)
  })
}
