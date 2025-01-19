<template>
  <div class="map-container">
    <img ref="map" src="/assets/map/route_1.png" alt="Map" class="map-image"/>
  </div>
</template>

<script setup>
import eventBus from "@/eventBus.js";
import VirtualWorld from '@/services/VirtualWorld.js';
import {onMounted} from "vue";

const props = defineProps({});

// Lifecycle Events
onMounted(async () => {
  world = new VirtualWorld(
      'MapComponent',
      '/assets/avatar/blue-hair.png',
      '/assets/map/image.png',
      '/api/getUninhabitableAreas',
      '/api/getPreviousLocation',
      '/api/saveLocation'
  );

  // Subscribe to joystick or movement events
  eventBus.on('joystick-move', direction => {
    mapService.move(direction);
  });

  // Save location on navigation
  window.addEventListener('beforeunload', () => this.mapService.saveCurrentLocation());
});
</script>

<style scoped>
.map-container {
  display: block;
  align-items: center;
  padding: 5px; /* Adds consistent inner spacing */
  background-color: #cc8b71;
  border-radius: 10px;
}

.map-image {
  width: 100%; /* Fits the width of the container */
  height: auto; /* Adjusts height proportionally */
  object-fit: contain; /* Ensures no distortion */
}
</style>