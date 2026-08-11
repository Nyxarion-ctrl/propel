"use client"

import { Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function AppHeader() {
  return (
    <header className="print-hidden sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-lg font-semibold tracking-tight text-foreground">
              PropelAI
            </span>
            <span className="hidden rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground sm:inline-block">
              Proposal Builder v1.0
            </span>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
