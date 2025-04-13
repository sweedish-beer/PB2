<template>
  <v-app :theme="currentTheme">
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav dense>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" :to="{ name: 'Dashboard' }" link></v-list-item>
        <v-list-item prepend-icon="mdi-note-multiple" title="Notes" :to="{ name: 'Notes' }" link></v-list-item>
        <v-list-item prepend-icon="mdi-palette" title="Doodle" :to="{ name: 'Doodle' }" link></v-list-item>
        <v-list-item prepend-icon="mdi-calculator-variant" title="Calculator" :to="{ name: 'Calculator' }" link></v-list-item>
        <v-list-item prepend-icon="mdi-chat" title="AI Chat" :to="{ name: 'Chat' }" link></v-list-item>
        <v-list-item prepend-icon="mdi-graph-outline" title="Flowchart" :to="{ name: 'Flowchart' }" link></v-list-item> 
        <v-divider class="my-2"></v-divider>
        <v-list-item prepend-icon="mdi-logout" title="Logout" @click="handleLogout" link></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" density="compact">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>Multi-App</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn :icon="themeIcon" @click="toggleTheme"></v-btn>

      {/* Add user menu etc. here later */}

    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'; // Added onMounted, computed
// import { useRouter } from 'vue-router'; // Not needed if guard handles redirect
import { useAuthStore } from '@/stores/auth';
import { useTheme } from 'vuetify'; // Import useTheme

// Drawer state
const drawer = ref(false);

// Auth store
const authStore = useAuthStore();

// --- Theme Handling ---
const theme = useTheme(); // Get Vuetify theme instance
const currentTheme = ref<'light' | 'dark'>('light'); // Local ref for theme name

// Function to toggle theme
const toggleTheme = () => {
  const newTheme = theme.global.current.value.dark ? 'light' : 'dark';
  theme.global.name.value = newTheme; // Update Vuetify theme
  localStorage.setItem('appTheme', newTheme); // Save preference
  currentTheme.value = newTheme; // Update local ref if needed for v-app :theme
};

// Computed icon based on current theme
const themeIcon = computed(() => {
    // Use theme.global.name.value directly if preferred over local currentTheme.value
    return theme.global.current.value.dark ? 'mdi-weather-night' : 'mdi-weather-sunny';
});

// Load saved theme on component mount
onMounted(() => {
  const savedTheme = localStorage.getItem('appTheme') as 'light' | 'dark' | null;
  // Check if theme is valid, otherwise default to 'light'
  const initialTheme = savedTheme && ['light', 'dark'].includes(savedTheme) ? savedTheme : 'light';
  theme.global.name.value = initialTheme;
  currentTheme.value = initialTheme;
});
// --- End Theme Handling ---


// Logout action
const handleLogout = async () => {
  await authStore.signOut();
  // No explicit redirect needed, route guard should handle it
};
</script>

<style scoped>
/* Add specific layout styles if needed */
</style>