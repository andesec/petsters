<template>
  <div class="map-container" id="map-container">
  </div>
<!--    <img ref="map" src="/assets/map/output.png" alt="Map" class="map-image"/>-->
</template>

<script setup>
import eventBus from "@/eventBus.js";
import {onMounted, ref} from "vue";
import World from "@/services/World.js";

// const props = defineProps({});
// let world = ref({})

// Lifecycle Events
onMounted(async () => {
  World.initTest('map-container', '/assets/map/output.png'); //, '/assets/avatar/blue-hair.png')

  // Save location on navigation
  // window.addEventListener('beforeunload', () => this.mapService.saveCurrentLocation());
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