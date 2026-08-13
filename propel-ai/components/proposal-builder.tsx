"use client"

import React, { useState } from "react"
import {
  type ProposalData,
  CURRENCIES,
  computeTotals,
  defaultProposalES,
  defaultProposalEN,
  formatCurrency,
} from "@/lib/proposal"
import { ProposalPreview } from "./proposal-preview"

const uiLabels = {
  es: {
    editingFor: "Editando para",
    generateAiText: "Generar Texto IA",
    copyLink: "Copiar Enlace",
    linkCopied: "¡Enlace Copiado!",
    exportPdf: "Exportar PDF",
    proposalDetails: "Detalles de la Propuesta",
    companyLogo: "Logo de la Empresa",
    logoHelp: "PNG, JPG o SVG. Se muestra en el encabezado de la propuesta.",
    uploadLogo: "Subir logo",
    clientProviderInfo: "Información de Cliente y Proveedor",
    clientName: "Nombre del Cliente",
    clientCompany: "Empresa del Cliente",
    providerName: "Nombre del Proveedor",
    date: "Fecha de Emisión",
    validUntil: "Válida Hasta",
    scopeOfWork: "Alcance del Trabajo",
    projectTitle: "Título del Proyecto",
    executiveSummary: "Resumen Ejecutivo / Visión General",
    generateAiProposalText: "Generar Texto IA para la Propuesta",
    coreDeliverables: "Entregables Principales",
    addDeliverable: "Agregar entregable",
    pricingTimeline: "Precios y Cronograma",
    estimatedTimeline: "Tiempo Estimado (semanas)",
    currency: "Moneda",
    lineItemPricing: "Precios Desglosados",
    descriptionPlaceholder: "Descripción del ítem",
    amountPlaceholder: "Monto",
    addLineItem: "Agregar ítem",
    taxRate: "Impuesto (%)",
    subtotal: "Subtotal",
    tax: "Impuesto",
    total: "Total",
    termsPayment: "Términos y Pago",
    paymentTerms: "Términos de Pago",
    revisionPolicy: "Política de Revisiones",
    deliverablePlaceholder: "Ej. Diseño UX/UI en Figma",
  },
  en: {
    editingFor: "Editing for",
    generateAiText: "Generate AI Text",
    copyLink: "Copy Link",
    linkCopied: "Link Copied!",
    exportPdf: "Export PDF",
    proposalDetails: "Proposal Details",
    companyLogo: "Company Logo",
    logoHelp: "PNG, JPG or SVG. Shown on the proposal header.",
    uploadLogo: "Upload logo",
    clientProviderInfo: "Client & Provider Info",
    clientName: "Client Name",
    clientCompany: "Client Company",
    providerName: "Provider Name",
    date: "Date Issued",
    validUntil: "Valid Until",
    scopeOfWork: "Scope of Work",
    projectTitle: "Project Title",
    executiveSummary: "Executive Summary / Overview",
    generateAiProposalText: "Generate AI Proposal Text",
    coreDeliverables: "Core Deliverables",
    addDeliverable: "Add deliverable",
    pricingTimeline: "Pricing & Timeline",
    estimatedTimeline: "Estimated Timeline (weeks)",
    currency: "Currency",
    lineItemPricing: "Line-item Pricing",
    descriptionPlaceholder: "Item description",
    amountPlaceholder: "Amount",
    addLineItem: "Add line item",
    taxRate: "Tax (%)",
    subtotal: "Subtotal",
    tax: "Tax",
    total: "Total",
    termsPayment: "Terms & Payment",
    paymentTerms: "Payment Terms",
    revisionPolicy: "Revision Policy",
    deliverablePlaceholder: "e.g. UX/UI Figma Design",
  },
}

export function ProposalBuilder() {
  const [lang, setLang] = useState<"es" | "en">("es")
  const [formData, setFormData] = useState<ProposalData>(defaultProposalES)
  const [copied, setCopied] = useState(false)

  const t = uiLabels[lang]

  const handleLangToggle = (newLang: "es" | "en") => {
    if (newLang === lang) return
    setLang(newLang)
    setFormData(newLang === "es" ? defaultProposalES : defaultProposalEN)
  }

  const handleChange = (field: keyof ProposalData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDeliverableChange = (index: number, value: string) => {
    const updated = [...(formData.deliverables || [])]
    updated[index] = value
    handleChange("deliverables", updated)
  }

  const addDeliverable = () => {
    handleChange("deliverables", [...(formData.deliverables || []), ""])
  }

  const removeDeliverable = (index: number) => {
    const updated = (formData.deliverables || []).filter((_, i) => i !== index)
    handleChange("deliverables", updated)
  }

  const handleLineItemChange = (index: number, field: "description" | "amount", value: any) => {
    const updated = [...(formData.lineItems || [])]
    updated[index] = { ...updated[index], [field]: value }
    handleChange("lineItems", updated)
  }

  const addLineItem = () => {
    const newId = String(Date.now())
    handleChange("lineItems", [...(formData.lineItems || []), { id: newId, description: "", amount: 0 }])
  }

  const removeLineItem = (index: number) => {
    const updated = (formData.lineItems || []).filter((_, i) => i !== index)
    handleChange("lineItems", updated)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        handleChange("companyLogoUrl", reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  const lineItems = Array.isArray(formData.lineItems) ? formData.lineItems : []
  const { subtotal, tax: taxAmount, total: totalAmount } = computeTotals(lineItems, formData.taxRate || 0)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER SUPERIOR */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              P
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none">
                {formData.projectTitle || "Propuesta Comercial"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t.editingFor} <span className="font-semibold text-foreground">{formData.clientCompany || "Cliente"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* TOGGLE IDIOMA */}
            <div className="flex items-center rounded-lg border border-border bg-muted p-1 text-xs">
              <button
                type="button"
                onClick={() => handleLangToggle("es")}
                className={`rounded px-2.5 py-1 font-semibold transition ${
                  lang === "es" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => handleLangToggle("en")}
                className={`rounded px-2.5 py-1 font-semibold transition ${
                  lang === "en" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition"
            >
              {copied ? t.linkCopied : t.copyLink}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              {t.exportPdf}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL: 2 COLUMNAS */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="lg:col-col-span-5 lg:col-span-5 space-y-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-bold tracking-tight text-foreground border-b border-border pb-3">
              {t.proposalDetails}
            </h2>

            {/* LOGO */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">{t.companyLogo}</label>
              <p className="text-[11px] text-muted-foreground">{t.logoHelp}</p>
              <div className="flex items-center gap-3 pt-1">
                {formData.companyLogoUrl && (
                  <img src={formData.companyLogoUrl} alt="Logo preview" className="h-10 w-10 object-contain rounded border border-border" />
                )}
                <label className="cursor-pointer rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium hover:bg-muted transition">
                  {t.uploadLogo}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              </div>
            </div>

            {/* INFO CLIENTE Y PROVEEDOR */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.clientProviderInfo}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium">{t.clientName}</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => handleChange("clientName", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">{t.clientCompany}</label>
                  <input
                    type="text"
                    value={formData.clientCompany}
                    onChange={(e) => handleChange("clientCompany", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">{t.providerName}</label>
                  <input
                    type="text"
                    value={formData.providerName}
                    onChange={(e) => handleChange("providerName", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">{t.date}</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium">{t.validUntil}</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => handleChange("validUntil", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* ALCANCE Y RESUMEN */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.scopeOfWork}</h3>
              <div>
                <label className="text-xs font-medium">{t.projectTitle}</label>
                <input
                  type="text"
                  value={formData.projectTitle}
                  onChange={(e) => handleChange("projectTitle", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium">{t.executiveSummary}</label>
                <textarea
                  rows={4}
                  value={formData.executiveSummary}
                  onChange={(e) => handleChange("executiveSummary", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-3 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* ENTREGABLES */}
              <div>
                <label className="text-xs font-medium">{t.coreDeliverables}</label>
                <div className="space-y-2 mt-2">
                  {(formData.deliverables || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground w-4">{idx + 1}.</span>
                      <input
                        type="text"
                        value={item}
                        placeholder={t.deliverablePlaceholder}
                        onChange={(e) => handleDeliverableChange(idx, e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => removeDeliverable(idx)}
                        className="text-xs text-red-500 hover:text-red-700 px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addDeliverable}
                    className="mt-1 text-xs font-semibold text-primary hover:underline"
                  >
                    + {t.addDeliverable}
                  </button>
                </div>
              </div>
            </div>

            {/* PRECIOS Y TIEMPO */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.pricingTimeline}</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium">{t.estimatedTimeline}</label>
                  <input
                    type="number"
                    value={formData.estimatedWeeks}
                    onChange={(e) => handleChange("estimatedWeeks", Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">{t.currency}</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleChange("currency", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* LÍNEAS DE PRECIO */}
              <div>
                <label className="text-xs font-medium">{t.lineItemPricing}</label>
                <div className="space-y-2 mt-2">
                  {lineItems.map((item, idx) => (
                    <div key={item.id || idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={t.descriptionPlaceholder}
                        value={item.description}
                        onChange={(e) => handleLineItemChange(idx, "description", e.target.value)}
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="number"
                        placeholder={t.amountPlaceholder}
                        value={item.amount || ""}
                        onChange={(e) => handleLineItemChange(idx, "amount", Number(e.target.value))}
                        className="w-24 rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary text-right"
                      />
                      <button
                        type="button"
                        onClick={() => removeLineItem(idx)}
                        className="text-xs text-red-500 hover:text-red-700 px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="mt-1 text-xs font-semibold text-primary hover:underline"
                  >
                    + {t.addLineItem}
                  </button>
                </div>
              </div>

              {/* IMPUESTOS Y RESUMEN FINANCIERO */}
              <div className="rounded-xl bg-muted/40 p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span>{t.taxRate}</span>
                  <input
                    type="number"
                    value={formData.taxRate}
                    onChange={(e) => handleChange("taxRate", Number(e.target.value))}
                    className="w-16 rounded border border-border bg-background px-2 py-1 text-right text-xs"
                  />
                </div>
                <div className="flex justify-between text-muted-foreground pt-1 border-t border-border">
                  <span>{t.subtotal}</span>
                  <span>{formatCurrency(subtotal, formData.currency)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t.tax} ({formData.taxRate || 0}%)</span>
                  <span>{formatCurrency(taxAmount, formData.currency)}</span>
                </div>
                <div className="flex justify-between font-bold text-foreground text-sm pt-1 border-t border-border">
                  <span>{t.total}</span>
                  <span className="text-primary">{formatCurrency(totalAmount, formData.currency)}</span>
                </div>
              </div>
            </div>

            {/* TÉRMINOS Y POLÍTICAS */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.termsPayment}</h3>
              <div>
                <label className="text-xs font-medium">{t.paymentTerms}</label>
                <textarea
                  rows={3}
                  value={formData.paymentTerms}
                  onChange={(e) => handleChange("paymentTerms", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium">{t.revisionPolicy}</label>
                <textarea
                  rows={2}
                  value={formData.revisionPolicy}
                  onChange={(e) => handleChange("revisionPolicy", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA: VISTA PREVIA DEL DOCUMENTO */}
          <div className="lg:col-span-7 sticky top-20">
            <ProposalPreview data={formData} lang={lang} />
          </div>

        </div>
      </main>
    </div>
  )
}
