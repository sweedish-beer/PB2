<template>
  <v-card class="mt-6 elevation-3" v-if="history && history.length > 0">
    <v-card-title class="text-subtitle-1 py-2">
      Calculation History
    </v-card-title>
    <v-divider></v-divider>
    <v-list density="compact" class="history-list">
      <v-list-item
        v-for="(item, index) in history"
        :key="item.timestamp + '-' + index"
        class="history-item"
      >
        <v-list-item-content>
          <div class="text-caption text-grey">{{ item.expression }}</div>
          <div class="text-body-2 font-weight-medium">{{ item.result }}</div>
        </v-list-item-content>
         </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="warning"
        variant="text"
        size="small"
        @click="$emit('clear-history')"
      >
        Clear History
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-card class="mt-6 elevation-3" v-else>
     <v-card-text class="text-center text-disabled">
         No history recorded yet.
     </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface HistoryEntry {
  expression: string;
  result: string;
  timestamp: number;
}

// Define props the component accepts
defineProps<{
  history: HistoryEntry[];
}>();

// Define events the component can emit
defineEmits<{
  (e: 'clear-history'): void;
  // (e: 'use-result', value: string): void; // If adding re-use button
}>();
</script>

<style scoped>
.history-list {
  max-height: 250px; /* Limit height and make scrollable */
  overflow-y: auto;
}
.history-item {
  padding-top: 4px;
  padding-bottom: 4px;
}
/* Alternate background colors slightly */
/* .history-item:nth-child(odd) {
  background-color: rgba(var(--v-theme-on-surface), 0.03);
} */
</style>