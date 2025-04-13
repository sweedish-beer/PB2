<template>
  <v-container class="calculator-container d-flex justify-center align-center">
    <v-card max-width="400" class="elevation-5">
      <v-card-text>
        <v-text-field
          v-model="display"
          variant="outlined"
          readonly
          reverse
          class="display-field mb-4 text-h5 text-right"
          aria-label="Calculator display"
        ></v-text-field>

        <v-row dense>
          <v-col cols="3"> <v-btn block size="large" variant="tonal" color="grey" @click="handleInput('clear')">AC</v-btn> </v-col>
          <v-col cols="3"> <v-btn block size="large" variant="tonal" color="grey" @click="handleInput('sign')">+/-</v-btn> </v-col>
          <v-col cols="3"> <v-btn block size="large" variant="tonal" color="grey" @click="handleInput('%')">%</v-btn> </v-col>
          <v-col cols="3"> <v-btn block size="large" variant="tonal" color="orange" @click="handleInput('/')">/</v-btn> </v-col>

          <v-col cols="3"> <v-btn block size="large" @click="handleInput('7')">7</v-btn> </v-col>
           <v-col cols="3"> <v-btn block size="large" @click="handleInput('8')">8</v-btn> </v-col>
           <v-col cols="3"> <v-btn block size="large" @click="handleInput('9')">9</v-btn> </v-col>
           <v-col cols="3"> <v-btn block size="large" variant="tonal" color="orange" @click="handleInput('*')">X</v-btn> </v-col>

          <v-col cols="3"> <v-btn block size="large" @click="handleInput('4')">4</v-btn> </v-col>
           <v-col cols="3"> <v-btn block size="large" @click="handleInput('5')">5</v-btn> </v-col>
           <v-col cols="3"> <v-btn block size="large" @click="handleInput('6')">6</v-btn> </v-col>
           <v-col cols="3"> <v-btn block size="large" variant="tonal" color="orange" @click="handleInput('-')">-</v-btn> </v-col>

          <v-col cols="3"> <v-btn block size="large" @click="handleInput('1')">1</v-btn> </v-col>
           <v-col cols="3"> <v-btn block size="large" @click="handleInput('2')">2</v-btn> </v-col>
           <v-col cols="3"> <v-btn block size="large" @click="handleInput('3')">3</v-btn> </v-col>
           <v-col cols="3"> <v-btn block size="large" variant="tonal" color="orange" @click="handleInput('+')">+</v-btn> </v-col>

          <v-col cols="6"> <v-btn block size="large" @click="handleInput('0')">0</v-btn> </v-col>
           <v-col cols="3"> <v-btn block size="large" @click="handleInput('.')">.</v-btn> </v-col>
           <v-col cols="3"> <v-btn block size="large" color="orange" @click="handleInput('=')">=</v-btn> </v-col>

        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// --- Calculator State ---
const display = ref('0'); // What's shown on the display
const currentValue = ref<number | null>(null); // Current numeric value being built/displayed
const previousValue = ref<number | null>(null); // First operand
const operator = ref<string | null>(null); // Pending operator (+, -, *, /)
const waitingForOperand = ref(false); // Flag: True if next digit starts a new number

// --- Helper Function for Calculations ---
const calculate = (num1: number, num2: number, op: string): number => {
    switch (op) {
        case '+': return num1 + num2;
        case '-': return num1 - num2;
        case '*': return num1 * num2;
        case '/':
            if (num2 === 0) {
                alert("Cannot divide by zero!"); // Simple error handling
                return 0; // Or handle error state appropriately
            }
            return num1 / num2;
        default: return num2; // Should not happen
    }
};

// --- Input Handler ---
const handleInput = (value: string) => {
    console.log('Input:', value); // Keep log for debugging

    // Handle Number Input
    if (!isNaN(parseInt(value))) { // Check if input is a digit 0-9
        if (waitingForOperand.value) {
            display.value = value;
            waitingForOperand.value = false;
        } else {
            display.value = display.value === '0' ? value : display.value + value;
        }
        currentValue.value = parseFloat(display.value);
        return;
    }

    // Handle Decimal Point
    if (value === '.') {
        if (waitingForOperand.value) { // Start new number with '0.' if needed
            display.value = '0.';
            waitingForOperand.value = false;
        } else if (!display.value.includes('.')) { // Add decimal only if not present
            display.value += '.';
        }
        // No need to update currentValue yet
        return;
    }

    // Handle Operators (+, -, *, /)
    if (['+', '-', '*', '/'].includes(value)) {
        // Perform previous calculation if needed (operator chaining)
        if (operator.value && previousValue.value !== null && !waitingForOperand.value) {
            currentValue.value = parseFloat(display.value);
            const result = calculate(previousValue.value, currentValue.value, operator.value);
            display.value = String(result);
            previousValue.value = result; // Store result for next operation
        } else {
             // Store current display value as previous value
            previousValue.value = parseFloat(display.value);
        }

        operator.value = value; // Set the new operator
        waitingForOperand.value = true; // Expecting the next operand
        return;
    }

    // Handle Equals (=)
    if (value === '=') {
        if (operator.value && previousValue.value !== null) {
             currentValue.value = parseFloat(display.value);
             const result = calculate(previousValue.value, currentValue.value, operator.value);
             display.value = String(result);
             // Reset state after calculation
             previousValue.value = null; // Clear previous value after '='
             operator.value = null;
             waitingForOperand.value = true; // Ready for new calculation
        }
        return;
    }

    // Handle Clear (AC)
    if (value === 'clear') {
        display.value = '0';
        currentValue.value = null;
        previousValue.value = null;
        operator.value = null;
        waitingForOperand.value = false;
        return;
    }

    // Handle Sign Toggle (+/-)
    if (value === 'sign') {
        if (display.value !== '0') {
            display.value = String(parseFloat(display.value) * -1);
            currentValue.value = parseFloat(display.value);
        }
        return;
    }

    // Handle Percent (%)
    if (value === '%') {
         if (display.value !== '0') {
            display.value = String(parseFloat(display.value) / 100);
            currentValue.value = parseFloat(display.value);
             // Optional: Clear operator/previous after % like '='
             // operator.value = null;
             // previousValue.value = null;
             // waitingForOperand.value = true;
        }
        return;
    }
};
</script>

<style scoped>
.calculator-container {
  min-height: calc(100vh - 64px); /* Adjust 64px based on potential app bar height later */
  padding: 1rem;
}
.display-field :deep(input) {
    text-align: right !important; /* Force text alignment */
    /* Adjust font size/family if needed */
}
</style>