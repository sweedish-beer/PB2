<template>
  <v-container fluid class="fill-height pa-0 chat-container">
    <v-row no-gutters class="fill-height">
      <v-col cols="12" class="d-flex flex-column">

        <v-toolbar density="compact" color="surface">
          <v-toolbar-title>AI Chat</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-select
            v-model="selectedProvider"
            :items="availableProviders"
            label="Provider"
            variant="solo-filled"
            density="compact"
            flat
            hide-details
            class="provider-select mr-2"
          ></v-select>
          </v-toolbar>

        <div ref="messageAreaRef" class="message-area flex-grow-1 pa-4">
          <div v-for="(message, index) in messages" :key="index"
               :class="['message', message.role === 'user' ? 'user-message' : 'assistant-message', 'mb-3']">
            <v-chip :color="message.role === 'user' ? 'primary' : 'surface-variant'" label>
               <pre class="message-content">{{ message.content }}</pre>
            </v-chip>
          </div>

          <div v-if="isLoading" class="message assistant-message mb-3 d-flex align-center">
             <v-progress-circular indeterminate size="20" width="2" class="mr-2"></v-progress-circular>
             <span>Thinking...</span>
          </div>
           <v-alert
              v-if="chatError"
              type="error"
              density="compact"
              variant="tonal"
              class="mt-3"
              closable
              @click:close="clearChatError"
            >
             {{ chatError }}
            </v-alert>
        </div>

        <div class="input-area pa-2 pb-4 d-flex align-center" style="background-color: rgb(var(--v-theme-surface));">
          <v-textarea
            v-model="newMessage"
            placeholder="Type your message..."
            rows="1"
            max-rows="5"
            auto-grow
            variant="solo"
            density="compact"
            hide-details
            filled
            class="mr-2"
            @keydown.enter.prevent="sendMessageHandler"
          ></v-textarea>
          <v-btn
            icon="mdi-send"
            color="primary"
            @click="sendMessageHandler"
            :disabled="!newMessage.trim()"
            :loading="isLoading"
          ></v-btn>
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from 'vue'; // Added computed, onMounted
import { useChatStore } from '@/stores/chat'; // Import the chat store (adjust path if needed)

// --- Store Instance ---
const chatStore = useChatStore();

// --- Local state for input only ---
const newMessage = ref('');
const messageAreaRef = ref<HTMLDivElement | null>(null); // Ref for scrolling

// --- Data from Store ---
// Use computed properties to reactively access store state
const messages = computed(() => chatStore.getMessages);
const isLoading = computed(() => chatStore.getIsLoading);
const chatError = computed(() => chatStore.getError);
// Use computed with getter/setter for v-model on store state
const selectedProvider = computed({
    get: () => chatStore.selectedProvider,
    set: (value) => chatStore.setProvider(value) // Use action to set provider
});

// --- Available Providers (could also come from store or config) ---
 const availableProviders = ref([
    { title: 'Anthropic', value: 'anthropic'},
    { title: 'OpenAI (coming soon)', value: 'openai', disabled: true },
    { title: 'Google (coming soon)', value: 'google', disabled: true },
]);

// --- Methods ---
const sendMessageHandler = async () => {
  const prompt = newMessage.value.trim();
  if (!prompt || isLoading.value) return; // Check computed isLoading

  // Clear input before sending (or after successful send)
  newMessage.value = '';

  // Call the store action
  await chatStore.sendMessage(prompt);

  // Scroll down after potential message updates
  scrollToBottom();
};

// Method to clear store error (used by v-alert close)
const clearChatError = () => {
    chatStore.clearError();
}

// Auto-scroll to bottom
const scrollToBottom = async () => {
    // Wait for DOM update after adding message
    await nextTick();
    if (messageAreaRef.value) {
        messageAreaRef.value.scrollTop = messageAreaRef.value.scrollHeight;
    }
};

// Watch messages length to scroll down whenever a new message is added
watch(() => messages.value.length, () => {
    scrollToBottom();
});

// Initial scroll on mount
onMounted(() => {
    scrollToBottom();
});

</script>

<style scoped>
.chat-container {
  height: calc(100vh - 64px); /* Adjust based on your app bar height */
  display: flex;
  flex-direction: column;
}

.message-area {
  overflow-y: auto;
  flex-grow: 1; /* Takes up remaining space */
}

.message {
  display: flex;
  max-width: 80%;
}

.user-message {
  justify-content: flex-end;
  margin-left: auto;
}

.assistant-message {
  justify-content: flex-start;
  margin-right: auto;
}

.input-area {
   border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.provider-select {
    max-width: 200px; /* Limit width of select */
}
</style>