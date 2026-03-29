import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { useNotifications } from "@/hooks/useNotifications"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, Activity, Package, LifeBuoy, LayoutDashboard, ChevronRight, Bell } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const { notifications, unreadCount, markAsRead } = useNotifications()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const navLinks = [
    { label: "Track Shipment", href: "/track", icon: Package },
    ...(user ? [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Support", href: "/support", icon: LifeBuoy },
    ] : []),
  ]

  const isActive = (href) => location.pathname === href

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-md group-hover:shadow-primary/30 transition-all"
              whileHover={{ scale: 1.08, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Activity className="w-4 h-4 text-primary-foreground" />
            </motion.div>
            <span className="hidden sm:block text-lg font-bold tracking-tight">
              Track<span className="gradient-text">2</span>Act
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {user && (
              <div className="relative mr-2">
                <Button variant="ghost" size="sm" onClick={() => setBellOpen(!bellOpen)} className="h-8 w-8 px-0 relative">
                  <Bell className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive animate-pulse" />}
                </Button>
                
                <AnimatePresence>
                  {bellOpen && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-3 w-80 bg-background/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="p-3 border-b border-border/40 font-bold flex justify-between items-center bg-secondary/20">
                         <span className="text-sm">Notifications</span>
                         <span className="text-[10px] uppercase tracking-widest bg-primary/20 text-primary px-2 py-0.5 rounded font-bold">{unreadCount} Unread</span>
                      </div>
                      <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
                         {notifications.length === 0 ? <div className="p-6 text-center text-xs text-muted-foreground font-medium">All caught up!</div> : 
                           notifications.map(n => (
                             <div key={n.id} onClick={() => { markAsRead(n.id); setBellOpen(false) }} className={`p-3 rounded-xl text-sm cursor-pointer transition-colors block ${n.read ? 'opacity-60 hover:bg-secondary/40' : 'bg-primary/5 hover:bg-primary/10 border-l-2 border-primary shadow-sm'}`}>
                               <p className="font-bold text-xs mb-1 uppercase tracking-widest opacity-80">{n.type.replace('_', ' ')}</p>
                               <p className="text-xs text-foreground/90">{n.message}</p>
                               <p className="text-[9px] text-muted-foreground mt-2 font-mono">{new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                             </div>
                           ))
                         }
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            <ThemeSwitcher />
            {user ? (
              <>
                <div className="flex items-center gap-2.5 pl-2 border-l border-border/60">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-600 text-primary-foreground font-bold text-xs shadow-md">
                    {user.fullName?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold leading-none">{user.fullName}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{user.role}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="text-xs">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-sm font-medium">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    size="sm"
                    className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-primary/30 transition-all text-sm font-medium"
                  >
                    Sign Up
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeSwitcher />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-secondary/60 transition-colors"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border/50 bg-background/98 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, i) => {
                const Icon = link.icon
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all font-medium text-sm"
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </motion.div>
                )
              })}

              <div className="border-t border-border/50 pt-3 mt-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3.5 py-3 bg-secondary/40 rounded-xl border border-border/50 mb-2">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md flex-shrink-0">
                        {user.fullName?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-destructive bg-destructive/8 hover:bg-destructive/15 transition-all font-medium text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full rounded-xl">Login</Button>
                    </Link>
                    <Link to="/signup" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full rounded-xl">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
