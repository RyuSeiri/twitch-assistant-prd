"use client"

import { useMemo, useState } from "react"
import {
  Bell,
  Settings2,
  TrendingUp,
  TrendingDown,
  Activity,
  Timer,
  Coins,
  Star,
  Pause,
  Play,
  Check,
  ArrowLeft,
  Gamepad2,
  Trash2,
  Zap,
  Gift,
} from "lucide-react"
import {
  channels as initialChannels,
  claimHistory,
  dashboardStats,
  todayStats,
  formatViewers,
  type Channel,
  type PriorityMode,
} from "@/lib/mock-data"
import { ChannelAvatar, AnimatedNumber, Toggle } from "./primitives"
import { cn } from "@/lib/utils"

type SortKey = "name" | "game" | "viewers"

export function DashboardView({ onBack }: { onBack?: () => void }) {
  const [channels, setChannels] = useState<Channel[]>(initialChannels)
  const [sortKey, setSortKey] = useState<SortKey>("viewers")
  const [statusFilter, setStatusFilter] = useState<"all" | "online" | "offline">("all")
  const [priorityMode, setPriorityMode] = useState<PriorityMode>("balanced")
  const [rules, setRules] = useState({
    followedOnly: true,
    autoJoinNew: false,
    avoidLowViewers: true,
  })

  const idleCount = channels.filter((c) => c.idle).length

  const visibleChannels = useMemo(() => {
    let list = [...channels]
    if (statusFilter !== "all") list = list.filter((c) => c.status === statusFilter)
    list.sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name)
      if (sortKey === "game") return a.game.localeCompare(b.game)
      return b.viewers - a.viewers
    })
    return list
  }, [channels, sortKey, statusFilter])

  const toggleIdle = (id: string) =>
    setChannels((prev) =>
      prev.map((c) =>
        c.id === id && c.status === "online" ? { ...c, idle: !c.idle } : c,
      ),
    )

  const toggleFavorite = (id: string) =>
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c)),
    )

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Global nav */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border glass px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to popup"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <span className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient font-heading text-base font-bold text-white">
            T
          </span>
          <span className="font-heading text-lg font-bold">
            Twitch<span className="brand-text-gradient">Mate</span>
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Bell size={18} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Settings2 size={18} />
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent" aria-hidden />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 sm:p-6">
        {/* Stat cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<Activity size={20} />}
            label="Today's overview"
            value={<>{todayStats.channelsIdle} channels idling</>}
            sub={
              <>
                <AnimatedNumber value={todayStats.pointsEarned} prefix="+" /> points earned
              </>
            }
          />
          <StatCard
            icon={<Timer size={20} />}
            label="Idle statistics"
            value={<>{dashboardStats.weeklyHours}h this week</>}
            sub={
              <span className="inline-flex items-center gap-1 text-success">
                <TrendingUp size={13} />+{dashboardStats.weeklyChange}% vs last week
              </span>
            }
          />
          <StatCard
            icon={<Coins size={20} />}
            label="Point earnings"
            value={
              <AnimatedNumber value={dashboardStats.monthlyPoints} /> 
            }
            sub={<>This month · goal {dashboardStats.monthlyGoalPercent}%</>}
          />
        </section>

        {/* Channel management */}
        <section className="rounded-xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
            <h2 className="text-sm font-semibold">
              Followed channels{" "}
              <span className="text-muted-foreground">({visibleChannels.length})</span>
            </h2>
            <div className="flex items-center gap-2">
              <SelectChip
                label="Sort"
                value={sortKey}
                options={[
                  { value: "viewers", label: "Viewers" },
                  { value: "name", label: "Name" },
                  { value: "game", label: "Game" },
                ]}
                onChange={(v) => setSortKey(v as SortKey)}
              />
              <SelectChip
                label="Filter"
                value={statusFilter}
                options={[
                  { value: "all", label: "All" },
                  { value: "online", label: "Online" },
                  { value: "offline", label: "Offline" },
                ]}
                onChange={(v) => setStatusFilter(v as typeof statusFilter)}
              />
            </div>
          </div>

          <div className="divide-y divide-border">
            {visibleChannels.map((c) => (
              <div
                key={c.id}
                className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
              >
                <ChannelAvatar
                  name={c.name}
                  from={c.avatarFrom}
                  to={c.avatarTo}
                  size={36}
                  online={c.status === "online"}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <Gamepad2 size={12} />
                    {c.game}
                  </p>
                </div>
                <span className="hidden w-16 text-right text-xs text-muted-foreground sm:block">
                  {c.status === "online" ? formatViewers(c.viewers) : "—"}
                </span>

                <div className="flex items-center gap-2">
                  {c.status === "online" ? (
                    <button
                      type="button"
                      onClick={() => toggleIdle(c.id)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                        c.idle
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {c.idle ? <Play size={12} /> : <Pause size={12} />}
                      {c.idle ? "Auto-idle" : "Idle"}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      <Pause size={12} />
                      Paused
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(c.id)}
                    aria-label={c.favorite ? "Unfavorite" : "Favorite"}
                    className={cn(
                      "transition-colors",
                      c.favorite
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary",
                    )}
                  >
                    <Star size={16} fill={c.favorite ? "currentColor" : "none"} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${c.name}`}
                    className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Strategy + claim records */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Strategy */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Zap size={16} className="text-accent" /> Smart idle strategy
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs text-muted-foreground">
                  Priority mode
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { value: "balanced", label: "Balanced" },
                      { value: "spread", label: "Spread out" },
                      { value: "focused", label: "Focused" },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setPriorityMode(m.value)}
                      className={cn(
                        "rounded-lg px-2 py-2 text-xs font-medium transition-colors",
                        priorityMode === m.value
                          ? "brand-gradient text-white"
                          : "bg-muted text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <RuleRow
                  label="Only idle followed channels"
                  checked={rules.followedOnly}
                  onChange={(v) => setRules((r) => ({ ...r, followedOnly: v }))}
                />
                <RuleRow
                  label="Auto-join newly live channels"
                  checked={rules.autoJoinNew}
                  onChange={(v) => setRules((r) => ({ ...r, autoJoinNew: v }))}
                />
                <RuleRow
                  label="Avoid low-viewer channels (<50)"
                  checked={rules.avoidLowViewers}
                  onChange={(v) => setRules((r) => ({ ...r, avoidLowViewers: v }))}
                />
              </div>

              <button
                type="button"
                className="w-full rounded-lg brand-gradient px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5"
              >
                Save strategy
              </button>
            </div>
          </div>

          {/* Claim records */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Gift size={16} className="text-success" /> Auto-claim history
            </h2>
            <ul className="scroll-thin mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
              {claimHistory.map((rec) => (
                <li
                  key={rec.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background/50 px-3 py-2"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check size={14} />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{rec.time}</span>
                  <span className="flex-1 truncate text-sm font-medium">{rec.channel}</span>
                  <span className="text-sm font-semibold text-success">+{rec.points}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Bottom status bar */}
      <footer className="sticky bottom-0 flex flex-wrap items-center justify-between gap-2 border-t border-border bg-card px-4 py-2.5 text-xs text-muted-foreground sm:px-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success animate-breathe text-success" />
            Active
          </span>
          <span>
            Idling {idleCount}/{channels.length} channels
          </span>
          <span className="inline-flex items-center gap-1 text-accent">
            <TrendingDown size={12} /> Data saver on
          </span>
          <span>Memory 42MB</span>
        </div>
        <button
          type="button"
          className="rounded-md border border-border px-2.5 py-1 font-medium text-foreground transition-colors hover:border-primary/40"
        >
          Clear cache
        </button>
      </footer>
    </div>
  )
}

/* ---------- Sub-components ---------- */

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  sub: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-transform hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          {icon}
        </span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-3 font-heading text-2xl font-extrabold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

function SelectChip({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <label className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-2.5 py-1.5 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer bg-transparent font-medium text-foreground outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-popover text-foreground">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function RuleRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  )
}
