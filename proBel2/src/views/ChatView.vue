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
          <div class="message user-message mb-3">
             <v-chip color="primary" label>Hello AI!</v-chip>
           </div>
           <div class="message assistant-message mb-3">
              <v-chip color="grey-lighten-1" label>Hello User! How can I help you today?</v-chip>
           </div>
           <div v-if="isLoading" class="message assistant-message mb-3">
               <v-progress-circular indeterminate size="20" class="mr-2"></v-progress-circular> Thinking...
           </div>
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
import { ref, nextTick, watch } from 'vue';

// --- State Refs (will mostly move to Pinia later) ---
const newMessage = ref('');
const isLoading = ref(false); // Loading state for AI response
const messageAreaRef = ref<HTMLDivElement | null>(null); // Ref for scrolling

// Provider Selection State
const availableProviders = ref([
    { title: 'Anthropic', value: 'anthropic'},
    { title: 'OpenAI (coming soon)', value: 'openai', disabled: true },
    { title: 'Google (coming soon)', value: 'google', disabled: true },
]);
const selectedProvider = ref('anthropic'); // Default provider

// Placeholder messages (will come from store)
const messages = ref([
    { role: 'user', content: 'Hello AI!'},
    { role: 'assistant', content: 'Hello User! How can I help you today?'}
]);
// --- End State Refs ---


// --- Methods (will mostly call store actions later) ---
const sendMessageHandler = () => {
  const prompt = newMessage.value.trim();
  if (!prompt || isLoading.value) return;

  console.log(`Sending to ${selectedProvider.value}:`, prompt);
  // TODO: Replace with Pinia store action call
  // Simulating request/response for now
  messages.value.push({ role: 'user', content: prompt });
  newMessage.value = '';
  isLoading.value = true;
  setTimeout(() => {
      messages.value.push({ role: 'assistant', content: `Placeholder response for "${prompt}"`});
      isLoading.value = false;
      scrollToBottom();
  }, 1500);
};

// Auto-scroll to bottom
const scrollToBottom = async () => {
    // Wait for DOM update after adding message
    await nextTick();
    if (messageAreaRef.value) {
        messageAreaRef.value.scrollTop = messageAreaRef.value.scrollHeight;
    }
};

// Watch messages to scroll down (could also call after adding messages)
watch(messages, scrollToBottom, { deep: true });

// Initial scroll
// onMounted(scrollToBottom); // Might need onMounted import

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