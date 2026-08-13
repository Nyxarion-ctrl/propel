"use client"

import React from "react"
import { type ProposalData, computeTotals, formatCurrency } from "@/lib/proposal"

interface ProposalPreviewProps {
  data: ProposalData
  lang?: "es" | "en"
}

const previewLabels = {
  es: {
    draft: "BORRADOR",
    issued: "Emitido",
    validUntil: "Válida hasta",
    commercialProposal: "PROPUESTA COMERCIAL",
    preparedFor: "PREPARADO PARA",
    preparedBy: "PREPARADO POR",
    executiveSummary: "RESUMEN EJECUTIVO",
    scopeDeliverables: "ALCANCE Y ENTREGABLES",
    investment: "INVERSIÓN",
    description: "Descripción",
    amount: "Monto",
    subtotal: "Subtotal",
    tax: "Impuesto",
    total: "Total",
    estimatedTimeline: "Cronograma estimado",
    weeksFromKickoff: "semanas a partir del inicio del proyecto.",
    termsAndPayment: "TÉRMINOS Y PAGO",
    paymentTerms: "Términos de Pago",
    revisionPolicy: "Política de Revisiones",
    clientSignature: "Firma del cliente y fecha",
    providerSignature: "Firma del proveedor y fecha",
    footerText: "Esta propuesta es confidencial y para uso exclusivo de",
    generatedWith: "Generado con PropelAI.",
  },
  en: {
    draft: "DRAFT",
    issued: "Issued",
    validUntil: "Valid until",
    commercialProposal: "COMMERCIAL PROPOSAL",
    preparedFor: "PREPARED FOR",
    preparedBy: "PREPARED BY",
    executiveSummary: "EXECUTIVE SUMMARY",
    scopeDeliverables: "SCOPE & DELIVERABLES",
    investment: "INVESTMENT",
    description: "Description",
    amount: "Amount",
    subtotal: "Subtotal",
    tax: "Tax",
    total: "Total",
    estimatedTimeline: "Estimated timeline",
    weeksFromKickoff: "weeks from project kickoff.",
    termsAndPayment: "TERMS & PAYMENT",
    paymentTerms: "Payment Terms",
    revisionPolicy: "Revision Policy",
    clientSignature: "Client signature & date",
    providerSignature: "Provider signature & date",
    footerText: "This proposal is confidential and intended solely for",
    generatedWith: "Generated with PropelAI.",
  },
}

export function ProposalPreview({ data, lang = "es" }: ProposalPreviewProps) {
  const t = previewLabels[lang] || previewLabels.es

  const lineItems = Array.isArray(data?.lineItems) ? data.lineItems : []
  const deliverables = Array.isArray(data?.deliverables) ? data.deliverables : []

  const { subtotal, tax: taxAmount, total: totalAmount } = computeTotals(lineItems, data?.taxRate || 0)

  const formatMoney = (val: number) => formatCurrency(val, data?.currency || "USD")

  return (
    <div className="mx-auto max-w-2xl">
      <div
        id="proposal-document"
        className="rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-12 text-card-foreground font-sans space-y-8"
      >
        {/* ENCABEZADO */}
        <div className="flex items-start justify-between border-b border-border pb-6">
          <div className="flex items-center gap-3">
            {data?.companyLogoUrl ? (
              <img src={data.companyLogoUrl} alt="Logo" className="h-10 w-auto object-contain" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                P
              </div>
            )}
            <span className="font-bold text-lg">{data?.providerName || "PropelAI Studio"}</span>
          </div>
          <div className="text-right text-xs text-muted-foreground space-y-1">
            <span className="inline-block rounded-full bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
              {t.draft}
            </span>
            <p>{t.issued}: {data?.date || ""}</p>
            <p>{t.validUntil}: {data?.validUntil || ""}</p>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-1">
            {t.commercialProposal}
          </p>
          <h1 className="text-2xl font-extrabold sm:text-3xl tracking-tight leading-snug">
            {data?.projectTitle || "Propuesta Comercial"}
          </h1>
        </div>

        {/* PREPARADO PARA / POR */}
        <div className="grid grid-cols-2 gap-6 rounded-xl bg-muted/50 p-4 text-xs">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              {t.preparedFor}
            </p>
            <p className="font-bold text-sm text-foreground">{data?.clientName || ""}</p>
            <p className="text-muted-foreground">{data?.clientCompany || ""}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              {t.preparedBy}
            </p>
            <p className="font-bold text-sm text-foreground">{data?.providerName || ""}</p>
          </div>
        </div>

        {/* RESUMEN EJECUTIVO */}
        {data?.executiveSummary && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t.executiveSummary}
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
              {data.executiveSummary}
            </p>
          </div>
        )}

        {/* ALCANCE Y ENTREGABLES */}
        {deliverables.filter(Boolean).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t.scopeDeliverables}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {deliverables.filter(Boolean).map((d, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* INVERSIÓN Y TABLA */}
        {lineItems.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t.investment}
            </h3>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-muted/60 text-muted-foreground font-semibold">
                  <tr>
                    <th className="px-4 py-2.5 text-left">{t.description}</th>
                    <th className="px-4 py-2.5 text-right">{t.amount}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {lineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2.5 text-foreground">{item.description}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-foreground">
                        {formatMoney(item.amount || 0)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muted/20">
                    <td className="px-4 py-2 font-medium text-muted-foreground">{t.subtotal}</td>
                    <td className="px-4 py-2 text-right font-medium text-foreground">{formatMoney(subtotal)}</td>
                  </tr>
                  {(data?.taxRate || 0) > 0 && (
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium text-muted-foreground">{t.tax} ({data.taxRate}%)</td>
                      <td className="px-4 py-2 text-right font-medium text-foreground">{formatMoney(taxAmount)}</td>
                    </tr>
                  )}
                  <tr className="bg-muted/40 font-bold">
                    <td className="px-4 py-3 text-foreground text-sm">{t.total}</td>
                    <td className="px-4 py-3 text-right text-primary text-base">{formatMoney(totalAmount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {(data?.estimatedWeeks || 0) > 0 && (
              <p className="text-xs text-muted-foreground pt-1">
                {t.estimatedTimeline}: <span className="font-semibold text-foreground">{data.estimatedWeeks} {t.weeksFromKickoff}</span>
              </p>
            )}
          </div>
        )}

        {/* TÉRMINOS Y PAGO */}
        {(data?.paymentTerms || data?.revisionPolicy) && (
          <div className="space-y-3 border-t border-border pt-6">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t.termsAndPayment}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-foreground/80">
              {data?.paymentTerms && (
                <div>
                  <p className="font-semibold text-foreground mb-1">{t.paymentTerms}</p>
                  <p className="leading-relaxed">{data.paymentTerms}</p>
                </div>
              )}
              {data?.revisionPolicy && (
                <div>
                  <p className="font-semibold text-foreground mb-1">{t.revisionPolicy}</p>
                  <p className="leading-relaxed">{data.revisionPolicy}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FIRMAS */}
        <div className="grid grid-cols-2 gap-8 border-t border-border pt-12 text-xs">
          <div className="border-t border-muted-foreground/30 pt-2">
            <p className="font-bold text-foreground">{data?.clientName || ""}</p>
            <p className="text-muted-foreground text-[10px]">{t.clientSignature}</p>
          </div>
          <div className="border-t border-muted-foreground/30 pt-2">
            <p className="font-bold text-foreground">{data?.providerName || ""}</p>
            <p className="text-muted-foreground text-[10px]">{t.providerSignature}</p>
          </div>
        </div>

        {/* PIE DE PÁGINA */}
        <p className="text-[10px] text-center text-muted-foreground border-t border-border pt-4">
          {t.footerText} {data?.clientCompany || "el cliente"}. {t.generatedWith}
        </p>
      </div>
    </div>
  )
}
