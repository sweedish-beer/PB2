<template>
  <v-card class="mx-auto" outlined>
    <v-card-title class="pb-1">
      {{ note.title || 'Untitled Note' }}
    </v-card-title>

    <v-card-subtitle class="pb-2">
       {{ formattedDate }}
    </v-card-subtitle>

    <v-divider></v-divider>

    <v-card-text class="note-content pt-3">
      {{ truncatedContent }}
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        icon="mdi-pencil"
        variant="text"
        color="info"
        size="small"
        @click="emitEdit"
        title="Edit Note"
      ></v-btn>
      <v-btn
        icon="mdi-delete"
        variant="text"
        color="error"
        size="small"
        @click="handleDelete"
        :loading="isDeleting"
        title="Delete Note"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, type PropType } from 'vue';
import { useNotesStore, type Note } from '@/stores/notes'; // Adjust path if needed

// Props definition
const props = defineProps({
  note: {
    type: Object as PropType<Note>,
    required: true,
  },
});

// Emits definition (for editing)
const emit = defineEmits(['edit']);

// Store instance
const notesStore = useNotesStore();

// Local state for delete loading
const isDeleting = ref(false);

// Computed property for truncated content
const truncatedContent = computed(() => {
  const content = props.note.content || '';
  const maxLength = 150; // Max characters to show
  if (content.length > maxLength) {
    return content.substring(0, maxLength) + '...';
  }
  return content;
});

 // Computed property for formatted date
const formattedDate = computed(() => {
  if (!props.note.updated_at && !props.note.created_at) return '';
  // Prioritize updated_at if available
  const dateToFormat = props.note.updated_at || props.note.created_at;
  try {
      // Use Intl for better formatting, handle potential string/Date object
      const dateObj = typeof dateToFormat === 'string' ? new Date(dateToFormat) : dateToFormat;
       return new Intl.DateTimeFormat(undefined, { // Use browser's locale
           dateStyle: 'short', // e.g., 4/13/2025
           timeStyle: 'short', // e.g., 9:45 AM
       }).format(dateObj);
  } catch (e) {
      console.error("Error formatting date:", e);
      return String(dateToFormat); // Fallback to string representation
  }
});

// Emit 'edit' event when edit button is clicked
const emitEdit = () => {
  emit('edit', props.note); // Send the whole note object up
};

// Handle delete button click
const handleDelete = async () => {
  // Optional: Add a confirmation dialog here
  // if (!confirm(`Are you sure you want to delete "${props.note.title || 'this note'}"?`)) {
  //   return;
  // }

  isDeleting.value = true;
  await notesStore.deleteNote(props.note.id);
  isDeleting.value = false; // Reset loading state (store might also handle this)
  // No need to emit, store handles backend and optimistic UI update
};
</script>

<style scoped>
.note-content {
  white-space: pre-wrap; /* Preserve whitespace and wrap lines */
  word-break: break-word; /* Break long words */
  min-height: 50px; /* Ensure some minimum height */
}
/* Add other styles as needed */
</style>