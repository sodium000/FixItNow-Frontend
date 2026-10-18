import {
  AnthropicConfigurationError,
  askAnthropic,
} from "@/lib/anthropic";

type PublicService = {
  id: string;
  name: string;
  category: string;
  description: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!isRecord(body) || typeof body.query !== "string" || !Array.isArray(body.services)) {
    return Response.json(
      { error: "A service need and service list are required." },
      { status: 400 },
    );
  }

  const query = body.query.trim();
  if (!query || query.length > 500) {
    return Response.json(
      { error: "Describe what you need in 1 to 500 characters." },
      { status: 400 },
    );
  }

  if (body.services.length === 0 || body.services.length > 30) {
    return Response.json(
      { error: "Recommendations require between 1 and 30 available services." },
      { status: 400 },
    );
  }

  const services: PublicService[] = [];
  for (const service of body.services) {
    if (
      !isRecord(service) ||
      typeof service.id !== "string" ||
      typeof service.name !== "string" ||
      typeof service.category !== "string" ||
      typeof service.description !== "string"
    ) {
      return Response.json(
        { error: "The service list contains invalid data." },
        { status: 400 },
      );
    }

    services.push({
      id: service.id.slice(0, 80),
      name: service.name.slice(0, 120),
      category: service.category.slice(0, 80),
      description: service.description.slice(0, 240),
    });
  }

  const serviceCatalog = services
    .map(
      (service) =>
        `id=${JSON.stringify(service.id)}; name=${JSON.stringify(service.name)}; category=${JSON.stringify(service.category)}; description=${JSON.stringify(service.description)}`,
    )
    .join("\n");

  try {
    const recommendation = await askAnthropic(
      'You recommend only home services from the supplied catalog. Respond with valid JSON only, using exactly this shape: {"serviceIds":["catalog id"],"reason":"short explanation"}. Rank up to five relevant services. Never invent IDs; if nothing fits, return an empty serviceIds array and explain why.',
      `User's service need: ${query}\n\nAvailable services:\n${serviceCatalog}`,
    );

    let parsed: unknown;
    try {
      parsed = JSON.parse(recommendation);
    } catch {
      return Response.json(
        { error: "The recommendation service returned an invalid result." },
        { status: 502 },
      );
    }

    if (
      !isRecord(parsed) ||
      !Array.isArray(parsed.serviceIds) ||
      typeof parsed.reason !== "string"
    ) {
      return Response.json(
        { error: "The recommendation service returned an invalid result." },
        { status: 502 },
      );
    }

    const allowedIds = new Set(services.map((service) => service.id));
    const serviceIds = parsed.serviceIds.filter(
      (id): id is string => typeof id === "string" && allowedIds.has(id),
    );
    if (serviceIds.length === 0) {
      return Response.json(
        { error: parsed.reason.slice(0, 300) || "No matching services were found." },
        { status: 200 },
      );
    }

    return Response.json({
      serviceIds: [...new Set(serviceIds)].slice(0, 5),
      reason: parsed.reason.slice(0, 300),
    });
  } catch (error) {
    if (error instanceof AnthropicConfigurationError) {
      return Response.json({ error: error.message }, { status: 503 });
    }
    console.error("AI service recommendation request failed:", error);
    return Response.json(
      { error: "AI recommendations are temporarily unavailable. Please try again." },
      { status: 502 },
    );
  }
}
