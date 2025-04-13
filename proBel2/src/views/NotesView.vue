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

    <note-list :notes="notesStore.getNotes" @edit="handleEditRequest" />

    <note-editor-dialog
      v-model="dialogVisible"
      :note-to-edit="selectedNote"
      @save="handleSaveNote"
    />

  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNotesStore, type Note } from '@/stores/notes'; // Import Note interface
import NoteList from '@/components/notes/NoteList.vue';
import NoteEditorDialog from '@/components/notes/NoteEditorDialog.vue';

const notesStore = useNotesStore();
const dialogVisible = ref(false);
const selectedNote = ref<Note | null>(null); // Use Note interface type

onMounted(() => {
  notesStore.fetchNotes();
});

const openAddNoteDialog = () => {
  selectedNote.value = null;
  dialogVisible.value = true;
};

// --- Renamed this function ---
// Handles the @edit event emitted from NoteList
const handleEditRequest = (note: Note) => { // Use Note interface type
  console.log('Edit requested for note:', note); // Add log for debugging
  selectedNote.value = note; // Set the note to be edited
  dialogVisible.value = true; // Open the dialog
};
// ---

const handleSaveNote = async (noteData: { title?: string | null; content?: string | null }) => { // Use specific type
  if (selectedNote.value && selectedNote.value.id) {
    // Editing existing note
    console.log('Saving updated note:', selectedNote.value.id, noteData); // Add log
    await notesStore.updateNote(selectedNote.value.id, noteData);
  } else {
    // Adding new note
    console.log('Saving new note:', noteData); // Add log
    await notesStore.addNote(noteData);
  }
  // Dialog closes via v-model binding in NoteEditorDialog
};

</script>

<style scoped>
/* Styles remain the same */
</style>