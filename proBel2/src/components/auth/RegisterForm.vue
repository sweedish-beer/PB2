<template>
  <v-form @submit.prevent="handleRegister" class="register-form">
    <v-alert
      v-if="authStore.error" type="error"
      variant="tonal"
      density="compact"
      class="mb-4"
      closable
      @click:close="authStore.clearError()" >
      {{ authStore.error.message || 'An unknown error occurred during registration' }}
    </v-alert>

    <v-text-field
      v-model="email"
      label="Email"
      name="register-email"
      prepend-inner-icon="mdi-email-outline" type="email"
      variant="outlined"
      density="compact"
      required
      :rules="[rules.required, rules.email]"
      :disabled="authStore.loading"
      class="mb-3"
    ></v-text-field>

    <v-text-field
      v-model="password"
      label="Password"
      name="register-password"
      prepend-inner-icon="mdi-lock-outline" :type="showPassword ? 'text' : 'password'"
      variant="outlined"
      density="compact"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="showPassword = !showPassword"
      required
      :rules="[rules.required, rules.passwordLength]"
      :disabled="authStore.loading"
      hint="Password must be at least 6 characters"
      persistent-hint
      class="mb-3"
    ></v-text-field>

     <v-text-field
      v-model="passwordConfirm"
      label="Confirm Password"
      name="register-password-confirm"
      prepend-inner-icon="mdi-lock-check-outline" :type="showConfirmPassword ? 'text' : 'password'"
      variant="outlined"
      density="compact"
      :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="showConfirmPassword = !showConfirmPassword"
      required
      :rules="[rules.required, rules.passwordMatch]"
      :disabled="authStore.loading"
      class="mb-4"
    ></v-text-field>

    <v-btn
      type="submit"
      color="secondary"
      block
      size="large"
      variant="elevated"
      :loading="authStore.loading"
      :disabled="authStore.loading || !passwordsMatch" >
      Sign Up
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth'; // Adjust path if needed

// Get store instance
const authStore = useAuthStore();

// State refs
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
// NOTE: showConfirmationMessage ref is removed - handled by parent view

// Validation rules (copied from RegisterView)
const rules = {
  required: (value: string) => !!value || 'Required.',
  email: (value: string) => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
  passwordLength: (value: string) => (value && value.length >= 6) || 'Password must be at least 6 characters.',
  // Make passwordMatch rule a standard function for use in :rules
  passwordMatch: (value: string) => value === password.value || 'Passwords do not match.',
};

// Computed property to check if passwords match (copied from RegisterView)
const passwordsMatch = computed(() => password.value === passwordConfirm.value && password.value.length > 0);

// Register handler function (copied and simplified from RegisterView)
const handleRegister = async () => {
  // Use computed property and form validation state if available
  // Simple check before calling store:
  if (email.value && password.value && passwordsMatch.value &&
      rules.email(email.value) === true &&
      rules.passwordLength(password.value) === true)
  {
    await authStore.signUp({ // Using action name from your RegisterView
      email: email.value,
      password: password.value,
    });

    // DO NOT handle success message or redirection here.
    // The parent component (RegisterView or HomeView) should react
    // to changes in the authStore state (e.g., lack of error after loading)
    // to display messages or navigate.
  } else {
      // Optionally trigger form validation display manually if needed
      console.log("Registration form validation failed pre-submission check.");
  }
};

// Clear errors when component mounts? (Optional)
import { onMounted } from 'vue';
onMounted(() => {
authStore.clearError();
});
</script>

<style scoped>
.register-form {
  width: 100%;
   background-color: transparent; /* Ensure no background */
}
</style>