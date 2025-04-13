<template>
  <div>
    <div v-if="notes && notes.length > 0">
      <v-row>
        <v-col
          v-for="note in notes"
          :key="note.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <note-card :note="note" @edit="handleEdit" />
        </v-col>
      </v-row>
    </div>
    <v-card v-else class="pa-4 text-center" flat>
      <v-card-text>
        You haven't created any notes yet. Click "Add Note" to start!
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, type PropType } from 'vue'; // <-- Add defineEmits
import type { Note } from '@/stores/notes';
import NoteCard from './NoteCard.vue';

// Keep props definition as is
const props = defineProps({
  notes: {
    type: Array as PropType<Note[]>,
    required: true,
  },
});

// --- Add this ---
// Define the 'edit' event that this component can emit
const emit = defineEmits(['edit']);

// Method to handle the @edit event received from NoteCard
const handleEdit = (note: Note) => {
  // Re-emit the 'edit' event upwards, passing the note object along
  emit('edit', note);
};
// --- End of added code ---

</script>

<style scoped>
/* Styles remain the same */
</style>