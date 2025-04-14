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
import { tsParticles } from "tsparticles"; // Import the core instance
import { loadFull } from "tsparticles"; // Keep using loadFull bundle

// --- Particle Configuration Options ---
// Keep your options object (or simplify for testing)
const particlesOptions = ref({
  background: { },
  fpsLimit: 60,
   interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse", // Particles move away from cursor
      },
      onClick: {
        enable: true,
        mode: "push", // Adds particles on click
      },
      resize: { // Ensure particles recalculate on window resize
        enable: true
      },
    },
    modes: {
      grab: { // Settings for "grab" mode (if used in onHover/onClick)
        distance: 140,
        links: { // Changed from line_linked
          opacity: 1,
        },
      },
      repulse: { // Settings for "repulse" mode
        distance: 100, // How far they move
        duration: 0.4, // How fast they move back
      },
      push: { // Settings for "push" mode
        quantity: 4, // How many particles to add on click
      },
      bubble: { // Settings for "bubble" mode (if used)
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 0.8,
        // speed: 3, // Speed is often part of the particle config now
      },
      connect: { // Settings for "connect" mode (if used)
        distance: 80,
        links: {
          opacity: 0.5,
        },
      },
      remove: { // Settings for "remove" mode (if used)
        quantity: 2,
      },
    },
  },
  particles: {
    color: {
      value: "#ad0089", // Color of the particles
    },
    links: { // Lines connecting particles
      color: "#ffffff", // Link color
      distance: 150, // Max distance to draw a link
      enable: true, // Draw links
      opacity: 0.4, // Link opacity
      width: 1, // Link width
    },
    collisions: { // Particles bouncing off each other
      enable: false, // Set to true if you want them to bounce
    },
    move: { // Particle movement settings
      enable: true, // Particles should move
      speed: 2, // Base speed
      direction: "none", // Movement direction (none = random)
      random: false, // True = different speeds, false = same base speed
      straight: false, // True = only move straight, false = slight angle changes
      outModes: { // What happens when particles leave the canvas
        default: "out", // "out" = disappear, "bounce" = bounce off edge
      },
      attract: { // Particles attracting each other
        enable: true,
        rotateX: 600,
        rotateY: 1200,
      },
    },
    number: { // How many particles
      density: {
        enable: true, // Adjust number based on screen area
        area: 800, // Smaller number = denser particles
      },
      value: 80, // Base number of particles
    },
    opacity: {
      value: 0.5, // Base opacity
      // Random opacity can be set using { min: 0.1, max: 0.5 }
      // Animation can be added here too
    },
    shape: {
      type: "circle", // "circle", "square", "triangle", "polygon", "star", "image"
      // polygon: { nb_sides: 5 }, // Use if shape is polygon
      // image: { src: 'path/to/image.png', width: 100, height: 100 } // Use if shape is image
    },
    size: { // Particle size
      value: { min: 1, max: 3 }, // Particles will have random size between 1 and 3
      // value: 3, // Use if you want a fixed size
      // animation: { enable: false, speed: 5, minimumValue: 0.1, sync: false }, // Optional size animation
    },
  },
  detectRetina: true, // Increases particle density on high-DPI screens
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