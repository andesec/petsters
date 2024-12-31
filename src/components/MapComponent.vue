<template>
  <div class="map-container">
    <h2>Map</h2>
    <div class="map-wrapper">
      <img src="/assets/map/route_1.png" alt="Map" class="map-image" />
    </div>
    <p>Use the controls in the right sidebar to interact with the map.</p>
  </div>
</template>

<script>
import eventBus from "@/eventBus.js";

export default {
  mounted() {
    eventBus.on('map-move', this.move);
    eventBus.on('map-right', this.updateFromRight);
  },
  beforeUnmount() {
    eventBus.off('map-move', this.move);
    eventBus.off('map-right', this.updateFromRight);
  },
  methods: {
    // move(update) {
    //   if (update.direction) {
    //     this.$refs.map.move(update.direction);
    //   }
    // },
    move(direction) {
      console.log(`Moving on the map: ${direction}`);
    },
  },
};
</script>

<style scoped>
.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px; /* Adds consistent inner spacing */
  margin: 10px 0; /* Adds separation between sections */
  background-color: #e8eaf6;
  border-radius: 10px;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto; /* Ensures scrollbar appears if content exceeds viewport */
}

.map-wrapper {
  width: 100%;
  max-height: 60vh; /* Limits height to 60% of the viewport */
  overflow: auto; /* Adds scrollbars if needed */
}

.map-image {
  width: 100%; /* Fits the width of the container */
  height: auto; /* Adjusts height proportionally */
  border-radius: 10px;
  object-fit: contain; /* Ensures no distortion */
}
</style>