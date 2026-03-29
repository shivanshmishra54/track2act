import { useState, useEffect } from "react"
import { notificationService } from "@/services/notificationService"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, Users, Package, Settings, Truck, MapPin, 
  CheckCircle, FileText, Map, Brain, ShieldCheck, BarChart, 
  Bell, Search, ChevronDown, LogOut, RefreshCw, Activity,
  ChevronRight, Sparkles, Navigation, LifeBuoy, Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger 
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"

function UserAvatar({ name, size = "md" }) {
  const initials = name 
    ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() 
    : "??"
  const sizeClass = size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm"
  return (
    <div className={`flex ${sizeClass} items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-600 text-primary-foreground font-semibold shadow-md`}>
      {initials}
    </div>
  )
}

const getNavItems = (role) => {
  if (role === 'ADMIN') return [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Overview', badge: null },
    { href: '/dashboard/users', icon: Users, label: 'User Management', badge: null },
    { href: '/dashboard/shipments', icon: Package, label: 'Shipments', badge: null },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings', badge: null },
  ]
  if (role === 'DRIVER') return [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Overview', badge: null },
    { href: '/dashboard/tasks', icon: Truck, label: 'My Tasks', badge: null },
    { href: '/dashboard/driver-shipments', icon: Package, label: 'My Shipments', badge: null },
    { href: '/dashboard/delivered', icon: CheckCircle, label: 'Delivered', badge: null },
    { href: '/dashboard/location', icon: Navigation, label: 'Live Tracking', badge: null },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings', badge: null },
  ]
  if (role === 'COMPANY_OFFICER' || role === 'PORT_MANAGER') return [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Overview', badge: null },
    { href: '/dashboard/create-shipment', icon: Plus, label: 'Create Shipment', badge: null },
    { href: '/dashboard/live-map', icon: Map, label: 'Live Map', badge: null },
    { href: '/dashboard/decision-ai', icon: Brain, label: 'Decision AI', badge: 'Beta' },
    { href: '/dashboard/fleet', icon: Users, label: 'Fleet & Drivers', badge: null },
    { href: '/dashboard/compliance', icon: ShieldCheck, label: 'Compliance', badge: null },
    { href: '/dashboard/audit-logs', icon: Activity, label: 'Audit Logs', badge: null },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings', badge: null },
  ]
  if (role === 'ANALYST') return [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Overview', badge: null },
    { href: '/dashboard/analytics', icon: BarChart, label: 'Analytics', badge: null },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings', badge: null },
  ]
  if (role === 'CUSTOMER') return [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Overview', badge: null },
    { href: '/dashboard/customer-shipments', icon: Package, label: 'My Shipments', badge: null },
    { href: '/dashboard/tracking', icon: MapPin, label: 'Track Shipment', badge: null },
    { href: '/dashboard/support', icon: LifeBuoy, label: 'Support', badge: null },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings', badge: null },
  ]
  return []
}

const getRoleBadgeStyle = (role) => {
  const styles = {
    ADMIN: "bg-red-500/15 text-red-500 border-red-500/30",
    DRIVER: "bg-blue-500/15 text-blue-500 border-blue-500/30",
    COMPANY_OFFICER: "bg-violet-500/15 text-violet-500 border-violet-500/30",
    PORT_MANAGER: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    ANALYST: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    CUSTOMER: "bg-cyan-500/15 text-cyan-500 border-cyan-500/30",
  }
  return styles[role] || "bg-muted text-muted-foreground border-border"
}

const getPageTitle = (pathname) => {
  const titles = {
    '/dashboard': 'Overview',
    '/dashboard/users': 'User Management',
    '/dashboard/shipments': 'Shipments',
    '/dashboard/tasks': 'My Tasks',
    '/dashboard/location': 'Update Location',
    '/dashboard/driver-shipments': 'Delivered Shipments',
    '/dashboard/audit': 'Audit Logs',
    '/dashboard/live-map': 'Live Map',
    '/dashboard/decision': 'Decision Intelligence',
    '/dashboard/compliance': 'Compliance',
    '/dashboard/reports': 'Reports',
    '/dashboard/settings': 'Settings',
  }
  return titles[pathname] || 'Dashboard'
}

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState([])

  const fetchNotifications = async () => {
    try {
      if (user) {
        const data = await notificationService.getNotifications()
        setNotifications(data || [])
      }
    } catch (e) {
      console.error('Error fetching notifications', e)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 15000)
    return () => clearInterval(interval)
  }, [user])

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (e) {
      console.error(e)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const roleNavItems = getNavItems(user?.role || 'GUEST')
  const pageTitle = getPageTitle(location.pathname)

  return (
    <div className="flex h-screen bg-background">
      <SidebarProvider>
        <Sidebar className="border-r-0">
          {/* Sidebar Header */}
          <SidebarHeader className="px-4 py-5 border-b border-sidebar-border/60">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 shadow-lg shadow-primary/30">
                <Activity className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight">
                  Track<span className="text-primary font-extrabold">2</span>Act
                </span>
                <p className="text-[10px] text-sidebar-foreground/50 font-medium">Intelligence Platform</p>
              </div>
            </div>
          </SidebarHeader>

          {/* Navigation */}
          <SidebarContent className="px-2 py-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40 px-3 mb-1">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {roleNavItems.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link
                            to={item.href}
                            className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? "bg-primary/15 text-primary shadow-sm"
                                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                            }`}
                          >
                            {/* Active indicator */}
                            {isActive && (
                              <motion.div
                                layoutId="activeNav"
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-primary"
                                transition={{ duration: 0.2 }}
                              />
                            )}
                            <item.icon className={`h-4 w-4 flex-shrink-0 transition-colors ${isActive ? "text-primary" : ""}`} />
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                              <span className="flex h-4 items-center rounded-full bg-primary/20 px-1.5 text-[9px] font-bold text-primary">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Platform Status */}
            <div className="mt-6 mx-3 rounded-xl bg-sidebar-accent/60 border border-sidebar-border/60 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </div>
                <span className="text-xs font-semibold text-sidebar-foreground/70">System Operational</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-[10px] text-sidebar-foreground/50">AI engines running</span>
              </div>
            </div>
          </SidebarContent>

          {/* User Profile Footer */}
          <SidebarFooter className="p-3 border-t border-sidebar-border/60">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-sidebar-accent/60 transition-colors cursor-pointer group">
              <div className="relative">
                <UserAvatar name={user?.fullName || user?.name} />
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-sidebar bg-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  {user?.fullName || user?.name || "User"}
                </p>
                <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${getRoleBadgeStyle(user?.role)}`}>
                  {user?.role?.replace('_', ' ') || 'Guest'}
                </span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70 transition-colors" />
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-3 border-b border-border/50 bg-background/95 backdrop-blur-xl px-4 lg:px-6">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
            <Separator orientation="vertical" className="h-5 hidden sm:block" />

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-1.5 text-sm">
              <span className="text-muted-foreground">Dashboard</span>
              {pageTitle !== 'Overview' && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                  <span className="font-semibold text-foreground">{pageTitle}</span>
                </>
              )}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search */}
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search…"
                className="pl-9 h-8 bg-secondary/60 border-border/50 focus-visible:ring-primary/20 text-sm"
              />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              {/* Live status */}
              <div className="hidden md:flex items-center gap-1.5 rounded-lg bg-success/10 border border-success/20 px-2.5 py-1 text-xs font-semibold text-success">
                <div className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                </div>
                Live
              </div>

              <ThemeSwitcher />

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                    <Bell className="h-4 w-4" />
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                        {notifications.filter(n => !n.isRead).length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={8} align="end" className="w-80 p-0">
                  <div className="px-3 py-3 border-b border-border/50 flex justify-between items-center bg-muted/30">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    <Badge variant="secondary" className="text-[10px]">{notifications.filter(n => !n.isRead).length} New</Badge>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-3 py-8 text-center flex flex-col items-center gap-2">
                        <Bell className="h-8 w-8 text-muted-foreground/30" />
                        <span className="text-xs text-muted-foreground">You're all caught up!</span>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-3 border-b border-border/50 last:border-0 hover:bg-muted/50 cursor-pointer flex flex-col gap-1.5 transition-colors ${!notif.isRead ? 'bg-primary/5' : ''}`}
                          onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                        >
                          <div className="flex items-start justify-between">
                            <span className={`text-xs font-semibold ${!notif.isRead ? 'text-primary' : 'text-foreground'}`}>{notif.type}</span>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className={`text-xs leading-relaxed ${!notif.isRead ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2 h-8 hover:bg-secondary/60">
                    <UserAvatar name={user?.fullName || user?.name} size="sm" />
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={8} align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold truncate">{user?.fullName || user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    <span className={`mt-1.5 inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${getRoleBadgeStyle(user?.role)}`}>
                      {user?.role?.replace('_', ' ') || 'Guest'}
                    </span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex flex-1 min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
