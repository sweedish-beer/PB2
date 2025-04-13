// src/App.vue
<template>
  <v-app>
    <v-main>
      <router-view /> {/* Display the current route's component */}
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth' // Import the auth store

// Get the auth store instance
const authStore = useAuthStore()

// Initialize the auth listener when the component is mounted
onMounted(() => {
  authStore.initializeAuthListener()
})
</script>

<style>
/* Global styles */
</style>