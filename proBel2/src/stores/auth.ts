// src/stores/auth.ts
import { defineStore } from "pinia";
import { supabase } from "../services/supabase"; // Use @ alias configured in vite.config.ts
import type { User, Session } from "@supabase/supabase-js";
//import router from "../router"; // Import router for redirects

export const useAuthStore = defineStore("auth", {
  // STATE: Data properties managed by the store
  state: () => ({
    user: null as User | null, // Holds user data if logged in
    session: null as Session | null, // Holds session data if logged in
    loading: true, // To track loading state during auth operations
    authError: null as Error | null, // To store any auth errors
    authInitialized: false, // To track if auth has been initialized
  }),

  // GETTERS: Computed properties derived from state
  getters: {
    isAuthenticated: (state): boolean => !!state.user, // Check if user object exists
    isLoading: (state): boolean => state.loading,
    getUser: (state): User | null => state.user,
    getError: (state): Error | null => state.authError,
  },

  // ACTIONS: Methods to perform asynchronous operations or mutate state
  actions: {
    // Action to check the current session when the app loads or store is initialized
    async initializeAuthListener() {
      this.authError = null;
      try {
        // Get initial session data
        const {
          data: { session },
        } = await supabase.auth.getSession();
       //Handle initial session
        this.session = session;
        this.user = session?.user ?? null;

        // Set up listener AFTER initial check
        supabase.auth.onAuthStateChange((event, session) => {
          console.log("Auth state changed:", event, session);
          const store = useAuthStore(); // Get store instance inside callback
          store.session = session;
          store.user = session?.user ?? null;
          store.loading = false;
        });

        // Mark initialization complete AFTER session check and listener setup
        this.authInitialized = true; // <-- Set flag here

      } catch (error: any) {
        console.error("Error initializing auth:", error);
        this.authError = error;
        this.authInitialized = true; // Also set true on error to allow navigation
      } finally {
         // Set loading false only after initialization attempt is fully complete
         // This ensures guards wait until we know the initial auth status.
        this.loading = false;
      }
    },

    // ---Actions (Login/Sign-up interaction) ---

    async signUp(credentials: {
      email?: string;
      password?: string;
      phone?: string;
    }) {
      if (!credentials.email || !credentials.password) {
        this.authError = new Error(
          "Email and password are required for sign up."
        );
        return;
      }
      this.loading = true;
      this.authError = null;
      try {
        // Note: Supabase signUp might require email confirmation by default.
        const { data, error } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          // phone: credentials.phone, // Add if using phone signup
          // options: { data: { full_name: 'Optional Name' } } // Optional: add user metadata
        });

        if (error) throw error;

        // Check if sign up requires email confirmation (common default)
        if (data.user && data.user.identities?.length === 0) {
          // User exists but needs confirmation - this isn't an error
          // You might want to inform the user to check their email
          console.log(
            "Sign up successful, please check your email for confirmation."
          );
          // Optionally set a specific state or message for confirmation pending
        } else if (data.session) {
          // If email confirmation is disabled or auto-confirmed, session might be available
          this.session = data.session;
          this.user = data.session.user;
        }
        // If confirmation needed, onAuthStateChange will trigger SIGNED_IN later after confirmation

        console.log("Sign up response data:", data);
      } catch (error: any) {
        console.error("Error signing up:", error);
        this.authError = error;
      } finally {
        this.loading = false;
      }
    },

    async signInWithPassword(credentials: {
      email?: string;
      password?: string;
      phone?: string;
    }) {
      if (!credentials.email || !credentials.password) {
        this.authError = new Error(
          "Email and password are required for sign in."
        );
        return;
      }
      this.loading = true;
      this.authError = null;
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
          // phone: credentials.phone, // Add if using phone signin
        });

        if (error) throw error;

        // Update state immediately - onAuthStateChange will also fire
        this.session = data.session;
        this.user = data.session?.user ?? null; // Use nullish coalescing

        console.log("Sign in successful:", data.session);
        // Redirect will likely be handled by route guards or component logic now
      } catch (error: any) {
        console.error("Error signing in:", error);
        this.authError = error;
        // Clear user/session on failed login attempt
        this.user = null;
        this.session = null;
      } finally {
        this.loading = false;
      }
    },

    async signOut() {
      this.loading = true;
      this.authError = null;
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        // Clear state immediately - onAuthStateChange will also fire
        this.user = null;
        this.session = null;

        console.log("Sign out successful");
        // Redirect will likely be handled by route guards or component logic
      } catch (error: any) {
        console.error("Error signing out:", error);
        this.authError = error;
      } finally {
        this.loading = false;
      }
    },

    // Keep helper action clearError here...
    clearError() {
      this.authError = null;
    },
  },
});
