// src/plugins/vuetify.ts

import "vuetify/styles"; // Import Vuetify styles
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader for this dependency

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { type ThemeDefinition } from "vuetify";

// Define a custom light theme (optional, can customize later)
const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: "#FFFFFF", // White background
    surface: "#FFFFFF", // Component surfaces like cards
    primary: "#6200EE", // Primary color (example purple)
    secondary: "#03DAC6", // Secondary color (example teal)
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
};

// Define a custom dark theme (optional, can customize later)
const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: "#111111", // Dark background
    surface: "#222222", // Dark surfaces
    primary: "#6200EE", // Primary color (example purple)
    secondary: "#03DAC6", // Secondary color
    error: "#CF6679",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
};

// Create the Vuetify instance
const vuetify = createVuetify({
  components, // Use all Vuetify components
  directives, // Use all Vuetify directives
  theme: {
    defaultTheme: "light", // Set the default theme
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
  icons: {
    defaultSet: "mdi", // Use Material Design Icons
  },
});

export default vuetify; // Export the instance
