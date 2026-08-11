export type CurrencyCode = "USD" | "EUR" | "DOP"

export type LineItem = {
  id: string
  description: string
  amount: number
}

export type ProposalData = {
  // Branding
  logoDataUrl: string
  // Section A — Client & Provider
  clientName: string
  clientCompany: string
  providerName: string
  date: string
  validUntil: string
  // Section B — Scope of Work
  projectTitle: string
  executiveSummary: string
  deliverables: string[]
  // Section C — Pricing & Timeline
  timelineWeeks: number
  currency: CurrencyCode
  lineItems: LineItem[]
  taxPercent: number
  paymentSchedule: string
  // Section D — Terms & Payment
  paymentTerms: string
  revisionPolicy: string
}

export const CURRENCIES: Record<
  CurrencyCode,
  { symbol: string; label: string; locale: string }
> = {
  USD: { symbol: "$", label: "US Dollar", locale: "en-US" },
  EUR: { symbol: "€", label: "Euro", locale: "de-DE" },
  DOP: { symbol: "RD$", label: "Dominican Peso", locale: "es-DO" },
}

export function formatCurrency(amount: number, currency: CurrencyCode) {
  const { locale } = CURRENCIES[currency]
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) ? amount : 0)
  } catch {
    return `${CURRENCIES[currency].symbol}${(amount || 0).toFixed(2)}`
  }
}

export function computeTotals(data: ProposalData) {
  const subtotal = data.lineItems.reduce(
    (sum, item) => sum + (Number.isFinite(item.amount) ? item.amount : 0),
    0,
  )
  const tax = subtotal * (data.taxPercent / 100)
  const total = subtotal + tax
  return { subtotal, tax, total }
}

let idCounter = 0
export function newId(prefix = "item") {
  idCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`
}

export const defaultProposal: ProposalData = {
  logoDataUrl: "",
  clientName: "Sarah Mitchell",
  clientCompany: "Acme Corp",
  providerName: "Jordan Rivera — PropelAI Studio",
  date: "2026-08-10",
  validUntil: "2026-09-10",
  projectTitle: "Web Redesign Proposal for Acme Corp",
  executiveSummary:
    "Acme Corp's current website no longer reflects the quality of its products or the ambitions of its brand. This proposal outlines a complete redesign focused on a modern, conversion-oriented experience: a refreshed visual identity, a faster and more accessible front-end, and a content structure that guides visitors toward becoming customers. Our goal is a site that feels effortless to use and measurably improves lead generation.",
  deliverables: [
    "Discovery workshop & competitive audit",
    "UX wireframes for all key page templates",
    "High-fidelity UI design system in Figma",
    "Responsive front-end build (desktop, tablet, mobile)",
    "CMS integration & content migration",
    "Analytics setup and 30-day post-launch support",
  ],
  timelineWeeks: 8,
  currency: "USD",
  lineItems: [
    { id: "seed-1", description: "Discovery & Strategy", amount: 2400 },
    { id: "seed-2", description: "UX / UI Design", amount: 6800 },
    { id: "seed-3", description: "Front-end Development", amount: 9500 },
    { id: "seed-4", description: "CMS Integration & QA", amount: 3300 },
  ],
  taxPercent: 8,
  paymentSchedule: "50% deposit on signing · 50% on final delivery",
  paymentTerms:
    "50% deposit due upon signing to reserve the project slot. Remaining 50% due upon final delivery and before production handoff. Invoices are payable within 14 days via bank transfer.",
  revisionPolicy:
    "Two rounds of revisions are included at each major milestone (design and development). Additional revision rounds are billed at $95/hour and estimated in advance.",
}

export const AI_EXECUTIVE_SUMMARY =
  "Acme Corp stands at an inflection point: your product has outgrown a website that no longer tells your story with the confidence it deserves. We propose a strategic redesign engineered around a single objective — turning more of your visitors into qualified customers. By pairing a distinctive, trust-building visual identity with a lightning-fast, accessible front-end and a content architecture rooted in your buyers' decision journey, we will transform your site from a digital brochure into your most effective sales asset. Every design decision is measured against real business outcomes: lower bounce rates, higher engagement, and a demonstrable lift in inbound leads. The result is not merely a better-looking website, but a scalable growth platform your team can confidently build on for years to come."
