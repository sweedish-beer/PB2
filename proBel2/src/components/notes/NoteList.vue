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
          <note-card :note="note" />
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
import { defineProps, type PropType } from 'vue';
import type { Note } from '@/stores/notes'; // Import Note interface (adjust path if needed)

// --- Placeholder for component we will create next ---
// This import will cause errors until the file exists
import NoteCard from './NoteCard.vue';
// ---

// Define component props
const props = defineProps({
  notes: {
    type: Array as PropType<Note[]>, // Expect an array of Note objects
    required: true,
  },
});
</script>

<style scoped>
/* Add styles if needed */
</style>