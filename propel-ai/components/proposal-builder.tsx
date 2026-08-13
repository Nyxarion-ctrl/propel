"use client"

import { useCallback, useState } from "react"
import { Download, Link2, WandSparkles, Loader2 } from "lucide-react"
import { type ProposalData, defaultProposal } from "@/lib/proposal"
import { AppHeader } from "@/components/app-header"
import { ProposalEditor } from "@/components/proposal-editor"
import { ProposalPreview } from "@/components/proposal-preview"
import { Toast } from "@/components/toast"

// Plantillas por defecto para cambio rápido de idioma en la propuesta inicial
const defaultContents = {
  es: {
    projectTitle: "Propuesta de Rediseño Web para Acme Corp",
    clientName: "Sarah Mitchell",
    clientCompany: "Acme Corp",
    providerName: "Jordan Rivera — PropelAI Studio",
    executiveSummary: "El sitio web actual de Acme Corp ya no refleja la calidad de sus productos ni la ambición de su marca. Esta propuesta detalla un rediseño completo enfocado en una experiencia moderna y orientada a la conversión: una identidad visual renovada, un front-end más rápido y accesible, y una estructura de contenido que guíe a los visitantes hacia convertirse en clientes."
  },
  en: {
    projectTitle: "Web Redesign Proposal for Acme Corp",
    clientName: "Sarah Mitchell",
    clientCompany: "Acme Corp",
    providerName: "Jordan Rivera — PropelAI Studio",
    executiveSummary: "Acme Corp's current website no longer reflects the quality of its products or the ambitions of its brand. This proposal outlines a complete redesign focused on a modern, conversion-oriented experience: a refreshed visual identity, a faster and more accessible front-end, and a content structure that guides visitors toward becoming customers."
  }
}

export function ProposalBuilder() {
  const [lang, setLang] = useState<"es" | "en">("es")
  const [data, setData] = useState<ProposalData>(defaultProposal)
  const [enhancing, setEnhancing] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const update = useCallback((patch: Partial<ProposalData>) => {
    setData((prev) => ({ ...prev, ...patch }))
  }, [])

  // Manejador del cambio de idioma en la barra
  const handleLanguageChange = (newLang: "es" | "en") => {
    setLang(newLang)
    setData((prev) => ({
      ...prev,
      projectTitle: defaultContents[newLang].projectTitle,
      executiveSummary: defaultContents[newLang].executiveSummary,
    }))
    setToast(newLang === "es" ? "Idioma cambiado a Español" : "Language changed to English")
  }

  const handleEnhance = useCallback(async () => {
    setEnhancing(true)
    try {
      const scopeContent = [
        data.deliverables.filter(Boolean).map((d) => `- ${d}`).join("\n"),
        data.executiveSummary.trim()
          ? `Detalles actuales:\n${data.executiveSummary.trim()}`
          : "",
      ]
        .filter(Boolean)
        .join("\n\n")

      const res = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.projectTitle || (lang === "es" ? "Propuesta Comercial" : "Commercial Proposal"),
          scope: scopeContent || "Rediseño y optimización de servicios",
          lang: lang,
        }),
      })

      const payload = (await res.json().catch(() => ({}))) as {
        summary?: string
        error?: string
      }

      if (!res.ok || !payload.summary) {
        throw new Error(payload.error || "Error al conectar con la API")
      }

      setData((prev) => ({ ...prev, executiveSummary: payload.summary! }))
      setToast(lang === "es" ? "¡Resumen ejecutivo generado!" : "Executive summary generated!")
    } catch (err) {
      console.log("[PropelAI] handleEnhance error:", err)
      setToast(
        err instanceof Error && err.message
          ? err.message
          : (lang === "es" ? "No se pudo generar el texto." : "Could not generate text."),
      )
    } finally {
      setEnhancing(false)
    }
  }, [data.projectTitle, data.deliverables, data.executiveSummary, lang])

  const handleExport = useCallback(async () => {
    const node = document.getElementById("proposal-document")
    if (!node) return
    setExporting(true)
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ])

      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      })

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const imgData = canvas.toDataURL("image/png")

      let heightLeft = imgHeight
      let position = 0
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position -= pageHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const safeName =
        (data.clientCompany || "proposal")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || "proposal"
      pdf.save(`${safeName}-proposal.pdf`)
      setToast(lang === "es" ? "¡PDF descargado con éxito!" : "PDF downloaded successfully!")
    } catch {
      window.print()
    } finally {
      setExporting(false)
    }
  }, [data.clientCompany, lang])

  const handleCopyLink = useCallback(() => {
    const url =
      typeof window !== "undefined" ? window.location.href : "https://propelai.app"
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {})
    }
    setToast(lang === "es" ? "¡Enlace copiado al portapapeles!" : "Link copied to clipboard!")
  }, [lang])

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <AppHeader />

      {/* Action toolbar */}
      <div className="print-hidden flex items-center justify-between gap-4 border-b border-border bg-card/40 px-4 py-3 sm:px-6">
        <div className="hidden flex-col sm:flex">
          <span className="text-sm font-semibold text-foreground">
            {data.projectTitle || (lang === "es" ? "Propuesta sin título" : "Untitled Proposal")}
          </span>
          <span className="text-xs text-muted-foreground">
            {lang === "es" ? "Editando para" : "Editing for"} {data.clientCompany || (lang === "es" ? "tu cliente" : "your client")}
          </span>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2">
          {/* TOGGLE ES / EN */}
          <div className="flex items-center rounded-lg border border-border bg-card p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleLanguageChange("es")}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                lang === "es"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange("en")}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                lang === "en"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            onClick={handleEnhance}
            disabled={enhancing}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-70"
          >
            {enhancing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <WandSparkles className="h-4 w-4" />
            )}
            <span className="hidden md:inline">
              {lang === "es" ? "Generar Texto IA" : "Generate AI Text"}
            </span>
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Link2 className="h-4 w-4" />
            <span className="hidden md:inline">
              {lang === "es" ? "Copiar Enlace" : "Copy Link"}
            </span>
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-70"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {exporting
              ? (lang === "es" ? "Exportando..." : "Exporting...")
              : (lang === "es" ? "Exportar PDF" : "Export PDF")}
          </button>
        </div>
      </div>

      {/* Split view */}
      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(420px,1fr)_1.1fr]">
        {/* Editor */}
        <div className="thin-scrollbar print-hidden overflow-y-auto border-b border-border bg-background px-4 py-6 sm:px-6 lg:border-b-0 lg:border-r">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {lang === "es" ? "Detalles de la propuesta" : "Proposal Details"}
          </p>
          <ProposalEditor
            data={data}
            update={update}
            onEnhance={handleEnhance}
            enhancing={enhancing}
          />
        </div>

        {/* Preview */}
        <div className="thin-scrollbar overflow-y-auto bg-muted p-4 sm:p-8">
          <ProposalPreview data={data} />
        </div>
      </div>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}
