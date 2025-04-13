// src/router/index.ts
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

// Define some basic routes
// We'll import actual view components later
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    // Placeholder component for now
    component: () => import("../views/HomeView.vue"), // Example lazy-loading a view
  },
  {
    path: "/login",
    name: "Login",
    // Placeholder component for now
    component: () => import("../views/LoginView.vue"), // Example lazy-loading a view
  },
  {
    path: "/register",
    name: "Register",
    // Placeholder component for now
    component: () => import("../views/RegisterView.vue"), // Example lazy-loading a view
  },
  // We will add more routes here later (Dashboard, Notes, Chat, etc.)
  // And implement route guards for authentication
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Use HTML5 history mode
  routes, // Pass in our routes array
});

export default router;
