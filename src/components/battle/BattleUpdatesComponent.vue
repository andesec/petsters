<template>
<h2>Battle Updates</h2>
<div class="sidebar-backdrop">
<ul>
  <li v-for="(summary, index) in turnSummary" :key="index" class="update-item">
    {{ summary }}
  </li>
</ul>
</div>
</template>

<script>
import {defineComponent, ref, onMounted, watch} from 'vue';
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
  // setup() {
  //   // return battleService;
  //   // const updates = battleService.battleState.ts;
  //
  //   // // Watch for updates in the battle array
  //   // onMounted(() => {
  //   //   const interval = setInterval(() => {
  //   //     if (updates.length > 0) {
  //   //       battleUpdates.length = 0; // Clear the updates
  //   //     }
  //   //   }, 1000);
  //   //
  //   //   // Clean up interval on component unmount
  //   //   return () => clearInterval(interval);
  //   // });
  //
  //   // return { updates };
  // },
  methods: {
    showBattleUpdates(ts) {
      this.turnSummary = ts.reverse(); // Reverse to show newest items at the top
      console.log('turnSummary:', ts);
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
  background-color: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 5px;
  font-size: 14px;
  transition: transform 0.2s, background-color 0.2s;
}

.update-item:hover {
  background-color: #bbdefb;
  transform: scale(1.02);
}
</style>