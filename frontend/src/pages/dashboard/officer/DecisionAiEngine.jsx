import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, AlertOctagon, TrendingDown, Clock, ShieldCheck, Zap, ArrowRight, Activity, MapPin, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

async function callClaudeAI(threat) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: "You are a supply chain AI advisor for Track2Act, a logistics platform in India. Given a supply chain disruption, analyze it and provide a JSON response with: { recommendation: string, confidence: number (0-100), riskOffset: string, timeSave: string, costVariance: string, reasoning: string }. Keep recommendation concise (max 15 words). Be specific to Indian logistics context. Respond with ONLY valid JSON, no markdown.",
        messages: [
          {
            role: "user",
            content: `Analyze this supply chain disruption and provide a recommendation:\nThreat: ${threat.label}\nEstimated Financial Impact: ${threat.impact}\nRespond only with valid JSON.`
          }
        ]
      })
    })
    const data = await response.json()
    const text = data.content?.map(c => c.text || "").join("") || ""
    const clean = text.replace(/```json|```/g, "").trim()
    return JSON.parse(clean)
  } catch (e) {
    return null
  }
}

export default function DecisionAiEngine() {
  const [executing, setExecuting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [activeThreadId, setActiveThreadId] = useState('DR-2024-1847')

  const threats = [
     { id: 'DR-2024-1847', label: 'Port Congestion @ JNPT', impact: '₹4.2Cr', time: '12m ago', active: true },
     { id: 'WX-2024-0991', label: 'Severe Cyclone Formation', impact: '₹1.8Cr', time: '1hr ago', active: false },
     { id: 'TR-2024-0102', label: 'Border Strike (T2 Highway)', impact: '₹84L', time: '5hrs ago', active: false },
  ]

  const activeThreat = threats.find(t => t.id === activeThreadId) || threats[0]

  const handleAnalyze = async () => {
    setAnalyzing(true)
    setAiAnalysis(null)
    const result = await callClaudeAI(activeThreat)
    setAiAnalysis(result)
    setAnalyzing(false)
  }

  const handleExecute = () => {
    setExecuting(true)
    setTimeout(() => {
      setExecuting(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }, 2000)
  }

  const displayAnalysis = aiAnalysis || {
    recommendation: "Reroute Fleet via Mundra Port Sector",
    confidence: 94.2,
    riskOffset: "📉 15%",
    timeSave: "12 Hrs",
    costVariance: "+ ₹2.8L (Fuel)",
    reasoning: "Telemetry sensors and global API syndication report a 40% throughput drop at Jawaharlal Nehru Port Trust (JNPT). Currently tracking 127 active manifests scheduled through this corridor over the next 48 hours.",
  }

  return (
    <div className="flex flex-col min-h-full max-w-7xl mx-auto w-full pb-16">
      
      <div className="pt-8 pb-6 px-6 lg:px-8 border-b border-border/40 mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
           <div className="p-2 bg-[#8b5cf6]/10 rounded-xl"><Brain className="w-8 h-8 text-[#8b5cf6]" /></div>
           Decision Intelligence
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Track2Act Deep-Mind actively surveils global weather, border congestion, and historical traffic patterns to mitigate supply-chain disruption before human operators detect latency.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 px-6 lg:px-8">
         
         {/* Left Queue */}
         <div className="w-full lg:w-[350px] shrink-0 space-y-4">
            <h3 className="font-bold flex justify-between items-center text-sm border-b border-border/40 pb-2">
               <span>Active Threat Queue</span>
               <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded uppercase tracking-widest font-bold animate-pulse">3 Detected</span>
            </h3>
            
            <div className="space-y-3">
               {threats.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => { setActiveThreadId(t.id); setAiAnalysis(null) }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${activeThreadId === t.id ? 'bg-[#8b5cf6]/10 border-[#8b5cf6]/40 shadow-[0_0_20px_rgba(139,92,246,0.1)]' : 'bg-card border-border/60 hover:bg-secondary/20'}`}
                  >
                     <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${activeThreadId === t.id ? 'bg-[#8b5cf6] text-white' : 'bg-secondary text-muted-foreground'}`}>{t.id}</span>
                        <span className="text-[10px] text-muted-foreground">{t.time}</span>
                     </div>
                     <p className={`text-sm font-bold mb-1 ${activeThreadId === t.id ? 'text-[#8b5cf6]' : 'text-foreground'}`}>{t.label}</p>
                     <p className="text-xs text-muted-foreground flex items-center gap-1 font-mono tracking-wide"><AlertOctagon className="w-3 h-3 text-destructive"/> Est. Fallout: {t.impact}</p>
                  </div>
               ))}
            </div>

            {/* AI Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full gap-2 bg-[#8b5cf6] hover:bg-[#8b5cf6]/90 text-white"
            >
              {analyzing ? (
                <><Activity className="w-4 h-4 animate-spin"/> Analyzing with AI...</>
              ) : (
                <><Sparkles className="w-4 h-4"/> Get AI Analysis</>
              )}
            </Button>
            {aiAnalysis && (
              <p className="text-[10px] text-center text-[#8b5cf6] font-mono">✓ Live AI analysis loaded</p>
            )}
         </div>

         {/* Right Main Engine Panel */}
         <div className="flex-1 bg-card border border-border/60 rounded-3xl p-6 lg:p-10 card-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8b5cf6]/5 blur-3xl pointer-events-none rounded-full" />
            
            {/* The Problem */}
            <div className="mb-10 relative z-10">
               <div className="flex items-center gap-2 mb-2"><AlertOctagon className="w-5 h-5 text-destructive" /> <h2 className="text-xl font-bold tracking-tight">Congestion Critical Matrix</h2></div>
               <p className="text-muted-foreground text-sm max-w-xl">
                 {displayAnalysis.reasoning}
               </p>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="p-3 bg-destructive/5 rounded-xl border border-destructive/20 border-l-2 border-l-destructive">
                     <p className="text-[10px] uppercase font-bold text-destructive tracking-widest mb-1">Impact Radius</p>
                     <p className="font-mono font-bold text-lg">127 Rigs</p>
                  </div>
                  <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/20 border-l-2 border-l-amber-500">
                     <p className="text-[10px] uppercase font-bold text-amber-500 tracking-widest mb-1">Latency Offset</p>
                     <p className="font-mono font-bold text-lg">+14 Hrs</p>
                  </div>
               </div>
            </div>

            {/* The Resolution (AI Output) */}
            <div className="border border-[#8b5cf6]/30 bg-[#8b5cf6]/[0.02] rounded-2xl relative z-10 overflow-hidden">
               <div className="bg-[#8b5cf6] text-white p-3 flex items-center justify-between">
                  <span className="font-bold flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 fill-white"/>
                    {aiAnalysis ? "AI-Generated Recommendation" : "Algorithm Recommendation"}
                  </span>
                  <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded tracking-widest">
                    CONFIDENCE: {typeof displayAnalysis.confidence === 'number' ? displayAnalysis.confidence.toFixed(1) : displayAnalysis.confidence}%
                  </span>
               </div>
               
               <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-[#8b5cf6]/10 pb-6 mb-6">
                      <div className="flex-1">
                         <h3 className="text-lg font-bold text-[#8b5cf6] mb-2 flex items-center gap-2">
                           <MapPin className="w-5 h-5"/>
                           {displayAnalysis.recommendation}
                         </h3>
                         <p className="text-sm text-foreground/80 max-w-md">{displayAnalysis.reasoning}</p>
                      </div>
                      
                      <div className="w-full md:w-auto grid grid-cols-2 gap-x-8 gap-y-4 shrink-0 bg-background/50 p-4 rounded-xl border border-border/40">
                         <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><TrendingDown className="w-3 h-3 text-success"/> Risk Offset</p>
                            <p className="font-mono font-bold text-sm mt-1 text-success">{displayAnalysis.riskOffset}</p>
                         </div>
                         <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3 text-primary"/> Time Save</p>
                            <p className="font-mono font-bold text-sm mt-1 text-primary">{displayAnalysis.timeSave}</p>
                         </div>
                         <div className="col-span-2 pt-2 border-t border-border/40">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Cost Variance</p>
                            <p className="font-mono font-bold text-sm text-amber-500">{displayAnalysis.costVariance}</p>
                         </div>
                      </div>
                  </div>

                  <div className="flex justify-between items-center bg-[#8b5cf6]/10 p-4 rounded-xl border border-[#8b5cf6]/20">
                     <div className="flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-[#8b5cf6]" />
                        <div>
                           <p className="text-sm font-bold text-[#8b5cf6]">System Alignment Verified</p>
                           <p className="text-[10px] text-muted-foreground">Oversight parameters met. Proceed at Officer discretion.</p>
                        </div>
                     </div>
                     <Button 
                       disabled={executing || success} 
                       onClick={handleExecute}
                       className={`h-12 px-6 font-bold shadow-lg transition-all ${success ? 'bg-success text-success-foreground' : 'bg-[#8b5cf6] hover:bg-[#8b5cf6]/90 text-white shadow-[#8b5cf6]/20 shadow-[0_0_15px_rgba(139,92,246,0.5)] cursor-pointer'}`}
                     >
                       {executing ? (
                           <span className="flex items-center gap-2"><Activity className="w-4 h-4 animate-spin"/> Bypassing Nav...</span>
                       ) : success ? (
                           <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Execution Secured</span>
                       ) : (
                           <span className="flex items-center gap-2">Execute Override Directive <ArrowRight className="w-4 h-4 ml-1"/></span>
                       )}
                     </Button>
                  </div>
               </div>
            </div>
         </div>

      </div>
    </div>
  )
}
