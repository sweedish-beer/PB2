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
// --- Correction 1: Use default import for the component ---
import Particles from "@tsparticles/vue3";
// -----------------------------------------------------------

// Import the 'full' engine bundle
import { loadFull } from "tsparticles";
// --- Correction 2: Import Engine type from 'tsparticles' ---
import type { Engine } from "tsparticles";
// ----------------------------------------------------------


// --- Particle Engine Initialization ---
// No changes needed here, the Engine type is now correctly imported
const particlesInit = async (engine: Engine): Promise<void> => {
    await loadFull(engine);
};

// --- Particle Configuration Options ---
const particlesOptions = ref({
  background: {
    // color: '#1e1e2e', // Optional background color via particles config
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse", // Try "grab", "bubble", "connect"
      },
      onClick: {
        enable: true,
        mode: "push", // Try "remove", "bubble"
      },
      resize: true,
    },
    modes: {
      grab: { distance: 140, links: { opacity: 1 } }, // Changed line_linked to links
      repulse: { distance: 100, duration: 0.4 },
      push: { quantity: 4 }, // Changed particles_nb to quantity
      bubble: { distance: 400, size: 40, duration: 2, opacity: 0.8 }, // Removed speed
      connect: { distance: 80, links: { opacity: 0.5 } },
      remove: { quantity: 2 } // Changed particles_nb to quantity
    },
  },
  particles: {
    color: { value: "#ffffff" },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.4,
      width: 1,
    },
     collisions: { // Optional: Make particles bounce off each other
        enable: false, // Set to true to enable bouncing
     },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      random: false,
      straight: false,
      outModes: { // Changed out_mode to outModes
        default: "out", // "out", "bounce"
      },
      attract: { enable: false, rotateX: 600, rotateY: 1200 },
    },
    number: {
      density: { enable: true, area: 800 }, // Changed value_area to area
      value: 80,
    },
    opacity: { value: 0.5 }, // Simplified opacity
    shape: { type: "circle" },
    size: {
      value: { min: 1, max: 3 }, // Use min/max for random size
    },
  },
  detectRetina: true,
});

</script>

<style scoped>
.home-container {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 64px); /* Adjust 64px based on app bar height */
  overflow: hidden;
  /* Optional: Add a fallback background */
  background-color: #121212; /* Example dark background */
}

.particles-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* Place behind content */
}

.content-container {
  position: relative;
  z-index: 1; /* Layer content above particles */
  padding: 2rem;
  color: #ffffff; /* Ensure text is readable */
}

/* Style your content */
h1 {
  color: #FFFFFF;
}
p {
   color: rgba(255, 255, 255, 0.7);
}
</style>