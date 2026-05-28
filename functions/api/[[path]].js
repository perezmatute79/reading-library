export async function onRequest(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(request.url);
  const path = url.pathname;

  // ── KV Storage endpoints ──────────────────────────────────────────
  // GET /api/library  → load full library
  if (request.method === "GET" && path === "/api/library") {
    const data = await env.LIBRARY_KV.get("reading_library");
    return new Response(data || "[]", {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // POST /api/library  → save full library
  if (request.method === "POST" && path === "/api/library") {
    const body = await request.text();
    await env.LIBRARY_KV.put("reading_library", body);
    return new Response('{"ok":true}', {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ── Anthropic proxy endpoint ──────────────────────────────────────
  // POST /api/claude  → forward to Anthropic, inject API key server-side
  if (request.method === "POST" && path === "/api/claude") {
    const body = await request.json();

    const anthropicResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "web-search-2025-03-05",
      },
      body: JSON.stringify(body),
    });

    const data = await anthropicResp.json();
    return new Response(JSON.stringify(data), {
      status: anthropicResp.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response("Not found", { status: 404, headers: corsHeaders });
}
