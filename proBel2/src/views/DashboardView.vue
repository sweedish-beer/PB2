// src/views/DashboardView.vue
<template>
  <v-container>
    <h1>Dashboard</h1>
    <p>Welcome! You should only see this if you are logged in.</p>
    <div v-if="authStore.getUser">
        <p>User ID: {{ authStore.getUser.id }}</p>
        <p>Email: {{ authStore.getUser.email }}</p>
    </div>
    <v-btn color="secondary" @click="handleLogout" :loading="authStore.isLoading">
        Logout
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'; // Or '../stores/auth'
import { useRouter } from 'vue-router'; // <-- Import useRouter

const authStore = useAuthStore();
const router = useRouter(); // <-- Get router instance

const handleLogout = async () => {
    await authStore.signOut();
    // Explicitly redirect to Login page after logout completes
    router.push({ name: 'Login' }); // <-- Add this line
};
</script>