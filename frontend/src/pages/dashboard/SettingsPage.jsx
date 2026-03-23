import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Settings, User, Bell, Palette, Key, Smartphone, Clock, Save, Check, Moon, Sun, Monitor, Zap, AlertTriangle, Loader2, Camera, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { useAuth } from "@/context/AuthContext"

const ROLE_LABELS = {
  "admin":       "Administrator",
  "ops-manager": "Operations Manager",
  "analyst":     "Supply Chain Analyst",
  "viewer":      "Viewer",
}

function SaveButton({ onClick, saving, saved }) {
  return (
    <Button onClick={onClick} disabled={saving}>
      {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>
       : saved  ? <><Check className="w-4 h-4 mr-2" />Saved</>
       : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
    </Button>
  )
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { user, updateProfile, updateSettings, changePassword, uploadAvatar } = useAuth()
  const fileInputRef = useRef(null)

  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState("")

  const [profile, setProfile] = useState({
    name: "", email: "", phone: "", company: "", role: "ops-manager", timezone: "ist"
  })

  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarFile,    setAvatarFile]    = useState(null)
  const [avatarError,   setAvatarError]   = useState("")

  const [settings, setSettings] = useState({
    notifications_email_shipment:  true,
    notifications_email_decisions: true,
    notifications_email_daily:     true,
    notifications_email_weekly:    false,
    notifications_push_critical:   true,
    notifications_push_approval:   true,
    quiet_hours_enabled:           true,
    quiet_hours_from:              22,
    quiet_hours_to:                7,
    ai_auto_execute:               true,
    ai_proactive:                  true,
    ai_learning:                   true,
    ai_budget_variance:            "10",
    ai_cost_limit:                 "50000",
    ai_confidence:                 "85",
    ai_risk:                       "medium",
    compact_mode:                  false,
    animations:                    true,
  })

  const [pw, setPw]         = useState({ current: "", newPass: "", confirm: "" })
  const [pwError, setPwErr] = useState("")
  const [pwOk,  setPwOk]   = useState("")

  useEffect(() => {
    if (!user) return
    setProfile({
      name:     user.name     || "",
      email:    user.email    || "",
      phone:    user.phone    || "",
      company:  user.company  || "",
      role:     user.role     || "ops-manager",
      timezone: user.timezone || "ist",
    })
    if (user.settings) setSettings(prev => ({ ...prev, ...user.settings }))
    if (user.avatar_url) setAvatarPreview(user.avatar_url)
  }, [user])

  const flash = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  // ── Avatar handlers ──────────────────────────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith("image/")) { setAvatarError("Please select an image file"); return }
    if (file.size > 2 * 1024 * 1024)     { setAvatarError("Image must be under 2MB"); return }
    setAvatarError("")
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return
    setSaving(true); setAvatarError("")
    try {
      await uploadAvatar(avatarFile)
      setAvatarFile(null)
      flash()
    } catch (err) {
      setAvatarError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const cancelAvatarChange = () => {
    setAvatarFile(null)
    setAvatarPreview(user?.avatar_url || null)
    setAvatarError("")
  }

  // ── Profile save ─────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    setSaving(true); setError("")
    try {
      await updateProfile(profile)
      flash()
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  // ── Settings save ────────────────────────────────────────────────────────
  const handleSaveSettings = async () => {
    setSaving(true); setError("")
    try {
      await updateSettings(settings)
      flash()
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  // ── Password change ──────────────────────────────────────────────────────
  const handleChangePw = async () => {
    setPwErr(""); setPwOk("")
    if (pw.newPass !== pw.confirm) { setPwErr("Passwords do not match"); return }
    if (pw.newPass.length < 8)     { setPwErr("Minimum 8 characters"); return }
    setSaving(true)
    try {
      await changePassword(pw.current, pw.newPass)
      setPwOk("Password updated! Please log in again.")
      setPw({ current: "", newPass: "", confirm: "" })
    } catch (err) { setPwErr(err.message) }
    finally { setSaving(false) }
  }

  const initials = user?.name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() || "??"

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Settings className="w-6 h-6 text-primary" />Settings</h1>
          <p className="text-muted-foreground">Manage your account, preferences, and security</p>
        </div>
      </div>

      {error && <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">{error}</div>}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="profile"><User className="w-4 h-4 mr-1.5" />Profile</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-1.5" />Alerts</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="w-4 h-4 mr-1.5" />Theme</TabsTrigger>
          <TabsTrigger value="ai"><Zap className="w-4 h-4 mr-1.5" />AI</TabsTrigger>
          <TabsTrigger value="security"><Key className="w-4 h-4 mr-1.5" />Security</TabsTrigger>
        </TabsList>

        {/* ── Profile ──────────────────────────────────────────────────── */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Profile Information</CardTitle><CardDescription>Update your personal and company details</CardDescription></CardHeader>
            <CardContent className="space-y-6">

              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 ring-2 ring-border">
                    {avatarPreview
                      ? <AvatarImage src={avatarPreview} alt={user?.name} className="object-cover" />
                      : null}
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">{initials}</AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">{user?.company} · {ROLE_LABELS[user?.role] || user?.role}</p>
                  {avatarError && <p className="text-xs text-destructive mt-2">{avatarError}</p>}
                  {avatarFile && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" onClick={handleAvatarUpload} disabled={saving}>
                        {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}Upload Photo
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelAvatarChange}><X className="h-3 w-3 mr-1" />Cancel</Button>
                    </div>
                  )}
                  {!avatarFile && <p className="text-xs text-muted-foreground mt-2">Click the camera icon to change photo. JPG/PNG/GIF, max 2MB.</p>}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2"><Label>Full Name</Label><Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="+91 98765 43210" /></div>
                <div className="space-y-2"><Label>Company</Label><Input value={profile.company} onChange={e => setProfile({...profile, company: e.target.value})} /></div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={profile.role} onValueChange={v => setProfile({...profile, role: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLE_LABELS).map(([val, label]) => (
                        <SelectItem key={val} value={val}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={profile.timezone} onValueChange={v => setProfile({...profile, timezone: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ist">IST (GMT+5:30)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="pst">PST (GMT-8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end"><SaveButton onClick={handleSaveProfile} saving={saving} saved={saved} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Notifications ─────────────────────────────────────────────── */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Notification Preferences</CardTitle><CardDescription>Choose how you want to be notified</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2"><Bell className="w-4 h-4" />Email</h4>
                {[
                  { key:"notifications_email_shipment",  label:"Shipment Alerts",   desc:"Delays, disruptions, and status changes" },
                  { key:"notifications_email_decisions", label:"Decision Requests",  desc:"AI recommendations requiring approval" },
                  { key:"notifications_email_daily",     label:"Daily Summary",      desc:"End-of-day operations report" },
                  { key:"notifications_email_weekly",    label:"Weekly Analytics",   desc:"Performance metrics and insights" },
                ].map(({key, label, desc}) => (
                  <div key={key} className="flex items-center justify-between ml-6">
                    <div><p className="font-medium">{label}</p><p className="text-sm text-muted-foreground">{desc}</p></div>
                    <Switch checked={!!settings[key]} onCheckedChange={v => setSettings({...settings, [key]: v})} />
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2"><Smartphone className="w-4 h-4" />Push</h4>
                {[
                  { key:"notifications_push_critical",  label:"Critical Alerts",    desc:"High-priority disruptions only" },
                  { key:"notifications_push_approval",  label:"Approval Requests",  desc:"When AI needs your decision" },
                ].map(({key, label, desc}) => (
                  <div key={key} className="flex items-center justify-between ml-6">
                    <div><p className="font-medium">{label}</p><p className="text-sm text-muted-foreground">{desc}</p></div>
                    <Switch checked={!!settings[key]} onCheckedChange={v => setSettings({...settings, [key]: v})} />
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2"><Clock className="w-4 h-4" />Quiet Hours</h4>
                <div className="flex items-center gap-4 ml-6 flex-wrap">
                  <div className="space-y-2">
                    <Label>From</Label>
                    <Select value={String(settings.quiet_hours_from)} onValueChange={v => setSettings({...settings, quiet_hours_from: Number(v)})}>
                      <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                      <SelectContent>{Array.from({length:24},(_,i)=><SelectItem key={i} value={String(i)}>{String(i).padStart(2,"0")}:00</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>To</Label>
                    <Select value={String(settings.quiet_hours_to)} onValueChange={v => setSettings({...settings, quiet_hours_to: Number(v)})}>
                      <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                      <SelectContent>{Array.from({length:24},(_,i)=><SelectItem key={i} value={String(i)}>{String(i).padStart(2,"0")}:00</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <Switch checked={!!settings.quiet_hours_enabled} onCheckedChange={v => setSettings({...settings, quiet_hours_enabled: v})} />
                    <Label>Enabled</Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end"><SaveButton onClick={handleSaveSettings} saving={saving} saved={saved} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Appearance ────────────────────────────────────────────────── */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Theme</CardTitle><CardDescription>Customise the look and feel of your dashboard</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {[{value:"light",icon:Sun,label:"Light"},{value:"dark",icon:Moon,label:"Dark"},{value:"system",icon:Monitor,label:"System"}].map(({value,icon:Icon,label})=>(
                  <motion.div key={value} whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={()=>setTheme(value)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${theme===value?"border-primary bg-primary/5":"border-border"}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-5 h-5"/><span className="font-medium">{label}</span>
                      {theme===value&&<Check className="w-4 h-4 text-primary ml-auto"/>}
                    </div>
                    <div className={`h-16 rounded border ${value==="dark"?"bg-gray-900 border-gray-700":value==="light"?"bg-white border-gray-200":"bg-gray-100 border-gray-200"}`}>
                      <div className={`h-4 rounded-t ${value==="dark"?"bg-gray-800":value==="light"?"bg-gray-100":"bg-gray-200"}`}/>
                      <div className="p-2 space-y-1">
                        <div className={`h-2 rounded w-3/4 ${value==="dark"?"bg-gray-700":"bg-gray-200"}`}/>
                        <div className={`h-2 rounded w-1/2 ${value==="dark"?"bg-gray-700":"bg-gray-200"}`}/>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium">Display</h4>
                <div className="flex items-center justify-between">
                  <div><p className="font-medium">Compact Mode</p><p className="text-sm text-muted-foreground">Reduce spacing for more information density</p></div>
                  <Switch checked={!!settings.compact_mode} onCheckedChange={v=>setSettings({...settings,compact_mode:v})}/>
                </div>
                <div className="flex items-center justify-between">
                  <div><p className="font-medium">Animations</p><p className="text-sm text-muted-foreground">Enable smooth transitions and effects</p></div>
                  <Switch checked={!!settings.animations} onCheckedChange={v=>setSettings({...settings,animations:v})}/>
                </div>
              </div>
              <div className="flex justify-end"><SaveButton onClick={handleSaveSettings} saving={saving} saved={saved}/></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── AI ────────────────────────────────────────────────────────── */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5"/>AI Autonomy Settings</CardTitle><CardDescription>Configure AI decision-making autonomy</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              {[
                {key:"ai_auto_execute",label:"Auto-Execute Low-Risk Decisions",desc:"Allow AI to act on decisions below risk threshold"},
                {key:"ai_proactive",  label:"Proactive Suggestions",           desc:"AI suggests optimisations before issues arise"},
                {key:"ai_learning",   label:"Learning Mode",                   desc:"AI learns from your decisions to improve recommendations"},
              ].map(({key,label,desc})=>(
                <div key={key} className="flex items-center justify-between">
                  <div><p className="font-medium">{label}</p><p className="text-sm text-muted-foreground">{desc}</p></div>
                  <Switch checked={!!settings[key]} onCheckedChange={v=>setSettings({...settings,[key]:v})}/>
                </div>
              ))}
              <Separator />
              <h4 className="font-medium">Auto-Approval Limits</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Budget Variance</Label>
                  <Select value={settings.ai_budget_variance} onValueChange={v=>setSettings({...settings,ai_budget_variance:v})}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent><SelectItem value="5">5%</SelectItem><SelectItem value="10">10%</SelectItem><SelectItem value="15">15%</SelectItem><SelectItem value="20">20%</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Max Cost Auto-Approve (₹)</Label>
                  <Input type="number" value={settings.ai_cost_limit} onChange={e=>setSettings({...settings,ai_cost_limit:e.target.value})}/>
                </div>
                <div className="space-y-2">
                  <Label>Confidence Threshold</Label>
                  <Select value={settings.ai_confidence} onValueChange={v=>setSettings({...settings,ai_confidence:v})}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent><SelectItem value="80">80%</SelectItem><SelectItem value="85">85%</SelectItem><SelectItem value="90">90%</SelectItem><SelectItem value="95">95%</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Risk Tolerance</Label>
                  <Select value={settings.ai_risk} onValueChange={v=>setSettings({...settings,ai_risk:v})}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent><SelectItem value="low">Conservative</SelectItem><SelectItem value="medium">Balanced</SelectItem><SelectItem value="high">Aggressive</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end"><SaveButton onClick={handleSaveSettings} saving={saving} saved={saved}/></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Security ──────────────────────────────────────────────────── */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
            <CardContent className="space-y-4 max-w-md">
              {pwError && <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">{pwError}</div>}
              {pwOk    && <div className="rounded-lg bg-success/10 border border-success/30 px-4 py-3 text-sm text-success">{pwOk}</div>}
              <div className="space-y-2"><Label>Current Password</Label><Input type="password" value={pw.current} onChange={e=>setPw({...pw,current:e.target.value})}/></div>
              <div className="space-y-2"><Label>New Password</Label><Input type="password" value={pw.newPass} onChange={e=>setPw({...pw,newPass:e.target.value})}/></div>
              <div className="space-y-2"><Label>Confirm New Password</Label><Input type="password" value={pw.confirm} onChange={e=>setPw({...pw,confirm:e.target.value})}/></div>
              <Button onClick={handleChangePw} disabled={saving}>
                {saving?<><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Updating…</>:"Update Password"}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="w-4 h-4"/>Danger Zone</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                <div><p className="font-medium">Delete Account</p><p className="text-sm text-muted-foreground">Permanently delete your account and all data</p></div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
