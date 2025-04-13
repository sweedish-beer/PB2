<template>
  <div ref="canvasContainerRef" class="canvas-container">
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, defineProps } from 'vue';
import p5 from 'p5';

const props = defineProps({
    strokeColor: { type: String, default: '#000000' },
    strokeWeightValue: { type: Number, default: 4 },
    clearCanvasTrigger: { type: Number, default: 0 },
    saveCanvasTrigger: { type: Number, default: 0 },
    isErasing: { type: Boolean, default: false } // <-- Add isErasing prop
});

const canvasContainerRef = ref<HTMLDivElement | null>(null);
let p5Instance: p5 | null = null;

const backgroundColor = 240; // <-- Store background color

const sketch = (p: p5) => {
  let canvasWidth = 400;
  let canvasHeight = 400;
  let mainCanvas: p5.Renderer | null = null;

  p.setup = () => {
    if (canvasContainerRef.value) {
        canvasWidth = canvasContainerRef.value.offsetWidth;
        canvasHeight = 400;
    }
    mainCanvas = p.createCanvas(canvasWidth, canvasHeight);
    p.background(backgroundColor); // <-- Use variable
    p.strokeCap(p.ROUND);
    p.strokeJoin(p.ROUND);
  };

 p.draw = () => {
    if (p.mouseIsPressed) {
        // --- Update this section ---
        // Set stroke weight based on prop
        p.strokeWeight(props.strokeWeightValue);

        // Set stroke color based on erasing mode
        if (props.isErasing) {
            p.stroke(backgroundColor); // Use background color for erasing
        } else {
            p.stroke(props.strokeColor); // Use selected color for drawing
        }
        // --- End update ---

        // Draw the line
        p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
    }
  };
  p.windowResized = () => {
      if (canvasContainerRef.value) {
        canvasWidth = canvasContainerRef.value.offsetWidth;
        canvasHeight = 400;
        p.resizeCanvas(canvasWidth, canvasHeight);
        p.background(240);
      }
  };
//@ts-expect-error
  // Expose clear and save functions on the instance
   p.clearCanvas = () => {
       p.background(240);
   }
//@ts-expect-error
   p.saveDrawing = () => {
       // Use the direct p5 saveCanvas function
       if (mainCanvas) { // Check if canvas exists
           p.saveCanvas(mainCanvas, 'myDoodle.png');
       } else {
           console.error("Canvas not available for saving.");
       }
   }
   
};

// --- onMounted, onUnmounted, watchers remain the same ---
onMounted(() => {
  if (canvasContainerRef.value) {
     p5Instance = new p5(sketch, canvasContainerRef.value);
  }
});

onUnmounted(() => {
  if (p5Instance) {
    p5Instance.remove();
    p5Instance = null;
  }
});

 watch(() => props.clearCanvasTrigger, () => {
    if (p5Instance) { // Check if instance exists
       console.log("Triggering background clear"); // Debug log
       p5Instance.background(backgroundColor); // Call background() directly
    } else {
        console.warn("Clear trigger fired but p5 instance not ready.");
    }
 });

 watch(() => props.saveCanvasTrigger, () => {
    if (p5Instance) { // Check if instance exists
        console.log("Calling saveCanvas..."); // Debug log
       p5Instance.saveCanvas('myDoodle.png'); // Call saveCanvas directly
    } else {
        console.warn("Save trigger fired but p5 instance not ready.");
    }
 });
// --- End of watchers ---

</script>

<style scoped>
/* Styles remain the same */
.canvas-container { width: 100%; max-width: 600px; height: 400px; margin: 1em auto; border: 1px solid #ccc; overflow: hidden; cursor: crosshair; }
:deep(canvas) { display: block; }
</style>