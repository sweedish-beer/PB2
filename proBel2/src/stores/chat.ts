// src/stores/chat.ts
import { defineStore } from "pinia";
import { supabase } from "@/services/supabase"; // <-- Import Supabase client (adjust path if needed)
import { useAuthStore } from "./auth"; // <-- Import Auth store to get user ID

// 1. Update Message Interface to include model and potentially ID from DB
export interface Message {
  id?: string; // Optional: Store DB id locally if needed
  role: "user" | "assistant" | "error"; // Added 'error' role for clarity
  content: string;
  model?: string | null; // Optional: To store AI model name
  created_at?: string | Date; // Optional: Store timestamp
}

// Define store state structure
export interface ChatState {
  messages: Message[];
  isLoadingHistory: boolean; // Specific loading state for history
  isLoadingReply: boolean; // Specific loading state for AI reply
  error: string | null;
  selectedProvider: "anthropic" | "openai" | "google";
  selectedModel: string | null;
}

export const useChatStore = defineStore("chat", {
  state: (): ChatState => ({
    messages: [],
    isLoadingHistory: false, // Initialize history loading state
    isLoadingReply: false, // Initialize reply loading state
    error: null,
    selectedProvider: "anthropic",
    selectedModel: null, // e.g., 'claude-3-haiku-20240307'
  }),

  getters: {
    getMessages: (state): Message[] => state.messages,
    // Combine loading states or keep separate as needed by UI
    getIsLoading: (state): boolean =>
      state.isLoadingHistory || state.isLoadingReply,
    getIsLoadingHistory: (state): boolean => state.isLoadingHistory,
    getIsLoadingReply: (state): boolean => state.isLoadingReply,
    getError: (state): string | null => state.error,
  },

  actions: {
    clearError() {
      this.error = null;
    },

    // =============================================
    // NEW ACTION: Save Message to Supabase
    // =============================================
    async saveMessageToSupabase(message: Omit<Message, "id" | "created_at">) {
      const authStore = useAuthStore();
      const userId = authStore.user?.id;

      if (!userId) {
        console.error("User not logged in, cannot save message.");
        // Optionally set state.error, but avoid overwriting more critical errors
        return;
      }

      try {
        const messageData = {
          user_id: userId,
          role: message.role,
          content: message.content,
          // Only include model if it's an assistant message AND model is provided
          model:
            message.role === "assistant" && message.model
              ? message.model
              : null,
        };

        const { data, error } = await supabase
          .from("chat_messages") // Ensure this matches your table name
          .insert([messageData])
          .select("id, created_at") // Optionally get back the generated ID and timestamp
          .single(); // Assuming insert returns the single created row

        if (error) {
          throw error; // Throw error to be caught below
        }

        console.log("Message saved to Supabase:", data);
        // Optional: Update local message state with DB id/timestamp if needed
        // const localMessageIndex = this.messages.findIndex(m => m === message); // Needs object reference stability
        // if (localMessageIndex > -1 && data) {
        //   this.messages[localMessageIndex].id = data.id;
        //   this.messages[localMessageIndex].created_at = data.created_at;
        // }
      } catch (err: any) {
        console.error("Error saving message to Supabase:", err);
        this.error = `Failed to save message: ${err.message}`;
        // Decide if you want to remove the local message bubble if save fails
      }
    },

    // =============================================
    // NEW ACTION: Load Chat History from Supabase
    // =============================================
    async loadChatHistory() {
      const authStore = useAuthStore();
      const userId = authStore.user?.id;

      if (!userId) {
        console.log("User not logged in, cannot load history.");
        this.messages = []; // Clear messages if user logs out/isn't logged in
        return;
      }

      console.log("Loading chat history for user:", userId);
      this.isLoadingHistory = true;
      this.error = null;
      // Keep existing messages while loading? Or clear first?
      // this.messages = []; // Option 1: Clear messages immediately

      try {
        const { data, error } = await supabase
          .from("chat_messages")
          .select("id, role, content, model, created_at") // Select columns
          .eq("user_id", userId) // Filter by user
          .order("created_at", { ascending: true }); // Order chronologically

        if (error) {
          throw error; // Throw error to be caught below
        }

        // Option 2: Replace messages only on successful load
        this.messages = data || [];
        console.log("Chat history loaded:", this.messages.length);
      } catch (err: any) {
        console.error("Error loading chat history:", err);
        this.error = `Failed to load history: ${err.message}`;
        this.messages = []; // Clear messages on error
      } finally {
        this.isLoadingHistory = false;
      }
    },

    // =============================================
    // MODIFIED ACTION: sendMessage
    // =============================================
    async sendMessage(prompt: string) {
      if (!prompt || this.isLoadingReply) return; // Check reply loading state

      // --- Get User ID (needed for saving) ---
      const authStore = useAuthStore();
      if (!authStore.user?.id) {
        this.error = "You must be logged in to chat.";
        return;
      }

      this.isLoadingReply = true; // Use specific loading state
      this.error = null;

      // 1. Add user message to local state
      const userMessage: Message = { role: "user", content: prompt };
      this.messages.push(userMessage);

      // 2. Save user message to Supabase (async, don't necessarily wait)
      this.saveMessageToSupabase(userMessage); // Call the new action

      // Prepare data for the backend API function
      const requestData = {
        provider: this.selectedProvider,
        model: this.selectedModel,
        // Send message history - consider context window limits!
        // Maybe truncate or summarize older messages
        messages: this.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      };

      try {
        // 3. Call Vercel Edge Function endpoint
        console.log("Sending to /api/chat:", requestData);
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Failed to parse error" }));
          throw new Error(
            errorData?.error || `HTTP error! status: ${response.status}`
          );
        }

        const responseData = await response.json();
        console.log("Received from /api/chat:", responseData);

        // =============================================
        // >>>>> CRITICAL CHANGE <<<<<
        // Expect 'reply' AND 'model' from API response
        // =============================================
        if (responseData.reply && responseData.model) {
          // 4. Add assistant response to local state
          const assistantMessage: Message = {
            role: "assistant",
            content: responseData.reply,
            model: responseData.model, // Store the model name
          };
          this.messages.push(assistantMessage);

          // 5. Save assistant message to Supabase (async)
          this.saveMessageToSupabase(assistantMessage); // Call the new action
        } else {
          // Handle missing reply or model
          let errMsg = "Received invalid response from backend.";
          if (!responseData.reply) errMsg += " (Missing reply)";
          if (!responseData.model) errMsg += " (Missing model name)";
          console.error(errMsg, responseData);
          throw new Error(errMsg);
        }
      } catch (err: any) {
        console.error("Error sending message:", err);
        const errorMessageContent = `Sorry, an error occurred: ${
          err.message || "Failed to get response"
        }`;
        this.error = errorMessageContent;

        // Add an error message bubble to the chat
        const errorMessage: Message = {
          role: "error",
          content: errorMessageContent,
        };
        this.messages.push(errorMessage);
        // Optionally save error message to Supabase (e.g., with role 'error')
        // this.saveMessageToSupabase(errorMessage);
      } finally {
        this.isLoadingReply = false;
      }
    },

    // --- Existing Actions (clearChat, setProvider) ---
    clearChat() {
      // Optional: Also clear from Supabase? Or just local view?
      // For now, just clears local state:
      this.messages = [];
      this.error = null;
      this.isLoadingHistory = false;
      this.isLoadingReply = false;
      // Maybe call loadChatHistory() again if you want to reset to persisted state?
    },

    setProvider(provider: ChatState["selectedProvider"]) {
      this.selectedProvider = provider;
      this.selectedModel = null;
      // Consider if changing provider should clear messages or trigger history reload
      // this.messages = [];
      // this.loadChatHistory();
    },
  },
});
