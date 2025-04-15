<template>
  <v-app :theme="currentTheme">

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav dense>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" :to="{ name: 'Dashboard' }" link></v-list-item>
        <v-list-item prepend-icon="mdi-note-multiple" title="Notes" :to="{ name: 'Notes' }" link></v-list-item>
        <v-list-item prepend-icon="mdi-palette" title="Doodle" :to="{ name: 'Doodle' }" link></v-list-item>
        <v-list-item prepend-icon="mdi-calculator-variant" title="Calculator" :to="{ name: 'Calculator' }"
          link></v-list-item>
        <v-list-item prepend-icon="mdi-chat" title="AI Chat" :to="{ name: 'Chat' }" link></v-list-item>
        <v-list-item prepend-icon="mdi-graph-outline" title="Flowchart" :to="{ name: 'Flowchart' }" link></v-list-item>
        <v-divider class="my-2"></v-divider>
        <v-list-item v-if="!authStore.isAuthenticated" prepend-icon="mdi-login" title="Login/Register"
          :to="{ name: 'Home' }" link></v-list-item>
        <v-list-item v-if="authStore.isAuthenticated" prepend-icon="mdi-logout" title="Logout" @click="handleLogout"
          link></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" density="compact">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>probel</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn Icon :icon="themeIcon" @click="toggleTheme">

      </v-btn>

    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useTheme } from 'vuetify';
  //import { Icon } from '@iconify/vue'; // Import all icons from Iconify

  const drawer = ref(false);
  const authStore = useAuthStore();
  const theme = useTheme();
  // Use theme.global.name directly for :theme binding
  const currentTheme = ref<'light' | 'dark'>('light'); // Can likely remove this local ref

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme.global.current.value.dark ? 'light' : 'dark';
    theme.global.name.value = newTheme;
    localStorage.setItem('appTheme', newTheme);
    currentTheme.value = newTheme; // Update local ref if kept
  };

  // Computed icon based on the *actual* current Vuetify theme
  const themeIcon = computed(() => {
    return theme.global.current.value.dark ? 'mdi-decagram' : 'mdi-decagram-outline';
  });

  // Load saved theme on component mount
  onMounted(() => {
    const savedTheme = localStorage.getItem('appTheme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme && ['light', 'dark'].includes(savedTheme) ? savedTheme : 'light';
    theme.global.name.value = initialTheme; // Directly set the global theme
    // currentTheme.value = initialTheme; // Update local ref if kept
  });

  // Logout action
  const handleLogout = async () => {
    await authStore.signOut();
    // Assuming route guards handle redirect after sign out
  };
</script>

<style scoped>


  /* From Uiverse.io by kennyotsu */
  :deep(.v-container) {
    z-index: -2;
    width: 100%;
    height: 100%;
    overflow: visible;
    /* Add your background pattern here */
    background-color: #84c6e898;


  }

  /* Apply styles directly to v-main within this layout */
  :deep(main.v-main) {


    background-color: var(--bg-color);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2000' height='2000' viewBox='0 0 800 800'%3E%3Cg fill='NONE' %3E%3Cg stroke='%23026' stroke-width='17'%3E%3Cline x1='-8' y1='-8' x2='808' y2='808'/%3E%3Cline x1='-8' y1='792' x2='808' y2='1608'/%3E%3Cline x1='-8' y1='-808' x2='808' y2='8'/%3E%3C/g%3E%3Cg stroke='%2324256c' stroke-width='16'%3E%3Cline x1='-8' y1='767' x2='808' y2='1583'/%3E%3Cline x1='-8' y1='17' x2='808' y2='833'/%3E%3Cline x1='-8' y1='-33' x2='808' y2='783'/%3E%3Cline x1='-8' y1='-783' x2='808' y2='33'/%3E%3C/g%3E%3Cg stroke='%23392871' stroke-width='15'%3E%3Cline x1='-8' y1='742' x2='808' y2='1558'/%3E%3Cline x1='-8' y1='42' x2='808' y2='858'/%3E%3Cline x1='-8' y1='-58' x2='808' y2='758'/%3E%3Cline x1='-8' y1='-758' x2='808' y2='58'/%3E%3C/g%3E%3Cg stroke='%234b2a75' stroke-width='14'%3E%3Cline x1='-8' y1='67' x2='808' y2='883'/%3E%3Cline x1='-8' y1='717' x2='808' y2='1533'/%3E%3Cline x1='-8' y1='-733' x2='808' y2='83'/%3E%3Cline x1='-8' y1='-83' x2='808' y2='733'/%3E%3C/g%3E%3Cg stroke='%235b2d79' stroke-width='13'%3E%3Cline x1='-8' y1='92' x2='808' y2='908'/%3E%3Cline x1='-8' y1='692' x2='808' y2='1508'/%3E%3Cline x1='-8' y1='-108' x2='808' y2='708'/%3E%3Cline x1='-8' y1='-708' x2='808' y2='108'/%3E%3C/g%3E%3Cg stroke='%236b307c' stroke-width='12'%3E%3Cline x1='-8' y1='667' x2='808' y2='1483'/%3E%3Cline x1='-8' y1='117' x2='808' y2='933'/%3E%3Cline x1='-8' y1='-133' x2='808' y2='683'/%3E%3Cline x1='-8' y1='-683' x2='808' y2='133'/%3E%3C/g%3E%3Cg stroke='%237b337e' stroke-width='11'%3E%3Cline x1='-8' y1='642' x2='808' y2='1458'/%3E%3Cline x1='-8' y1='142' x2='808' y2='958'/%3E%3Cline x1='-8' y1='-158' x2='808' y2='658'/%3E%3Cline x1='-8' y1='-658' x2='808' y2='158'/%3E%3C/g%3E%3Cg stroke='%238a3680' stroke-width='10'%3E%3Cline x1='-8' y1='167' x2='808' y2='983'/%3E%3Cline x1='-8' y1='617' x2='808' y2='1433'/%3E%3Cline x1='-8' y1='-633' x2='808' y2='183'/%3E%3Cline x1='-8' y1='-183' x2='808' y2='633'/%3E%3C/g%3E%3Cg stroke='%23993a82' stroke-width='9'%3E%3Cline x1='-8' y1='592' x2='808' y2='1408'/%3E%3Cline x1='-8' y1='192' x2='808' y2='1008'/%3E%3Cline x1='-8' y1='-608' x2='808' y2='208'/%3E%3Cline x1='-8' y1='-208' x2='808' y2='608'/%3E%3C/g%3E%3Cg stroke='%23a73e83' stroke-width='8'%3E%3Cline x1='-8' y1='567' x2='808' y2='1383'/%3E%3Cline x1='-8' y1='217' x2='808' y2='1033'/%3E%3Cline x1='-8' y1='-233' x2='808' y2='583'/%3E%3Cline x1='-8' y1='-583' x2='808' y2='233'/%3E%3C/g%3E%3Cg stroke='%23b54383' stroke-width='7'%3E%3Cline x1='-8' y1='242' x2='808' y2='1058'/%3E%3Cline x1='-8' y1='542' x2='808' y2='1358'/%3E%3Cline x1='-8' y1='-558' x2='808' y2='258'/%3E%3Cline x1='-8' y1='-258' x2='808' y2='558'/%3E%3C/g%3E%3Cg stroke='%23c24883' stroke-width='6'%3E%3Cline x1='-8' y1='267' x2='808' y2='1083'/%3E%3Cline x1='-8' y1='517' x2='808' y2='1333'/%3E%3Cline x1='-8' y1='-533' x2='808' y2='283'/%3E%3Cline x1='-8' y1='-283' x2='808' y2='533'/%3E%3C/g%3E%3Cg stroke='%23cf4f83' stroke-width='5'%3E%3Cline x1='-8' y1='292' x2='808' y2='1108'/%3E%3Cline x1='-8' y1='492' x2='808' y2='1308'/%3E%3Cline x1='-8' y1='-308' x2='808' y2='508'/%3E%3Cline x1='-8' y1='-508' x2='808' y2='308'/%3E%3C/g%3E%3Cg stroke='%23db5582' stroke-width='4'%3E%3Cline x1='-8' y1='467' x2='808' y2='1283'/%3E%3Cline x1='-8' y1='317' x2='808' y2='1133'/%3E%3Cline x1='-8' y1='-333' x2='808' y2='483'/%3E%3Cline x1='-8' y1='-483' x2='808' y2='333'/%3E%3C/g%3E%3Cg stroke='%23e65d81' stroke-width='3'%3E%3Cline x1='-8' y1='342' x2='808' y2='1158'/%3E%3Cline x1='-8' y1='442' x2='808' y2='1258'/%3E%3Cline x1='-8' y1='-458' x2='808' y2='358'/%3E%3Cline x1='-8' y1='-358' x2='808' y2='458'/%3E%3C/g%3E%3Cg stroke='%23f16580' stroke-width='2'%3E%3Cline x1='-8' y1='367' x2='808' y2='1183'/%3E%3Cline x1='-8' y1='417' x2='808' y2='1233'/%3E%3Cline x1='-8' y1='-433' x2='808' y2='383'/%3E%3Cline x1='-8' y1='-383' x2='808' y2='433'/%3E%3C/g%3E%3Cg stroke='%23FB6E7E' stroke-width='1'%3E%3Cline x1='-8' y1='392' x2='808' y2='1208'/%3E%3Cline x1='-8' y1='-408' x2='808' y2='408'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    background-attachment: fixed;
    background-size: cover;
  }

  :deep(.main.v-main) {
    background-color: var(--bg-color);
  }

  /* --- Override CSS Variables for Light Theme --- */
  :deep(.v-theme--light main.v-main) {
    --pattern-color: rgba(var(--v-theme-on-surface), 0.02);
    --bg-color: rgba(235, 69, 152, 0.685);
    /* Use dark text color, faint */
    --pattern-gradient-stop: rgba(var(--v-theme-on-surface), 0.3);
    /* Lighter shading */
    --pattern-opacity: 0.07;
  }


</style>
