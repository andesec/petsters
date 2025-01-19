<template>
  <div>
    <h2>Map</h2> <br/>
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
  },
  beforeUnmount() {
    eventBus.off('map-move', this.handleSidebarUpdate);
  },
  methods: {
    handleSidebarUpdate(update) {
      if (update.direction) {
        this.$refs.map.move(update.direction);
      }
    },
  },
};
</script>