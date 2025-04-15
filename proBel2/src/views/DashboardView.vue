// src/views/DashboardView.vue
<template>
  <v-container>
    <h1>Dashboard</h1>
    <p>Welcome! You should only see this if you are logged in.</p>
    <div v-if="authStore.getUser">
      <p>User ID: {{ authStore.getUser.id }}</p>
      <p>Email: {{ authStore.getUser.email }}</p>
    </div>
    <v-btn
      color="secondary"
      @click="handleLogout"
      :loading="authStore.isLoading"
    >
      Logout
    </v-btn>
    <!-- From Uiverse.io by SelfMadeSystem -->
    <div class="container">
      <div class="cube" style="--x: -1; --y: -1; --z: -1; --fz: 0"></div>
      <div class="cube" style="--x: -1; --y: -1; --z: -1; --fz: 1"></div>
      <div
        class="cube"
        style="--x: -1; --y: -1; --z: -1; --rx: 1; --fx: -1"
      ></div>
      <div
        class="cube"
        style="--x: -1; --y: -1; --z: -1; --rx: 1; --fx: 1"
      ></div>
      <div
        class="cube"
        style="--x: -1; --y: -1; --z: -1; --ry: 1; --fy: -1"
      ></div>
      <div
        class="cube"
        style="--x: -1; --y: -1; --z: -1; --ry: 1; --fy: 1"
      ></div>
      <div class="cube" style="--x: -1; --y: -1; --z: 0; --fz: 0"></div>
      <div class="cube" style="--x: -1; --y: -1; --z: 0; --fz: 1"></div>
      <div
        class="cube"
        style="--x: -1; --y: -1; --z: 0; --rx: 1; --fx: -1"
      ></div>
      <div
        class="cube"
        style="--x: -1; --y: -1; --z: 0; --rx: 1; --fx: 1"
      ></div>
      <div
        class="cube"
        style="--x: -1; --y: -1; --z: 0; --ry: 1; --fy: -1"
      ></div>
      <div
        class="cube"
        style="--x: -1; --y: -1; --z: 0; --ry: 1; --fy: 1"
      ></div>
      <div class="cube" style="--x: -1; --y: -1; --z: 1; --fz: 0"></div>
      <div class="cube" style="--x: -1; --y: -1; --z: 1; --fz: 1"></div>
      <div
        class="cube"
        style="--x: -1; --y: -1; --z: 1; --rx: 1; --fx: -1"
      ></div>
      <div
        class="cube"
        style="--x: -1; --y: -1; --z: 1; --rx: 1; --fx: 1"
      ></div>
      <div
        class="cube"
        style="--x: -1; --y: -1; --z: 1; --ry: 1; --fy: -1"
      ></div>
      <div
        class="cube"
        style="--x: -1; --y: -1; --z: 1; --ry: 1; --fy: 1"
      ></div>
      <div class="cube" style="--x: -1; --y: 0; --z: -1; --fz: 0"></div>
      <div class="cube" style="--x: -1; --y: 0; --z: -1; --fz: 1"></div>
      <div
        class="cube"
        style="--x: -1; --y: 0; --z: -1; --rx: 1; --fx: -1"
      ></div>
      <div
        class="cube"
        style="--x: -1; --y: 0; --z: -1; --rx: 1; --fx: 1"
      ></div>
      <div
        class="cube"
        style="--x: -1; --y: 0; --z: -1; --ry: 1; --fy: -1"
      ></div>
      <div
        class="cube"
        style="--x: -1; --y: 0; --z: -1; --ry: 1; --fy: 1"
      ></div>
      <div class="cube" style="--x: -1; --y: 0; --z: 0; --fz: 0"></div>
      <div class="cube" style="--x: -1; --y: 0; --z: 0; --fz: 1"></div>
      <div
        class="cube"
        style="--x: -1; --y: 0; --z: 0; --rx: 1; --fx: -1"
      ></div>
      <div class="cube" style="--x: -1; --y: 0; --z: 0; --rx: 1; --fx: 1"></div>
      <div
        class="cube"
        style="--x: -1; --y: 0; --z: 0; --ry: 1; --fy: -1"
      ></div>
      <div class="cube" style="--x: -1; --y: 0; --z: 0; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: -1; --y: 0; --z: 1; --fz: 0"></div>
      <div class="cube" style="--x: -1; --y: 0; --z: 1; --fz: 1"></div>
      <div
        class="cube"
        style="--x: -1; --y: 0; --z: 1; --rx: 1; --fx: -1"
      ></div>
      <div class="cube" style="--x: -1; --y: 0; --z: 1; --rx: 1; --fx: 1"></div>
      <div
        class="cube"
        style="--x: -1; --y: 0; --z: 1; --ry: 1; --fy: -1"
      ></div>
      <div class="cube" style="--x: -1; --y: 0; --z: 1; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: -1; --y: 1; --z: -1; --fz: 0"></div>
      <div class="cube" style="--x: -1; --y: 1; --z: -1; --fz: 1"></div>
      <div
        class="cube"
        style="--x: -1; --y: 1; --z: -1; --rx: 1; --fx: -1"
      ></div>
      <div
        class="cube"
        style="--x: -1; --y: 1; --z: -1; --rx: 1; --fx: 1"
      ></div>
      <div
        class="cube"
        style="--x: -1; --y: 1; --z: -1; --ry: 1; --fy: -1"
      ></div>
      <div
        class="cube"
        style="--x: -1; --y: 1; --z: -1; --ry: 1; --fy: 1"
      ></div>
      <div class="cube" style="--x: -1; --y: 1; --z: 0; --fz: 0"></div>
      <div class="cube" style="--x: -1; --y: 1; --z: 0; --fz: 1"></div>
      <div
        class="cube"
        style="--x: -1; --y: 1; --z: 0; --rx: 1; --fx: -1"
      ></div>
      <div class="cube" style="--x: -1; --y: 1; --z: 0; --rx: 1; --fx: 1"></div>
      <div
        class="cube"
        style="--x: -1; --y: 1; --z: 0; --ry: 1; --fy: -1"
      ></div>
      <div class="cube" style="--x: -1; --y: 1; --z: 0; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: -1; --y: 1; --z: 1; --fz: 0"></div>
      <div class="cube" style="--x: -1; --y: 1; --z: 1; --fz: 1"></div>
      <div
        class="cube"
        style="--x: -1; --y: 1; --z: 1; --rx: 1; --fx: -1"
      ></div>
      <div class="cube" style="--x: -1; --y: 1; --z: 1; --rx: 1; --fx: 1"></div>
      <div
        class="cube"
        style="--x: -1; --y: 1; --z: 1; --ry: 1; --fy: -1"
      ></div>
      <div class="cube" style="--x: -1; --y: 1; --z: 1; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: 0; --y: -1; --z: -1; --fz: 0"></div>
      <div class="cube" style="--x: 0; --y: -1; --z: -1; --fz: 1"></div>
      <div
        class="cube"
        style="--x: 0; --y: -1; --z: -1; --rx: 1; --fx: -1"
      ></div>
      <div
        class="cube"
        style="--x: 0; --y: -1; --z: -1; --rx: 1; --fx: 1"
      ></div>
      <div
        class="cube"
        style="--x: 0; --y: -1; --z: -1; --ry: 1; --fy: -1"
      ></div>
      <div
        class="cube"
        style="--x: 0; --y: -1; --z: -1; --ry: 1; --fy: 1"
      ></div>
      <div class="cube" style="--x: 0; --y: -1; --z: 0; --fz: 0"></div>
      <div class="cube" style="--x: 0; --y: -1; --z: 0; --fz: 1"></div>
      <div
        class="cube"
        style="--x: 0; --y: -1; --z: 0; --rx: 1; --fx: -1"
      ></div>
      <div class="cube" style="--x: 0; --y: -1; --z: 0; --rx: 1; --fx: 1"></div>
      <div
        class="cube"
        style="--x: 0; --y: -1; --z: 0; --ry: 1; --fy: -1"
      ></div>
      <div class="cube" style="--x: 0; --y: -1; --z: 0; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: 0; --y: -1; --z: 1; --fz: 0"></div>
      <div class="cube" style="--x: 0; --y: -1; --z: 1; --fz: 1"></div>
      <div
        class="cube"
        style="--x: 0; --y: -1; --z: 1; --rx: 1; --fx: -1"
      ></div>
      <div class="cube" style="--x: 0; --y: -1; --z: 1; --rx: 1; --fx: 1"></div>
      <div
        class="cube"
        style="--x: 0; --y: -1; --z: 1; --ry: 1; --fy: -1"
      ></div>
      <div class="cube" style="--x: 0; --y: -1; --z: 1; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: 0; --y: 0; --z: -1; --fz: 0"></div>
      <div class="cube" style="--x: 0; --y: 0; --z: -1; --fz: 1"></div>
      <div
        class="cube"
        style="--x: 0; --y: 0; --z: -1; --rx: 1; --fx: -1"
      ></div>
      <div class="cube" style="--x: 0; --y: 0; --z: -1; --rx: 1; --fx: 1"></div>
      <div
        class="cube"
        style="--x: 0; --y: 0; --z: -1; --ry: 1; --fy: -1"
      ></div>
      <div class="cube" style="--x: 0; --y: 0; --z: -1; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: 0; --y: 0; --z: 0; --fz: 0"></div>
      <div class="cube" style="--x: 0; --y: 0; --z: 0; --fz: 1"></div>
      <div class="cube" style="--x: 0; --y: 0; --z: 0; --rx: 1; --fx: -1"></div>
      <div class="cube" style="--x: 0; --y: 0; --z: 0; --rx: 1; --fx: 1"></div>
      <div class="cube" style="--x: 0; --y: 0; --z: 0; --ry: 1; --fy: -1"></div>
      <div class="cube" style="--x: 0; --y: 0; --z: 0; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: 0; --y: 0; --z: 1; --fz: 0"></div>
      <div class="cube" style="--x: 0; --y: 0; --z: 1; --fz: 1"></div>
      <div class="cube" style="--x: 0; --y: 0; --z: 1; --rx: 1; --fx: -1"></div>
      <div class="cube" style="--x: 0; --y: 0; --z: 1; --rx: 1; --fx: 1"></div>
      <div class="cube" style="--x: 0; --y: 0; --z: 1; --ry: 1; --fy: -1"></div>
      <div class="cube" style="--x: 0; --y: 0; --z: 1; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: 0; --y: 1; --z: -1; --fz: 0"></div>
      <div class="cube" style="--x: 0; --y: 1; --z: -1; --fz: 1"></div>
      <div
        class="cube"
        style="--x: 0; --y: 1; --z: -1; --rx: 1; --fx: -1"
      ></div>
      <div class="cube" style="--x: 0; --y: 1; --z: -1; --rx: 1; --fx: 1"></div>
      <div
        class="cube"
        style="--x: 0; --y: 1; --z: -1; --ry: 1; --fy: -1"
      ></div>
      <div class="cube" style="--x: 0; --y: 1; --z: -1; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: 0; --y: 1; --z: 0; --fz: 0"></div>
      <div class="cube" style="--x: 0; --y: 1; --z: 0; --fz: 1"></div>
      <div class="cube" style="--x: 0; --y: 1; --z: 0; --rx: 1; --fx: -1"></div>
      <div class="cube" style="--x: 0; --y: 1; --z: 0; --rx: 1; --fx: 1"></div>
      <div class="cube" style="--x: 0; --y: 1; --z: 0; --ry: 1; --fy: -1"></div>
      <div class="cube" style="--x: 0; --y: 1; --z: 0; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: 0; --y: 1; --z: 1; --fz: 0"></div>
      <div class="cube" style="--x: 0; --y: 1; --z: 1; --fz: 1"></div>
      <div class="cube" style="--x: 0; --y: 1; --z: 1; --rx: 1; --fx: -1"></div>
      <div class="cube" style="--x: 0; --y: 1; --z: 1; --rx: 1; --fx: 1"></div>
      <div class="cube" style="--x: 0; --y: 1; --z: 1; --ry: 1; --fy: -1"></div>
      <div class="cube" style="--x: 0; --y: 1; --z: 1; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: 1; --y: -1; --z: -1; --fz: 0"></div>
      <div class="cube" style="--x: 1; --y: -1; --z: -1; --fz: 1"></div>
      <div
        class="cube"
        style="--x: 1; --y: -1; --z: -1; --rx: 1; --fx: -1"
      ></div>
      <div
        class="cube"
        style="--x: 1; --y: -1; --z: -1; --rx: 1; --fx: 1"
      ></div>
      <div
        class="cube"
        style="--x: 1; --y: -1; --z: -1; --ry: 1; --fy: -1"
      ></div>
      <div
        class="cube"
        style="--x: 1; --y: -1; --z: -1; --ry: 1; --fy: 1"
      ></div>
      <div class="cube" style="--x: 1; --y: -1; --z: 0; --fz: 0"></div>
      <div class="cube" style="--x: 1; --y: -1; --z: 0; --fz: 1"></div>
      <div
        class="cube"
        style="--x: 1; --y: -1; --z: 0; --rx: 1; --fx: -1"
      ></div>
      <div class="cube" style="--x: 1; --y: -1; --z: 0; --rx: 1; --fx: 1"></div>
      <div
        class="cube"
        style="--x: 1; --y: -1; --z: 0; --ry: 1; --fy: -1"
      ></div>
      <div class="cube" style="--x: 1; --y: -1; --z: 0; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: 1; --y: -1; --z: 1; --fz: 0"></div>
      <div class="cube" style="--x: 1; --y: -1; --z: 1; --fz: 1"></div>
      <div
        class="cube"
        style="--x: 1; --y: -1; --z: 1; --rx: 1; --fx: -1"
      ></div>
      <div class="cube" style="--x: 1; --y: -1; --z: 1; --rx: 1; --fx: 1"></div>
      <div
        class="cube"
        style="--x: 1; --y: -1; --z: 1; --ry: 1; --fy: -1"
      ></div>
      <div class="cube" style="--x: 1; --y: -1; --z: 1; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: 1; --y: 0; --z: -1; --fz: 0"></div>
      <div class="cube" style="--x: 1; --y: 0; --z: -1; --fz: 1"></div>
      <div
        class="cube"
        style="--x: 1; --y: 0; --z: -1; --rx: 1; --fx: -1"
      ></div>
      <div class="cube" style="--x: 1; --y: 0; --z: -1; --rx: 1; --fx: 1"></div>
      <div
        class="cube"
        style="--x: 1; --y: 0; --z: -1; --ry: 1; --fy: -1"
      ></div>
      <div class="cube" style="--x: 1; --y: 0; --z: -1; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: 1; --y: 0; --z: 0; --fz: 0"></div>
      <div class="cube" style="--x: 1; --y: 0; --z: 0; --fz: 1"></div>
      <div class="cube" style="--x: 1; --y: 0; --z: 0; --rx: 1; --fx: -1"></div>
      <div class="cube" style="--x: 1; --y: 0; --z: 0; --rx: 1; --fx: 1"></div>
      <div class="cube" style="--x: 1; --y: 0; --z: 0; --ry: 1; --fy: -1"></div>
      <div class="cube" style="--x: 1; --y: 0; --z: 0; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: 1; --y: 0; --z: 1; --fz: 0"></div>
      <div class="cube" style="--x: 1; --y: 0; --z: 1; --fz: 1"></div>
      <div class="cube" style="--x: 1; --y: 0; --z: 1; --rx: 1; --fx: -1"></div>
      <div class="cube" style="--x: 1; --y: 0; --z: 1; --rx: 1; --fx: 1"></div>
      <div class="cube" style="--x: 1; --y: 0; --z: 1; --ry: 1; --fy: -1"></div>
      <div class="cube" style="--x: 1; --y: 0; --z: 1; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: 1; --y: 1; --z: -1; --fz: 0"></div>
      <div class="cube" style="--x: 1; --y: 1; --z: -1; --fz: 1"></div>
      <div
        class="cube"
        style="--x: 1; --y: 1; --z: -1; --rx: 1; --fx: -1"
      ></div>
      <div class="cube" style="--x: 1; --y: 1; --z: -1; --rx: 1; --fx: 1"></div>
      <div
        class="cube"
        style="--x: 1; --y: 1; --z: -1; --ry: 1; --fy: -1"
      ></div>
      <div class="cube" style="--x: 1; --y: 1; --z: -1; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: 1; --y: 1; --z: 0; --fz: 0"></div>
      <div class="cube" style="--x: 1; --y: 1; --z: 0; --fz: 1"></div>
      <div class="cube" style="--x: 1; --y: 1; --z: 0; --rx: 1; --fx: -1"></div>
      <div class="cube" style="--x: 1; --y: 1; --z: 0; --rx: 1; --fx: 1"></div>
      <div class="cube" style="--x: 1; --y: 1; --z: 0; --ry: 1; --fy: -1"></div>
      <div class="cube" style="--x: 1; --y: 1; --z: 0; --ry: 1; --fy: 1"></div>
      <div class="cube" style="--x: 1; --y: 1; --z: 1; --fz: 0"></div>
      <div class="cube" style="--x: 1; --y: 1; --z: 1; --fz: 1"></div>
      <div class="cube" style="--x: 1; --y: 1; --z: 1; --rx: 1; --fx: -1"></div>
      <div class="cube" style="--x: 1; --y: 1; --z: 1; --rx: 1; --fx: 1"></div>
      <div class="cube" style="--x: 1; --y: 1; --z: 1; --ry: 1; --fy: -1"></div>
      <div class="cube" style="--x: 1; --y: 1; --z: 1; --ry: 1; --fy: 1"></div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth"; // Or '../stores/auth'
import { useRouter } from "vue-router"; // <-- Import useRouter

const authStore = useAuthStore();
const router = useRouter(); // <-- Get router instance

const handleLogout = async () => {
  await authStore.signOut();
  // Explicitly redirect to Login page after logout completes
  router.push({ name: "Login" }); // <-- Add this line
};
</script>
<style scoped>
/* From Uiverse.io by SelfMadeSystem */ 
@keyframes hue-rotate {
  to {
    filter: hue-rotate(360deg);
  }
}

.container {
  --w: 35px;
  --g: 5px;
  --t: calc(var(--w) + var(--g));
  width: var(--w);
  aspect-ratio: 1;
  perspective: 120px;
  transform-style: preserve-3d;
}

.cube {
  --fz: 0;
  --rx: 0;
  --fx: 0;
  --ry: 0;
  --fy: 0;
  position: absolute;
  background: #fffc;
  border: 2px solid black;
  width: var(--w);
  aspect-ratio: 1;
  bottom: calc(var(--w) * -0.5);
  right: calc(var(--w) * -0.5);
  animation:
    rotate 30s linear infinite,
    hue-rotate 30s linear infinite;
  transition: 9s;
  --a: translateZ(calc(0.5 * var(--w)))
    translateX(calc(var(--x) * var(--t) - 0.5 * var(--fy) * var(--w)))
    translateY(calc(var(--y) * var(--t) - 0.5 * var(--fx) * var(--w)))
    translateZ(
      calc(
        var(--z) * var(--t) - 0.5 * var(--ry) * var(--w) - 0.5 * var(--rx) *
          var(--w) - var(--fz) * var(--w)
      )
    )
    rotateX(calc(90deg * var(--rx))) rotateY(calc(90deg * var(--ry)));
  --p: translateX(calc(-0.5 * var(--w))) translateY(calc(-0.5 * var(--w)))
    translateZ(calc(-0.5 * var(--w)));
}

.cube:hover {
  background: #f00e;
  transition: 0s;
}

@keyframes rotate {
  0% {
    transform: var(--p) rotateZ(0deg) rotateY(0deg) rotateX(0deg) var(--a);
  }
  to {
    transform: var(--p) rotateZ(360deg) rotateY(720deg) rotateX(360deg) var(--a);
  }
}
</style>