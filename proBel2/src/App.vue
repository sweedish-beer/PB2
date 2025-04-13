<template>
  <component :is="layoutComponent">
     {/* The layout component will contain its own <router-view /> */}
     {/* where the actual page component will be rendered */}
  </component>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, markRaw } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Adjust path if needed
import { onMounted } from 'vue'; // Keep onMounted if still needed

const route = useRoute();
const authStore = useAuthStore(); // Keep if initializeAuthListener is here

// Define available layouts (async components for lazy loading)
const layouts = {
  DefaultLayout: defineAsyncComponent(() => import('@/layouts/DefaultLayout.vue')),
  // Add other layouts here if needed, e.g.:
  // AuthLayout: defineAsyncComponent(() => import('@/layouts/AuthLayout.vue')),
  BlankLayout: defineAsyncComponent(() => import('@/layouts/BlankLayout.vue')), // Fallback
};

// Compute the layout component based on the current route's meta field
const layoutComponent = computed(() => {
  const layoutName = route.meta.layout as keyof typeof layouts | undefined;
  // markRaw prevents Vue from making the layout component itself reactive
  return markRaw(layouts[layoutName || 'BlankLayout'] || layouts['BlankLayout']);
});

// Keep auth listener initialization if it's still here
onMounted(() => {
  authStore.initializeAuthListener();
});
</script>

<style>
/* Remove component-specific styles - maybe keep minimal global styles */
/* body { font-family: 'Roboto', sans-serif; } */ /* Example */
</style>