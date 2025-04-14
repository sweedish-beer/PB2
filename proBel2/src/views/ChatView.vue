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
          <div v-if="isLoadingHistory" class="text-center my-4">
               <v-progress-circular indeterminate color="primary"></v-progress-circular>
               <p>Loading history...</p>
            </div>

          <template v-else>
              <div v-if="messages.length === 0 && authStore.user" class="text-center text-disabled my-4">
                  No messages yet. Start chatting!
               </div>
               <div v-if="messages.length === 0 && !authStore.user" class="text-center text-disabled my-4">
                  Please log in to see your chat history.
               </div>

              <div v-for="(message) in messages" :key="message.id || message.content + message.role" :class="['message', message.role === 'user' ? 'user-message' : message.role === 'assistant' ? 'assistant-message' : 'error-message', 'mb-3']">
                 <v-alert v-if="message.role === 'error'" type="error" density="compact" variant="tonal" class="message-bubble">
                    {{ message.content }}
                 </v-alert>
                 <v-chip v-else :color="message.role === 'user' ? 'primary' : 'surface-variant'" label class="message-bubble">
                     <span v-if="message.role === 'assistant' && message.model" class="text-caption d-block mb-1 text-disabled">
                         Model: {{ message.model }}
                     </span>
                     <span style="white-space: pre-wrap;">{{ message.content }}</span>
                 </v-chip>
              </div>
           </template>

           <div v-if="isLoadingReply" class="message assistant-message mb-3 d-flex align-center">
             <v-progress-circular indeterminate size="20" width="2" class="mr-2"></v-progress-circular>
             <span>Thinking...</span>
          </div>

          <v-alert
              v-if="chatError && !isLoadingHistory" type="error"
              density="compact"
              variant="tonal"
              class="mt-3"
              closable
              @click:close="clearChatError"
            >
             {{ chatError }}
            </->
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
            :disabled="isLoadingHistory || isLoadingReply || !authStore.user" ></v-textarea>
          <v-btn
            icon="mdi-send"
            color="primary"
            @click="sendMessageHandler"
            :disabled="!newMessage.trim() || !authStore.user"
            :loading="isLoadingReply" ></v-btn>
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from 'vue';
import { useChatStore } from '@/stores/chat';
import { useAuthStore } from '@/stores/auth'; // <-- Import Auth Store

// --- Store Instances ---
const chatStore = useChatStore();
const authStore = useAuthStore(); // <-- Get auth store instance

// --- Local state ---
const newMessage = ref('');
const messageAreaRef = ref<HTMLDivElement | null>(null);

// --- Data from Store ---
const messages = computed(() => chatStore.getMessages);
const isLoadingHistory = computed(() => chatStore.getIsLoadingHistory); // Use specific state
const isLoadingReply = computed(() => chatStore.getIsLoadingReply);   // Use specific state
const chatError = computed(() => chatStore.getError);
const selectedProvider = computed({
    get: () => chatStore.selectedProvider,
    set: (value) => chatStore.setProvider(value)
});

// --- Available Providers ---
 const availableProviders = ref([/* ... same as before ... */]);

// --- Methods ---
const sendMessageHandler = async () => {
  const prompt = newMessage.value.trim();
  if (!prompt || isLoadingReply.value) return;
  newMessage.value = '';
  await chatStore.sendMessage(prompt);
  // Scroll handled by watcher
};

const clearChatError = () => {
    chatStore.clearError();
}

const scrollToBottom = async (behavior: ScrollBehavior = 'auto') => {
    await nextTick();
    if (messageAreaRef.value) {
        messageAreaRef.value.scrollTo({ top: messageAreaRef.value.scrollHeight, behavior });
    }
};

// Watch messages length to scroll down (smooth scroll for new messages)
watch(() => messages.value.length, (newLength, oldLength) => {
    if (newLength > oldLength) { // Only scroll smoothly on new message add
         scrollToBottom('smooth');
    }
});

// --- Load History on Mount or Auth Change ---
onMounted(() => {
    if (authStore.user) {
        console.log("ChatView mounted, user logged in. Loading history.");
        chatStore.loadChatHistory().then(() => {
             scrollToBottom('auto'); // Scroll immediately after history loads
        });
    } else {
         console.log("ChatView mounted, user not logged in.");
         chatStore.messages = []; // Ensure messages are clear if user isn't logged in initially
    }
});

// Watch for user login/logout to load/clear history
watch(() => authStore.user, (newUser, oldUser) => {
     console.log("Auth user changed:", newUser);
    if (newUser && !oldUser) { // User logged in
        chatStore.loadChatHistory().then(() => {
             scrollToBottom('auto');
        });
    } else if (!newUser && oldUser) { // User logged out
        chatStore.messages = []; // Clear messages
        chatStore.error = null; // Clear any errors
    }
});

</script>

<style scoped>
/* ... existing styles ... */

/* Add style for error messages */
.error-message {
    justify-content: center; /* Center error alerts */
    margin-left: auto;
    margin-right: auto;
    max-width: 95%;
}
.error-message .v-alert {
    width: 100%;
}

/* Adjust message bubble styles */
.message-bubble {
  height: auto;
  white-space: normal;
  max-width: 100%;
  padding: 8px 12px; /* Adjust padding */
  word-break: break-word;
}

.message-bubble :deep(.v-chip__content) {
   display: block;
   white-space: pre-wrap;
}

</style>