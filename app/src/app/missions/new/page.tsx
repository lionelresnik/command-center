"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Crosshair, MessageSquare, FileText, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type AgentBehavior = "assume_and_document" | "ask_me" | "async"

const behaviorOptions = [
  { id: "assume_and_document" as AgentBehavior, label: "Assume & document", description: "Never pauses. Logs every assumption for your review at the end.", icon: <FileText className="h-4 w-4" /> },
  { id: "ask_me" as AgentBehavior, label: "Ask me", description: "Pauses when stuck and asks you up to 3 questions before continuing.", icon: <MessageSquare className="h-4 w-4" /> },
  { id: "async" as AgentBehavior, label: "Async", description: "Logs questions without blocking. Answer when you have time.", icon: <Clock className="h-4 w-4" /> },
]

type Project = { id: string; name: string; color: string | null }
type Team = { id: string; name: string; members: { roleId: string; order: number }[] }

export default function NewMissionPage() {
  const router = useRouter()
  const [goal, setGoal] = useState("")
  const [ticketId, setTicketId] = useState("")
  const [projectId, setProjectId] = useState("")
  const [teamId, setTeamId] = useState("")
  const [behavior, setBehavior] = useState<AgentBehavior>("assume_and_document")
  const [projects, setProjects] = useState<Project[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(setProjects).catch(() => {})
    fetch("/api/crews").then(r => r.json()).then(setTeams).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal || !projectId) return
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, ticketId: ticketId || undefined, projectId, teamId: teamId || undefined, agentBehavior: behavior }),
      })
      if (!res.ok) throw new Error(await res.text())
      const mission = await res.json()
      router.push(`/missions/${mission.id}`)
    } catch (err) {
      setError(String(err))
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">New Mission</h1>
        <p className="text-sm text-muted-foreground">Define a goal, pick your crew, and let them run.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Goal</CardTitle>
            <CardDescription>What needs to be done? Be specific.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="e.g. Add Azure Container Registry support, matching the existing GCP and AWS registry patterns"
              value={goal} onChange={e => setGoal(e.target.value)}
              className="min-h-[80px]" required
            />
            <Input placeholder="Jira ticket (optional) — e.g. PROJ-123" value={ticketId} onChange={e => setTicketId(e.target.value)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Project</CardTitle></CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No projects yet — <a href="/projects/new" className="text-primary underline">create one first</a></p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {projects.map(p => (
                  <button key={p.id} type="button" onClick={() => setProjectId(p.id)}
                    className={cn("flex items-center gap-2 rounded-md border p-3 text-left text-sm font-medium transition-colors",
                      projectId === p.id ? "border-primary bg-primary/10 text-primary" : "hover:bg-accent"
                    )}
                  >
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color ?? "#6b7280" }} />
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {teams.length > 0 && (
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Crew <span className="text-muted-foreground font-normal text-xs">(optional)</span></CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {teams.map(team => (
                <button key={team.id} type="button" onClick={() => setTeamId(team.id)}
                  className={cn("flex w-full items-center justify-between rounded-md border p-3 text-left text-sm transition-colors",
                    teamId === team.id ? "border-primary bg-primary/10" : "hover:bg-accent"
                  )}
                >
                  <span className="font-medium">{team.name}</span>
                  <Badge variant="outline" className="text-xs">{team.members?.length ?? 0} roles</Badge>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Agent behavior</CardTitle>
            <CardDescription>How should agents handle ambiguity?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {behaviorOptions.map(opt => (
              <button key={opt.id} type="button" onClick={() => setBehavior(opt.id)}
                className={cn("flex w-full items-start gap-3 rounded-md border p-3 text-left text-sm transition-colors",
                  behavior === opt.id ? "border-primary bg-primary/10" : "hover:bg-accent"
                )}
              >
                <div className={cn("mt-0.5", behavior === opt.id ? "text-primary" : "text-muted-foreground")}>{opt.icon}</div>
                <div>
                  <p className="font-medium">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={!goal || !projectId || saving} className="gap-2">
            <Crosshair className="h-4 w-4" />
            {saving ? "Creating…" : "Launch Mission"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
