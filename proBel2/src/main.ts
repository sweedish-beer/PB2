// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router"; // Import the router instance

const app = createApp(App);

app.use(vuetify);
app.use(router); // Use the router

app.mount("#app");
