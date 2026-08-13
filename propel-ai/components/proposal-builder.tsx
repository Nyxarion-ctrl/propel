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

// ICONOS SVG
const SparklesIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
)

const CopyIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
  </svg>
)

const ExportIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
)

const UserIcon = () => (
  <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
)

const ListIcon = () => (
  <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75V12zm0 5.25h.007v.008H3.75v-.008z" />
  </svg>
)

const ImageIcon = () => (
  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
)

const ChevronUp = () => (
  <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
  </svg>
)

const ChevronDown = () => (
  <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
)

// LABELS DE LA INTERFAZ TRADUCIDOS 100%
const uiLabels = {
  es: {
    editingFor: "Editando para",
    generateAiText: "Generar Texto IA",
    copyLink: "Copiar Enlace",
    linkCopied: "¡Copiado!",
    exportPdf: "Exportar PDF",
    proposalDetails: "DETALLES DE LA PROPUESTA",
    companyLogo: "Logo de la Empresa",
    logoHelp: "PNG, JPG o SVG. Se muestra en el encabezado de la propuesta.",
    uploadLogo: "Subir logo",
    clientProviderInfo: "Info del Cliente y Proveedor",
    clientName: "Nombre del Cliente",
    clientCompany: "Empresa del Cliente",
    providerName: "Nombre del Proveedor",
    date: "Fecha de Emisión",
    validUntil: "Válido Hasta",
    scopeOfWork: "Alcance del Trabajo",
    projectTitle: "Título del Proyecto",
    executiveSummary: "Resumen Ejecutivo / Descripción",
    coreDeliverables: "Entregables Principales",
    addDeliverable: "Agregar entregable",
    pricingTimeline: "Precios y Cronograma",
    estimatedTimeline: "Tiempo Estimado (semanas)",
    currency: "Moneda",
    lineItemPricing: "Desglose de Costos",
    descriptionPlaceholder: "Descripción",
    amountPlaceholder: "Monto",
    addLineItem: "Agregar elemento",
    taxRate: "Impuesto (%)",
    subtotal: "Subtotal",
    tax: "Impuesto",
    total: "Total",
    termsPayment: "Términos y Pago",
    paymentTerms: "Términos de Pago",
    revisionPolicy: "Política de Revisiones",
  },
  en: {
    editingFor: "Editing for",
    generateAiText: "Generate AI Text",
    copyLink: "Copy Link",
    linkCopied: "Copied!",
    exportPdf: "Export PDF",
    proposalDetails: "PROPOSAL DETAILS",
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
    coreDeliverables: "Core Deliverables",
    addDeliverable: "Add deliverable",
    pricingTimeline: "Pricing & Timeline",
    estimatedTimeline: "Estimated Timeline (weeks)",
    currency: "Currency",
    lineItemPricing: "Line-item Pricing",
    descriptionPlaceholder: "Description",
    amountPlaceholder: "Amount",
    addLineItem: "Add line item",
    taxRate: "Tax (%)",
    subtotal: "Subtotal",
    tax: "Tax",
    total: "Total",
    termsPayment: "Terms & Payment",
    paymentTerms: "Payment Terms",
    revisionPolicy: "Revision Policy",
  },
}

export function ProposalBuilder() {
  const [lang, setLang] = useState<"es" | "en">("es")
  const [formData, setFormData] = useState<ProposalData>(defaultProposalES)
  const [copied, setCopied] = useState(false)

  const [openSections, setOpenSections] = useState({
    client: true,
    scope: true,
    pricing: true,
    terms: true,
  })

  const toggleSection = (sec: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }))
  }

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
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 text-foreground font-sans">
      
      {/* HEADER SUPERIOR */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur px-4 py-2.5 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-black shadow-md shadow-indigo-200 dark:shadow-none">
              <SparklesIcon />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-foreground">PropelAI</span>
              <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                Proposal Builder v1.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* TOGGLE ES / EN */}
            <div className="flex items-center rounded-lg border border-border bg-muted/60 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => handleLangToggle("es")}
                className={`rounded-md px-2.5 py-1 font-semibold text-xs transition ${
                  lang === "es" ? "bg-indigo-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => handleLangToggle("en")}
                className={`rounded-md px-2.5 py-1 font-semibold text-xs transition ${
                  lang === "en" ? "bg-indigo-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition shadow-sm"
            >
              <SparklesIcon />
              <span>{t.generateAiText}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition shadow-sm"
            >
              <CopyIcon />
              <span>{copied ? t.linkCopied : t.copyLink}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-sm shadow-indigo-200 dark:shadow-none"
            >
              <ExportIcon />
              <span>{t.exportPdf}</span>
            </button>
          </div>
        </div>
      </header>

      {/* SUB-HEADER */}
      <div className="border-b border-border bg-background/50 px-4 py-2 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-sm font-bold text-foreground leading-tight">
            {formData.projectTitle || "Propuesta Comercial"}
          </h1>
          <p className="text-[11px] text-muted-foreground">
            {t.editingFor} <span className="font-semibold text-foreground">{formData.clientCompany || "Cliente"}</span>
          </p>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xs font-bold tracking-widest text-muted-foreground uppercase px-1">
              {t.proposalDetails}
            </h2>

            {/* LOGO */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted border border-dashed border-border text-muted-foreground">
                  {formData.companyLogoUrl ? (
                    <img src={formData.companyLogoUrl} alt="Logo" className="h-10 w-10 object-contain" />
                  ) : (
                    <ImageIcon />
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">{t.companyLogo}</h3>
                  <p className="text-[11px] text-muted-foreground">{t.logoHelp}</p>
                </div>
              </div>
              <label className="inline-block cursor-pointer rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition">
                {t.uploadLogo}
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            </div>

            {/* CLIENTE Y PROVEEDOR */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("client")}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-foreground bg-card hover:bg-muted/30 transition"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900">
                    <UserIcon />
                  </div>
                  <span>{t.clientProviderInfo}</span>
                </div>
                {openSections.client ? <ChevronUp /> : <ChevronDown />}
              </button>

              {openSections.client && (
                <div className="p-4 pt-0 space-y-3 border-t border-border/40">
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground">{t.clientName}</label>
                      <input
                        type="text"
                        value={formData.clientName}
                        onChange={(e) => handleChange("clientName", e.target.value)}
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground">{t.clientCompany}</label>
                      <input
                        type="text"
                        value={formData.clientCompany}
                        onChange={(e) => handleChange("clientCompany", e.target.value)}
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground">{t.providerName}</label>
                    <input
                      type="text"
                      value={formData.providerName}
                      onChange={(e) => handleChange("providerName", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground">{t.date}</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground">{t.validUntil}</label>
                      <input
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => handleChange("validUntil", e.target.value)}
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ALCANCE DEL TRABAJO */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("scope")}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-foreground bg-card hover:bg-muted/30 transition"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900">
                    <ListIcon />
                  </div>
                  <span>{t.scopeOfWork}</span>
                </div>
                {openSections.scope ? <ChevronUp /> : <ChevronDown />}
              </button>

              {openSections.scope && (
                <div className="p-4 pt-0 space-y-3 border-t border-border/40">
                  <div className="pt-3">
                    <label className="text-[11px] font-medium text-muted-foreground">{t.projectTitle}</label>
                    <input
                      type="text"
                      value={formData.projectTitle}
                      onChange={(e) => handleChange("projectTitle", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground">{t.executiveSummary}</label>
                    <textarea
                      rows={4}
                      value={formData.executiveSummary}
                      onChange={(e) => handleChange("executiveSummary", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground">{t.coreDeliverables}</label>
                    <div className="space-y-2 mt-2">
                      {(formData.deliverables || []).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-600 w-4">{idx + 1}</span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleDeliverableChange(idx, e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        className="mt-1 text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        + {t.addDeliverable}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PRECIOS Y CRONOGRAMA */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("pricing")}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-foreground bg-card hover:bg-muted/30 transition"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900">
                    <span className="font-bold text-indigo-600 text-xs">$</span>
                  </div>
                  <span>{t.pricingTimeline}</span>
                </div>
                {openSections.pricing ? <ChevronUp /> : <ChevronDown />}
              </button>

              {openSections.pricing && (
                <div className="p-4 pt-0 space-y-3 border-t border-border/40">
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground">{t.estimatedTimeline}</label>
                      <input
                        type="number"
                        value={formData.estimatedWeeks}
                        onChange={(e) => handleChange("estimatedWeeks", Number(e.target.value))}
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground">{t.currency}</label>
                      <select
                        value={formData.currency}
                        onChange={(e) => handleChange("currency", e.target.value)}
                        className="mt-1 w-full rounded-xl border border-border bg-background px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground">{t.lineItemPricing}</label>
                    <div className="space-y-2 mt-2">
                      {lineItems.map((item, idx) => (
                        <div key={item.id || idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={t.descriptionPlaceholder}
                            value={item.description}
                            onChange={(e) => handleLineItemChange(idx, "description", e.target.value)}
                            className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <input
                            type="number"
                            placeholder={t.amountPlaceholder}
                            value={item.amount || ""}
                            onChange={(e) => handleLineItemChange(idx, "amount", Number(e.target.value))}
                            className="w-24 rounded-xl border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
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
                        className="mt-1 text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        + {t.addLineItem}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl bg-muted/40 p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t.taxRate}</span>
                      <input
                        type="number"
                        value={formData.taxRate}
                        onChange={(e) => handleChange("taxRate", Number(e.target.value))}
                        className="w-16 rounded-lg border border-border bg-background px-2 py-1 text-right text-xs"
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
                      <span className="text-indigo-600">{formatCurrency(totalAmount, formData.currency)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* TÉRMINOS Y PAGO */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("terms")}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-foreground bg-card hover:bg-muted/30 transition"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900">
                    <span className="font-bold text-indigo-600 text-xs">¶</span>
                  </div>
                  <span>{t.termsPayment}</span>
                </div>
                {openSections.terms ? <ChevronUp /> : <ChevronDown />}
              </button>

              {openSections.terms && (
                <div className="p-4 pt-0 space-y-3 border-t border-border/40">
                  <div className="pt-3">
                    <label className="text-[11px] font-medium text-muted-foreground">{t.paymentTerms}</label>
                    <textarea
                      rows={3}
                      value={formData.paymentTerms}
                      onChange={(e) => handleChange("paymentTerms", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground">{t.revisionPolicy}</label>
                    <textarea
                      rows={2}
                      value={formData.revisionPolicy}
                      onChange={(e) => handleChange("revisionPolicy", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* VISTA PREVIA DEL DOCUMENTO */}
          <div className="lg:col-span-7 sticky top-20">
            <ProposalPreview data={formData} lang={lang} />
          </div>

        </div>
      </main>
    </div>
  )
}
