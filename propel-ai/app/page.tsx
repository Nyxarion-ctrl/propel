'use client'

import React, { useState } from 'react'

// Diccionarios de Idioma
const uiTranslations = {
  es: {
    editFor: "Editando para",
    generateAI: "Generar Texto IA",
    copyLink: "Copiar Enlace",
    exportPDF: "Exportar PDF",
    proposalDetails: "DETALLES DE LA PROPUESTA",
    companyLogo: "Logo de la Empresa",
    logoDesc: "PNG, JPG o SVG. Se muestra en el encabezado.",
    uploadLogo: "Subir logo",
    clientProviderTitle: "Información de Cliente y Proveedor",
    clientName: "Nombre del Cliente",
    clientCompany: "Empresa del Cliente",
    providerName: "Nombre del Proveedor",
    date: "Fecha",
    validUntil: "Válida hasta",
    scopeTitle: "Alcance del Trabajo",
    projectTitle: "Título del Proyecto",
    previewDraft: "BORRADOR",
    issued: "Emitido",
    validity: "Válido hasta",
    commercialProposal: "PROPUESTA COMERCIAL",
    preparedFor: "PREPARADO PARA",
    preparedBy: "PREPARADO POR",
    execSummaryTitle: "RESUMEN EJECUTIVO",
    scopeDeliverablesTitle: "ALCANCE Y ENTREGABLES"
  },
  en: {
    editFor: "Editing for",
    generateAI: "Generate AI Text",
    copyLink: "Copy Link",
    exportPDF: "Export PDF",
    proposalDetails: "PROPOSAL DETAILS",
    companyLogo: "Company Logo",
    logoDesc: "PNG, JPG or SVG. Shown on the proposal header.",
    uploadLogo: "Upload logo",
    clientProviderTitle: "Client & Provider Info",
    clientName: "Client Name",
    clientCompany: "Client Company",
    providerName: "Provider Name",
    date: "Date",
    validUntil: "Valid Until",
    scopeTitle: "Scope of Work",
    projectTitle: "Project Title",
    previewDraft: "DRAFT",
    issued: "Issued",
    validity: "Valid until",
    commercialProposal: "COMMERCIAL PROPOSAL",
    preparedFor: "PREPARADO PARA",
    preparedBy: "PREPARADO POR",
    execSummaryTitle: "EXECUTIVE SUMMARY",
    scopeDeliverablesTitle: "SCOPE & DELIVERABLES"
  }
}

// Plantillas por idioma para la vista previa
const defaultContents = {
  es: {
    title: "Propuesta de Rediseño Web para Acme Corp",
    summary: "El sitio web actual de Acme Corp ya no refleja la calidad de sus productos ni la ambición de su marca. Esta propuesta detalla un rediseño completo enfocado en una experiencia moderna y orientada a la conversión: una identidad visual renovada, un front-end más rápido y accesible, y una estructura de contenido que guíe a los visitantes hacia convertirse en clientes.",
    clientName: "Sarah Mitchell",
    clientCompany: "Acme Corp",
    providerName: "Jordan Rivera — PropelAI Studio"
  },
  en: {
    title: "Web Redesign Proposal for Acme Corp",
    summary: "Acme Corp's current website no longer reflects the quality of its products or the ambitions of its brand. This proposal outlines a complete redesign focused on a modern, conversion-oriented experience: a refreshed visual identity, a faster and more accessible front-end, and a content structure that guides visitors toward becoming customers.",
    clientName: "Sarah Mitchell",
    clientCompany: "Acme Corp",
    providerName: "Jordan Rivera — PropelAI Studio"
  }
}

export default function PropelApp() {
  const [lang, setLang] = useState<'es' | 'en'>('es')

  // Datos del formulario vinculados al idioma actual por defecto
  const [proposalData, setProposalData] = useState({
    title: defaultContents.es.title,
    clientName: defaultContents.es.clientName,
    clientCompany: defaultContents.es.clientCompany,
    providerName: defaultContents.es.providerName,
    date: '2026-08-10',
    validUntil: '2026-09-10',
    summary: defaultContents.es.summary
  })

  const t = uiTranslations[lang]

  // Cambiar idioma y actualizar textos por defecto si no han sido modificados manualmente
  const handleLanguageChange = (newLang: 'es' | 'en') => {
    setLang(newLang)
    setProposalData(prev => ({
      ...prev,
      title: defaultContents[newLang].title,
      summary: defaultContents[newLang].summary
    }))
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col">
      {/* HEADER DE LA APP */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white font-bold px-2.5 py-1 rounded-lg text-sm">
            PropelAI
          </div>
          <span className="text-xs text-slate-400 font-medium">Proposal Builder v1.0</span>
        </div>

        <div className="flex items-center gap-3">
          {/* TOGGLE IDIOMA ES / EN */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 text-xs font-semibold border border-slate-200">
            <button
              onClick={() => handleLanguageChange('es')}
              className={`px-3 py-1 rounded-md transition-all ${lang === 'es' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500'}`}
            >
              ES
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-3 py-1 rounded-md transition-all ${lang === 'en' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500'}`}
            >
              EN
            </button>
          </div>

          <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 border border-slate-200 bg-white px-3 py-2 rounded-lg hover:bg-slate-50 transition">
            ✨ {t.generateAI}
          </button>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 border border-slate-200 bg-white px-3 py-2 rounded-lg hover:bg-slate-50 transition">
            🔗 {t.copyLink}
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition">
            {t.exportPDF}
          </button>
        </div>
      </header>

      {/* BARRA SECUNDARIA */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">{proposalData.title}</span> — {t.editFor} <span className="text-slate-700 font-medium">{proposalData.clientCompany}</span>
      </div>

      {/* MAIN CONTAINER (EDITOR Y PREVIEW) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* PANEL IZQUIERDO: FORMULARIO */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-slate-200 bg-white space-y-6">
          <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase">{t.proposalDetails}</h2>

          {/* LOGO BOX */}
          <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50/50">
            <div>
              <p className="text-sm font-semibold text-slate-800">{t.companyLogo}</p>
              <p className="text-xs text-slate-400">{t.logoDesc}</p>
            </div>
            <button className="bg-indigo-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition">
              {t.uploadLogo}
            </button>
          </div>

          {/* SECCIÓN CLIENTE Y PROVEEDOR */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              👤 {t.clientProviderTitle}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">{t.clientName}</label>
                <input
                  type="text"
                  value={proposalData.clientName}
                  onChange={e => setProposalData({ ...proposalData, clientName: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">{t.clientCompany}</label>
                <input
                  type="text"
                  value={proposalData.clientCompany}
                  onChange={e => setProposalData({ ...proposalData, clientCompany: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">{t.providerName}</label>
              <input
                type="text"
                value={proposalData.providerName}
                onChange={e => setProposalData({ ...proposalData, providerName: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">{t.date}</label>
                <input
                  type="date"
                  value={proposalData.date}
                  onChange={e => setProposalData({ ...proposalData, date: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">{t.validUntil}</label>
                <input
                  type="date"
                  value={proposalData.validUntil}
                  onChange={e => setProposalData({ ...proposalData, validUntil: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN ALCANCE DE TRABAJO */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              📋 {t.scopeTitle}
            </h3>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">{t.projectTitle}</label>
              <input
                type="text"
                value={proposalData.title}
                onChange={e => setProposalData({ ...proposalData, title: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: VISTA PREVIA DE LA PROPUESTA */}
        <div className="w-full md:w-1/2 p-6 bg-slate-100 overflow-y-auto flex justify-center">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6 self-start">
            
            {/* ENCABEZADO DE LA PROPUESTA IMPRESA */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-600 text-white font-bold rounded-lg p-2 text-xs">P</span>
                <span className="font-bold text-slate-900 text-sm">PropelAI Studio</span>
              </div>
              <div className="text-right">
                <span className="bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  {t.previewDraft}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">{t.issued}: {proposalData.date}</p>
                <p className="text-[10px] text-slate-400">{t.validity}: {proposalData.validUntil}</p>
              </div>
            </div>

            <p className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">{t.commercialProposal}</p>

            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
              {proposalData.title}
            </h1>

            {/* PREPARADO PARA / POR */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{t.preparedFor}</p>
                <p className="font-bold text-slate-800 mt-1">{proposalData.clientName}</p>
                <p className="text-slate-500">{proposalData.clientCompany}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{t.preparedBy}</p>
                <p className="font-bold text-slate-800 mt-1">{proposalData.providerName}</p>
              </div>
            </div>

            {/* RESUMEN EJECUTIVO */}
            <div>
              <h3 className="text-xs font-extrabold text-slate-400 tracking-wider uppercase mb-2">
                {t.execSummaryTitle}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {proposalData.summary}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
