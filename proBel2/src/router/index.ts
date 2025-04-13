// src/router/index.ts
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
// Import Pinia store definition (needed inside the guard)
import { useAuthStore } from "../stores/auth"; // Or '../stores/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/HomeView.vue"),
    meta: {
      layout: 'BlankLayout', // <-- Use BlankLayout for the home page
      requireGuest: true, // <-- Mark as requiring guest access
    }
    // Anyone can access home for now, or add meta: { requiresAuth: true }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginView.vue"),
    meta: { requiresGuest: true, layout: 'BlankLayout' }, // Mark routes only for guests
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/RegisterView.vue"),
    meta: { requiresGuest: true, layout: 'BlankLayout' }, // Mark routes only for guests
  },
  {
    // <-- Add Dashboard route
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/DashboardView.vue"),
    meta: { requiresAuth: true, layout: "DefaultLayout" }, // <-- Mark as requiring authentication
  },
  {
    path: "/notes",
    name: "Notes",
    component: () => import("../views/NotesView.vue"),
    meta: { requiresAuth: true, layout: "DefaultLayout" }, // <-- Protect this route
  },
  {
    path: "/doodle",
    name: "Doodle",
    component: () => import("../views/DoodleView.vue"), // Lazy-load the view
    meta: { requiresAuth: true, layout: "DefaultLayout" }, // <-- Protect this route
  },
  {
    path: "/calculator",
    name: "Calculator",
    component: () => import("../views/CalculatorView.vue"), // Lazy-load the view
    meta: { requiresAuth: true, layout: "DefaultLayout" }, // <-- Protect this route (assuming calculator is for logged-in users)
  },
  {
    path: "/flowchart",
    name: "Flowchart",
    component: () => import("../views/FlowchartView.vue"), // Lazy-load the view
    meta: { requiresAuth: true, layout: "DefaultLayout" }, // <-- Protect this route
  },
  {
    path: "/chat",
    name: "Chat",
    component: () => import("../views/ChatView.vue"), // Lazy-load the view
    meta: { requiresAuth: true, layout: "DefaultLayout" }, // <-- Protect this route
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Global Navigation Guard
//@ts-ignore
router.beforeEach(async (to, from, next) => {
  // Instantiate the auth store INSIDE the guard
  const authStore = useAuthStore();

  // Wait until the initial auth state check is complete, unless already initialized
  while (!authStore.authInitialized && authStore.loading) {
    // This simple loop waits if initialization is ongoing.
    // Consider a more robust solution like an event or watcher if needed.
    await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100ms
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);
  const isAuthenticated = authStore.isAuthenticated;

  console.log(
    `Navigating to: ${to.path}, Requires Auth: ${requiresAuth}, Requires Guest: ${requiresGuest}, Is Authenticated: ${isAuthenticated}`
  );

  if (requiresAuth && !isAuthenticated) {
    // User needs to be authenticated but isn't. Redirect to login.
    console.log("Guard: Not authenticated, redirecting to login.");
    next({ name: "Login" });
  } else if (requiresGuest && isAuthenticated) {
    // User is authenticated but trying to access guest-only pages (Login/Register). Redirect to dashboard.
    console.log(
      "Guard: Authenticated user trying to access guest page, redirecting to dashboard."
    );
    next({ name: "Dashboard" }); // Or '/' if Home is the main authenticated landing page
  } else {
    // Allow navigation
    console.log("Guard: Allowing navigation.");
    next();
  }
});

export default router;
