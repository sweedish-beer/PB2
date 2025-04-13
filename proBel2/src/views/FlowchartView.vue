<template>
  <v-container fluid class="fill-height flowchart-container pa-0">

    <VueFlow
        v-model="elements"
        @connect="onConnect"
        @pane-key-down="onPaneKeyDown"
    >
        <Controls />

        <MiniMap />

        </VueFlow>

    <v-btn
        fab
        location="bottom right"
        position="absolute"
        size="large"
        color="primary"
        icon="mdi-plus"
        class="ma-4"
        title="Add Node"
        @click="addNode"
    ></v-btn>

  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// --- Vue Flow Imports ---
import {
    VueFlow,
    useVueFlow, // Import composable to access Vue Flow instance
    type Elements,
    type Node,
    type Edge,
    Position,
    addEdge,
    type Connection,
    type FlowEvents // Import FlowEvents type for keydown handler
} from '@vue-flow/core';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
// Optional: Import Background component
// import { Background, BackgroundVariant } from '@vue-flow/background'

// --- CSS Imports for Vue Flow ---
import '@vue-flow/core/dist/style.css';          /* basic vue flow styles */
import '@vue-flow/core/dist/theme-default.css'; /* default theme */
import '@vue-flow/controls/dist/style.css';     /* controls styles */
import '@vue-flow/minimap/dist/style.css';      /* minimap styles */


// --- Initial State ---
// Define the starting nodes and edges
const initialElements: Elements = [
  { id: '1', type: 'input', label: 'Start Node', position: { x: 250, y: 50 } },
  { id: '2', label: 'Step 2', position: { x: 250, y: 150 } },
  { id: '3', type: 'output', label: 'End Node', position: { x: 250, y: 250 } },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', label: 'Process Complete' },
];

// Reactive ref holding all nodes and edges
const elements = ref<Elements>(initialElements);

// Counters for generating unique IDs
const newNodeCounter = ref(4); // Start after initial nodes
const newEdgeCounter = ref(1); // Start edge IDs

// --- Get Vue Flow instance methods ---
// Use the composable within setup script to access internal state/methods
const {
    getSelectedNodes, // Function to get selected node objects
    getSelectedEdges, // Function to get selected edge objects
    removeNodes,      // Utility function to remove nodes by ID/object
    removeEdges       // Utility function to remove edges by ID/object
} = useVueFlow();


// --- Methods ---

// Method to add a new node to the canvas
const addNode = () => {
  const nodeId = `${newNodeCounter.value++}`; // Generate ID like '4', '5', etc.
  const newNode: Node = {
    id: nodeId,
    label: `Node ${nodeId}`, // Default label
    position: {
        // Place randomly near the center for demo purposes
        x: 200 + Math.random() * 200,
        y: 100 + Math.random() * 200
    },
    // type: 'default', // Can specify node type if needed
  };
  // Add the new node object to the reactive elements array
  elements.value.push(newNode);
};

// Method called by VueFlow when a connection is made via dragging
const onConnect = (params: Connection | Edge) => {
  // Assign a unique ID to the new edge
  params.id = `e-${newEdgeCounter.value++}`;
  // Optionally make the new edge animated
  params.animated = true;
  // Use the addEdge utility function from Vue Flow to add the edge
  // This correctly handles the connection parameters and updates the elements ref
  addEdge(params, elements.value);
};

// Replace the ENTIRE existing onPaneKeyDown function with this one:
const onPaneKeyDown = (event: FlowEvents['paneKeyDown']) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
        console.log('Delete/Backspace pressed (Attempting Manual Filter)');

        // Find IDs of elements marked as selected directly in our ref
        const selectedNodeIds = elements.value
            .filter(el => el.selected && 'position' in el) // Nodes have 'position' property
            .map(el => el.id);
        const selectedEdgeIds = elements.value
            .filter(el => el.selected && 'source' in el) // Edges have 'source' property
            .map(el => el.id);

        console.log('Manually found Selected Node IDs:', selectedNodeIds);
        console.log('Manually found Selected Edge IDs:', selectedEdgeIds);

        // Proceed if any elements were found marked as selected
        if (selectedNodeIds.length > 0 || selectedEdgeIds.length > 0) {

            // Create a new array excluding selected elements and connected edges
            elements.value = elements.value.filter(el => {
                // Exclude selected nodes
                if (selectedNodeIds.includes(el.id)) {
                    return false;
                }
                // Exclude selected edges
                if (selectedEdgeIds.includes(el.id)) {
                    return false;
                }
                // Exclude edges connected to deleted nodes
                if ('source' in el && (selectedNodeIds.includes(el.source) || selectedNodeIds.includes(el.target))) {
                     console.log(`Filtering out edge ${el.id} connected to deleted node`);
                     return false;
                }
                // Keep all other elements
                return true;
            });

            console.log('Elements after manual filtering:', elements.value);
        } else {
             console.log('No elements found with .selected property true in the elements array.');
        }
    }
}

</script>

<style scoped>
.flowchart-container {
    /* Ensure container takes up space */
    height: calc(100vh - 64px); /* Full viewport height minus potential app bar */
    width: 100%;
    background-color: #f8f8f8; /* Light background for visibility */
}

/* Optional: Deeper styling for Vue Flow elements */
:deep(.vue-flow__node) {
    /* Example: Add border */
    border: 1px solid #999;
    border-radius: 4px;
    font-size: 12px; /* Adjust font size */
}

:deep(.vue-flow__node.selected) {
    /* Style for selected nodes */
    box-shadow: 0 0 0 2px var(--vf-primary, #1a192b);
}

:deep(.vue-flow__handle) {
     /* Make handles slightly larger/easier to grab */
     width: 8px;
     height: 8px;
     border-radius: 50%;
     background-color: #555;
}
</style>