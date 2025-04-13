// src/stores/notes.ts
import { defineStore } from "pinia";
import { supabase } from "../services/supabase"; // Use @ alias or relative path '../services/supabase'
import { useAuthStore } from "./auth"; // Need auth store to get current user ID

// Define an interface for the Note object structure
// Reflects the columns in your Supabase 'notes' table
export interface Note {
  id: string; // uuid is typically represented as a string
  created_at: string | Date; // Supabase returns string, but can be Date object
  user_id: string;
  title: string | null;
  content: string | null;
  updated_at?: string | Date | null; // Optional or can be null
}

export const useNotesStore = defineStore("notes", {
  // STATE: Data managed by this store
  state: () => ({
    notes: [] as Note[], // Array to hold the fetched notes
    loading: false, // Loading indicator for notes operations
    error: null as Error | string | null, // To store errors
  }),

  // GETTERS: Computed properties (optional for now)
  getters: {
    getNotes: (state): Note[] => state.notes,
    isLoading: (state): boolean => state.loading,
    getError: (state): Error | string | null => state.error,
  },

  // ACTIONS: Methods for CRUD operations
  actions: {
    // Clear any previous errors
    clearError() {
      this.error = null;
    },

    // Fetch notes for the logged-in user
    async fetchNotes() {
      const authStore = useAuthStore();
      if (!authStore.user) {
        this.error = "User not authenticated";
        this.notes = []; // Clear notes if user logs out
        return;
      }

      this.loading = true;
      this.error = null;
      try {
        // Select notes where user_id matches the authenticated user's ID
        // Order by creation date descending (newest first)
        const { data, error } = await supabase
          .from("notes")
          .select("*") // Select all columns
          .eq("user_id", authStore.user.id) // Filter by user_id
          .order("created_at", { ascending: false }); // Order results

        if (error) throw error;

        this.notes = data || []; // Update the state with fetched notes
        console.log("Notes fetched:", this.notes);
      } catch (err: any) {
        console.error("Error fetching notes:", err);
        this.error = err.message || "Failed to fetch notes";
        this.notes = []; // Clear notes on error
      } finally {
        this.loading = false;
      }
    },

    // Add a new note
    async addNote(newNoteData: {
      title?: string | null;
      content?: string | null;
    }) {
      const authStore = useAuthStore();
      if (!authStore.user) {
        this.error = "User not authenticated";
        return null; // Return null or throw error to indicate failure
      }

      this.loading = true;
      this.error = null;
      try {
        // Insert the new note, setting the user_id explicitly
        const { data, error } = await supabase
          .from("notes")
          .insert([
            {
              user_id: authStore.user.id, // Associate with current user
              title: newNoteData.title,
              content: newNoteData.content,
              // created_at and updated_at handled by DB defaults/triggers
            },
          ])
          .select() // Return the newly inserted row(s)
          .single(); // Expecting only one row back

        if (error) throw error;

        // Add the new note to the beginning of the local state array
        if (data) {
          this.notes.unshift(data as Note); // Add to local state
          console.log("Note added:", data);
          return data as Note; // Return the added note
        }
        return null; // Should not happen if insert succeeded with .single()
      } catch (err: any) {
        console.error("Error adding note:", err);
        this.error = err.message || "Failed to add note";
        return null; // Return null on error
      } finally {
        this.loading = false;
      }
    },

    // Update an existing note
    async updateNote(
      noteId: string,
      updatedData: { title?: string | null; content?: string | null }
    ) {
      const authStore = useAuthStore();
      if (!authStore.user) {
        this.error = "User not authenticated";
        return false; // Indicate failure
      }

      this.loading = true;
      this.error = null;
      try {
        // Update the note WHERE id matches AND user_id matches (RLS handles user_id check too)
        // Also update the 'updated_at' timestamp (optional, if not using DB triggers)
        const { data, error } = await supabase
          .from("notes")
          .update({
            ...updatedData,
            updated_at: new Date().toISOString(), // Manually set updated_at
          })
          .eq("id", noteId)
          .eq("user_id", authStore.user.id) // Explicit check for safety
          .select()
          .single(); // Expecting one row back

        if (error) throw error;

        // Find the index of the note in the local state and update it
        const index = this.notes.findIndex((note) => note.id === noteId);
        if (index !== -1 && data) {
          this.notes[index] = data as Note;
          console.log("Note updated:", data);
          return true; // Indicate success
        }
        return false; // Note not found locally or update failed silently
      } catch (err: any) {
        console.error("Error updating note:", err);
        this.error = err.message || "Failed to update note";
        return false; // Indicate failure
      } finally {
        this.loading = false;
      }
    },

    // Delete a note
    async deleteNote(noteId: string) {
      const authStore = useAuthStore();
      if (!authStore.user) {
        this.error = "User not authenticated";
        return false; // Indicate failure
      }

      // Optimistic UI update: Remove immediately from local state
      const index = this.notes.findIndex((note) => note.id === noteId);
      if (index === -1) return false; // Note not found locally
      const deletedNoteLocally = this.notes.splice(index, 1)[0];

      this.loading = true; // Still set loading for the backend operation
      this.error = null;
      try {
        // Delete the note WHERE id matches AND user_id matches (RLS handles user_id check too)
        const { error } = await supabase
          .from("notes")
          .delete()
          .eq("id", noteId)
          .eq("user_id", authStore.user.id); // Explicit check for safety

        if (error) {
          // If backend delete fails, revert the optimistic update
          this.notes.splice(index, 0, deletedNoteLocally);
          throw error;
        }

        console.log("Note deleted successfully, ID:", noteId);
        return true; // Indicate success
      } catch (err: any) {
        console.error("Error deleting note:", err);
        this.error = err.message || "Failed to delete note";
        // Ensure note is back if it failed after optimistic removal
        if (this.notes.findIndex((note) => note.id === noteId) === -1) {
          this.notes.splice(index, 0, deletedNoteLocally);
        }
        return false; // Indicate failure
      } finally {
        this.loading = false;
      }
    },
  },
});
