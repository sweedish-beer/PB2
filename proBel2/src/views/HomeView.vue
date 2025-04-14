// src/views/HomeView.vue

<template>
  <div class="home-container">
    <Particles
      id="tsparticles"
      :options="particlesOptions"
      :particlesInit="particlesInit"
      class="particles-background"
    />
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
// --- Correction: Import 'ref' from Vue ---
import { ref } from 'vue';
// ----------------------------------------

// Import Particles component (default import)
import Particles from "@tsparticles/vue3";

// Import the 'full' engine bundle (loads all features)
import { loadFull } from "tsparticles";
// --- Correction: Import Engine type from 'tsparticles-engine' ---
import type { Engine } from "tsparticles-engine";
// ----------------------------------------------------------


// --- Particle Engine Initialization ---
// Needs the Engine type from tsparticles-engine
const particlesInit = async (engine: Engine): Promise<void> => {
    // Initializes the tsParticles instance (engine), loading the bundle
    await loadFull(engine);
};

// --- Particle Configuration Options ---
// Needs 'ref' to be reactive
const particlesOptions = ref({
  // ... (options remain the same as before) ...
   background: { /* color: '#1e1e2e', */ },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      onClick: { enable: true, mode: "push" },
      resize: true,
    },
    modes: {
      grab: { distance: 140, links: { opacity: 1 } },
      repulse: { distance: 100, duration: 0.4 },
      push: { quantity: 4 },
      bubble: { distance: 400, size: 40, duration: 2, opacity: 0.8 },
      connect: { distance: 80, links: { opacity: 0.5 } },
      remove: { quantity: 2 }
    },
  },
  particles: {
    color: { value: "#ffffff" },
    links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.4, width: 1 },
    collisions: { enable: false },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      random: false,
      straight: false,
      outModes: { default: "out" },
      attract: { enable: false, rotateX: 600, rotateY: 1200 },
    },
    number: { density: { enable: true, area: 800 }, value: 80 },
    opacity: { value: 0.5 },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 3 } },
  },
  detectRetina: true,
});

</script>

<style scoped>
/* CSS remains the same */
.home-container {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 64px); /* Adjust 64px based on app bar height */
  overflow: hidden;
  background-color: #121212;
}

.particles-background {
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