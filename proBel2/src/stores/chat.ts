// src/stores/chat.ts
import { defineStore } from "pinia";

// Define message structure
export interface Message {
  role: "user" | "assistant";
  content: string;
}

// Define store state structure
interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  selectedProvider: "anthropic" | "openai" | "google"; // Extend as needed
  selectedModel: string | null; // Specific model for the provider
}

export const useChatStore = defineStore("chat", {
  state: (): ChatState => ({
    messages: [], // Start with empty messages
    isLoading: false,
    error: null,
    selectedProvider: "anthropic", // Default provider
    selectedModel: null, // Or set a default model like 'claude-3-haiku-20240307'
  }),

  getters: {
    getMessages: (state): Message[] => state.messages,
    getIsLoading: (state): boolean => state.isLoading,
    getError: (state): string | null => state.error,
  },

  actions: {
    clearError() {
      this.error = null;
    },

    // Action to send message and get response
    async sendMessage(prompt: string) {
      if (!prompt || this.isLoading) return;

      this.isLoading = true;
      this.error = null;

      // 1. Add user message to state
      this.messages.push({ role: "user", content: prompt });

      // Prepare data for the backend API function
      const requestData = {
        provider: this.selectedProvider,
        model: this.selectedModel, // Send null or specific model
        // Send relevant message history (could be all, or truncated)
        // Be mindful of context window limits for different models
        messages: this.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      };

      try {
        // 2. Call our Vercel Edge Function endpoint
        console.log("Sending to /api/chat:", requestData);
        const response = await fetch("/api/chat", {
          // Relative path works with vercel dev
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Failed to parse error response" }));
          throw new Error(
            errorData?.error || `HTTP error! status: ${response.status}`
          );
        }

        const responseData = await response.json();

        // 3. Add assistant response to state
        if (responseData.reply) {
          this.messages.push({
            role: "assistant",
            content: responseData.reply,
          });
        } else {
          throw new Error("Received empty reply from backend");
        }
      } catch (err: any) {
        console.error("Error sending message:", err);
        this.error = err.message || "Failed to get response from AI";
        // Optionally remove the user's message if the API call failed?
        // Or add an error message to the chat?
        this.messages.push({
          role: "assistant",
          content: `Error: ${this.error}`,
        });
      } finally {
        this.isLoading = false;
      }
    },

    // Action to clear chat (optional)
    clearChat() {
      this.messages = [];
      this.error = null;
      this.isLoading = false;
    },

    // Action to update provider (optional)
    setProvider(provider: ChatState["selectedProvider"]) {
      this.selectedProvider = provider;
      // maybe clear chat or reset model when provider changes?
      // this.clearChat();
      this.selectedModel = null; // Reset model when provider changes
    },
  },
});
