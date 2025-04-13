<template>
  <v-container fluid class="landing-page text-center pa-0 fill-height">

    {/* Optional: Animated Background Component would go here if we built it */}
    {/* <AnimatedBackground style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;" /> */}

    {/* Main Content Area - Use z-index to ensure it's above background */}
    <v-row align="center" justify="center" class="fill-height" style="position: relative; z-index: 1;">
      <v-col cols="12" md="8" lg="6">

        {/* Simple Fade Transition for Content */}
        <v-scroll-y-transition appear>
          <div> {/* Wrap content in div for transition */}
            {/* Logo/Icon (Example) */}
            <v-icon size="x-large" color="primary" class="mb-6">mdi-rocket-launch-outline</v-icon>

            {/* App Title */}
            <h1 class="text-h3 font-weight-bold mb-4">Welcome to Multi-App!</h1>

            {/* Tagline/Description */}
            <p class="text-h6 text-medium-emphasis mb-8">
              Your integrated workspace for Notes, Doodles, AI Chat, Calculations, and Flowcharts. <br /> Boost your productivity.
            </p>

            {/* Action Buttons */}
            <v-row justify="center" dense>
              <v-col cols="auto">
                <v-btn
                  color="primary"
                  size="large"
                  :to="{ name: 'Login' }"
                  prepend-icon="mdi-login"
                  elevation="2"
                  >
                  Login
                  </v-btn>
              </v-col>
              <v-col cols="auto">
                 <v-btn
                  variant="outlined"
                  size="large"
                  :to="{ name: 'Register' }"
                   prepend-icon="mdi-account-plus"
                   elevation="2"
                 >
                  Register
                  </v-btn>
              </v-col>
            </v-row>

             {/* Placeholder for more animated components later */}
             <div class="mt-16">
                <p class="text-caption text-disabled">(More interactive elements coming soon!)</p>
             </div>

          </div>
        </v-scroll-y-transition>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// No specific script logic needed for this basic landing page yet
// Animations primarily handled by Vuetify transitions or CSS
</script>

<style scoped>
.landing-page {
  /* Example gradient background if not using canvas */
  background: linear-gradient(to bottom right, rgb(var(--v-theme-surface)), rgb(var(--v-theme-primary)));
  color: white; /* Adjust text color for background */
}

/* Ensure text is readable over gradient */
h1, p {
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

/* Add more styles for animations or specific elements */
</style>