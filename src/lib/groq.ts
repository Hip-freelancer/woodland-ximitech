const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

export async function callGroqJson(systemPrompt: string, userPrompt: string) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Thiếu GROQ_API_KEY.");
  }

  const response = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | {
        choices?: Array<{
          message?: {
            content?: string;
          };
        }>;
        error?: {
          message?: string;
        };
      }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Không gọi được Groq API.");
  }

  const content = payload?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq không trả về nội dung hợp lệ.");
  }

  return JSON.parse(content) as Record<string, unknown>;
}
