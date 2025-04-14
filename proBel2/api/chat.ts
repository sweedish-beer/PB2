// /api/chat.ts (Vercel Edge Function - Multi-Provider Capable)

import type { RequestContext } from "@vercel/edge";

export const config = {
  runtime: "edge",
};

// --- Interfaces ---
// Expected from Frontend
interface FrontendRequestBody {
  provider: "anthropic" | "openai" | "google"; // Add more as needed
  model?: string; // Optional model override from frontend
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
    // Avoid exposing exact missing key in production error messages if desired
    throw new Error(`Configuration error: Service unavailable.`);
  }
  return value;
}

// --- Provider-Specific Logic ---

// == ANTHROPIC ==
async function handleAnthropic(
  messages: Message[],
  apiKey: string,
  model?: string
): Promise<{ reply: string; model: string }> {
  // <-- Updated return type
  const anthropicEndpoint = "https://api.anthropic.com/v1/messages";
  // Determine the actual model name used
  const modelToUse = model || "claude-3-haiku-20240307"; // Default Anthropic model

  // Convert messages to Anthropic format
  const anthropicMessages = messages
    .filter((msg) => msg.role === "user" || msg.role === "assistant")
    .map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

  const requestBody = {
    model: modelToUse, // Pass the determined model name
    messages: anthropicMessages,
    max_tokens: 1024,
    // Add temperature, system prompt etc. if needed
  };

  console.log(
    `Sending to Anthropic (${modelToUse}):`,
    // Avoid logging full message content in production if sensitive
    `${anthropicMessages.length} messages`
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
    // Avoid sending detailed API error back to frontend if sensitive
    throw new Error(`Anthropic API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  // console.log("Anthropic Response Body:", JSON.stringify(data)); // Be careful logging full responses

  // Extract reply text
  if (
    data.content &&
    Array.isArray(data.content) &&
    data.content[0]?.type === "text"
  ) {
    const replyText = data.content[0].text;
    // --- Return object with reply AND model name ---
    return { reply: replyText, model: modelToUse }; // <-- Return object
  }
  console.error(
    "Could not parse reply text from Anthropic response structure:",
    data
  );
  throw new Error("Could not parse reply from Anthropic response");
}

// == OPENAI (Placeholder) ==
async function handleOpenAI(
  messages: Message[],
  apiKey: string,
  model?: string
): Promise<{ reply: string; model: string }> {
  // <-- Updated return type
  console.warn("OpenAI handler not fully implemented");
  // Determine the actual model name used
  const modelToUse = model || "gpt-4o"; // Example placeholder model
  // TODO: Implement OpenAI logic here
  // 1. Endpoint: 'https://api.openai.com/v1/chat/completions'
  // 2. Body: { model: modelToUse, messages: messages, max_tokens: ... }
  // 3. Headers: { 'Authorization': `Bearer ${apiKey}` }
  // 4. Parse response: data.choices[0].message.content

  const replyText = "OpenAI response placeholder"; // Placeholder
  // --- Return object with reply AND model name ---
  return { reply: replyText, model: modelToUse }; // <-- Return object
}

// == GOOGLE (Placeholder) ==
async function handleGoogle(
  messages: Message[],
  apiKey: string,
  model?: string
): Promise<{ reply: string; model: string }> {
  // <-- Updated return type
  console.warn("Google Gemini handler not fully implemented");
  // Determine the actual model name used
  const modelToUse = model || "gemini-1.5-flash"; // Example placeholder model
  // TODO: Implement Google logic here
  // 1. Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${apiKey}`
  // 2. Body: { contents: formattedMessages } (requires specific formatting)
  // 3. Parse response: data.candidates[0].content.parts[0].text

  const replyText = "Google Gemini response placeholder"; // Placeholder
  // --- Return object with reply AND model name ---
  return { reply: replyText, model: modelToUse }; // <-- Return object
}

// --- Main Handler ---
export default async function handler(req: Request, context: RequestContext) {
  // Standardized response headers (including CORS)
  // Allow requests from your Vercel deployment URL and localhost for development
  const allowedOrigin =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5173" // Your Vite dev server port
      : process.env.VERCEL_URL // Vercel system environment variable for the deployment URL
      ? `https://${process.env.VERCEL_URL}`
      : "*"; // Fallback - be cautious with '*' in production

  const responseHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type", // Add others if needed (e.g., Authorization)
    "Access-Control-Allow-Credentials": "true", // If you plan to use cookies/auth headers
  };

  if (req.method === "OPTIONS") {
    // Handle CORS preflight requests
    return new Response(null, {
      status: 204, // No Content for preflight
      headers: responseHeaders, // Use standardized headers
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: responseHeaders, // Include CORS headers in error responses too
    });
  }

  try {
    // --- Authentication/Authorization Check (Placeholder) ---
    // If your chat requires users to be logged in via Supabase Auth,
    // you would typically verify a JWT token passed in the Authorization header here.
    // const token = req.headers.get('Authorization')?.split('Bearer ')[1];
    // if (!token) { throw new Error("Missing authentication token."); }
    // const { data: { user }, error } = await verifySupabaseToken(token); // Need a helper for this
    // if (error || !user) { throw new Error("Invalid or expired token."); }
    // console.log("Request authenticated for user:", user.id);
    // --- End Auth Check ---

    // Rename 'model' from body to 'requestedModel' for clarity vs. 'modelToUse'
    const {
      provider,
      model: requestedModel,
      messages,
    } = (await req.json()) as FrontendRequestBody;

    // Basic validation
    if (
      !provider ||
      !messages ||
      !Array.isArray(messages) ||
      messages.length === 0
    ) {
      return new Response(
        JSON.stringify({
          error: "Bad request: Missing or invalid provider or messages",
        }),
        {
          status: 400,
          headers: responseHeaders, // Include CORS headers
        }
      );
    }

    let apiKey: string;
    // --- Variable to hold the result object { reply: string; model: string } ---
    let result: { reply: string; model: string };

    // Route based on provider
    switch (provider) {
      case "anthropic":
        apiKey = getEnvVariable("ANTHROPIC_API_KEY");
        result = await handleAnthropic(messages, apiKey, requestedModel);
        break;
      case "openai":
        apiKey = getEnvVariable("OPENAI_API_KEY");
        result = await handleOpenAI(messages, apiKey, requestedModel); // Use placeholder impl
        break;
      case "google":
        apiKey = getEnvVariable("GOOGLE_API_KEY");
        result = await handleGoogle(messages, apiKey, requestedModel); // Use placeholder impl
        break;
      default:
        // Use `as any` to handle cases where provider might be something else unexpected
        const invalidProvider = provider as any;
        return new Response(
          JSON.stringify({ error: `Unsupported provider: ${invalidProvider}` }),
          {
            status: 400,
            headers: responseHeaders, // Include CORS headers
          }
        );
    }

    // --- Return successful response with BOTH 'reply' and 'model' fields ---
    return new Response(
      JSON.stringify({ reply: result.reply, model: result.model }),
      {
        status: 200,
        headers: responseHeaders, // Use standardized headers
      }
    );
  } catch (error: any) {
    console.error("Error processing chat request:", error);
    // Ensure error response also has CORS headers
    return new Response(
      JSON.stringify({ error: error.message || "An internal error occurred" }),
      {
        status: 500,
        headers: responseHeaders, // Include CORS headers
      }
    );
  }
}

// --- Optional: Supabase JWT Verification Helper (Example) ---
// Needs '@supabase/supabase-js' added as a dependency if used server-side
/*
import { createClient } from '@supabase/supabase-js';

async function verifySupabaseToken(token: string) {
    // You might need a service role key here if calling from edge function without user context
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, // Or VITE_SUPABASE_URL
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Needs Service Role Key env variable
    );
    return await supabaseAdmin.auth.getUser(token);
}
*/
