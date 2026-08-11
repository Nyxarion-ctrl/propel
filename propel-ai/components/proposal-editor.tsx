"use client"

import { useRef, useState } from "react"
import {
  ChevronDown,
  Plus,
  Trash2,
  UserRound,
  ListChecks,
  Wallet,
  FileSignature,
  Loader2,
  WandSparkles,
  ImagePlus,
  X,
} from "lucide-react"
import {
  CURRENCIES,
  type CurrencyCode,
  type ProposalData,
  computeTotals,
  formatCurrency,
} from "@/lib/proposal"
import { Field, Select, TextArea, TextInput } from "@/components/form-fields"
import { cn } from "@/lib/utils"

type EditorProps = {
  data: ProposalData
  update: (patch: Partial<ProposalData>) => void
  onEnhance: () => void
  enhancing: boolean
}

const SECTIONS = [
  { id: "client", label: "Client & Provider Info", icon: UserRound },
  { id: "scope", label: "Scope of Work", icon: ListChecks },
  { id: "pricing", label: "Pricing & Timeline", icon: Wallet },
  { id: "terms", label: "Terms & Payment", icon: FileSignature },
] as const

export function ProposalEditor({
  data,
  update,
  onEnhance,
  enhancing,
}: EditorProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({
    client: true,
    scope: true,
    pricing: true,
    terms: true,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  function toggle(id: string) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function handleLogoFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = () => {
      update({ logoDataUrl: String(reader.result) })
    }
    reader.readAsDataURL(file)
  }

  const { subtotal, tax, total } = computeTotals(data)

  // Deliverables handlers
  function setDeliverable(index: number, value: string) {
    const next = [...data.deliverables]
    next[index] = value
    update({ deliverables: next })
  }
  function addDeliverable() {
    update({ deliverables: [...data.deliverables, ""] })
  }
  function removeDeliverable(index: number) {
    update({ deliverables: data.deliverables.filter((_, i) => i !== index) })
  }

  // Line item handlers
  function setLineItem(
    id: string,
    patch: Partial<{ description: string; amount: number }>,
  ) {
    update({
      lineItems: data.lineItems.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    })
  }
  function addLineItem() {
    update({
      lineItems: [
        ...data.lineItems,
        {
          id: `item-${Date.now().toString(36)}`,
          description: "",
          amount: 0,
        },
      ],
    })
  }
  function removeLineItem(id: string) {
    update({ lineItems: data.lineItems.filter((item) => item.id !== id) })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Branding — logo upload */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-secondary/50">
            {data.logoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.logoDataUrl || "/placeholder.svg"}
                alt="Company logo preview"
                className="h-full w-full object-contain"
              />
            ) : (
              <ImagePlus className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              Company Logo
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              PNG, JPG or SVG. Shown on the proposal header.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <ImagePlus className="h-3.5 w-3.5" />
                {data.logoDataUrl ? "Replace logo" : "Upload logo"}
              </button>
              {data.logoDataUrl && (
                <button
                  type="button"
                  onClick={() => update({ logoDataUrl: "" })}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                  Remove
                </button>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handleLogoFile(e.target.files?.[0])
              e.target.value = ""
            }}
          />
        </div>
      </section>

      {SECTIONS.map((section) => {
        const Icon = section.icon
        const isOpen = open[section.id]
        return (
          <section
            key={section.id}
            className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggle(section.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-accent/40"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1 text-sm font-semibold text-foreground">
                {section.label}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {isOpen && (
              <div className="border-t border-border px-4 py-5">
                {section.id === "client" && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Client Name" htmlFor="clientName">
                      <TextInput
                        id="clientName"
                        value={data.clientName}
                        onChange={(e) => update({ clientName: e.target.value })}
                        placeholder="e.g. Sarah Mitchell"
                      />
                    </Field>
                    <Field label="Client Company" htmlFor="clientCompany">
                      <TextInput
                        id="clientCompany"
                        value={data.clientCompany}
                        onChange={(e) =>
                          update({ clientCompany: e.target.value })
                        }
                        placeholder="e.g. Acme Corp"
                      />
                    </Field>
                    <Field
                      label="Provider Name"
                      htmlFor="providerName"
                      className="sm:col-span-2"
                    >
                      <TextInput
                        id="providerName"
                        value={data.providerName}
                        onChange={(e) =>
                          update({ providerName: e.target.value })
                        }
                        placeholder="Your name / studio"
                      />
                    </Field>
                    <Field label="Date" htmlFor="date">
                      <TextInput
                        id="date"
                        type="date"
                        value={data.date}
                        onChange={(e) => update({ date: e.target.value })}
                      />
                    </Field>
                    <Field label="Valid Until" htmlFor="validUntil">
                      <TextInput
                        id="validUntil"
                        type="date"
                        value={data.validUntil}
                        onChange={(e) => update({ validUntil: e.target.value })}
                      />
                    </Field>
                  </div>
                )}

                {section.id === "scope" && (
                  <div className="flex flex-col gap-4">
                    <Field label="Project Title" htmlFor="projectTitle">
                      <TextInput
                        id="projectTitle"
                        value={data.projectTitle}
                        onChange={(e) =>
                          update({ projectTitle: e.target.value })
                        }
                        placeholder="e.g. Web Redesign Proposal"
                      />
                    </Field>

                    <Field label="Executive Summary / Overview">
                      <div className="flex flex-col gap-2">
                        <TextArea
                          rows={6}
                          value={data.executiveSummary}
                          onChange={(e) =>
                            update({ executiveSummary: e.target.value })
                          }
                          placeholder="Describe the project vision and value..."
                        />
                        <button
                          type="button"
                          onClick={onEnhance}
                          disabled={enhancing}
                          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-primary/30 bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {enhancing ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <WandSparkles className="h-3.5 w-3.5" />
                          )}
                          {enhancing
                            ? "Generating..."
                            : "Generate AI Proposal Text"}
                        </button>
                      </div>
                    </Field>

                    <Field label="Core Deliverables">
                      <div className="flex flex-col gap-2">
                        {data.deliverables.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-medium text-muted-foreground">
                              {index + 1}
                            </span>
                            <TextInput
                              value={item}
                              onChange={(e) =>
                                setDeliverable(index, e.target.value)
                              }
                              placeholder="Describe a deliverable..."
                            />
                            <button
                              type="button"
                              onClick={() => removeDeliverable(index)}
                              aria-label="Remove deliverable"
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addDeliverable}
                          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add deliverable
                        </button>
                      </div>
                    </Field>
                  </div>
                )}

                {section.id === "pricing" && (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field
                        label="Estimated Timeline (weeks)"
                        htmlFor="timeline"
                      >
                        <TextInput
                          id="timeline"
                          type="number"
                          min={1}
                          value={data.timelineWeeks}
                          onChange={(e) =>
                            update({
                              timelineWeeks: Math.max(
                                0,
                                Number(e.target.value),
                              ),
                            })
                          }
                        />
                      </Field>
                      <Field label="Currency" htmlFor="currency">
                        <Select
                          id="currency"
                          value={data.currency}
                          onChange={(e) =>
                            update({
                              currency: e.target.value as CurrencyCode,
                            })
                          }
                        >
                          {(
                            Object.keys(CURRENCIES) as CurrencyCode[]
                          ).map((code) => (
                            <option key={code} value={code}>
                              {code} — {CURRENCIES[code].label}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    </div>

                    <Field label="Line-item Pricing">
                      <div className="flex flex-col gap-2">
                        {data.lineItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <TextInput
                              value={item.description}
                              onChange={(e) =>
                                setLineItem(item.id, {
                                  description: e.target.value,
                                })
                              }
                              placeholder="Service description"
                              className="flex-1"
                            />
                            <TextInput
                              type="number"
                              min={0}
                              step="0.01"
                              value={item.amount}
                              onChange={(e) =>
                                setLineItem(item.id, {
                                  amount: Number(e.target.value),
                                })
                              }
                              className="w-28"
                            />
                            <button
                              type="button"
                              onClick={() => removeLineItem(item.id)}
                              aria-label="Remove line item"
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addLineItem}
                          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add line item
                        </button>
                      </div>
                    </Field>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Tax (%)" htmlFor="tax">
                        <TextInput
                          id="tax"
                          type="number"
                          min={0}
                          step="0.1"
                          value={data.taxPercent}
                          onChange={(e) =>
                            update({
                              taxPercent: Math.max(0, Number(e.target.value)),
                            })
                          }
                        />
                      </Field>
                    </div>

                    <div className="rounded-lg border border-border bg-secondary/50 px-4 py-3">
                      <dl className="flex flex-col gap-1.5 text-sm">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <dt>Subtotal</dt>
                          <dd className="font-mono">
                            {formatCurrency(subtotal, data.currency)}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between text-muted-foreground">
                          <dt>Tax ({data.taxPercent}%)</dt>
                          <dd className="font-mono">
                            {formatCurrency(tax, data.currency)}
                          </dd>
                        </div>
                        <div className="mt-1 flex items-center justify-between border-t border-border pt-2 text-base font-semibold text-foreground">
                          <dt>Total</dt>
                          <dd className="font-mono">
                            {formatCurrency(total, data.currency)}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <Field
                      label="Payment Terms"
                      htmlFor="paymentSchedule"
                    >
                      <TextInput
                        id="paymentSchedule"
                        value={data.paymentSchedule}
                        onChange={(e) =>
                          update({ paymentSchedule: e.target.value })
                        }
                        placeholder="e.g. 50% deposit · 50% on delivery"
                      />
                    </Field>
                  </div>
                )}

                {section.id === "terms" && (
                  <div className="flex flex-col gap-4">
                    <Field label="Payment Terms">
                      <TextArea
                        rows={4}
                        value={data.paymentTerms}
                        onChange={(e) =>
                          update({ paymentTerms: e.target.value })
                        }
                        placeholder="e.g. 50% upfront / 50% upon completion..."
                      />
                    </Field>
                    <Field label="Revision Policy">
                      <TextArea
                        rows={3}
                        value={data.revisionPolicy}
                        onChange={(e) =>
                          update({ revisionPolicy: e.target.value })
                        }
                        placeholder="Describe your revision policy..."
                      />
                    </Field>
                  </div>
                )}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
