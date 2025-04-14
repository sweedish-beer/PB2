// src/views/HomeView.vue (Manual Initialization)

<template>
  <div class="home-container">
    <div id="tsparticles-container" class="particles-background"></div>

    <v-container fluid class="content-container fill-height d-flex justify-center align-center">
      <v-row>
        <v-col cols="12" class="text-center">
          <h1 class="text-h3 font-weight-bold mb-4">Welcome to proBel2!</h1>
          <p class="text-h6 text-medium-emphasis">Your Multi-Tool Hub</p>
          <v-row justify="center" class="mt-10">
             <v-col cols="auto">
                <v-btn prepend-icon="mdi-note-text" to="/notes" color="primary" size="large">Notes</v-btn>
             </v-col>
             <v-col cols="auto">
                <v-btn prepend-icon="mdi-draw" to="/doodle" color="secondary" size="large">Doodle</v-btn>
             </v-col>
             <v-col cols="auto">
                <v-btn prepend-icon="mdi-calculator" to="/calculator" color="accent" size="large">Calculator</v-btn>
             </v-col>
              <v-col cols="auto">
                <v-btn prepend-icon="mdi-robot" to="/chat" color="info" size="large">AI Chat</v-btn>
             </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Import the main tsParticles object and the engine loader
import { tsParticles } from "tsparticles-core"; // Import the core instance
import { loadFull } from "tsparticles"; // Keep using loadFull bundle

// --- Particle Configuration Options ---
// Keep your options object (or simplify for testing)
const particlesOptions = ref({
  // ... (same options as before) ...
  background: { },
  fpsLimit: 60,
  interactivity: { /* ... */ },
  particles: { /* ... */ },
  detectRetina: true,
});

// --- Manual Initialization on Mount ---
onMounted(async () => {
  try {
    console.log("Attempting manual particles initialization...");

    // Load the engine features (pass the main tsParticles instance)
    // This adds shapes, modes, etc. to the tsParticles object
    await loadFull(tsParticles);
    console.log("tsParticles engine features loaded.");

    // Load particles onto the container div
    // Pass the options directly
    await tsParticles.load({
        id: "tsparticles-container", // ID of the div in the template
        options: particlesOptions.value
    });
    console.log("tsParticles instance loaded onto container.");

  } catch (error) {
      console.error("Error initializing tsParticles manually:", error);
  }
});

</script>

<style scoped>
/* CSS remains mostly the same */
.home-container {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 64px);
  overflow: hidden;
  background-color: #121212;
}

/* Style the container div */
#tsparticles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.content-container {
  position: relative;
  z-index: 1;
  padding: 2rem;
  color: #ffffff;
}

h1 { color: #FFFFFF; }
p { color: rgba(255, 255, 255, 0.7); }
</style>