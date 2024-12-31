<template>
  <h2>Battle Updates</h2>
  <div class="sidebar-backdrop">
    <transition-group name="fade" tag="ul">
      <li v-for="(summary, index) in turnSummary" :key="index" :class="getUpdateClass(summary)" class="update-item">
        {{ summary }}
      </li>
    </transition-group>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import eventBus from '@/eventBus';

export default defineComponent({
  name: 'BattleUpdatesComponent',
  data() {
    return {
      turnSummary: []
    };
  },
  mounted() {
    eventBus.on('battle-update', this.showBattleUpdates);
  },
  beforeUnmount() {
    eventBus.off('battle-update', this.showBattleUpdates);
  },
  methods: {
    showBattleUpdates(ts) {
      this.turnSummary = ts.reverse(); // Reverse to show newest items at the top
      console.log('turnSummary:', this.turnSummary);
    },
    getUpdateClass(summary) {
      if (summary.includes('fainted!')) return 'update-fainted';
      if (summary.includes('sent out')) return 'update-sent-out';
      if (summary.includes('used')) return 'update-used';
      if (summary.includes('is burned')) return 'update-burned';
      if (summary.includes('is poisoned')) return 'update-poisoned';
      if (summary.includes('is frozen')) return 'update-frozen';
      if (summary.includes('is asleep')) return 'update-asleep';
      if (summary.includes('is paralyzed')) return 'update-paralyzed';
      if (summary.includes('dodged')) return 'update-dodged';
      return 'update-default';
    }
  }
});
</script>

<style scoped>
h2 {
  font-size: 18px;
  color: #333;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
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
  transform: scale(1.02);
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

/* Transition styles */
.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>