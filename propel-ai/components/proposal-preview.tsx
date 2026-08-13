import React from "react"
import { type ProposalData, computeTotals, formatCurrency } from "@/lib/proposal"

interface ProposalPreviewProps {
  data: ProposalData
  lang: "es" | "en"
}

const docLabels = {
  es: {
    commercialProposal: "PROPUESTA COMERCIAL",
    draft: "BORRADOR",
    issued: "Emitido",
    validUntil: "Válida hasta",
    preparedFor: "PREPARADO PARA",
    preparedBy: "PREPARADO POR",
    executiveSummary: "RESUMEN EJECUTIVO",
    scopeDeliverables: "ALCANCE Y ENTREGABLES",
    timelinePricing: "CRONOGRAMA Y PRECIOS",
    weeks: "semanas estimado",
    description: "DESCRIPCIÓN",
    amount: "MONTO",
    subtotal: "Subtotal",
    tax: "Impuesto",
    total: "Total",
    termsConditions: "TÉRMINOS Y CONDICIONES",
    paymentTerms: "Términos de Pago",
    revisionPolicy: "Política de Revisiones",
    acceptProposal: "Aceptar Propuesta",
  },
  en: {
    commercialProposal: "COMMERCIAL PROPOSAL",
    draft: "DRAFT",
    issued: "Issued",
    validUntil: "Valid until",
    preparedFor: "PREPARED FOR",
    preparedBy: "PREPARED BY",
    executiveSummary: "EXECUTIVE SUMMARY",
    scopeDeliverables: "SCOPE & DELIVERABLES",
    timelinePricing: "TIMELINE & PRICING",
    weeks: "weeks estimated",
    description: "DESCRIPTION",
    amount: "AMOUNT",
    subtotal: "Subtotal",
    tax: "Tax",
    total: "Total",
    termsConditions: "TERMS & CONDITIONS",
    paymentTerms: "Payment Terms",
    revisionPolicy: "Revision Policy",
    acceptProposal: "Accept Proposal",
  },
}

export function ProposalPreview({ data, lang }: ProposalPreviewProps) {
  const d = docLabels[lang]
  const lineItems = Array.isArray(data.lineItems) ? data.lineItems : []
  const { subtotal, tax, total } = computeTotals(lineItems, data.taxRate || 0)

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-xl space-y-8 font-sans text-card-foreground">
      
      {/* CABECERA DEL DOCUMENTO */}
      <div className="flex items-start justify-between border-b border-border/60 pb-6">
        <div className="flex items-center gap-4">
          {data.companyLogoUrl ? (
            <img src={data.companyLogoUrl} alt="Logo" className="h-12 w-12 object-contain" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xl">
              {data.providerName ? data.providerName.charAt(0) : "P"}
            </div>
          )}
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground">{data.providerName}</h2>
          </div>
        </div>

        <div className="text-right space-y-1">
          <span className="inline-block rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
            {d.draft}
          </span>
          <p className="text-[11px] text-muted-foreground">{d.issued}: {data.date}</p>
          <p className="text-[11px] text-muted-foreground">{d.validUntil}: {data.validUntil}</p>
        </div>
      </div>

      {/* TÍTULO */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          {d.commercialProposal}
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
          {data.projectTitle}
        </h1>
      </div>

      {/* PARA / POR */}
      <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/30 p-4 border border-border/40 text-xs">
        <div>
          <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">{d.preparedFor}</p>
          <p className="font-bold text-foreground mt-0.5">{data.clientName}</p>
          <p className="text-muted-foreground">{data.clientCompany}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">{d.preparedBy}</p>
          <p className="font-bold text-foreground mt-0.5">{data.providerName}</p>
        </div>
      </div>

      {/* RESUMEN EJECUTIVO */}
      {data.executiveSummary && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
            {d.executiveSummary}
          </h3>
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
            {data.executiveSummary}
          </p>
        </div>
      )}

      {/* ALCANCE Y ENTREGABLES */}
      {data.deliverables && data.deliverables.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
            {d.scopeDeliverables}
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-foreground/90">
            {data.deliverables.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* TABLA DE PRECIOS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
            {d.timelinePricing}
          </h3>
          {data.estimatedWeeks > 0 && (
            <span className="text-xs text-muted-foreground font-medium">
              {data.estimatedWeeks} {d.weeks}
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="p-3">{d.description}</th>
                <th className="p-3 text-right">{d.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {lineItems.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="p-3 text-foreground font-medium">{item.description}</td>
                  <td className="p-3 text-right font-mono text-foreground">
                    {formatCurrency(Number(item.amount) || 0, data.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bg-muted/20 p-4 border-t border-border space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>{d.subtotal}</span>
              <span className="font-mono">{formatCurrency(subtotal, data.currency)}</span>
            </div>
            {data.taxRate > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>{d.tax} ({data.taxRate}%)</span>
                <span className="font-mono">{formatCurrency(tax, data.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border">
              <span>{d.total}</span>
              <span className="font-mono text-indigo-600">{formatCurrency(total, data.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TÉRMINOS */}
      {(data.paymentTerms || data.revisionPolicy) && (
        <div className="space-y-3 pt-2 border-t border-border/60">
          <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
            {d.termsConditions}
          </h3>
          {data.paymentTerms && (
            <div className="text-xs space-y-1">
              <p className="font-semibold text-foreground">{d.paymentTerms}:</p>
              <p className="text-muted-foreground leading-relaxed">{data.paymentTerms}</p>
            </div>
          )}
          {data.revisionPolicy && (
            <div className="text-xs space-y-1">
              <p className="font-semibold text-foreground">{d.revisionPolicy}:</p>
              <p className="text-muted-foreground leading-relaxed">{data.revisionPolicy}</p>
            </div>
          )}
        </div>
      )}

      {/* BOTÓN VIRTUAL */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition"
        >
          {d.acceptProposal}
        </button>
      </div>

    </div>
  )
}
