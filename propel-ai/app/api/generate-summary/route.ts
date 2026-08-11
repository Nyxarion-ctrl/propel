import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, scope } = await req.json();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en redacción comercial. Genera directamente un resumen ejecutivo profesional y conciso para la propuesta de proyecto. NO incluyas saludos, ni frases introductorias como "Aquí tienes" o "A continuación". Comienza directamente con el texto formal del resumen.',
          },
          {
            role: 'user',
            content: `Título del proyecto: ${title}\nAlcance: ${scope}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Error con la API de Groq' }, { status: response.status });
    }

    const summary = data.choices[0]?.message?.content || '';
    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
