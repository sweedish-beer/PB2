<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="secondary" dark flat> 
            <v-toolbar-title>Sign Up</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleRegister">
              <v-text-field
                v-model="email"
                label="Email"
                name="register-email"
                prepend-icon="mdi-email"
                type="email"
                required
                :rules="[rules.required, rules.email]"
                :disabled="authStore.isLoading"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                name="register-password"
                prepend-icon="mdi-lock"
                type="password"
                required
                :rules="[rules.required, rules.passwordLength]"
                :disabled="authStore.isLoading"
                hint="Password must be at least 6 characters"
                persistent-hint
              ></v-text-field>

               <v-text-field
                v-model="passwordConfirm"
                label="Confirm Password"
                name="register-password-confirm"
                prepend-icon="mdi-lock-check"
                type="password"
                required
                :rules="[rules.required, rules.passwordMatch]"
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

              <v-alert
                v-if="showConfirmationMessage"
                type="success"
                density="compact"
                variant="tonal"
                class="mb-4"
              >
                Sign up successful! Please check your email to confirm your account.
              </v-alert>

              <v-btn
                type="submit"
                color="secondary" 
                block
                :loading="authStore.isLoading"
                :disabled="authStore.isLoading || !passwordsMatch" 
              >
                Sign Up
              </v-btn>
            </v-form>
             <v-card-actions>
              <v-spacer></v-spacer>
               Already have an account? <router-link to="/login" class="ml-1">Login</router-link>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth'; // Use '../stores/auth' if alias not working

// State refs
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const showConfirmationMessage = ref(false); // To show success message

// Get store instance
const authStore = useAuthStore();

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Required.',
  email: (value: string) => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
  passwordLength: (value: string) => value.length >= 6 || 'Password must be at least 6 characters.',
  passwordMatch: (value: string) => value === password.value || 'Passwords do not match.',
};

// Computed property to check if passwords match
const passwordsMatch = computed(() => password.value === passwordConfirm.value && password.value.length > 0);

// Register handler function
const handleRegister = async () => {
  showConfirmationMessage.value = false; // Reset confirmation message
  // Optional: Add form validation check here
  if (email.value && password.value && passwordsMatch.value) {
    await authStore.signUp({
      email: email.value,
      password: password.value,
    });

    // Check if sign up was successful (no error) and show confirmation message
    // Note: This assumes email confirmation is required. If auto-confirmed, user might be logged in.
    if (!authStore.getError) {
      // Optionally clear form or show message
      // email.value = ''; // Example clear
      // password.value = '';
      // passwordConfirm.value = '';
      showConfirmationMessage.value = true;
      console.log("Sign up request sent. Check Supabase logs and email for confirmation if enabled.");
    }
  } else if (!passwordsMatch.value) {
      console.log("Passwords do not match validation triggered.");
      // Optionally set a specific error or rely on field rules
  }
};

// Clear errors when component is mounted (optional)
// import { onMounted } from 'vue';
// onMounted(() => {
//   authStore.clearError();
// });
</script>

<style scoped>
/* Add any specific styles for the register view here */
.fill-height {
  min-height: 100vh;
}
</style>