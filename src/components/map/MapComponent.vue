<template>
  <div class="map-container">
    <img ref="map" src="/assets/map/route_1.png" alt="Map" class="map-image"/>
  </div>
</template>

<script>
import eventBus from "@/eventBus.js";
import MapService from '@/services/MapService.js';

export default {
  data() {
    return {
      mapService: null
    };
  },
  mounted() {
    this.mapService = new MapService(
        'MapComponent',
        '/assets/avatar/blue-hair.png',
        '/assets/map/image.png',
        '/api/getUninhabitableAreas',
        '/api/getPreviousLocation',
        '/api/saveLocation'
    );

    // Subscribe to joystick or movement events
    this.$eventBus.on('joystick-move', direction => {
      this.mapService.move(direction);
    });

    // Save location on navigation
    window.addEventListener('beforeunload', () => this.mapService.saveCurrentLocation());
  }
};
</script>

<style scoped>
.map-container {
  display: block;
  align-items: center;
  padding: 5px; /* Adds consistent inner spacing */
  background-color: #8794e3;
  border-radius: 10px;
}

.map-image {
  width: 100%; /* Fits the width of the container */
  height: auto; /* Adjusts height proportionally */
  object-fit: contain; /* Ensures no distortion */
}
</style>