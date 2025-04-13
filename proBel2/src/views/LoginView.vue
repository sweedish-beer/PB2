<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Email"
                name="login-email"
                prepend-icon="mdi-email"
                type="email"
                required
                :rules="[rules.required, rules.email]"
                :disabled="authStore.isLoading"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                name="login-password"
                prepend-icon="mdi-lock"
                type="password"
                required
                :rules="[rules.required]"
                :disabled="authStore.isLoading"
              ></v-text-field>

              <v-alert
                v-if="authStore.getError"
                type="error"
                density="compact"
                variant="tonal"
                class="mb-4"
                closable
                @click:close="authStore.clearError()"
              >
                {{ authStore.getError.message }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                block
                :loading="authStore.isLoading"
                :disabled="authStore.isLoading"
              >
                Login
              </v-btn>
            </v-form>
            <v-card-actions>
              <v-spacer></v-spacer>
               No account? <router-link to="/register" class="ml-1">Sign Up</router-link>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter for potential redirects
import { useAuthStore } from '@/stores/auth'; // Import the auth store (use '../stores/auth' if alias not working)

// State refs for form inputs
const email = ref('');
const password = ref('');

// Get instances
const authStore = useAuthStore();
const router = useRouter(); // Get router instance

// Basic validation rules (can be expanded)
const rules = {
  required: (value: string) => !!value || 'Required.',
  email: (value: string) => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
};

// Login handler function
const handleLogin = async () => {
  // Optional: Add form validation check here using v-form's validation
  // For now, we rely on store validation/errors
  if (email.value && password.value) {
    await authStore.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    // Redirect on successful login (if user is now authenticated)
    // Note: Route guards are a more robust way to handle this, we'll add them later
    if (authStore.isAuthenticated) {
       router.push('/'); // Redirect to home page after successful login
    }
  }
};

// Clear errors when component is mounted/navigated to (optional)
// import { onMounted } from 'vue';
// onMounted(() => {
//   authStore.clearError();
// });
</script>

<style scoped>
/* Add any specific styles for the login view here */
.fill-height {
  min-height: 100vh;
}
</style>