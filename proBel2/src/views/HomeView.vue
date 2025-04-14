<template>
  <div class="home-container">
    <v-container class="content-container" fluid>
      <v-row class="welcome-section text-center" align="center" justify="center">
        <v-col cols="12">
          <h1 class="text-h3 font-weight-bold mb-4">Welcome to proBel2!</h1>
          <p class="text-h6 text-medium-emphasis">Your Multi-Tool Hub</p>
          <v-row justify="center" class="mt-10">
             <v-col cols="auto">
                <v-btn prepend-icon="mdi-note-text" to="/notes" color="primary" size="large" variant="elevated">Notes</v-btn>
             </v-col>
             <v-col cols="auto">
                <v-btn prepend-icon="mdi-draw" to="/doodle" color="secondary" size="large" variant="elevated">Doodle</v-btn>
             </v-col>
             <v-col cols="auto">
                <v-btn prepend-icon="mdi-calculator" to="/calculator" color="accent" size="large" variant="elevated">Calculator</v-btn>
             </v-col>
              <v-col cols="auto">
                <v-btn prepend-icon="mdi-robot" to="/chat" color="info" size="large" variant="elevated">AI Chat</v-btn>
             </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row class="mt-16 placeholder-grid">
         <v-col cols="12">
             <h2 class="text-h5 mb-6 text-center">Dashboard / Widgets Area</h2>
         </v-col>

         <v-col cols="12" md="6">
            <v-card variant="outlined" class="pa-4 fill-height d-flex align-center justify-center">
                <span class="text-disabled">Grid Cell 1 (Future Content)</span>
            </v-card>
         </v-col>
          <v-col cols="12" md="6">
             <v-card variant="outlined" class="pa-4 fill-height d-flex align-center justify-center">
                <span class="text-disabled">Grid Cell 2 (Future Content)</span>
            </v-card>
          </v-col>
           <v-col cols="12" md="6">
             <v-card variant="outlined" class="pa-4 fill-height d-flex align-center justify-center">
                <span class="text-disabled">Grid Cell 3 (Future Content)</span>
             </v-card>
           </v-col>
           <v-col cols="12" md="6">
             <v-card variant="outlined" class="pa-4 fill-height d-flex align-center justify-center">
                 <span class="text-disabled">Grid Cell 4 (Future Content)</span>
             </v-card>
           </v-col>
      </v-row>

       <div style="height: 50vh;"></div>

    </v-container>
  </div>
</template>

<script setup lang="ts">
// No specific script logic needed for this background effect
import { onMounted } from 'vue';

onMounted(() => {
    // Potential hook for later if JS interaction is needed
    console.log("HomeView mounted.");
});

</script>

<style scoped>
.home-container {
  width: 100%;
  min-height: 100vh; /* Ensure it takes at least full viewport height */
  padding-top: 64px; /* Adjust based on your app bar height */
  padding-bottom: 4rem; /* Add padding at the bottom */

  /* --- Background Configuration --- */
  /* Layer 1: Geometric Pattern (dots) */
  /* Layer 2: Vertical Gradient */
  background-image:
    /* Dots: color alpha size, transparent size */
    radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1.1px),
    /* Gradient: dark -> lighter */
    linear-gradient(to bottom,
       #1a1a2e 0%,  /* Dark Purple/Blue Start */
       #3b2a4a 50%, /* Intermediate */
       #ff8a80 150% /* Orangy-Pinkish End (extends beyond 100% height) */
     );

  /* Pattern size / repeat */
  background-size:
      18px 18px, /* Size of the repeating dot pattern */
      100% auto; /* Gradient covers full width, height is auto (will stretch) */

  /* Ensure gradient scrolls with the page, pattern repeats */
  background-attachment: local, scroll; /* Pattern repeats locally, gradient scrolls */
  background-repeat: repeat, no-repeat;

  /* Optional: Smooth background scroll behavior */
  scroll-behavior: smooth;
}

.content-container {
  position: relative; /* Ensures content stays above background patterns if needed */
  z-index: 1;
  color: #ffffff; /* Default text color for readability */
}

.welcome-section {
    min-height: 50vh; /* Give the welcome section some height */
    display: flex;
    flex-direction: column;
    justify-content: center;
}

h1 {
  color: #FFFFFF;
}
p {
   color: rgba(255, 255, 255, 0.8);
}

/* Style placeholder grid */
.placeholder-grid .v-card {
    min-height: 150px;
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
}
</style>