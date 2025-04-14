<template>
  <v-container class="calculator-container d-flex flex-column justify-center align-center">
    <v-card max-width="400" class="elevation-5 calculator-card">
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

    <RecentCalculations
        :history="history"
        @clear-history="clearHistory"
        style="max-width: 400px; width: 100%;"
        class="history-component"
        aria-label="Calculation History"
    />

  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// --- Import the new component ---
import RecentCalculations from '@/components/RecentCalculations.vue';

// --- Constants ---
const LOCAL_STORAGE_HISTORY_KEY = 'calculatorHistory';
const MAX_HISTORY_LENGTH = 15; // Keep the last 15 calculations

// --- Calculator State ---
const display = ref('0'); // What's shown on the display
// Note: Removed currentValue ref as parseFloat(display.value) is used directly when needed.
const previousValue = ref<number | null>(null); // First operand
const operator = ref<string | null>(null); // Pending operator (+, -, *, /)
const waitingForOperand = ref(false); // Flag: True if next digit starts a new number

// --- History State ---
interface HistoryEntry {
  expression: string;
  result: string;
  timestamp: number;
}
const history = ref<HistoryEntry[]>([]);

// --- History Functions ---
const addCalculationToHistory = (expression: string, result: string) => {
  // Ensure expression ends with '=' for clarity
  const formattedExpression = expression.endsWith('=') ? expression : `${expression} =`;

  const newEntry: HistoryEntry = {
    expression: formattedExpression,
    result: result,
    timestamp: Date.now(),
  };

  // Add to the beginning of the array
  const updatedHistory = [newEntry, ...history.value];

  // Limit history size
  if (updatedHistory.length > MAX_HISTORY_LENGTH) {
    updatedHistory.length = MAX_HISTORY_LENGTH; // Trim older entries
  }

  history.value = updatedHistory;

  // Save to localStorage
  try {
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(history.value));
  } catch (error) {
    console.error("Error saving calculator history to localStorage:", error);
    // Handle potential storage errors (e.g., quota exceeded)
  }
};

const loadHistory = () => {
  try {
    const storedHistory = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory);
      if (Array.isArray(parsedHistory)) {
         // TODO: Add validation for item structure if needed
         history.value = parsedHistory;
         console.log("Calculator history loaded:", history.value.length);
      } else {
         console.warn("Invalid calculator history format found. Clearing.");
         localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
         history.value = [];
      }
    } else {
        history.value = []; // No history found
    }
  } catch (error) {
    console.error("Error loading/parsing calculator history:", error);
    history.value = [];
    localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
  }
};

const clearHistory = () => {
    history.value = [];
    try {
        localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
        console.log("Calculator history cleared.");
    } catch (error) {
         console.error("Error removing calculator history:", error);
    }
};

// --- Calculation Helper ---
// Returns result or throws an error for division by zero
const calculate = (num1: number, num2: number, op: string): number => {
    switch (op) {
        case '+': return num1 + num2;
        case '-': return num1 - num2;
        case '*': return num1 * num2;
        case '/':
            if (num2 === 0) {
                throw new Error("Cannot divide by zero!"); // Throw error
            }
            return num1 / num2;
        default:
            console.warn("Invalid operator in calculate:", op);
            return num2; // Return second number if operator invalid
    }
};

// --- Input Handler (Modified for History) ---
const handleInput = (value: string) => {
    // Handle Number Input
    if (!isNaN(parseInt(value))) {
        if (waitingForOperand.value) {
            display.value = value;
            waitingForOperand.value = false;
        } else {
            display.value = display.value === '0' ? value : display.value + value;
        }
        // currentValue.value = parseFloat(display.value); // Not strictly needed here anymore
        return;
    }

    // Handle Decimal Point
    if (value === '.') {
        if (waitingForOperand.value) {
            display.value = '0.';
            waitingForOperand.value = false;
        } else if (!display.value.includes('.')) {
            display.value += '.';
        }
        return;
    }

    // Handle Operators (+, -, *, /)
    if (['+', '-', '*', '/'].includes(value)) {
        const currentDisplayValue = parseFloat(display.value);

        // Perform previous calculation if chaining
        if (operator.value && previousValue.value !== null && !waitingForOperand.value) {
            try {
                // --- Capture state BEFORE calculation for history ---
                const expression = `${previousValue.value} ${operator.value} ${currentDisplayValue}`;
                const result = calculate(previousValue.value, currentDisplayValue, operator.value);
                // --- Add to history AFTER successful calculation ---
                addCalculationToHistory(expression, String(result));

                // Update state for next operation
                display.value = String(result);
                previousValue.value = result;

            } catch(error: any) {
                 console.error("Calculation error:", error);
                 display.value = "Error"; // Show error on display
                 // Reset state on error during chaining?
                 previousValue.value = null;
                 operator.value = null;
                 waitingForOperand.value = true; // Allow starting fresh
                 return; // Stop processing this operator input
            }
        } else {
             // Just store current value as previous for the first operator press
            previousValue.value = currentDisplayValue;
        }

        operator.value = value; // Set the new operator
        waitingForOperand.value = true; // Expecting the next operand
        return;
    }

    // Handle Equals (=)
    if (value === '=') {
        if (operator.value && previousValue.value !== null) {
            const currentDisplayValue = parseFloat(display.value);
             try {
                // --- Capture state BEFORE calculation ---
                const expression = `${previousValue.value} ${operator.value} ${currentDisplayValue}`;
                const result = calculate(previousValue.value, currentDisplayValue, operator.value);
                 // --- Add to history AFTER successful calculation ---
                addCalculationToHistory(expression, String(result));

                // Update display
                display.value = String(result);

            } catch (error: any) {
                 console.error("Calculation error:", error);
                 display.value = "Error"; // Show error on display
            } finally {
                 // Reset state after calculation (or error)
                 previousValue.value = null;
                 operator.value = null;
                 waitingForOperand.value = true; // Ready for new calculation input
            }
        } // else: do nothing if '=' pressed without operator/previous value
        return;
    }

    // Handle Clear (AC)
    if (value === 'clear') {
        display.value = '0';
        // currentValue.value = null; // No longer used
        previousValue.value = null;
        operator.value = null;
        waitingForOperand.value = false;
        return;
    }

    // Handle Sign Toggle (+/-)
    if (value === 'sign') {
        if (display.value !== '0' && display.value !== 'Error') {
            display.value = String(parseFloat(display.value) * -1);
           // currentValue.value = parseFloat(display.value); // No longer used
        }
        return;
    }

    // Handle Percent (%)
    if (value === '%') {
         if (display.value !== '0' && display.value !== 'Error') {
            // --- Potential History Item for Percentage ---
            const currentValueForPercent = parseFloat(display.value);
            const result = currentValueForPercent / 100;
            const expression = `${currentValueForPercent} %`; // Simple expression for %
            addCalculationToHistory(expression, String(result));
            // --- End History Add ---

            display.value = String(result);
            // Decide if % should finalize like '='
            // operator.value = null;
            // previousValue.value = null;
            waitingForOperand.value = true; // Often allows starting new calc
        }
        return;
    }
};

// --- Load history when component mounts ---
onMounted(() => {
  loadHistory();
});
</script>

<style scoped>
.calculator-container {
  padding: 1rem;
}
/* Ensure calculator and history cards don't exceed viewport width on small screens */
.calculator-card, .history-component {
    width: 100%;
}

.display-field :deep(input) {
    text-align: right !important;
    font-weight: 500; /* Make display slightly bolder perhaps */
    letter-spacing: 0.05em; /* Adjust spacing if needed */
}

/* Add margin between calculator card and history card */
.calculator-card {
    margin-bottom: 1.5rem; /* Adjust spacing as needed */
}
</style>