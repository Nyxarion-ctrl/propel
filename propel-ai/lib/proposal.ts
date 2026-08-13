export interface LineItem {
  id: string
  description: string
  amount: number
}

export interface ProposalData {
  clientName: string
  clientCompany: string
  providerName: string
  date: string
  validUntil: string
  projectTitle: string
  executiveSummary: string
  deliverables: string[]
  estimatedWeeks: number
  currency: string
  lineItems: LineItem[]
  taxRate: number
  paymentTerms: string
  revisionPolicy: string
  companyLogoUrl?: string
}

export const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "DOP", symbol: "RD$", label: "DOP (RD$)" },
]

export const defaultProposalES: ProposalData = {
  clientName: "Sarah Mitchell",
  clientCompany: "Acme Corp",
  providerName: "Jordan Rivera — PropelAI Studio",
  date: "2026-08-10",
  validUntil: "2026-09-10",
  projectTitle: "Propuesta de Rediseño Web para Acme Corp",
  executiveSummary:
    "El sitio web actual de Acme Corp ya no refleja la calidad de sus productos ni la ambición de su marca. Esta propuesta detalla un rediseño completo enfocado en una experiencia moderna y orientada a la conversión: una identidad visual renovada, un front-end más rápido y accesible, y una estructura de contenido que guíe a los visitantes hacia convertirse en clientes.",
  deliverables: [
    "Taller de descubrimiento y auditoría competitiva",
    "Wireframes UX para todas las plantillas de página clave",
    "Sistema de diseño UI de alta fidelidad en Figma",
    "Desarrollo front-end responsivo (escritorio, tablet, móvil)",
    "Integración CMS y migración de contenido",
    "Configuración de analítica y soporte post-lanzamiento por 30 días",
  ],
  estimatedWeeks: 6,
  currency: "USD",
  lineItems: [
    { id: "1", description: "Descubrimiento, Estrategia y Wireframing UX", amount: 2500 },
    { id: "2", description: "Diseño de Interfaz (UI) y Sistema de Diseño", amount: 3500 },
    { id: "3", description: "Desarrollo Front-End e Integración CMS", amount: 4800 },
    { id: "4", description: "Pruebas QA, Analítica y Despliegue", amount: 1200 },
  ],
  taxRate: 0,
  paymentTerms:
    "Depósito del 50% al iniciar el proyecto, 30% tras la aprobación del diseño, y 20% restante antes del lanzamiento final.",
  revisionPolicy:
    "Incluye hasta 2 rondas de revisiones por etapa (Diseño y Desarrollo). Revisiones adicionales se facturarán a la tarifa por hora acordada.",
}

export const defaultProposalEN: ProposalData = {
  clientName: "Sarah Mitchell",
  clientCompany: "Acme Corp",
  providerName: "Jordan Rivera — PropelAI Studio",
  date: "2026-08-10",
  validUntil: "2026-09-10",
  projectTitle: "Web Redesign Proposal for Acme Corp",
  executiveSummary:
    "Acme Corp's current website no longer reflects the quality of its products or the ambitions of its brand. This proposal outlines a complete redesign focused on a modern, conversion-oriented experience: a refreshed visual identity, a faster and more accessible front-end, and a content structure that guides visitors toward becoming customers.",
  deliverables: [
    "Discovery workshop & competitive audit",
    "UX wireframes for all key page templates",
    "High-fidelity UI design system in Figma",
    "Responsive front-end build (desktop, tablet, mobile)",
    "CMS integration & content migration",
    "Analytics setup and 30-day post-launch support",
  ],
  estimatedWeeks: 6,
  currency: "USD",
  lineItems: [
    { id: "1", description: "Discovery, Strategy & UX Wireframing", amount: 2500 },
    { id: "2", description: "UI Design & Design System", amount: 3500 },
    { id: "3", description: "Front-End Development & CMS Integration", amount: 4800 },
    { id: "4", description: "QA Testing, Analytics & Deployment", amount: 1200 },
  ],
  taxRate: 0,
  paymentTerms:
    "50% deposit upon project kickoff, 30% upon design approval, and 20% prior to final launch.",
  revisionPolicy:
    "Includes up to 2 rounds of revisions per milestone (Design & Development). Additional revisions billed at standard hourly rate.",
}

export function computeTotals(lineItems: LineItem[], taxRate: number) {
  const subtotal = lineItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0)
  const tax = subtotal * ((Number(taxRate) || 0) / 100)
  const total = subtotal + tax
  return { subtotal, tax, total }
}

export function formatCurrency(amount: number, currencyCode: string) {
  const curr = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0]
  return `${curr.symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
