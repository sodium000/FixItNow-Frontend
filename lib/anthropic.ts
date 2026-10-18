export class AnthropicConfigurationError extends Error {
  constructor(message = "AI support is not configured. Set GROQ_API_KEY in your .env.local (Get a free key at https://console.groq.com).") {
    super(message);
    this.name = "AnthropicConfigurationError";
  }
}

export const AIConfigurationError = AnthropicConfigurationError;

/**
 * Ask AI using Groq (free, ultra-fast inference).
 * Also falls back to Anthropic if ANTHROPIC_API_KEY is configured.
 */
export async function askAnthropic(system: string, prompt: string): Promise<string> {
  const groqKey = process.env.GROQ_API_KEY;
  const groqModel = (process.env.GROQ_MODEL || "openai/gpt-oss-120b").trim();

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const anthropicModel = process.env.ANTHROPIC_MODEL;

  // 1. Prioritize Groq (Free & Fast)
  if (groqKey) {
    const candidateModels = [groqModel, "openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"];
    const uniqueModels = [...new Set(candidateModels)];

    let lastError = "";

    for (const model of uniqueModels) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          cache: "no-store",
          signal: AbortSignal.timeout(20_000),
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${groqKey.trim()}`,
          },
          body: JSON.stringify({
            model,
            max_tokens: 600,
            temperature: 0.2,
            messages: [
              { role: "system", content: system },
              { role: "user", content: prompt },
            ],
          }),
        });

        if (response.status === 404) {
          // Model not found on this Groq tier/account, try next model
          const errText = await response.text().catch(() => "");
          lastError = `Model ${model} not found: ${errText}`;
          continue;
        }

        if (!response.ok) {
          const errText = await response.text().catch(() => "");
          console.error("Groq API error:", response.status, errText);
          throw new Error(`Groq request failed with HTTP ${response.status}: ${errText}`);
        }

        const payload: unknown = await response.json();
        if (
          typeof payload === "object" &&
          payload !== null &&
          "choices" in payload &&
          Array.isArray((payload as { choices: unknown[] }).choices) &&
          (payload as { choices: Array<{ message?: { content?: string } }> }).choices.length > 0
        ) {
          const content = (payload as { choices: Array<{ message?: { content?: string } }> }).choices[0]?.message?.content;
          if (typeof content === "string" && content.trim()) {
            return content.trim();
          }
        }
      } catch (err) {
        if ((err as Error).message.includes("HTTP 404")) {
          continue;
        }
        throw err;
      }
    }

    throw new Error(`Groq request failed: ${lastError || "No valid model available"}`);
  }

  // 2. Fallback to Anthropic if configured
  if (anthropicKey && anthropicModel) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
      headers: {
        "content-type": "application/json",
        "x-api-key": anthropicKey.trim(),
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: anthropicModel.trim(),
        max_tokens: 500,
        system,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic request failed with HTTP ${response.status}.`);
    }

    const payload: unknown = await response.json();
    if (
      typeof payload === "object" &&
      payload !== null &&
      "content" in payload &&
      Array.isArray((payload as { content: unknown[] }).content)
    ) {
      const textBlock = (payload as { content: Array<{ type?: string; text?: string }> }).content.find(
        (block) => block.type === "text" && typeof block.text === "string",
      );

      if (textBlock?.text?.trim()) {
        return textBlock.text.trim();
      }
    }

    throw new Error("Anthropic returned an invalid response.");
  }

  // 3. Neither key is configured
  throw new AnthropicConfigurationError();
}

export const askAI = askAnthropic;
