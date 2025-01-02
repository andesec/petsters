<template>
  <div>
    <h2>Map</h2>
    <MapComponent ref="map"/>
  </div>
</template>

<script>
import MapComponent from '../components/map/MapComponent.vue';
import eventBus from '../eventBus';

export default {
  components: {
    MapComponent,
  },
  mounted() {
    eventBus.on('map-move', this.handleSidebarUpdate);
    eventBus.on('map-right', this.updateFromRight);
  },
  beforeUnmount() {
    eventBus.off('map-move', this.handleSidebarUpdate);
    eventBus.off('map-right', this.updateFromRight);
  },
  methods: {
    handleSidebarUpdate(update) {
      if (update.direction) {
        this.$refs.map.move(update.direction);
      }
    },
    updateFromRight(message) {
      console.log(123);
      console.log(message);
    }
  },
};
</script>