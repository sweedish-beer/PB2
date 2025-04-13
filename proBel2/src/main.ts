import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

// Import the Vuetify plugin
import vuetify from "./plugins/vuetify";

// Create app with Vuetify
createApp(App)
  .use(vuetify) // Use the Vuetify plugin
  .mount("#app");
