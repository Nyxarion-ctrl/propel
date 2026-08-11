import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, scope, tone = 'Profesional' } = await req.json();

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
            content: `Eres un experto en redacción comercial y gestión de proyectos. Genera una respuesta en formato JSON con dos campos:
1. "summary": Un resumen ejecutivo conciso en un tono ${tone}. Sin frases introductorias ni saludos.
2. "deliverables": Un arreglo de 3 a 5 strings que representen los entregables clave del proyecto basándote en el título y alcance.

Responde ÚNICAMENTE en formato JSON estricto con la siguiente estructura:
{
  "summary": "texto del resumen",
  "deliverables": ["Entregable 1", "Entregable 2", "Entregable 3"]
}`,
          },
          {
            role: 'user',
            content: `Título del proyecto: ${title}\nAlcance: ${scope}`,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Error con la API de Groq' }, { status: status });
    }

    const content = JSON.parse(data.choices[0]?.message?.content || '{}');
    return NextResponse.json({
      summary: content.summary || '',
      deliverables: content.deliverables || [],
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
