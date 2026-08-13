export type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "DOP"

export interface CurrencyOption {
  code: CurrencyCode
  symbol: string
  label: string
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "USD", symbol: "$", label: "USD — US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR — Euro" },
  { code: "GBP", symbol: "£", label: "GBP — British Pound" },
  { code: "CAD", symbol: "CA$", label: "CAD — Canadian Dollar" },
  { code: "AUD", symbol: "A$", label: "AUD — Australian Dollar" },
  { code: "DOP", symbol: "RD$", label: "DOP — Peso Dominicano" },
]

export interface Deliverable {
  id: string
  title: string
}

export interface LineItem {
  id: string
  description: string
  amount: number
}

export interface ProposalData {
  companyLogoUrl?: string
  clientName: string
  clientCompany: string
  providerName: string
  date: string
  validUntil: string
  projectTitle: string
  executiveSummary: string
  deliverables: string[]
  estimatedWeeks: number
  currency: CurrencyCode | string
  lineItems: LineItem[]
  taxRate: number
  paymentTerms: string
  revisionPolicy: string
}

export function computeTotals(lineItems: LineItem[] = [], taxRate: number = 0) {
  const items = Array.isArray(lineItems) ? lineItems : []
  const subtotal = items.reduce((acc, item) => acc + (item?.amount || 0), 0)
  const tax = (subtotal * (taxRate || 0)) / 100
  const total = subtotal + tax
  return { subtotal, tax, total }
}

export function formatCurrency(amount: number, currencyCode: string = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode || "USD",
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `$${(amount || 0).toFixed(2)}`
  }
}

export const defaultProposalES: ProposalData = {
  companyLogoUrl: "",
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
    "Wireframes de UX para las plantillas clave",
    "Sistema de diseño UI de alta fidelidad en Figma",
    "Desarrollo front-end responsivo (desktop, tablet, móvil)",
    "Integración CMS y migración de contenidos",
    "Configuración de analítica y 30 días de soporte post-lanzamiento",
  ],
  estimatedWeeks: 8,
  currency: "USD",
  lineItems: [
    { id: "1", description: "Descubrimiento y Estrategia", amount: 2400 },
    { id: "2", description: "Diseño UX / UI", amount: 6800 },
    { id: "3", description: "Desarrollo Front-end", amount: 9500 },
    { id: "4", description: "Integración CMS y Control de Calidad", amount: 3300 },
  ],
  taxRate: 8,
  paymentTerms:
    "50% de depósito al firmar para reservar el cupo del proyecto. El 50% restante al entregar la versión final antes del paso a producción. Facturas pagaderas en 14 días vía transferencia bancaria.",
  revisionPolicy:
    "Se incluyen dos rondas de revisiones en cada hito principal (diseño y desarrollo). Las rondas adicionales se facturan a $95/hora con estimación previa.",
}

export const defaultProposalEN: ProposalData = {
  companyLogoUrl: "",
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
  estimatedWeeks: 8,
  currency: "USD",
  lineItems: [
    { id: "1", description: "Discovery & Strategy", amount: 2400 },
    { id: "2", description: "UX / UI Design", amount: 6800 },
    { id: "3", description: "Front-end Development", amount: 9500 },
    { id: "4", description: "CMS Integration & QA", amount: 3300 },
  ],
  taxRate: 8,
  paymentTerms:
    "50% deposit due upon signing to reserve the project slot. Remaining 50% due upon final delivery and before production handoff. Invoices are payable within 14 days via bank transfer.",
  revisionPolicy:
    "Two rounds of revisions are included at each major milestone (design and development). Additional revision rounds are billed at $95/hour and estimated in advance.",
}

export const defaultProposal = defaultProposalES
