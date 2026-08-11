"use client"

import { Check } from "lucide-react"
import {
  type ProposalData,
  computeTotals,
  formatCurrency,
} from "@/lib/proposal"

function formatDate(value: string) {
  if (!value) return "—"
  const d = new Date(value + "T00:00:00")
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function ProposalPreview({ data }: { data: ProposalData }) {
  const { subtotal, tax, total } = computeTotals(data)

  return (
    <article
      id="proposal-document"
      className="print-document mx-auto flex min-h-full w-full max-w-[820px] flex-col bg-white text-slate-800 shadow-xl ring-1 ring-slate-200/70"
    >
      {/* Document header */}
      <header className="flex items-start justify-between gap-6 border-b border-slate-200 px-10 pb-8 pt-10">
        <div>
          {data.logoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.logoDataUrl || "/placeholder.svg"}
              alt="Company logo"
              className="max-h-14 w-auto max-w-[220px] object-contain"
            />
          ) : (
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-sm font-bold text-white">
                P
              </span>
              <span className="text-lg font-semibold tracking-tight text-slate-900">
                PropelAI Studio
              </span>
            </div>
          )}
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
            Commercial Proposal
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700 ring-1 ring-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Draft
          </span>
          <dl className="mt-4 space-y-1 text-xs text-slate-500">
            <div className="flex justify-end gap-2">
              <dt className="text-slate-400">Issued</dt>
              <dd className="font-medium text-slate-700">
                {formatDate(data.date)}
              </dd>
            </div>
            <div className="flex justify-end gap-2">
              <dt className="text-slate-400">Valid until</dt>
              <dd className="font-medium text-slate-700">
                {formatDate(data.validUntil)}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-9 px-10 py-9">
        {/* Title */}
        <div>
          <h1 className="text-pretty text-2xl font-bold leading-tight tracking-tight text-slate-900">
            {data.projectTitle || "Untitled Proposal"}
          </h1>
        </div>

        {/* Parties */}
        <section className="grid grid-cols-2 gap-6">
          <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-100">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
              Prepared for
            </p>
            <p className="mt-2 font-semibold text-slate-900">
              {data.clientName || "—"}
            </p>
            <p className="text-sm text-slate-500">{data.clientCompany}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-100">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
              Prepared by
            </p>
            <p className="mt-2 font-semibold text-slate-900">
              {data.providerName || "—"}
            </p>
          </div>
        </section>

        {/* Executive summary */}
        <Section title="Executive Summary">
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
            {data.executiveSummary || "No summary provided yet."}
          </p>
        </Section>

        {/* Deliverables */}
        <Section title="Scope & Deliverables">
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {data.deliverables
              .filter((d) => d.trim())
              .map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                  {item}
                </li>
              ))}
          </ul>
        </Section>

        {/* Pricing table */}
        <Section title="Investment">
          <div className="overflow-hidden rounded-lg ring-1 ring-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-2.5 font-semibold">Description</th>
                  <th className="px-4 py-2.5 text-right font-semibold">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2.5 text-slate-700">
                      {item.description || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-700">
                      {formatCurrency(item.amount, data.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50/60">
                <tr className="text-slate-500">
                  <td className="px-4 py-2 text-right">Subtotal</td>
                  <td className="px-4 py-2 text-right font-mono">
                    {formatCurrency(subtotal, data.currency)}
                  </td>
                </tr>
                <tr className="text-slate-500">
                  <td className="px-4 py-2 text-right">
                    Tax ({data.taxPercent}%)
                  </td>
                  <td className="px-4 py-2 text-right font-mono">
                    {formatCurrency(tax, data.currency)}
                  </td>
                </tr>
                <tr className="border-t border-slate-200 text-base font-bold text-slate-900">
                  <td className="px-4 py-3 text-right">Total</td>
                  <td className="px-4 py-3 text-right font-mono text-indigo-600">
                    {formatCurrency(total, data.currency)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <p>
              Estimated timeline:{" "}
              <span className="font-semibold text-slate-700">
                {data.timelineWeeks} weeks
              </span>{" "}
              from project kickoff.
            </p>
            {data.paymentSchedule.trim() && (
              <p className="rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-700 ring-1 ring-indigo-100">
                {data.paymentSchedule}
              </p>
            )}
          </div>
        </Section>

        {/* Terms */}
        <Section title="Terms & Payment">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Payment Terms
              </h4>
              <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {data.paymentTerms || "—"}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Revision Policy
              </h4>
              <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {data.revisionPolicy || "—"}
              </p>
            </div>
          </div>
        </Section>

        {/* Signatures */}
        <section className="mt-auto grid grid-cols-2 gap-8 border-t border-slate-200 pt-8">
          <Signature role="Client" name={data.clientName} />
          <Signature role="Provider" name={data.providerName} />
        </section>

        <p className="pt-2 text-center text-[11px] text-slate-400">
          This proposal is confidential and intended solely for{" "}
          {data.clientCompany || "the recipient"}. Generated with PropelAI.
        </p>
      </div>
    </article>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-indigo-600">
        {title}
      </h3>
      {children}
    </section>
  )
}

function Signature({ role, name }: { role: string; name: string }) {
  return (
    <div>
      <div className="h-12 border-b border-slate-300" />
      <p className="mt-2 text-sm font-medium text-slate-700">{name || "—"}</p>
      <p className="text-xs text-slate-400">{role} signature &amp; date</p>
    </div>
  )
}
