"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

const inputBase =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"

export function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string
  htmlFor?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium text-muted-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  )
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  const { className, ...rest } = props
  return <input {...rest} className={cn(inputBase, className)} />
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const { className, ...rest } = props
  return (
    <textarea
      {...rest}
      className={cn(inputBase, "resize-y leading-relaxed", className)}
    />
  )
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  const { className, ...rest } = props
  return (
    <select {...rest} className={cn(inputBase, "cursor-pointer", className)} />
  )
}
