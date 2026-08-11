"use client"

import { useCallback, useState } from "react"
import { Download, Link2, WandSparkles, Loader2 } from "lucide-react"
import { type ProposalData, defaultProposal } from "@/lib/proposal"
import { AppHeader } from "@/components/app-header"
import { ProposalEditor } from "@/components/proposal-editor"
import { ProposalPreview } from "@/components/proposal-preview"
import { Toast } from "@/components/toast"

export function ProposalBuilder() {
  const [data, setData] = useState<ProposalData>(defaultProposal)
  const [enhancing, setEnhancing] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const update = useCallback((patch: Partial<ProposalData>) => {
    setData((prev) => ({ ...prev, ...patch }))
  }, [])

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
          title: data.projectTitle || "Propuesta Comercial",
          scope: scopeContent || "Rediseño y optimización de servicios",
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
      setToast("¡Resumen ejecutivo generado con Groq AI!")
    } catch (err) {
      console.log("[PropelAI] handleEnhance error:", err)
      setToast(
        err instanceof Error && err.message
          ? err.message
          : "No se pudo generar el texto. Intenta nuevamente.",
      )
    } finally {
      setEnhancing(false)
    }
  }, [data.projectTitle, data.deliverables, data.executiveSummary])

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
      setToast("¡PDF descargado con éxito!")
    } catch {
      window.print()
    } finally {
      setExporting(false)
    }
  }, [data.clientCompany])

  const handleCopyLink = useCallback(() => {
    const url =
      typeof window !== "undefined" ? window.location.href : "https://propelai.app"
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {})
    }
    setToast("¡Enlace copiado al portapapeles!")
  }, [])

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <AppHeader />

      {/* Action toolbar */}
      <div className="print-hidden flex items-center justify-between gap-4 border-b border-border bg-card/40 px-4 py-3 sm:px-6">
        <div className="hidden flex-col sm:flex">
          <span className="text-sm font-semibold text-foreground">
            {data.projectTitle || "Propuesta sin título"}
          </span>
          <span className="text-xs text-muted-foreground">
            Editando para {data.clientCompany || "tu cliente"}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
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
            <span className="hidden md:inline">Generar Texto IA</span>
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Link2 className="h-4 w-4" />
            <span className="hidden md:inline">Copiar Enlace</span>
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
            {exporting ? "Exportando..." : "Exportar PDF"}
          </button>
        </div>
      </div>

      {/* Split view */}
      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(420px,1fr)_1.1fr]">
        {/* Editor */}
        <div className="thin-scrollbar print-hidden overflow-y-auto border-b border-border bg-background px-4 py-6 sm:px-6 lg:border-b-0 lg:border-r">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Detalles de la propuesta
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
