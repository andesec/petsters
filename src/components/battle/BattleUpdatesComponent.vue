<template>
  <h2>Battle Updates</h2>
  <div class="sidebar-backdrop">
    <transition-group name="fade" tag="ul">
      <li
          v-for="(summary, index) in turnSummaryWithDividers.slice().reverse()"
          :key="index"
          :class="[getUpdateClass(summary), { 'new-update': summary.isNew }]"
          class="update-item"
      >
        <div v-if="summary.isDivider" class="turn-divider"></div>
        <div v-else> {{ summary.text }}</div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import eventBus from '@/eventBus';

export default defineComponent({
  name: 'BattleUpdatesComponent',
  created() {
    this.turnSummaryWithDividers = [];
  },
  mounted() {
    eventBus.on('battle-update', this.showBattleUpdates);
  },
  beforeUnmount() {
    eventBus.off('battle-update', this.showBattleUpdates);
  },
  methods: {
    showBattleUpdates(newUpdates) {
      // Add a divider for the new turn
      this.turnSummaryWithDividers.unshift({ isDivider: true, isNew: true });

      // Add the updates
      newUpdates.forEach((update) => {
        this.turnSummaryWithDividers.unshift({ isDivider: false, text: update, isNew: true });
      });

      // Remove the `isNew` flag after a short delay to stop the animation
      setTimeout(() => {
        this.turnSummaryWithDividers.forEach((update) => {
          if (update.isNew) update.isNew = false;
        });
      }, 1000);

      console.log('turnSummaryWithDividers:', this.turnSummaryWithDividers);
    },
    getUpdateClass(summary) {
      if (summary.isDivider) return '';
      const text = summary.text || '';
      if (text.includes('fainted!')) return 'update-fainted';
      if (text.includes('sent out')) return 'update-sent-out';
      if (text.includes('used')) return 'update-used';
      if (text.includes('is burned')) return 'update-burned';
      if (text.includes('is poisoned')) return 'update-poisoned';
      if (text.includes('is frozen')) return 'update-frozen';
      if (text.includes('is asleep')) return 'update-asleep';
      if (text.includes('is paralyzed')) return 'update-paralyzed';
      if (text.includes('dodged')) return 'update-dodged';
      return 'update-default';
    },
  },
  data() {
    return {
      turnSummaryWithDividers: [],
    };
  },
});
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.turn-divider {
  text-align: center;
  font-weight: bold;
  border-top: 1px solid #ccc;
  color: #333;
}

.update-item {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  transition: transform 0.2s, background-color 0.2s;
}

/* Hover effect */
.update-item:hover {
  transform: scale(1.03);
}

/* Specific classes for different types of updates */
.update-fainted {
  background-color: #ffcccc; /* Light red */
  border: 1px solid #ff0000;
}

.update-sent-out {
  background-color: #ccffcc; /* Light green */
  border: 1px solid #00b000;
}

.update-used {
  background-color: #cce5ff; /* Light blue */
  border: 1px solid #007bff;
}

.update-burned {
  background-color: #ffe0cc; /* Light orange */
  border: 1px solid #ff6600;
}

.update-poisoned {
  background-color: #e0ccff; /* Light purple */
  border: 1px solid #800080;
}

.update-frozen {
  background-color: #ccf2ff; /* Light cyan */
  border: 1px solid #00cccc;
}

.update-asleep {
  background-color: #f5f5dc; /* Beige */
  border: 1px solid #c2b280;
}

.update-paralyzed {
  background-color: #fffacd; /* Light yellow */
  border: 1px solid #ffd700;
}

.update-dodged {
  background-color: #d8d8d8; /* Light yellow */
  border: 1px solid #636363;
}

.update-default {
  background-color: #e3f2fd; /* Default light blue */
  border: 1px solid #90caf9;
}

/* New update animation */
.new-update {
  animation: highlight 1s ease-out;
}

@keyframes highlight {
  from {
    background-color: yellow;
  }
  to {
    background-color: inherit;
  }
}

/* Transition styles */
.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>