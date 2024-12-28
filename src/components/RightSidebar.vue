<template>
  <div class="right-sidebar">
    <h2>Updates & Notifications</h2>
    <div v-if="$route.name === 'Maps'">
      <p>Map Controls</p>
      <div class="arrow-controls">
        <button @click="sendDirection('up')">⬆️</button>
        <div>
          <button @click="sendDirection('left')">⬅️</button>
          <button @click="sendDirection('right')">➡️</button>
        </div>
        <button @click="sendDirection('down')">⬇️</button>
      </div>
    </div>
    <div v-else>
      <button @click="sendUpdate">Send Update</button>
    </div>
  </div>
</template>

<script>
import eventBus from '../eventBus';

export default {
  methods: {
    sendDirection(direction) {
      eventBus.emit('map-move', { direction });
    },
    sendUpdate() {
      eventBus.emit('update-from-right', { message: 'New update from Right Sidebar' });
    },
  },
};
</script>

<style scoped>
.arrow-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.arrow-controls div {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>