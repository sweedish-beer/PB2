<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="closeDialog"
    persistent
    max-width="600px"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ dialogTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-form ref="formRef">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editableTitle"
                  label="Title (Optional)"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editableContent"
                  label="Content"
                  variant="outlined"
                  rows="10"
                  required
                  :rules="[rules.required]"
                  auto-grow
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeDialog">
          Cancel
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="saveNote">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineProps, defineEmits, type PropType } from 'vue';
import type { Note } from '@/stores/notes'; // Adjust path if needed
import type { VForm } from 'vuetify/components'; // Import VForm type for ref

// Props
const props = defineProps({
  modelValue: { // For v-model binding (controls dialog visibility)
    type: Boolean,
    default: false,
  },
  noteToEdit: { // The note object passed when editing
    type: Object as PropType<Note | null>,
    default: null,
  },
});

// Emits
const emit = defineEmits(['update:modelValue', 'save']);

// Local reactive state for form fields
const editableTitle = ref('');
const editableContent = ref('');
const formRef = ref<InstanceType<typeof VForm> | null>(null); // Ref for v-form

// Computed property for dialog title
const dialogTitle = computed(() => (props.noteToEdit ? 'Edit Note' : 'Add New Note'));

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Content is required.',
};

// Watch the modelValue (dialog visibility) to reset form when opening for 'Add'
watch(() => props.modelValue, (newValue) => {
  if (newValue && !props.noteToEdit) {
    // Dialog opened for 'Add', reset fields
    editableTitle.value = '';
    editableContent.value = '';
    formRef.value?.resetValidation(); // Reset validation state
  }
});

// Watch the noteToEdit prop to populate form when opening for 'Edit'
watch(() => props.noteToEdit, (newNote) => {
  if (newNote) {
    editableTitle.value = newNote.title || '';
    editableContent.value = newNote.content || '';
     formRef.value?.resetValidation(); // Reset validation state
  }
}, { immediate: true }); // immediate: true to run on initial mount if prop is passed

// Close the dialog by emitting update:modelValue
const closeDialog = () => {
  emit('update:modelValue', false);
};

// Handle save button click
const saveNote = async () => {
  // Validate form
  const validation = await formRef.value?.validate();
  if (!validation?.valid) {
      return; // Stop if form is invalid
  }

  // Emit 'save' event with the current data
  emit('save', {
    title: editableTitle.value || null, // Send null if empty for Supabase
    content: editableContent.value,
  });
  closeDialog(); // Close dialog after emitting save
};

</script>

<style scoped>
/* Add styles if needed */
</style>