<template>
  <div class="map-container" id="map-container"></div>
<!--    <img ref="map" src="/assets/map/output.png" alt="Map" class="map-image"/>-->
</template>

<script setup>
import eventBus from "@/eventBus.js";
import {onMounted, onUnmounted, ref} from "vue";
import World from "@/sprites/World.js";
import Player from "@/sprites/Player.js";

const props = defineProps({
  scale: {
    type: Number,
    default: 1
  }
});

let world = ref({});
let player = ref({});

// Methods
function handleJoystickMovement(data) {
  world.movePlayer(data.direction)
}

// Lifecycle Events
onMounted(async () => {
  world = new World('map-container', '/assets/map/output.png', {x:0, y:0});
  await world.init();

  player = new Player('/assets/avatar/blue-hair.png')
  await world.addPlayer(player);

  eventBus.on('joystick-move', handleJoystickMovement);
});

onUnmounted(() => {
  eventBus.off('joystick-move', handleJoystickMovement);
  world.destroy();
  // window.removeEventListener('beforeunload', () => this.mapService.saveCurrentLocation());
});
</script>

<style scoped>
.map-container {
  border-radius: 10px !important;
  width: 100%; /* Fits the width of the container */
  height: auto; /* Adjusts height proportionally */
}

.map-image {
  width: 100%; /* Fits the width of the container */
  height: auto; /* Adjusts height proportionally */
  object-fit: contain; /* Ensures no distortion */
}
</style>