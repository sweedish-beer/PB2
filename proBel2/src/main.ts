// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import { createPinia } from "pinia"; // 1. Import createPinia

const app = createApp(App);
const pinia = createPinia(); // 2. Create a Pinia instance

app.use(vuetify);
app.use(router);
app.use(pinia); // 3. Tell the app to use Pinia

app.mount("#app");
