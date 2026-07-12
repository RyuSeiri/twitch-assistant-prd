"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/* ---------- Channel avatar (initials fallback) ---------- */

export function ChannelAvatar({
  name,
  from,
  to,
  size = 40,
  online,
}: {
  name: string
  from: string
  to: string
  size?: number
  online?: boolean
}) {
  const initials = name.slice(0, 2).toUpperCase()
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br font-heading font-bold text-white",
          from,
          to,
        )}
        style={{ fontSize: size * 0.34 }}
        aria-hidden
      >
        {initials}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-background",
            online ? "bg-success animate-breathe text-success" : "bg-destructive text-destructive",
          )}
          style={{ width: size * 0.3, height: size * 0.3 }}
        >
          <span className="sr-only">{online ? "online" : "offline"}</span>
        </span>
      )}
    </div>
  )
}

/* ---------- Animated count-up number ---------- */

export function AnimatedNumber({
  value,
  className,
  prefix = "",
}: {
  value: number
  className?: string
  prefix?: string
}) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const duration = 600
    const start = performance.now()
    const initial = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(initial + (value - initial) * eased))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value])

  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString()}
    </span>
  )
}

/* ---------- Status dot ---------- */

export function StatusDot({
  status,
}: {
  status: "online" | "idle" | "offline"
}) {
  const map = {
    online: { color: "bg-success text-success", label: "Online" },
    idle: { color: "bg-primary text-primary", label: "Idling" },
    offline: { color: "bg-destructive text-destructive", label: "Offline" },
  } as const
  const { color, label } = map[status]
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full animate-breathe", color)} />
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </span>
  )
}

/* ---------- Toggle switch ---------- */

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-[18px]" : "translate-x-1",
        )}
      />
    </button>
  )
}
