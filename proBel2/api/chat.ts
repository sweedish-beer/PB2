// /api/chat.ts (Vercel Edge Function - Multi-Provider Capable)

import type { RequestContext } from "@vercel/edge";

export const config = {
  runtime: "edge",
};

// --- Interfaces ---
// Expected from Frontend
interface FrontendRequestBody {
  provider: "anthropic" | "openai" | "google"; // Add more as needed
  model?: string; // Optional model override
  messages: { role: "user" | "assistant"; content: string }[]; // Use 'assistant' consistently from frontend
  // Add other potential parameters like temperature, max_tokens if needed globally
}

// Common Message structure (used internally)
interface Message {
  role: "user" | "assistant" | "system"; // System role might be needed
  content: string;
}

// --- Helper: Get Environment Variable ---
function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`Missing environment variable: ${key}`);
    throw new Error(`Configuration error: Missing ${key}`);
  }
  return value;
}

// --- Provider-Specific Logic ---

// == ANTHROPIC ==
async function handleAnthropic(
  messages: Message[],
  apiKey: string,
  model?: string
) {
  const anthropicEndpoint = "https://api.anthropic.com/v1/messages";
  const modelToUse = model || "claude-3-haiku-20240307"; // Default Anthropic model

  // Convert messages to Anthropic format (user/assistant roles)
  // Anthropic API might require alternating user/assistant messages
  // You might need more sophisticated logic to handle consecutive messages of the same role if your frontend allows it.
  const anthropicMessages = messages
    .filter((msg) => msg.role === "user" || msg.role === "assistant") // Filter system for basic API
    .map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

  const requestBody = {
    model: modelToUse,
    messages: anthropicMessages,
    max_tokens: 1024, // Example: Set max tokens
    // Add temperature, system prompt etc. if needed
  };

  console.log(
    `Sending to Anthropic (${modelToUse}):`,
    JSON.stringify(requestBody.messages)
  );

  const response = await fetch(anthropicEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01", // Required Anthropic version header
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `Anthropic API Error: ${response.status} ${response.statusText}`,
      errorBody
    );
    throw new Error(
      `Anthropic API request failed: ${response.statusText} - ${errorBody}`
    );
  }

  const data = await response.json();
  console.log("Anthropic Response:", JSON.stringify(data));

  // Extract reply text (check Anthropic documentation for exact structure)
  // Usually in data.content[0].text for message API
  if (
    data.content &&
    Array.isArray(data.content) &&
    data.content[0]?.type === "text"
  ) {
    return data.content[0].text;
  }
  throw new Error("Could not parse reply text from Anthropic response");
}

// == OPENAI (Placeholder) ==
async function handleOpenAI(
  messages: Message[],
  apiKey: string,
  model?: string
) {
  console.warn("OpenAI handler not fully implemented");
  // TODO:
  // 1. Define OpenAI Endpoint (e.g., 'https://api.openai.com/v1/chat/completions')
  // 2. Get model (e.g., model || 'gpt-3.5-turbo')
  // 3. Format messages for OpenAI (user/assistant/system roles usually okay)
  // 4. Create request body (model, messages, max_tokens, etc.)
  // 5. Fetch: POST, Headers: {'Authorization': `Bearer ${apiKey}`}, Body: JSON.stringify(...)
  // 6. Parse response (e.g., data.choices[0].message.content)
  // 7. Return text
  return "OpenAI response placeholder"; // Placeholder
}

// == GOOGLE (Placeholder) ==
async function handleGoogle(
  messages: Message[],
  apiKey: string,
  model?: string
) {
  console.warn("Google Gemini handler not fully implemented");
  // TODO:
  // 1. Define Google Endpoint (e.g., `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent`)
  // 2. Get model (e.g., model || 'gemini-pro') - Needs to be part of URL
  // 3. Format messages for Google (role 'user'/'model', specific 'contents' structure)
  // 4. Create request body ({ contents: formattedMessages })
  // 5. Fetch: POST to URL + `?key=${apiKey}`, Body: JSON.stringify(...)
  // 6. Parse response (e.g., data.candidates[0].content.parts[0].text)
  // 7. Return text
  return "Google Gemini response placeholder"; // Placeholder
}

// --- Main Handler ---
export default async function handler(req: Request, context: RequestContext) {
  if (req.method === "OPTIONS") {
    // Handle CORS preflight requests
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400", // Cache preflight response for 1 day
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Standardized response headers (including CORS)
  const responseHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const { provider, model, messages } =
      (await req.json()) as FrontendRequestBody;

    if (!provider || !messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Bad request: Missing provider or messages" }),
        {
          status: 400,
          headers: responseHeaders,
        }
      );
    }

    let apiKey: string;
    let replyText: string;

    // Route based on provider
    switch (provider) {
      case "anthropic":
        apiKey = getEnvVariable("ANTHROPIC_API_KEY");
        replyText = await handleAnthropic(messages, apiKey, model);
        break;
      case "openai":
        apiKey = getEnvVariable("OPENAI_API_KEY");
        replyText = await handleOpenAI(messages, apiKey, model); // Use placeholder
        break;
      case "google":
        apiKey = getEnvVariable("GOOGLE_API_KEY");
        replyText = await handleGoogle(messages, apiKey, model); // Use placeholder
        break;
      default:
        return new Response(
          JSON.stringify({ error: `Unsupported provider: ${provider}` }),
          {
            status: 400,
            headers: responseHeaders,
          }
        );
    }

    // Return successful response
    return new Response(JSON.stringify({ reply: replyText }), {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error("Error in chat function:", error);
    // Ensure error response also has CORS headers
    return new Response(
      JSON.stringify({ error: error.message || "An internal error occurred" }),
      {
        status: 500,
        headers: responseHeaders,
      }
    );
  }
}
