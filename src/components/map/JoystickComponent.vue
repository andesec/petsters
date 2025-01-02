<template>
  <div class="joystick-container" @keydown="handleKeyPress" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd" tabindex="0" ref="joystick">
    <h2>Map Controls</h2>
    <p class="instructions">Use the arrow keys, touch, or drag the joystick to move the map.</p>
    <div class="joystick">
      <div class="joystick-base" ref="joystickBase">
        <div
            class="joystick-knob"
            :style="{ left: `${knobPosition.x}px`, top: `${knobPosition.y}px` }"
            @mousedown="startDrag"
            @mouseup="endDrag"
            @mousemove="drag"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '../../eventBus';
import { throttle } from 'lodash'; // Add lodash for throttling

export default {
  data() {
    return {
      dragging: false,
      knobPosition: { x: 50, y: 50 }, // Start at center
      center: { x: 50, y: 50 }, // Initial center in percentage
      radius: 50, // Radius in percentage
      lastDirection: '', // To prevent redundant emits
    };
  },
  mounted() {
    const base = this.$refs.joystickBase;
    const rect = base.getBoundingClientRect();
    this.center = { x: rect.width / 2, y: rect.height / 2 };

    // Set focus for keyboard handling
    this.$refs.joystick.focus();
  },
  methods: {
    emitDirection(x, y) {
      const threshold = 10;
      let direction = '';

      if (Math.abs(y) > threshold) {
        direction = y > 0 ? 'down' : 'up';
      }
      if (Math.abs(x) > threshold) {
        direction = x > 0 ? 'right' : 'left';
      }

      if (direction && direction !== this.lastDirection) {
        this.lastDirection = direction;
        eventBus.emit('map-move', { direction });
      }
    },
    startDrag(event) {
      this.dragging = true;
      const rect = this.$refs.joystickBase.getBoundingClientRect();
      this.center = { x: rect.width / 2, y: rect.height / 2 };
    },
    drag(event) {
      if (!this.dragging) return;

      const rect = this.$refs.joystickBase.getBoundingClientRect();
      const x = event.clientX - rect.left - this.center.x;
      const y = event.clientY - rect.top - this.center.y;

      const distance = Math.sqrt(x ** 2 + y ** 2);
      if (distance > this.radius) {
        const scale = this.radius / distance;
        this.knobPosition.x = this.center.x + x * scale;
        this.knobPosition.y = this.center.y + y * scale;
      } else {
        this.knobPosition.x = this.center.x + x;
        this.knobPosition.y = this.center.y + y;
      }

      this.emitDirectionThrottled(this.knobPosition.x, this.knobPosition.y);
    },
    endDrag() {
      this.dragging = false;
      this.knobPosition = { x: 50, y: 50 }; // Reset to center
      this.lastDirection = '';
    },
    handleKeyPress(event) {
      const directions = {
        ArrowUp: { x: 0, y: -10 },
        ArrowDown: { x: 0, y: 10 },
        ArrowLeft: { x: -10, y: 0 },
        ArrowRight: { x: 10, y: 0 },
      };

      if (directions[event.key]) {
        const { x, y } = directions[event.key];
        this.emitDirection(x, y);
      }
    },
    handleTouchStart(event) {
      const touch = event.touches[0];
      this.startDrag({ clientX: touch.clientX, clientY: touch.clientY });
    },
    handleTouchMove(event) {
      const touch = event.touches[0];
      this.drag({ clientX: touch.clientX, clientY: touch.clientY });
    },
    handleTouchEnd() {
      this.endDrag();
    },
  },
  created() {
    this.emitDirectionThrottled = throttle(this.emitDirection, 200);
  },
};
</script>

<style scoped>
.joystick-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  outline: none;
}

.instructions {
  font-size: 14px;
  color: #666;
}

.joystick {
  position: relative;
  width: 120px;
  height: 120px;
}

.joystick-base {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #cccccc, #999999);
  border-radius: 50%;
  border: 3px solid #666;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.joystick-knob {
  position: absolute;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #555, #333);
  border-radius: 50%;
  border: 2px solid #111;
  transform: translate(-50%, -50%);
  cursor: grab;
  left: 50%;
  top: 50%;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}
</style>