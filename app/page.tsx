"use client"

import { useState } from "react"
import { PopupView } from "@/components/twitchmate/popup-view"
import { DashboardView } from "@/components/twitchmate/dashboard-view"
import { cn } from "@/lib/utils"

type Mode = "popup" | "dashboard"

export default function Page() {
  const [mode, setMode] = useState<Mode>("popup")

  if (mode === "dashboard") {
    return <DashboardView onBack={() => setMode("popup")} />
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      {/* Ambient backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(145,70,255,0.18), transparent 70%), radial-gradient(40% 40% at 80% 90%, rgba(0,212,255,0.1), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Mode switcher */}
        <div className="mb-8 inline-flex rounded-full border border-border bg-card p-1">
          {(["popup", "dashboard"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                mode === m
                  ? "brand-gradient text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "popup" ? "Popup" : "Dashboard"}
            </button>
          ))}
        </div>

        <PopupView onOpenDashboard={() => setMode("dashboard")} />

        <p className="mt-8 max-w-sm text-balance text-center text-xs text-muted-foreground">
          TwitchMate browser extension preview. Click{" "}
          <span className="font-medium text-foreground">Open full dashboard</span> to explore the
          complete control panel.
        </p>
      </div>
    </main>
  )
}
