<template>
  <div class="joystick">
    <h2>Map Controls</h2>
    <div class="arrow-controls">
      <button @click="sendDirection('up')">⬆️</button>
      <div>
        <button @click="sendDirection('left')">⬅️</button>
        <button @click="sendDirection('right')">➡️</button>
      </div>
      <button @click="sendDirection('down')">⬇️</button>
    </div>
  </div>
</template>

<script>
import eventBus from '../../eventBus';

export default {
  methods: {
    sendDirection(direction) {
      eventBus.emit('map-move', { direction });
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