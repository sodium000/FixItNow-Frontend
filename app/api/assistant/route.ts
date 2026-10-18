import {
  AnthropicConfigurationError,
  askAnthropic,
} from "@/lib/anthropic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const message =
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof body.message === "string"
      ? body.message.trim()
      : "";

  if (!message || message.length > 500) {
    return Response.json(
      { error: "Enter a question between 1 and 500 characters." },
      { status: 400 },
    );
  }

  try {
    const answer = await askAnthropic(
      "You are FixItNow's home-service support assistant. Give concise, practical guidance about booking, repairs, and maintenance. Do not claim a technician is booked, quote unverified prices, or request personal information. For gas, electrical, or other immediate safety risks, advise the user to leave the area and contact qualified emergency services. Remind users to confirm diagnosis and price with their technician.",
      message,
    );
    return Response.json({ answer });
  } catch (error) {
    if (error instanceof AnthropicConfigurationError) {
      return Response.json({ error: error.message }, { status: 503 });
    }
    console.error("Home-service assistant request failed:", error);
    return Response.json(
      { error: "The assistant is temporarily unavailable. Please try again." },
      { status: 502 },
    );
  }
}
