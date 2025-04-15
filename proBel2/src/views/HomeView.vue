// src/views/HomeView.vue (Template and Style Changes Only)

<template>
  <div class="home-container">
    <v-container class="content-container" fluid>

      <template v-if="authStore.isAuthenticated">
        <div class="welcome-section">
          <v-row class="text-center">
            <v-col cols="12">
              <h1 class="text-h3 font-weight-bold mb-4">Welcome back, {{ authStore.user?.email }}!</h1>
              <p class="text-h6 text-medium-emphasis">You are logged in.</p>
            </v-col>
          </v-row>
        </div>
      </template>

      <template v-else>
        <v-row class="auth-section" align="center" justify="center">
          <v-col cols="12" class="text-center mb-8">
            <h1 class="text-h3 font-weight-bold mb-4">Welcome to proBel2!</h1>
            <p class="text-h6 text-medium-emphasis">Log in or Register to get started.</p>
          </v-col>

          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="auth-card elevation-5">
              <v-card-title class="text-center text-h6 py-3">Login</v-card-title>
              <v-divider></v-divider>
              <LoginForm class="pa-4" />
              <v-card-actions class="justify-center pb-4">
                <span>Please confirm your email to log-in!</span>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="auth-card elevation-5">
              <v-card-title class="text-center text-h6 py-3">Register</v-card-title>
              <v-divider></v-divider>
              <RegisterForm class="pa-4" />

            </v-card>
          </v-col>
        </v-row>
        <div style="height: 30vh;"></div>
      </template>

    </v-container>
  </div>
</template>

<script setup lang="ts">
  //import { computed } from 'vue';
  import { useAuthStore } from '@/stores/auth';

  // --- Import NEW Form Components ---

  import LoginForm from '@/components/auth/LoginForm.vue'; // Adjust path if needed

  import RegisterForm from '@/components/auth/RegisterForm.vue'; // Adjust path if needed

  const authStore = useAuthStore();

  // NOTE: We removed the direct imports for LoginView and RegisterView

  // --- Import Login/Register View Components ---
  // Adjust paths if your views are elsewhere
  //import LoginView from '@/views/LoginView.vue';
  //import RegisterView from '@/views/RegisterView.vue';

  // Example using computed if needed, direct access usually works fine
  // const isAuthenticated = computed(() => authStore.isAuthenticated);
  // const userEmail = computed(() => authStore.user?.email);

</script>

<style scoped>
  .home-container {
    /* ... (background styles remain the same) ... */
    width: 100%;
    min-height: 100vh;
    padding-top: 64px;
    /* Adjust for app bar */
    padding-bottom: 4rem;
    background-image:
      radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1.1px),
      linear-gradient(to bottom, #1a1a2e 0%, #3b2a4a 50%, #ff8a80 150%);
    background-size: 10px 10px, 100% auto;
    background-attachment: local, fixed;
    background-repeat: repeat, no-repeat;
    scroll-behavior: smooth;
  }

  .content-container {
    /* ... */
  }

  .welcome-section {
    /* ... */
  }

  .auth-section {
    /* ... */
  }

  .auth-card {
    /* Make card background semi-transparent to blend better */
    background-color: rgba(250, 250, 250, 0.19);
    /* Darker semi-transparent */
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    /* Subtle border */
  }

  /* Remove deep styles, forms should be transparent by default */
  /*
.auth-card :deep(.v-container),
.auth-card :deep(.v-card) { ... }
.auth-card :deep(.v-card-title) { ... }
*/


  h1 {
    color: #FFFFFF;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
  }
</style>
