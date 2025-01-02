<template xmlns="http://www.w3.org/1999/html">
  <p>Use the controls in the right sidebar to interact with the map.</p>
  <br/>
  <div class="map-container">
    <img src="/assets/map/route_1.png" alt="Map" class="map-image"/>
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