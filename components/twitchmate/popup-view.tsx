"use client"

import { useMemo, useState } from "react"
import {
  ChevronDown,
  Download,
  Settings2,
  ArrowRight,
  Shield,
  Zap,
  X,
  Clock,
  Gamepad2,
} from "lucide-react"
import {
  channels as allChannels,
  formatViewers,
  formatWatched,
  todayStats,
  type Channel,
} from "@/lib/mock-data"
import { ChannelAvatar, AnimatedNumber, Toggle } from "./primitives"
import { cn } from "@/lib/utils"

export function PopupView({ onOpenDashboard }: { onOpenDashboard?: () => void }) {
  const [idleList, setIdleList] = useState<Channel[]>(
    allChannels.filter((c) => c.idle),
  )
  const [autoClaim, setAutoClaim] = useState(true)
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false)
  const [quality, setQuality] = useState<"160p" | "360p" | "480p">("160p")
  const [soundOn, setSoundOn] = useState(false)

  const goalPercent = useMemo(
    () => Math.min(Math.round((todayStats.pointsEarned / todayStats.dailyGoal) * 100), 100),
    [],
  )

  const removeChannel = (id: string) =>
    setIdleList((prev) => prev.filter((c) => c.id !== id))

  return (
    <div className="flex h-[600px] w-[360px] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg brand-gradient font-heading text-sm font-bold text-white">
            T
          </span>
          <span className="font-heading text-base font-bold">
            Twitch<span className="brand-text-gradient">Mate</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-1 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-success animate-breathe text-success" />
            Online
          </span>
          <button
            type="button"
            aria-label="Settings"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Settings2 size={18} />
          </button>
        </div>
      </header>

      <div className="scroll-thin flex-1 space-y-3 overflow-y-auto p-3">
        {/* Core data card */}
        <section className="glass rounded-xl border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground">Today&apos;s idle earnings</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <AnimatedNumber
              value={todayStats.pointsEarned}
              prefix="+"
              className="font-heading text-3xl font-extrabold tracking-tight text-foreground"
            />
            <span className="text-xs text-muted-foreground">channel points</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Idling {idleList.length} channels · {todayStats.hoursIdle} hours
          </p>
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Daily goal</span>
              <span className="font-medium text-foreground">{goalPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full brand-gradient transition-all"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
          </div>
        </section>

        {/* Idle list */}
        <section>
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold">Now idling ({idleList.length})</h2>
          </div>
          <div className="space-y-2">
            {idleList.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                No channels are being idled. Open a channel to start.
              </div>
            )}
            {idleList.map((c) => (
              <div
                key={c.id}
                className="group flex items-center gap-3 rounded-lg border border-border bg-card p-2.5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
              >
                <ChannelAvatar
                  name={c.name}
                  from={c.avatarFrom}
                  to={c.avatarTo}
                  size={40}
                  online
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <Gamepad2 size={12} className="shrink-0" />
                    {c.game} · {formatViewers(c.viewers)}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock size={11} />
                    Idled {formatWatched(c.watchedMinutes)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeChannel(c.id)}
                  aria-label={`Remove ${c.name}`}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom actions */}
      <div className="space-y-2 border-t border-border p-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setAutoClaim((v) => !v)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
              autoClaim
                ? "border-primary/40 bg-primary/15 text-primary"
                : "border-border bg-muted text-muted-foreground",
            )}
          >
            <Download size={15} />
            Auto-claim
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setQuickSettingsOpen((v) => !v)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40"
            >
              <Settings2 size={15} />
              Quick settings
              <ChevronDown
                size={13}
                className={cn("transition-transform", quickSettingsOpen && "rotate-180")}
              />
            </button>
            {quickSettingsOpen && (
              <div className="absolute bottom-full left-0 z-10 mb-2 w-full rounded-lg border border-border bg-popover p-3 shadow-xl">
                <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">
                  Idle quality
                </p>
                <div className="mb-3 grid grid-cols-3 gap-1">
                  {(["160p", "360p", "480p"] as const).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuality(q)}
                      className={cn(
                        "rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                        quality === q
                          ? "brand-gradient text-white"
                          : "bg-muted text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Sound</span>
                  <Toggle checked={soundOn} onChange={setSoundOn} label="Toggle sound" />
                </div>
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenDashboard}
          className="flex w-full items-center justify-center gap-2 rounded-lg brand-gradient px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5"
        >
          Open full dashboard
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Status bar */}
      <footer className="flex items-center justify-between border-t border-border bg-card px-4 py-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Shield size={12} className="text-success" />
          Blocked {todayStats.adsBlocked} ads
        </span>
        <span className="inline-flex items-center gap-1">
          <Zap size={12} className="text-accent" />
          Data saver
        </span>
      </footer>
    </div>
  )
}
