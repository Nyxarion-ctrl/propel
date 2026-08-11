import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { title, clientName, description, language = 'en' } = await req.json()

    // Selecciona el idioma para el resultado de la IA
    const targetLanguage = language === 'es' ? 'Spanish' : 'English'

    const systemPrompt = `You are a world-class business consultant and copywriter.
Generate a comprehensive, highly persuasive business proposal document in ${targetLanguage}.
Format the output cleanly in HTML (using h1, h2, h3, ul, ol, p, table tags where applicable).
Do not include any conversational intro or markdown backticks in the response.`

    const userPrompt = `Project Title: ${title}
Client Name: ${clientName}
Project Requirements / Description: ${description}

Please draft a complete commercial proposal including:
1. Executive Summary
2. Scope of Work & Deliverables
3. Project Timeline & Milestones
4. Estimated Investment & Pricing Table
5. Terms & Next Steps`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
      }),
    })

    const data = await response.json()
    const proposalContent = data.choices?.[0]?.message?.content || ''

    return NextResponse.json({ content: proposalContent })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate proposal' }, { status: 500 })
  }
}
