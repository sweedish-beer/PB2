// src/App.vue
<template>
  <v-app> {/* Vuetify's main application wrapper */}
    <v-main> {/* Ensures content aligns correctly with Vuetify components like app bars */}
      <router-view /> {/* This is where the matched route component will be displayed */}
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// No specific script needed for this basic setup yet
</script>

<style>
/* You might want some basic global styles here or keep using style.css */
/* Remove the default Vite styles if you haven't already */
</style>