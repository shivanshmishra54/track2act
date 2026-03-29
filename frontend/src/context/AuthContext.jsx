import { createContext, useContext, useState, useEffect } from "react"

export const API = "http://localhost:8080"
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { setLoading(false); return }
    fetch(`${API}/api/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setUser(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const response = await res.json()
    if (!res.ok) throw new Error(response.message || "Login failed")
    localStorage.setItem("token", response.data.token)
    const userData = {
      id: response.data.userId,
      fullName: response.data.fullName,
      email: response.data.email,
      role: response.data.role,
    }
    setUser(userData)
    return userData
  }

  const signup = async (fields) => {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: fields.fullName, email: fields.email, password: fields.password, role: fields.role }),
    })
    const response = await res.json()
    if (!res.ok) throw new Error(response.message || "Signup failed")
    localStorage.setItem("token", response.data.token)
    const userData = {
      id: response.data.userId,
      fullName: response.data.fullName,
      email: response.data.email,
      role: response.data.role,
    }
    setUser(userData)
    return userData
  }

  const logout = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      await fetch(`${API}/api/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
    localStorage.removeItem("token")
    setUser(null)
  }

  const updateProfile = async (fields) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API}/api/me`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(fields),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || "Update failed")
    setUser(prev => ({ ...prev, ...data }))
    return data
  }

  const uploadAvatar = async (file) => {
    const token = localStorage.getItem("token")
    const form = new FormData()
    form.append("file", file)
    const res = await fetch(`${API}/api/me/avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || "Upload failed")
    setUser(prev => ({ ...prev, avatar_url: data.avatar_url }))
    return data.avatar_url
  }

  const updateSettings = async (settings) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API}/api/me/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(settings),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || "Settings update failed")
    setUser(prev => ({ ...prev, settings: data }))
    return data
  }

  const changePassword = async (current_password, new_password) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API}/api/me/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ current_password, new_password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || "Password change failed")
    return data
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, uploadAvatar, updateSettings, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
