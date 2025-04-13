<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" temporary> {/* Use temporary for mobile overlay */}
      <v-list nav dense>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" :to="{ name: 'Dashboard' }" link></v-list-item>
        <v-list-item prepend-icon="mdi-note-multiple" title="Notes" :to="{ name: 'Notes' }" link></v-list-item>
        <v-list-item prepend-icon="mdi-palette" title="Doodle" :to="{ name: 'Doodle' }" link></v-list-item>
        <v-list-item prepend-icon="mdi-calculator-variant" title="Calculator" :to="{ name: 'Calculator' }" link></v-list-item>
         <v-list-item prepend-icon="mdi-chat" title="AI Chat" :to="{ name: 'Chat' }" link></v-list-item>
        <v-divider class="my-2"></v-divider>

        <v-list-item prepend-icon="mdi-logout" title="Logout" @click="handleLogout" link></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" density="compact">
       {/* Button to toggle drawer on mobile/smaller screens */}
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>Multi-App</v-app-bar-title> {/* Or use dynamic title */}

      <v-spacer></v-spacer>

      {/* Add other app bar items like theme toggle or user menu later */}

    </v-app-bar>

    <v-main>
       {/* The content of the current route will be rendered here */}
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useAuthStore } from '@/stores/auth'; // Adjust path if needed

// State for controlling the navigation drawer visibility
const drawer = ref(false); // Start closed, use 'temporary' prop for mobile overlay

// Get store and router instances
const authStore = useAuthStore();
const router = useRouter();

// Logout action
const handleLogout = async () => {
  await authStore.signOut();
  // Route guards should automatically redirect to login,
  // but we can force it if needed:
  // router.push({ name: 'Login' });
};
</script>

<style scoped>
/* Add specific layout styles if needed */
</style>