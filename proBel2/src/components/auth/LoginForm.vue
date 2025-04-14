// src/components/auth/LoginForm.vue

<template>
  <v-form @submit.prevent="handleLogin" class="login-form">
    <v-alert
      v-if="authStore.error" type="error"
      variant="tonal"
      density="compact"
      class="mb-4"
      closable
      @click:close="authStore.clearError()" >
      {{ authStore.error.message || 'An unknown error occurred' }}
    </v-alert>

    <v-text-field
      v-model="email"
      label="Email"
      name="login-email"
      prepend-inner-icon="mdi-email-outline" type="email"
      variant="outlined"          
      density="compact"           
      required
      :rules="[rules.required, rules.email]"
      :disabled="authStore.loading" class="mb-3"                
    ></v-text-field>

    <v-text-field
      v-model="password"
      label="Password"
      name="login-password"
      prepend-inner-icon="mdi-lock-outline" :type="showPassword ? 'text' : 'password'"
      variant="outlined"          
      density="compact"           
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="showPassword = !showPassword" required
      :rules="[rules.required]"
      :disabled="authStore.loading" class="mb-4"                
    ></v-text-field>

    <v-btn
      type="submit"
      color="primary"
      block
      size="large"                
      variant="elevated"          
      :loading="authStore.loading"   :disabled="authStore.loading"
    >
      Login
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// Import only the auth store - NO router needed here
import { useAuthStore } from '@/stores/auth'; // Adjust path if needed

// State refs for form inputs
const email = ref('');
const password = ref('');
const showPassword = ref(false); // Added for password visibility toggle

// Get auth store instance
const authStore = useAuthStore();

// Basic validation rules (copied from LoginView)
const rules = {
  required: (value: string) => !!value || 'Required.',
  email: (value: string) => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
};

// Login handler function (copied and simplified from LoginView)
const handleLogin = async () => {
  // Optional: Add Vuelidate or vee-validate for better form validation state
  if (email.value && password.value && rules.email(email.value)) {
    // Call the store action (ensure your store action is named signInWithPassword)
    await authStore.signInWithPassword({ // Using the action name from your LoginView
      email: email.value,
      password: password.value,
    });
    // DO NOT REDIRECT HERE - Redirection should be handled by route guards
    // or watchers reacting to the auth state changes, not within the reusable form.
  }
};

// Clear errors when component mounts? Could be done here or in parent view.
// import { onMounted } from 'vue';
// onMounted(() => {
//   authStore.clearError();
// });
</script>

<style scoped>
.login-form {
  width: 100%;
  background-color: transparent; /* Ensure no background */
}
/* Remove any margin/padding if needed, although it's usually better */
/* to handle spacing in the parent component where this is used. */
</style>