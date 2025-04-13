
<template>
  <v-container>
    <h1 class="mb-4 text-center">Doodle Pad</h1>

    <DoodleCanvas
        :stroke-color="selectedColor"
        :stroke-weight-value="selectedStrokeWeight"
        :clear-canvas-trigger="clearTrigger"
        :save-canvas-trigger="saveTrigger"
        :is-erasing="isErasing" />

    <v-card class="mt-4 pa-3" elevation="2">
       <v-row align="center" justify="center" dense>
         <v-col cols="12" sm="auto" class="d-flex justify-center flex-column align-center px-2">
             <div class="text-caption mb-1">Color</div>
             <v-color-picker
                v-model="selectedColor"
                hide-inputs
                show-swatches
                :swatches="swatches"
                width="180"  
                elevation="0"
                :disabled="isErasing" 
             ></v-color-picker>
         </v-col>

         <v-col cols="12" sm="4" class="px-4">
              <v-slider
                v-model="selectedStrokeWeight"
                label="Brush / Eraser Size"
                min="1"
                max="50"
                step="1"
                thumb-label
                show-ticks="always"
                color="primary"
             ></v-slider>
         </v-col>

         <v-col cols="12" sm="auto" class="d-flex flex-column justify-center align-center px-2">
             <v-btn
                 :color="isErasing ? 'blue-grey' : 'default'"
                 :variant="isErasing ? 'flat' : 'outlined'" 
                 @click="toggleEraser"
                 :prepend-icon="isErasing ? 'mdi-pencil' : 'mdi-eraser'"
                 class="mb-2"
                 block
             >
                 {{ isErasing ? 'Switch to Pen' : 'Switch to Eraser' }}
             </v-btn>

             <v-btn color="error" @click="triggerClear" prepend-icon="mdi-delete-sweep" class="mb-2" block>
                 Clear Canvas
             </v-btn>

             <v-btn color="success" @click="handleSaveImage" prepend-icon="mdi-content-save" block>
                 Save Image
             </v-btn>
         </v-col>
       </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DoodleCanvas from '@/components/doodle/DoodleCanvas.vue';

// Refs for control values
const selectedColor = ref('#000000');
const selectedStrokeWeight = ref(4);
const clearTrigger = ref(0);
const saveTrigger = ref(0);
const isErasing = ref(false); // <-- Add eraser state ref

// Swatches remain the same
const swatches = ref([
  ['#000000', '#FFFFFF'],
  ['#FF0000', '#FF8000'],
  ['#FFFF00', '#00FF00'],
  ['#00FFFF', '#0000FF'],
  ['#FF00FF', '#800080'],
]);

const triggerClear = () => { clearTrigger.value++; }
const handleSaveImage = () => { saveTrigger.value++; }
const toggleEraser = () => {
    isErasing.value = !isErasing.value;
}
// ---

</script>

<style scoped>
/* Styles remain the same */
 .text-center { text-align: center; }
</style>