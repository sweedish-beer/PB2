<template>
  <v-container>
    <h1 class="mb-4">My Notes</h1>

    <v-btn
      color="primary"
      class="mb-4"
      @click="openAddNoteDialog"
      prepend-icon="mdi-plus-circle"
    >
      Add Note
    </v-btn>

    <v-progress-linear
      v-if="notesStore.isLoading"
      indeterminate
      color="primary"
      class="mb-4"
    ></v-progress-linear>

    <v-alert
      v-if="notesStore.getError"
      type="error"
      density="compact"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="notesStore.clearError()"
    >
      {{ notesStore.getError }}
    </v-alert>

    <note-list :notes="notesStore.getNotes" />

    <note-editor-dialog
      v-model="dialogVisible"
      :note-to-edit="selectedNote"
      @save="handleSaveNote"
    />

  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNotesStore } from '../stores/notes'; // Adjust path if needed

// --- Placeholders for components we will create next ---
// These imports will cause errors until the files exist
import NoteList from '../components/notes/NoteList.vue';
import NoteEditorDialog from '@/components/notes/NoteEditorDialog.vue';
// ---

// Store instance
const notesStore = useNotesStore();

// Dialog state
const dialogVisible = ref(false);
const selectedNote = ref(null); // Holds note data when editing

// Fetch notes when the component is mounted
onMounted(() => {
  notesStore.fetchNotes();
});

// Methods to handle dialog
const openAddNoteDialog = () => {
  selectedNote.value = null; // Clear selected note for adding
  dialogVisible.value = true;
};

// Method to handle opening dialog for editing (will be called from NoteList/NoteCard)
const openEditNoteDialog = (note: any) => { // Use 'any' for now, replace with Note interface later
    selectedNote.value = note;
    dialogVisible.value = true;
};

// Method to save note (called from dialog emit)
const handleSaveNote = async (noteData: any) => { // Use 'any' for now
  if (selectedNote.value) {
    // Editing existing note
    await notesStore.updateNote(selectedNote.value.id, noteData);
  } else {
    // Adding new note
    await notesStore.addNote(noteData);
  }
  // Dialog will close itself via v-model
};

</script>

<style scoped>
/* Add styles if needed */
</style>