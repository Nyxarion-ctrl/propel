import { generateText } from "ai"

export const maxDuration = 30

type Body = {
  projectTitle?: string
  scope?: string
  clientCompany?: string
}

export async function POST(req: Request) {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 })
  }

  const projectTitle = (body.projectTitle ?? "").trim()
  const scope = (body.scope ?? "").trim()
  const clientCompany = (body.clientCompany ?? "").trim()

  if (!projectTitle && !scope) {
    return Response.json(
      { error: "A project title or scope is required to generate text." },
      { status: 400 },
    )
  }

  const prompt = [
    "Write a compelling, professional executive summary for a commercial B2B web-agency proposal.",
    clientCompany ? `Client company: ${clientCompany}.` : "",
    projectTitle ? `Project title: ${projectTitle}.` : "",
    scope ? `Scope of work / deliverables:\n${scope}` : "",
    "",
    "Requirements:",
    "- One or two paragraphs, 90-140 words total.",
    "- Confident, persuasive, outcome-oriented tone that builds trust.",
    "- Focus on business value and results, not a list of tasks.",
    "- Do not use markdown, headings, bullet points, or a greeting/sign-off.",
    "- Return only the summary prose.",
  ]
    .filter(Boolean)
    .join("\n")

  try {
    const { text } = await generateText({
      // Runs on Groq's fast inference via the Vercel AI Gateway.
      model: "openai/gpt-oss-120b",
      prompt,
      temperature: 0.7,
      providerOptions: {
        gateway: {
          only: ["groq"],
        },
      },
    })

    const summary = text.trim()
    if (!summary) {
      return Response.json(
        { error: "The model returned an empty response. Please try again." },
        { status: 502 },
      )
    }

    return Response.json({ summary })
  } catch (err) {
    console.log("[v0] generate-summary error:", err)
    return Response.json(
      { error: "Failed to generate text. Please try again." },
      { status: 500 },
    )
  }
}
